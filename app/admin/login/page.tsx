"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createSupabaseClient();
      
      // Sign in with email/password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user is an admin using the authenticated session
      let adminAccount: any = null;
      
      const { data: adminData, error: adminError } = await supabase
        .from("admin_accounts")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      console.log("Admin lookup result:", { adminData, adminError, email });

      if (adminData) {
        adminAccount = adminData;
      } else {
        // Try with ilike for case-insensitive match
        const { data: adminAccountAlt, error: altError } = await supabase
          .from("admin_accounts")
          .select("*")
          .ilike("email", email)
          .maybeSingle();
          
        if (adminAccountAlt) {
          adminAccount = adminAccountAlt;
        } else {
          await supabase.auth.signOut();
          throw new Error("You don't have admin access. Contact support if you believe this is an error.");
        }
      }

      if (!adminAccount || !adminAccount.is_active) {
        await supabase.auth.signOut();
        throw new Error("Your admin account has been deactivated");
      }

      // Link user_id if not already linked
      if (!adminAccount.user_id && authData.user) {
        await supabase
          .from("admin_accounts")
          .update({ 
            user_id: authData.user.id,
            last_login: new Date().toISOString()
          })
          .eq("id", adminAccount.id);
      } else {
        await supabase
          .from("admin_accounts")
          .update({ last_login: new Date().toISOString() })
          .eq("id", adminAccount.id);
      }

      // Check if password needs to be changed
      if (!adminAccount.password_changed && adminAccount.temp_password) {
        router.push("/admin/change-password");
        return;
      }

      toast({
        title: "Welcome back!",
        description: `Logged in as ${adminAccount.full_name}`,
      });

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 mt-1">Bold & Beyond Management</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-xl font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Protected admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
