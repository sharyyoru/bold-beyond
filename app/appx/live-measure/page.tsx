"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  Bluetooth,
  Brain,
  ChevronRight,
  Heart,
  Moon,
  RefreshCw,
  Smile,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createAppClient } from "@/lib/supabase";
import {
  EmotionalSnapshot,
  Suggestion,
} from "@/lib/biometric-emotion";

interface TrendPoint {
  snapshot_at: string;
  eli_score: number;
  emotion_label: string;
}

export default function LiveMeasurePage() {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<EmotionalSnapshot | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/appx/welcome");
        return;
      }

      const [snapshotRes, trendRes] = await Promise.all([
        fetch("/api/biometric-emotion/snapshot"),
        supabase
          .from("emotional_snapshots")
          .select("snapshot_at, eli_score, emotion_label")
          .eq("user_id", user.id)
          .order("snapshot_at", { ascending: false })
          .limit(7),
      ]);

      if (!snapshotRes.ok) {
        const text = await snapshotRes.text().catch(() => "Unknown error");
        console.warn("Snapshot API error:", snapshotRes.status, text);
      } else {
        const snapshotJson = await snapshotRes.json();
        if (snapshotJson.success && snapshotJson.snapshot) {
          setSnapshot(snapshotJson.snapshot);
        }
      }

      if (!trendRes.error && trendRes.data) {
        setTrend(trendRes.data.reverse());
      }
    } catch (err) {
      console.error("Live measure load error:", err);
      setError("Could not load your live measure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async () => {
    router.push("/appx/wearables");
  };

  const formatLabel = (label: string) =>
    label
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const eliColor = (score: number) => {
    if (score >= 70) return "text-rose-500";
    if (score >= 45) return "text-amber-500";
    return "text-emerald-500";
  };

  const eliBg = (score: number) => {
    if (score >= 70) return "bg-rose-500";
    if (score >= 45) return "bg-amber-500";
    return "bg-emerald-500";
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
                Live Measure
              </h1>
              <p className="text-brand-navy/60 text-sm mt-1">
                Real-time emotional load index from your band, body, and mind.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-brand-teal/30 text-brand-teal hover:bg-brand-teal/5"
                onClick={loadData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                size="sm"
                className="bg-brand-teal hover:bg-brand-teal-dark text-white gap-2"
                onClick={handleSyncNow}
              >
                <Bluetooth className="w-4 h-4" />
                Sync band
              </Button>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <Card className="border-none shadow-glass bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Ring */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-slate-100"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className={snapshot ? eliColor(snapshot.eliScore).replace("text-", "stroke-") : "text-slate-300"}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: snapshot ? snapshot.eliScore / 100 : 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-display font-bold ${snapshot ? eliColor(snapshot.eliScore) : "text-slate-300"}`}>
                        {snapshot ? snapshot.eliScore : "--"}
                      </span>
                      <span className="text-xs text-brand-navy/50 uppercase tracking-wide mt-1">
                        ELI Score
                      </span>
                    </div>
                  </div>
                  {snapshot && (
                    <p className="mt-4 text-sm text-brand-navy/60 text-center max-w-xs">
                      {snapshot.eliScore >= 70
                        ? "Your body and mind are signaling high load. Consider slowing down."
                        : snapshot.eliScore >= 45
                        ? "Moderate load. A small reset could help."
                        : "You&apos;re in a balanced state. Great job."}
                    </p>
                  )}
                </div>

                {/* Dimensions */}
                <div className="space-y-4">
                  {[
                    { label: "Valence", icon: Smile, key: "valence" as const, color: "bg-emerald-500" },
                    { label: "Activation", icon: Zap, key: "activation" as const, color: "bg-rose-500" },
                    { label: "Regulation", icon: Heart, key: "regulation" as const, color: "bg-sky-500" },
                    { label: "Fatigue", icon: Moon, key: "fatigue" as const, color: "bg-violet-500" },
                  ].map((dim) => {
                    const value = snapshot ? snapshot.dimensions[dim.key] : 0;
                    return (
                      <div key={dim.key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-brand-navy/70">
                            <dim.icon className="w-4 h-4" />
                            {dim.label}
                          </div>
                          <span className="font-medium text-brand-navy">
                            {snapshot ? Math.round(value * 100) : "--"}
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            className={`h-full ${dim.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round(value * 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emotion Label + Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-none shadow-glass-sm bg-white/80 backdrop-blur-sm h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-medium text-brand-navy/50 uppercase tracking-wide">
                    Trend (last 7 snapshots)
                  </p>
                  {snapshot && (
                    <Badge variant="outline" className="text-brand-navy/60 border-slate-200">
                      <Brain className="w-3 h-3 mr-1" />
                      {formatLabel(snapshot.label)}
                    </Badge>
                  )}
                </div>

                {trend.length > 1 ? (
                  <div className="h-40 flex items-end gap-2">
                    {trend.map((point, i) => {
                      const height = `${Math.min(100, Math.max(10, point.eli_score))}%`;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                          <div className="relative w-full flex items-end justify-center">
                            <motion.div
                              className={`w-full max-w-[32px] rounded-t-lg ${eliBg(point.eli_score)} opacity-80 group-hover:opacity-100 transition-opacity`}
                              initial={{ height: 0 }}
                              animate={{ height }}
                              transition={{ duration: 0.5, delay: i * 0.05 }}
                            />
                            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-brand-navy/70 whitespace-nowrap">
                              {point.eli_score}
                            </div>
                          </div>
                          <span className="text-[10px] text-brand-navy/40">
                            {new Date(point.snapshot_at).toLocaleDateString(undefined, { weekday: "narrow" })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-sm text-brand-navy/40 bg-slate-50 rounded-xl">
                    Sync your band a few times to see your emotional load trend.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-none shadow-glass-sm bg-white/80 backdrop-blur-sm h-full">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-brand-navy/50 uppercase tracking-wide mb-4">
                  State
                </p>
                {snapshot ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-brand-teal/5 border border-brand-teal/10">
                      <p className="text-sm text-brand-navy/60 mb-1">Inferred emotion</p>
                      <p className="text-xl font-display font-semibold text-brand-navy">
                        {formatLabel(snapshot.label)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50">
                      <p className="text-sm text-brand-navy/60 mb-1">Based on</p>
                      <div className="flex flex-wrap gap-2">
                        {["hr", "hrv", "sleep", "steps", "spo2", "temperature"]
                          .filter((k) => snapshot.inputs[k as keyof typeof snapshot.inputs] !== undefined)
                          .map((k) => (
                            <Badge key={k} variant="outline" className="text-[10px] border-slate-200 text-brand-navy/60 capitalize">
                              {k}
                            </Badge>
                          ))}
                        {snapshot.inputs.selfReportedMood !== undefined && (
                          <Badge variant="outline" className="text-[10px] border-slate-200 text-brand-navy/60">
                            self-report
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-sm text-brand-navy/40 py-8">
                    <Activity className="w-8 h-8 mb-2 opacity-40" />
                    <p>No snapshot yet.</p>
                    <p className="text-xs mt-1">Sync your band to compute your emotional state.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Suggestions */}
        {snapshot && snapshot.suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-semibold text-brand-navy mb-3">Suggested for you</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {snapshot.suggestions.slice(0, 6).map((s: Suggestion) => (
                <Link
                  key={s.id}
                  href={s.link || "#"}
                  className="group block p-4 rounded-2xl bg-white/80 hover:bg-white border border-slate-100 hover:border-brand-teal/30 shadow-glass-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-brand-navy group-hover:text-brand-teal-dark">
                        {s.title}
                      </p>
                      <p className="text-xs text-brand-navy/60 mt-1">{s.reason}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-navy/30 group-hover:text-brand-teal shrink-0 mt-0.5" />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize ${
                        s.urgency === "high"
                          ? "border-rose-200 text-rose-600 bg-rose-50"
                          : s.urgency === "medium"
                          ? "border-amber-200 text-amber-600 bg-amber-50"
                          : "border-emerald-200 text-emerald-600 bg-emerald-50"
                      }`}
                    >
                      {s.urgency} priority
                    </Badge>
                    <Badge variant="outline" className="text-[10px] border-slate-200 text-brand-navy/50 capitalize">
                      {s.type}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {!snapshot && !loading && (
          <div className="text-center py-12">
            <p className="text-brand-navy/60 mb-4">
              You haven&apos;t synced any band data yet.
            </p>
            <Button
              className="bg-brand-teal hover:bg-brand-teal-dark text-white gap-2"
              onClick={handleSyncNow}
            >
              <Bluetooth className="w-4 h-4" />
              Go to Wearables
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
