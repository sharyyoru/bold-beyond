"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DecorativeBackground, BrandLogo } from "@/components/ui/decorative-bg";

export default function WelcomePage() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="min-h-screen bg-brand-cream relative flex flex-col items-center justify-center px-6 py-12">
      <DecorativeBackground />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <BrandLogo className="h-20 w-20 mb-8" />

        {/* Title */}
        <h1 className="text-4xl font-display font-bold text-gray-900 text-center mb-3">
          Welcome to
        </h1>
        <h1 className="text-4xl font-display font-bold text-gray-900 text-center mb-4">
          Bold & Beyond
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-12 px-4">
          We drive positive change for individuals and businesses in our community
        </p>

        {/* Buttons */}
        <div className="w-full flex gap-4 mb-4">
          <Button
            variant="teal-outline"
            size="lg"
            className="flex-1 font-medium"
            asChild
          >
            <Link href="/appx/login">Log in</Link>
          </Button>
          <Button
            variant="teal"
            size="lg"
            className="flex-1 font-medium"
            asChild
          >
            <Link href="/appx/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Google Login */}
        <Button
          variant="social"
          size="lg"
          className="w-full mb-6 font-medium"
          asChild
        >
          <Link href="/api/auth/google">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
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
            Login with Google
          </Link>
        </Button>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
            By continuing, you agree to the{" "}
            <Link href="/appx/terms" className="text-brand-teal hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/appx/privacy" className="text-brand-teal hover:underline">
              Privacy Policy
            </Link>{" "}
            of Bold and Beyond.
          </label>
        </div>
      </div>
    </div>
  );
}
