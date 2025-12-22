import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Portal types for separate session management
export type PortalType = "app" | "admin" | "partner";

// Create portal-specific storage key
function getStorageKey(portal: PortalType): string {
  return `sb-boldandbeyond-${portal}-auth-token`;
}

// Client-side Supabase client (default - for /appx)
export function createSupabaseClient(portal: PortalType = "app") {
  const storageKey = getStorageKey(portal);
  
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storageKey,
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
    }
  );
}

// Convenience functions for each portal
export function createAppClient() {
  return createSupabaseClient("app");
}

export function createAdminClient() {
  return createSupabaseClient("admin");
}

export function createPartnerClient() {
  return createSupabaseClient("partner");
}

// Server-side admin client (use only in server components/API routes)
export function createSupabaseAdmin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Default client for backwards compatibility (uses app portal)
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storageKey: getStorageKey("app"),
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
  }
);
