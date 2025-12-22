"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPartnerClient } from "@/lib/supabase";

export default function PartnersPage() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createPartnerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check if user is a provider
      const { data: providerAccount } = await supabase
        .from("provider_accounts")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (providerAccount) {
        router.push("/partners/dashboard");
        return;
      }
    }

    router.push("/partners/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
    </div>
  );
}
