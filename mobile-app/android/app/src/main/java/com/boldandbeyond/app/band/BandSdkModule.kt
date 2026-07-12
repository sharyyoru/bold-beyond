package com.boldandbeyond.app.band

import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothGattDescriptor
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.ParcelUuid
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.jstyle.blesdkv8.Util.BleSDK
import com.jstyle.blesdkv8.callback.DataListener2301
import com.jstyle.blesdkv8.constant.DeviceKey
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class BandSdkModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), LifecycleEventListener, DataListener2301 {

    private val TAG = "BandSdk"

    private val SERVICE_UUID = UUID.fromString("0000fff0-0000-1000-8000-00805f9b34fb")
    private val WRITE_UUID = UUID.fromString("0000fff6-0000-1000-8000-00805f9b34fb")
    private val NOTIFY_UUID = UUID.fromString("0000fff7-0000-1000-8000-00805f9b34fb")
    private val CCCD_UUID = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")

    private val bluetoothManager: BluetoothManager? =
        reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
    private val bluetoothAdapter: BluetoothAdapter? = bluetoothManager?.adapter
    private var bluetoothGatt: BluetoothGatt? = null

    private var connectPromise: Promise? = null
    private var syncPromise: Promise? = null
    private var syncType: String? = null
    private var syncResults = JSONArray()
    private var isSyncing = false

    private val mainHandler = Handler(Looper.getMainLooper())
    private var scanCallback: ScanCallback? = null

    init {
        reactContext.addLifecycleEventListener(this)
    }

    override fun getName(): String = "BandSdk"

    private fun emit(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit(eventName, params)
    }

    private fun jsonToMap(json: JSONObject): WritableMap {
        val map = Arguments.createMap()
        json.keys().forEach { key ->
            when (val value = json.get(key)) {
                is String -> map.putString(key, value)
                is Int -> map.putInt(key, value)
                is Double -> map.putDouble(key, value)
                is Long -> map.putDouble(key, value.toDouble())
                is Float -> map.putDouble(key, value.toDouble())
                is Boolean -> map.putBoolean(key, value)
                is JSONObject -> map.putMap(key, jsonToMap(value))
                is JSONArray -> map.putArray(key, jsonToArray(value))
                else -> map.putString(key, value.toString())
            }
        }
        return map
    }

    private fun jsonToArray(json: JSONArray): com.facebook.react.bridge.WritableArray {
        val arr = Arguments.createArray()
        for (i in 0 until json.length()) {
            when (val value = json.get(i)) {
                is String -> arr.pushString(value)
                is Int -> arr.pushInt(value)
                is Double -> arr.pushDouble(value)
                is Long -> arr.pushDouble(value.toDouble())
                is Float -> arr.pushDouble(value.toDouble())
                is Boolean -> arr.pushBoolean(value)
                is JSONObject -> arr.pushMap(jsonToMap(value))
                is JSONArray -> arr.pushArray(jsonToArray(value))
                else -> arr.pushString(value.toString())
            }
        }
        return arr
    }

    override fun dataCallback(maps: MutableMap<String, Any>?) {
        if (maps == null) return
        mainHandler.post {
            try {
                val json = JSONObject(maps as Map<*, *>)
                emitJson("BandDataReceived", json)

                if (isSyncing) {
                    syncResults.put(json)
                    val ended = try { json.optBoolean(DeviceKey.End) } catch (e: Exception) { false }
                    if (ended) {
                        finishSync()
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "dataCallback error", e)
            }
        }
    }

    override fun dataCallback(value: ByteArray?) {
        // Raw data callback; parsed data handled by dataCallback(map)
    }

    private fun emitJson(eventName: String, json: JSONObject) {
        emit(eventName, jsonToMap(json))
    }

    private fun finishSync() {
        if (!isSyncing) return
        isSyncing = false
        val result = syncResults.toString()
        syncPromise?.resolve(result)
        syncPromise = null
        syncResults = JSONArray()
    }

    @ReactMethod
    fun isBluetoothSupported(promise: Promise) {
        promise.resolve(bluetoothAdapter != null)
    }

    @ReactMethod
    fun isBluetoothEnabled(promise: Promise) {
        promise.resolve(bluetoothAdapter?.isEnabled == true)
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun startScan(timeoutMs: Int, promise: Promise) {
        if (bluetoothAdapter == null) {
            promise.reject("ERR_BLUETOOTH", "Bluetooth adapter not available")
            return
        }
        if (!bluetoothAdapter.isEnabled) {
            promise.reject("ERR_BLUETOOTH", "Bluetooth is disabled")
            return
        }

        stopScan()

        val scanner = bluetoothAdapter.bluetoothLeScanner ?: run {
            promise.reject("ERR_SCANNER", "Bluetooth LE scanner unavailable")
            return
        }

        scanCallback = object : ScanCallback() {
            override fun onScanResult(callbackType: Int, result: ScanResult?) {
                result?.device?.let { device ->
                    val map = Arguments.createMap().apply {
                        putString("id", device.address)
                        putString("name", device.name ?: "")
                        putInt("rssi", result.rssi)
                    }
                    emit("BandDeviceFound", map)
                }
            }

            override fun onBatchScanResults(results: MutableList<ScanResult>?) {}

            override fun onScanFailed(errorCode: Int) {
                promise.reject("ERR_SCAN", "Scan failed with code ")
                scanCallback = null
            }
        }

        try {
            val filter = ScanFilter.Builder()
                .setServiceUuid(ParcelUuid(SERVICE_UUID))
                .build()
            val settings = ScanSettings.Builder()
                .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                .build()
            scanner.startScan(listOf(filter), settings, scanCallback)
            promise.resolve(true)

            mainHandler.postDelayed({
                stopScan()
            }, timeoutMs.coerceIn(3000, 30000).toLong())
        } catch (e: Exception) {
            promise.reject("ERR_SCAN", e.message)
            scanCallback = null
        }
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun stopScan() {
        scanCallback?.let { cb ->
            try {
                bluetoothAdapter?.bluetoothLeScanner?.stopScan(cb)
            } catch (e: Exception) {
                Log.w(TAG, "stopScan error", e)
            }
            scanCallback = null
        }
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun connect(deviceId: String, promise: Promise) {
        if (bluetoothAdapter == null) {
            promise.reject("ERR_BLUETOOTH", "Bluetooth adapter not available")
            return
        }

        disconnect()
        connectPromise = promise

        try {
            val device = bluetoothAdapter.getRemoteDevice(deviceId)
            bluetoothGatt = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                device.connectGatt(reactApplicationContext, false, gattCallback, android.bluetooth.BluetoothDevice.TRANSPORT_LE)
            } else {
                device.connectGatt(reactApplicationContext, false, gattCallback)
            }
        } catch (e: Exception) {
            connectPromise = null
            promise.reject("ERR_CONNECT", e.message)
        }
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun disconnect() {
        isSyncing = false
        syncPromise = null
        syncResults = JSONArray()
        try {
            bluetoothGatt?.close()
        } catch (e: Exception) {
            Log.w(TAG, "disconnect error", e)
        }
        bluetoothGatt = null
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun syncHealthData(type: String, promise: Promise) {
        if (bluetoothGatt == null) {
            promise.reject("ERR_NOT_CONNECTED", "Device not connected")
            return
        }
        if (isSyncing) {
            promise.reject("ERR_BUSY", "Another sync is in progress")
            return
        }

        isSyncing = true
        syncType = type
        syncPromise = promise
        syncResults = JSONArray()

        val dateStr = SimpleDateFormat("yyyy-MM-dd-HH:mm:ss", Locale.getDefault()).format(Date())

        val command: ByteArray = when (type) {
            "steps" -> BleSDK.GetTotalActivityDataWithMode(0.toByte(), dateStr)
            "sleep" -> BleSDK.getObtainDetailedSleepData(0.toByte(), dateStr)
            "hr" -> BleSDK.GetStaticHRWithMode(0.toByte(), dateStr)
            "spo2" -> BleSDK.Oxygen_data(0.toByte(), dateStr)
            "temperature" -> BleSDK.GetTemperature_historyData(0.toByte(), dateStr)
            "stress" -> BleSDK.GetHRVDataWithMode(0.toByte(), dateStr)
            "ecg" -> BleSDK.ppgWithMode(1, 0)
            "battery" -> BleSDK.GetDeviceBatteryLevel()
            "version" -> BleSDK.GetDeviceVersion()
            "personalInfo" -> BleSDK.GetPersonalInfo()
            "deviceTime" -> BleSDK.GetDeviceTime()
            else -> {
                isSyncing = false
                syncPromise = null
                promise.reject("ERR_TYPE", "Unknown sync type: ")
                return
            }
        }

        writeCommand(command)

        mainHandler.postDelayed({
            if (isSyncing) {
                finishSync()
            }
        }, 15000)
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun writeCommand(commandBase64: String, promise: Promise) {
        try {
            val command = android.util.Base64.decode(commandBase64, android.util.Base64.DEFAULT)
            writeCommand(command)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_WRITE", e.message)
        }
    }

    @SuppressLint("MissingPermission")
    private fun writeCommand(command: ByteArray) {
        val gatt = bluetoothGatt ?: return
        val service = gatt.getService(SERVICE_UUID) ?: return
        val characteristic = service.getCharacteristic(WRITE_UUID) ?: return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            gatt.writeCharacteristic(characteristic, command, BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT)
        } else {
            @Suppress("DEPRECATION")
            characteristic.value = command
            @Suppress("DEPRECATION")
            gatt.writeCharacteristic(characteristic)
        }
    }

    private val gattCallback = object : BluetoothGattCallback() {
        @SuppressLint("MissingPermission")
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            when (newState) {
                BluetoothProfile.STATE_CONNECTED -> {
                    Log.d(TAG, "Connected, discovering services")
                    gatt.discoverServices()
                }
                BluetoothProfile.STATE_DISCONNECTED -> {
                    mainHandler.post {
                        connectPromise?.let {
                            it.reject("ERR_DISCONNECTED", "Device disconnected")
                            connectPromise = null
                        }
                        if (isSyncing) finishSync()
                    }
                    try { gatt.close() } catch (e: Exception) {}
                }
            }
        }

        @SuppressLint("MissingPermission")
        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            if (status != BluetoothGatt.GATT_SUCCESS) return
            val service = gatt.getService(SERVICE_UUID) ?: return
            val notifyChar = service.getCharacteristic(NOTIFY_UUID) ?: return

            gatt.setCharacteristicNotification(notifyChar, true)
            val descriptor = notifyChar.getDescriptor(CCCD_UUID)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                gatt.writeDescriptor(descriptor, BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE)
            } else {
                @Suppress("DEPRECATION")
                descriptor.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                @Suppress("DEPRECATION")
                gatt.writeDescriptor(descriptor)
            }

            mainHandler.post {
                connectPromise?.resolve(true)
                connectPromise = null
            }
        }

        @Deprecated("Deprecated in Java")
        @Suppress("DEPRECATION")
        override fun onCharacteristicChanged(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic) {
            val value = characteristic.value ?: return
            handleIncomingData(value)
        }

        override fun onCharacteristicChanged(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic,
            value: ByteArray
        ) {
            handleIncomingData(value)
        }
    }

    private fun handleIncomingData(data: ByteArray) {
        try {
            BleSDK.DataParsingWithData(data, this)
        } catch (e: Exception) {
            Log.e(TAG, "Parse error", e)
        }
    }

    override fun onHostResume() {}
    override fun onHostPause() {}
    override fun onHostDestroy() {
        disconnect()
    }
}
