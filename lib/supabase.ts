import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Main app client - uses default cookie storage so middleware can read it
// This is the primary client for /appx routes
export function createAppClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Alias for backwards compatibility
export function createSupabaseClient() {
  return createAppClient();
}

// Admin portal client - uses localStorage with custom key for isolation
// This allows separate admin sessions from the main app
export function createAdminClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storageKey: "sb-boldandbeyond-admin-auth-token",
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
    }
  );
}

// Partner portal client - uses localStorage with custom key for isolation
// This allows separate partner sessions from the main app
export function createPartnerClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storageKey: "sb-boldandbeyond-partner-auth-token",
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
    }
  );
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

// Default client for backwards compatibility
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
