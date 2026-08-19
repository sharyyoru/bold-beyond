import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import {
  BandMetricReading,
  normalizeBandReadings,
  computeEmotionalSnapshot,
  generateRuleSuggestions,
} from "@/lib/biometric-emotion";

async function getUser(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error, supabase, response };
}

export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: snapshot, error } = await supabase
      .from("emotional_snapshots")
      .select("*")
      .eq("user_id", user.id)
      .order("snapshot_at", { ascending: false })
      .limit(1)
      .single();

    const { data: recentReadings } = await supabase
      .from("biometric_readings")
      .select("*")
      .eq("user_id", user.id)
      .order("synced_at", { ascending: false })
      .limit(20);

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({
      success: true,
      snapshot,
      recentReadings: recentReadings ?? [],
    });
  } catch (error: unknown) {
    console.error("Snapshot GET error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch snapshot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const readings: BandMetricReading[] = Array.isArray(body.readings)
      ? body.readings
      : [];
    const deviceId: string | undefined = body.deviceId;
    const profile = body.profile ?? {};

    // Persist raw readings
    const recordsToInsert = readings.map((reading) => ({
      user_id: user.id,
      device_id: deviceId,
      reading_type: reading.type,
      recorded_at: reading.recordedAt || new Date().toISOString(),
      value:
        typeof reading.value === "number"
          ? { value: reading.value }
          : (reading.value as Record<string, unknown>),
      metadata: reading.metadata ?? {},
    }));

    if (recordsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("biometric_readings")
        .insert(recordsToInsert);
      if (insertError) throw insertError;
    }

    // Enrich with latest self-reported check-in
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: latestCheckin } = await supabase
      .from("wellness_checkins")
      .select("id, answers, created_at")
      .eq("user_id", user.id)
      .gte("created_at", oneDayAgo)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let selfReportedMood: number | undefined;
    let selfReportedStress: number | undefined;
    if (latestCheckin?.answers) {
      const answers = latestCheckin.answers as Record<string, unknown>;
      if (answers.overall_mood) {
        selfReportedMood = Math.max(0, Math.min(1, Number(answers.overall_mood) / 100));
      }
      if (answers.stress_level) {
        // stress_level is scored 0-100 where higher = more stressed; invert so 1 = calm
        selfReportedStress = 1 - Math.max(0, Math.min(1, Number(answers.stress_level) / 100));
      }
    }

    // Count recent missed check-ins (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentCheckins } = await supabase
      .from("wellness_checkins")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo);

    const uniqueDays = new Set(
      (recentCheckins ?? []).map((c) =>
        new Date(c.created_at).toISOString().split("T")[0]
      )
    );
    const missedCheckins = Math.max(0, 7 - uniqueDays.size);

    const normalized = normalizeBandReadings(readings, {
      dailyStepGoal: profile.dailyStepGoal,
    });
    if (selfReportedMood !== undefined) {
      normalized.selfReportedMood = selfReportedMood;
    }
    if (selfReportedStress !== undefined) {
      normalized.selfReportedStress = selfReportedStress;
    }
    normalized.missedCheckins = missedCheckins;
    normalized.recentCheckinId = latestCheckin?.id;
    normalized.lastCheckinAt = latestCheckin?.created_at;

    const snapshot = computeEmotionalSnapshot(
      normalized,
      deviceId,
      new Date().toISOString()
    );

    snapshot.suggestions = generateRuleSuggestions(snapshot, {
      hasBand: Boolean(deviceId),
      missedCheckins,
    });

    // Persist snapshot
    const { data: persisted, error: snapshotError } = await supabase
      .from("emotional_snapshots")
      .insert({
        user_id: user.id,
        snapshot_at: snapshot.generatedAt,
        inputs: snapshot.inputs,
        emotional_state: snapshot.dimensions,
        emotion_label: snapshot.label,
        eli_score: snapshot.eliScore,
        suggestions: snapshot.suggestions,
      })
      .select()
      .single();

    if (snapshotError) throw snapshotError;

    return NextResponse.json({
      success: true,
      snapshot,
      persisted,
    });
  } catch (error: unknown) {
    console.error("Snapshot POST error:", error);
    const message = error instanceof Error ? error.message : "Failed to compute snapshot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
