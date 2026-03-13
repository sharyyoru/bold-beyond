"use client";

import Image from "next/image";

export default function SmiliesAnimation() {
  return (
    <div className="relative w-48 h-48">
      {/* Mandala Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/assets/mandala-filled.svg')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      
      {/* Floating Smilies */}
      <div 
        className="absolute top-2 left-4 w-10 h-10 rounded-full bg-[#E8B86D] flex items-center justify-center text-xl"
        style={{
          animation: "smiley-float-1 3s ease-in-out infinite",
        }}
      >
        <span className="transform -rotate-12">😊</span>
      </div>
      
      <div 
        className="absolute top-2 right-4 w-10 h-10 rounded-full bg-[#9CB071] flex items-center justify-center text-xl"
        style={{
          animation: "smiley-float-2 4s ease-in-out infinite 0.5s",
        }}
      >
        <span>😌</span>
      </div>
      
      <div 
        className="absolute bottom-8 left-6 w-10 h-10 rounded-full bg-[#D4A574] flex items-center justify-center text-xl"
        style={{
          animation: "smiley-float-3 3.5s ease-in-out infinite 1s",
        }}
      >
        <span className="transform rotate-180">😐</span>
      </div>
      
      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes smiley-float-1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-8px) translateX(4px); }
        }
        @keyframes smiley-float-2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-6px) translateX(-4px); }
        }
        @keyframes smiley-float-3 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(2px); }
        }
      `}</style>
    </div>
  );
}
