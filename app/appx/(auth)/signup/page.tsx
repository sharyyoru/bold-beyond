"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAppClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { DecorativeBackground, BrandLogo } from "@/components/ui/decorative-bg";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createAppClient();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Sign up without email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // If user is created and session exists, redirect to onboarding for new users
      if (data.user && data.session) {
        toast({
          title: "Welcome!",
          description: "Let's personalize your experience.",
        });
        // New users always go to onboarding
        router.push("/appx/onboarding");
        router.refresh();
      } else if (data.user) {
        // User created but no session (email confirmation might still be required in Supabase)
        // Try to sign in immediately
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          toast({
            title: "Account created",
            description: "Please sign in with your credentials.",
          });
          router.push("/appx/login");
        } else {
          toast({
            title: "Welcome!",
            description: "Let's personalize your experience.",
          });
          // New users always go to onboarding
          router.push("/appx/onboarding");
          router.refresh();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: "google" | "facebook" | "apple") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream relative flex flex-col items-center justify-center px-6 py-12">
      <DecorativeBackground />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <BrandLogo className="h-16 w-16 mb-6" />

        {/* Title */}
        <h1 className="text-3xl font-display font-bold text-gray-900 text-center mb-2">
          Create your account
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Start your wellness journey today
        </p>

        {/* Form */}
        <form onSubmit={handleEmailSignup} className="w-full space-y-4 mb-8">
          {/* Full Name Field */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="text-sm text-gray-500 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full text-gray-900 bg-transparent focus:outline-none"
              required
            />
          </div>

          {/* Email Field */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="text-sm text-gray-500 block mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-gray-900 bg-transparent focus:outline-none"
              required
            />
          </div>

          {/* Password Field */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="text-sm text-gray-500 block mb-1">
              Password
            </label>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="flex-1 text-gray-900 bg-transparent focus:outline-none"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Must be at least 6 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="teal"
            size="xl"
            className="w-full font-medium text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            Create Account
          </Button>
        </form>

        {/* Social Login */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm mb-4">Or sign up with</p>
          <div className="flex items-center justify-center gap-4">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialSignup("google")}
              className="h-12 w-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleSocialSignup("facebook")}
              className="h-12 w-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleSocialSignup("apple")}
              className="h-12 w-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <Link href="/appx/login" className="text-brand-teal font-medium hover:underline">
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-gray-400 mt-4">
          By signing up, you agree to our{" "}
          <Link href="/appx/terms" className="underline hover:text-gray-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/appx/privacy" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
