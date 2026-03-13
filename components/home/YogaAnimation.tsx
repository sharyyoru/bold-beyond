"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function YogaAnimation() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/animations/Yoga.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load Yoga animation:", err));
  }, []);

  if (!animationData) {
    return <div className="w-full h-48 bg-white/10 rounded-2xl animate-pulse" />;
  }

  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      className="w-full h-full max-h-64"
      rendererSettings={{
        preserveAspectRatio: "xMidYMid meet",
      }}
    />
  );
}
