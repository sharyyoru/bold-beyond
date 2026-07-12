/**
 * BandBridge - Web -> React Native -> Wearable SDK bridge.
 *
 * When the app runs inside the React Native WebView shell, `window.BandBridge`
 * is injected by App.js. In a normal browser (web preview / dev) a mock
 * implementation is used so UI work can continue without a physical device.
 */

export interface BandDevice {
  id: string;
  name: string;
  rssi: number;
}

export interface BandDataMessage {
  type: "deviceFound" | "dataReceived" | "result" | "error";
  id?: string;
  device?: BandDevice;
  data?: Record<string, unknown>;
  result?: unknown;
  error?: string;
}

type PromiseResolve = (value: unknown) => void;
type PromiseReject = (reason: Error) => void;

interface PendingCall {
  resolve: PromiseResolve;
  reject: PromiseReject;
}

interface NativeBandBridge {
  call: (action: string, params?: Record<string, unknown>) => Promise<unknown>;
}

interface MockBridge extends NativeBandBridge {
  isMock: true;
}

function isNativeBridge(obj: unknown): obj is NativeBandBridge {
  return typeof obj === "object" && obj !== null && "call" in obj && typeof (obj as NativeBandBridge).call === "function";
}

class BandBridgeManager {
  private _pending = new Map<string, PendingCall>();
  private _listeners = new Set<(msg: BandDataMessage) => void>();
  private _bridge: NativeBandBridge | null = null;
  private _id = 0;

  constructor() {
    if (typeof window !== "undefined") {
      this._bridge = isNativeBridge(window.BandBridge) ? window.BandBridge : null;
      if (!this._bridge) {
        const mock = this._createMock();
        (window as unknown as Record<string, unknown>).BandBridge = mock as unknown as NativeBandBridge;
        this._bridge = mock;
      }
      window.addEventListener("message", this._handleMessage);
      window.addEventListener("band:deviceFound", this._handleCustomEvent as EventListener);
      window.addEventListener("band:dataReceived", this._handleCustomEvent as EventListener);
    }
  }

  private _createMock(): NativeBandBridge & { isMock: true } {
    return {
      isMock: true,
      call: async (action, params) => {
        await new Promise((r) => setTimeout(r, 600));
        switch (action) {
          case "isBluetoothSupported":
            return true;
          case "isBluetoothEnabled":
            return true;
          case "startScan":
            setTimeout(() => {
              this._emit({ type: "deviceFound", device: { id: "MOCK_V8", name: "Bold Band V8", rssi: -52 } });
            }, 1200);
            return true;
          case "stopScan":
            return true;
          case "connect":
            return true;
          case "disconnect":
            return true;
          case "syncHealthData":
            return this._mockSyncData(params?.dataType as string);
          case "writeCommand":
            return true;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
      },
    };
  }

  private _mockSyncData(type?: string): Record<string, unknown>[] {
    const today = new Date().toISOString().split("T")[0];
    switch (type) {
      case "steps":
        return [{ date: today, steps: 8432, distance: 6200, calories: 412, DataType: "TotalActivityData" }];
      case "sleep":
        return [{ date: today, deepSleep: 92, lightSleep: 285, awake: 18, totalSleep: 395, DataType: "SleepData" }];
      case "hr":
        return [
          { date: today, time: "08:00", heartRate: 68, DataType: "StaticHR" },
          { date: today, time: "12:00", heartRate: 74, DataType: "StaticHR" },
          { date: today, time: "18:00", heartRate: 71, DataType: "StaticHR" },
        ];
      case "spo2":
        return [{ date: today, time: "09:00", spo2: 98, DataType: "SpO2" }];
      case "temperature":
        return [{ date: today, time: "08:30", temperature: 36.6, DataType: "Temperature" }];
      case "stress":
        return [{ date: today, time: "14:00", hrv: 42, stress: 24, DataType: "HRV" }];
      case "battery":
        return [{ battery: 78, DataType: "Battery" }];
      default:
        return [{ DataType: "Unknown", type }];
    }
  }

  private _handleMessage = (event: MessageEvent) => {
    try {
      const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (msg && typeof msg === "object") {
        this._handleBandMessage(msg as BandDataMessage);
      }
    } catch {
      // ignore non-JSON messages
    }
  };

  private _handleCustomEvent = (event: CustomEvent<BandDataMessage>) => {
    if (event.detail) this._emit(event.detail);
  };

  private _handleBandMessage(msg: BandDataMessage) {
    if (msg.id && this._pending.has(msg.id)) {
      const { resolve, reject } = this._pending.get(msg.id)!;
      this._pending.delete(msg.id);
      if (msg.type === "error" && msg.error) {
        reject(new Error(msg.error));
      } else {
        resolve(msg.result ?? null);
      }
      return;
    }
    this._emit(msg);
  }

  private _emit(msg: BandDataMessage) {
    this._listeners.forEach((cb) => cb(msg));
  }

  private _call(action: string, params: Record<string, unknown> = {}): Promise<unknown> {
    if (!this._bridge) return Promise.reject(new Error("BandBridge not available"));
    return this._bridge.call(action, params);
  }

  isBluetoothSupported(): Promise<boolean> {
    return this._call("isBluetoothSupported").then((r) => Boolean(r));
  }

  isBluetoothEnabled(): Promise<boolean> {
    return this._call("isBluetoothEnabled").then((r) => Boolean(r));
  }

  startScan(timeoutMs = 10000): Promise<boolean> {
    return this._call("startScan", { timeoutMs }).then((r) => Boolean(r));
  }

  stopScan(): Promise<boolean> {
    return this._call("stopScan").then((r) => Boolean(r));
  }

  connect(deviceId: string): Promise<boolean> {
    return this._call("connect", { deviceId }).then((r) => Boolean(r));
  }

  disconnect(): Promise<boolean> {
    return this._call("disconnect").then((r) => Boolean(r));
  }

  syncHealthData(dataType: string): Promise<unknown> {
    return this._call("syncHealthData", { dataType });
  }

  writeCommand(commandBase64: string): Promise<boolean> {
    return this._call("writeCommand", { commandBase64 }).then((r) => Boolean(r));
  }

  subscribe(listener: (msg: BandDataMessage) => void): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  isMock(): boolean {
    return (this._bridge as MockBridge | null)?.isMock === true;
  }
}

let manager: BandBridgeManager | null = null;

export function getBandBridge(): BandBridgeManager {
  if (!manager && typeof window !== "undefined") {
    manager = new BandBridgeManager();
  }
  return manager!;
}

export function resetBandBridge(): void {
  manager = null;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    BandBridge?: NativeBandBridge & Partial<MockBridge>;
  }
}
