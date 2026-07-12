"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Activity,
  Heart,
  Moon,
  Wind,
  Thermometer,
  Zap,
  Watch,
  Bluetooth,
  BluetoothSearching,
  BluetoothConnected,
  BluetoothOff,
  RefreshCw,
  ChevronRight,
  Droplets,
  Battery,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  getBandBridge,
  BandDevice,
  BandDataMessage,
} from "@/lib/band-bridge";
import Link from "next/link";

interface MetricReading {
  type: string;
  label: string;
  value: string;
  unit: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  detail?: Record<string, unknown>;
  lastSynced?: Date;
}

const METRICS = [
  { key: "steps", label: "Steps", icon: Activity, color: "text-brand-teal", bg: "bg-brand-teal/10" },
  { key: "hr", label: "Heart Rate", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
  { key: "sleep", label: "Sleep", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { key: "spo2", label: "SpO₂", icon: Wind, color: "text-sky-500", bg: "bg-sky-500/10" },
  { key: "temperature", label: "Temperature", icon: Thermometer, color: "text-amber-500", bg: "bg-amber-500/10" },
  { key: "stress", label: "Stress / HRV", icon: Zap, color: "text-violet-500", bg: "bg-violet-500/10" },
  { key: "ecg", label: "ECG (V8)", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

export default function WearablesPage() {
  const [bridgeReady, setBridgeReady] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [btSupported, setBtSupported] = useState(false);
  const [btEnabled, setBtEnabled] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<BandDevice[]>([]);
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [readings, setReadings] = useState<Record<string, MetricReading>>({});
  const bridgeRef = useRef<ReturnType<typeof getBandBridge> | null>(null);

  const log = useCallback((message: string) => {
    setLogs((prev) => [message, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    const bridge = getBandBridge();
    bridgeRef.current = bridge;
    setBridgeReady(true);
    setIsMock(bridge.isMock());

    bridge.isBluetoothSupported().then(setBtSupported).catch(() => setBtSupported(false));
    bridge.isBluetoothEnabled().then(setBtEnabled).catch(() => setBtEnabled(false));

    const unsubscribe = bridge.subscribe((msg: BandDataMessage) => {
      if (msg.type === "deviceFound" && msg.device) {
        const device = msg.device;
        setDevices((prev) => {
          if (prev.some((d) => d.id === device.id)) return prev;
          return [...prev, device];
        });
        log(`Found ${device.name || "device"} (${device.id})`);
      } else if (msg.type === "dataReceived" && msg.data) {
        log(`Data: ${JSON.stringify(msg.data).slice(0, 120)}`);
      }
    });

    return () => unsubscribe();
  }, [log]);

  const handleScan = async () => {
    if (!bridgeRef.current) return;
    setDevices([]);
    setScanning(true);
    log("Scanning for Bold Bands...");
    try {
      await bridgeRef.current.startScan(12000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      log(`Scan error: ${message}`);
    } finally {
      setTimeout(() => setScanning(false), 12000);
    }
  };

  const handleConnect = async (device: BandDevice) => {
    if (!bridgeRef.current) return;
    setConnectingId(device.id);
    log(`Connecting to ${device.name || device.id}...`);
    try {
      await bridgeRef.current.connect(device.id);
      setConnectedId(device.id);
      log(`Connected to ${device.name || device.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      log(`Connect error: ${message}`);
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = async () => {
    if (!bridgeRef.current) return;
    await bridgeRef.current.disconnect();
    setConnectedId(null);
    log("Disconnected");
  };

  const handleSync = async (key: string) => {
    if (!bridgeRef.current || !connectedId) {
      log("Connect a device first");
      return;
    }
    setSyncing(key);
    log(`Syncing ${key}...`);
    try {
      const result = await bridgeRef.current.syncHealthData(key);
      const rows = Array.isArray(result) ? result : [];
      const last = rows[rows.length - 1] as Record<string, unknown> | undefined;
      updateReading(key, rows, last);
      log(`Synced ${key}: ${rows.length} record(s)`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      log(`Sync ${key} error: ${message}`);
    } finally {
      setSyncing(null);
    }
  };

  const updateReading = (key: string, rows: Record<string, unknown>[], last?: Record<string, unknown>) => {
    const meta = METRICS.find((m) => m.key === key)!;
    let value = "--";
    let unit = "";
    let detail: Record<string, unknown> = {};

    if (last) {
      if (key === "steps") {
        value = String(last.steps ?? last.step ?? last[DeviceKey.Step] ?? 0);
        unit = "steps";
        detail = { distance: last.distance ?? "--", calories: last.calories ?? "--" };
      } else if (key === "hr") {
        value = String(last.heartRate ?? last.HeartRate ?? last[DeviceKey.HeartRate] ?? 0);
        unit = "bpm";
        detail = { entries: rows.length };
      } else if (key === "sleep") {
        const total = Number(last.totalSleep ?? last.sleepTime ?? 0);
        value = total > 0 ? `${Math.floor(total / 60)}h ${total % 60}m` : "--";
        unit = "";
        detail = { deep: last.deepSleep ?? "--", light: last.lightSleep ?? "--", awake: last.awake ?? "--" };
      } else if (key === "spo2") {
        value = String(last.spo2 ?? last.SpO2 ?? last[DeviceKey.SpO2] ?? 0);
        unit = "%";
      } else if (key === "temperature") {
        value = String(last.temperature ?? last.Temperature ?? last[DeviceKey.Temp] ?? 0);
        unit = "°C";
      } else if (key === "stress") {
        value = String(last.stress ?? last.hrv ?? last[DeviceKey.HRV] ?? 0);
        unit = last.hrv ? "ms (HRV)" : "score";
      } else if (key === "ecg") {
        value = last.result ? String(last.result) : "Ready";
        unit = "";
      }
    }

    setReadings((prev) => ({
      ...prev,
      [key]: {
        type: key,
        label: meta.label,
        value,
        unit,
        icon: meta.icon,
        color: meta.color,
        bg: meta.bg,
        detail,
        lastSynced: new Date(),
      },
    }));
  };

  const syncAll = async () => {
    for (const m of METRICS) {
      await handleSync(m.key);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-teal/5">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link href="/appx" className="text-sm text-brand-navy/60 hover:text-brand-navy">
              ← Back
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-brand-navy">
                Bold Band
              </h1>
              <p className="text-brand-navy/60 text-sm mt-1">
                Sync your wearable health data in one place.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isMock && (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  Preview Mode
                </Badge>
              )}
              {connectedId ? (
                <Badge className="bg-emerald-500 text-white gap-1">
                  <BluetoothConnected className="w-3 h-3" /> Connected
                </Badge>
              ) : btEnabled ? (
                <Badge variant="outline" className="text-brand-teal border-brand-teal/30 bg-brand-teal/5 gap-1">
                  <Bluetooth className="w-3 h-3" /> Bluetooth On
                </Badge>
              ) : (
                <Badge variant="outline" className="text-slate-500 border-slate-200 bg-slate-50 gap-1">
                  <BluetoothOff className="w-3 h-3" /> Bluetooth Off
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Device Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <Card className="border-none shadow-glass bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-teal-dark flex items-center justify-center shadow-glow-sea">
                    <Watch className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-brand-navy">Your Band</h2>
                    <p className="text-xs text-brand-navy/50">
                      {connectedId
                        ? devices.find((d) => d.id === connectedId)?.name || "Connected"
                        : "No device connected"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {connectedId ? (
                    <Button variant="outline" size="sm" onClick={handleDisconnect}>
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-brand-teal hover:bg-brand-teal-dark text-white gap-2"
                      onClick={handleScan}
                      disabled={scanning}
                    >
                      {scanning ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <BluetoothSearching className="w-4 h-4" />
                      )}
                      {scanning ? "Scanning..." : "Scan"}
                    </Button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {devices.length > 0 && !connectedId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <p className="text-xs font-medium text-brand-navy/60 uppercase tracking-wide">
                      Found devices
                    </p>
                    {devices.map((device) => (
                      <div
                        key={device.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Bluetooth className="w-5 h-5 text-brand-teal" />
                          <div>
                            <p className="font-medium text-brand-navy text-sm">
                              {device.name || "Unknown device"}
                            </p>
                            <p className="text-xs text-brand-navy/40">{device.id}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConnect(device)}
                          disabled={connectingId === device.id}
                        >
                          {connectingId === device.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            "Connect"
                          )}
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {!btSupported && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50 text-amber-700 text-sm flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  Bluetooth is not supported on this browser. Open inside the Bold & Beyond app for full functionality.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-3"
        >
          <h2 className="font-semibold text-brand-navy">Health Metrics</h2>
          <Button
            size="sm"
            variant="ghost"
            className="text-brand-teal hover:text-brand-teal-dark gap-1"
            onClick={syncAll}
            disabled={!connectedId || !!syncing}
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            Sync all
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {METRICS.map((metric, index) => {
            const reading = readings[metric.key];
            const isSyncingMetric = syncing === metric.key;
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.04 }}
              >
                <Card
                  className={`border-none shadow-glass-sm bg-white/80 backdrop-blur-sm h-full transition-all hover:shadow-glass ${
                    isSyncingMetric ? "ring-2 ring-brand-teal/30" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center`}>
                        <metric.icon className={`w-5 h-5 ${metric.color}`} />
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-brand-navy/40 hover:text-brand-teal"
                        onClick={() => handleSync(metric.key)}
                        disabled={!connectedId || !!syncing}
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${isSyncingMetric ? "animate-spin" : ""}`}
                        />
                      </Button>
                    </div>
                    <p className="text-sm text-brand-navy/60 mb-1">{metric.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-display font-bold text-brand-navy">
                        {reading?.value ?? "--"}
                      </span>
                      <span className="text-xs text-brand-navy/50">
                        {reading?.unit ?? ""}
                      </span>
                    </div>
                    {reading?.detail && (
                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-brand-navy/60">
                        {Object.entries(reading.detail).map(([k, v]) => (
                          <div key={k}>
                            <span className="block text-[10px] uppercase tracking-wider opacity-60">
                              {k}
                            </span>
                            <span className="font-medium text-brand-navy">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {reading?.lastSynced && (
                      <p className="mt-2 text-[10px] text-brand-navy/40">
                        Last synced {reading.lastSynced.toLocaleTimeString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Live Log */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-none shadow-glass-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-brand-navy mb-3 text-sm">Activity Log</h3>
              <div className="h-40 overflow-y-auto rounded-xl bg-slate-50 p-3 space-y-1.5 text-xs font-mono">
                {logs.length === 0 && (
                  <p className="text-slate-400 italic">No activity yet. Scan and connect your band to begin.</p>
                )}
                {logs.map((entry, i) => (
                  <div key={i} className="text-brand-navy/70 break-all">
                    <span className="text-brand-teal mr-1.5">•</span>
                    {entry}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Minimal mapping for DeviceKey constants used in JSON fallback parsing
const DeviceKey = {
  Step: "Step",
  HeartRate: "HeartRate",
  SpO2: "SpO2",
  Temp: "Temp",
  HRV: "HRV",
} as const;
