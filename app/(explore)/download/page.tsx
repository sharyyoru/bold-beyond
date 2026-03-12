import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Smartphone, Apple, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-sky via-palette-sea to-palette-sky relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-palette-sand/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-palette-sea/20 rounded-full blur-3xl" />

      <div className="container relative z-10 py-16 px-4">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-12 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>

        {/* Main content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/new-assets/bnb-white.png"
              alt="Bold & Beyond"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Download Bold & Beyond
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Your personal wellness companion. Track your mental health, connect with experts, and unlock your full potential.
          </p>

          {/* Download cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* iOS Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all">
              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                <Apple className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">iOS App</h2>
              <p className="text-white/70 mb-6">Download from the App Store</p>
              
              {/* QR Code placeholder */}
              <div className="bg-white rounded-2xl p-4 w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Scan to download</p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-white text-gray-900 hover:bg-white/90 rounded-full py-6 text-lg font-semibold"
                asChild
              >
                <Link href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                  <Apple className="h-5 w-5 mr-2" />
                  App Store
                </Link>
              </Button>
            </div>

            {/* Android Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all">
              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                <Play className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Android App</h2>
              <p className="text-white/70 mb-6">Download from Google Play</p>
              
              {/* QR Code placeholder */}
              <div className="bg-white rounded-2xl p-4 w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Scan to download</p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-white text-gray-900 hover:bg-white/90 rounded-full py-6 text-lg font-semibold"
                asChild
              >
                <Link href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                  <Play className="h-5 w-5 mr-2" />
                  Google Play
                </Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-8">What&apos;s Inside</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Human OS", description: "AI-powered wellness intelligence that learns and adapts to you" },
                { title: "Expert Network", description: "Connect with verified therapists, coaches, and wellness professionals" },
                { title: "Regulation Tools", description: "Science-backed tools for nervous system regulation and emotional balance" },
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="h-12 w-12 rounded-xl bg-palette-sand/30 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">
                      {i === 0 ? "🧠" : i === 1 ? "👥" : "🎯"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Web app link */}
          <div className="mt-12">
            <p className="text-white/60 mb-4">Or continue on the web</p>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full px-8"
              asChild
            >
              <Link href="/appx">
                Open Web App
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
