import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import {
  generateRuleSuggestions,
  computeEmotionalSnapshot,
  normalizeBandReadings,
  routeSnapshotToProviders,
  EmotionalSnapshot,
} from "@/lib/biometric-emotion";
import { WellbeingProvider } from "@/lib/human-os/types";

const sampleProviders: WellbeingProvider[] = [
  { id: "1", name: "Dr. Sarah Ahmed", modality: "psychotherapy", specializations: ["anxiety", "depression", "stress"], rating: 4.9, availability: true },
  { id: "2", name: "Coach Michael", modality: "life-coaching", specializations: ["career", "leadership", "motivation"], rating: 4.8, availability: true },
  { id: "3", name: "Wellbeing Center Dubai", modality: "meditation", specializations: ["mindfulness", "stress", "sleep"], rating: 4.7, availability: true },
  { id: "4", name: "FitLife Studio", modality: "fitness", specializations: ["weight-loss", "strength", "wellness"], rating: 4.6, availability: true },
  { id: "5", name: "Nutrition Plus", modality: "nutrition", specializations: ["diet", "weight-management", "wellness"], rating: 4.8, availability: true },
  { id: "6", name: "Dr. Fatima Hassan", modality: "couples-therapy", specializations: ["relationships", "communication", "conflict"], rating: 4.9, availability: true },
  { id: "7", name: "Sleep Clinic UAE", modality: "sleep", specializations: ["insomnia", "sleep-quality", "rest"], rating: 4.7, availability: true },
  { id: "8", name: "Stress Relief Center", modality: "stress-management", specializations: ["burnout", "work-stress", "anxiety"], rating: 4.8, availability: true },
];

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
  const { data: { user } } = await supabase.auth.getUser();
  return { user, supabase, response };
}

async function buildSnapshotFromLatest(request: NextRequest): Promise<{
  snapshot: EmotionalSnapshot;
  source: "live" | "latest-stored" | "none";
} | null> {
  const { user, supabase } = await getUser(request);
  if (!user) return null;

  const body = await request.json().catch(() => ({}));
  const readings = Array.isArray(body.readings) ? body.readings : [];

  // If readings provided in request, compute live snapshot
  if (readings.length > 0) {
    const normalized = normalizeBandReadings(readings, body.profile ?? {});
    const snapshot = computeEmotionalSnapshot(normalized, body.deviceId);
    return { snapshot, source: "live" };
  }

  // Otherwise fetch latest stored snapshot
  const { data: latest } = await supabase
    .from("emotional_snapshots")
    .select("*")
    .eq("user_id", user.id)
    .order("snapshot_at", { ascending: false })
    .limit(1)
    .single();

  if (!latest) return null;

  const snapshot: EmotionalSnapshot = {
    eliScore: latest.eli_score ?? 50,
    dimensions: latest.emotional_state as EmotionalSnapshot["dimensions"],
    label: latest.emotion_label ?? "settled-neutral",
    inputs: latest.inputs as EmotionalSnapshot["inputs"],
    suggestions: (latest.suggestions as EmotionalSnapshot["suggestions"]) ?? [],
    generatedAt: latest.snapshot_at ?? new Date().toISOString(),
  };

  return { snapshot, source: "latest-stored" };
}

export async function POST(request: NextRequest) {
  try {
    const result = await buildSnapshotFromLatest(request);
    if (!result) {
      return NextResponse.json(
        { error: "Unauthorized or no biometric data available" },
        { status: 401 }
      );
    }

    const { snapshot, source } = result;
    const { user, supabase } = await getUser(request);

    let ruleSuggestions = snapshot.suggestions;
    if (!ruleSuggestions || ruleSuggestions.length === 0) {
      ruleSuggestions = generateRuleSuggestions(snapshot);
    }

    let providerMatches = snapshot.providerMatches;
    if (!providerMatches && user) {
      providerMatches = await routeSnapshotToProviders(user.id, snapshot, sampleProviders);

      // Optionally cache provider matches on the snapshot row
      if (source === "latest-stored") {
        await supabase
          .from("emotional_snapshots")
          .update({ provider_matches: providerMatches })
          .eq("id", (await supabase
            .from("emotional_snapshots")
            .select("id")
            .eq("user_id", user.id)
            .order("snapshot_at", { ascending: false })
            .limit(1)
            .single()).data?.id ?? "");
      }
    }

    return NextResponse.json({
      success: true,
      source,
      snapshot,
      ruleSuggestions,
      providerMatches,
    });
  } catch (error: unknown) {
    console.error("Suggest POST error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate suggestions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
