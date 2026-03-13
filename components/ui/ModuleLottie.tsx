"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface ModuleLottieProps {
  animationPath: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function ModuleLottie({
  animationPath,
  className = "",
  loop = true,
  autoplay = true,
}: ModuleLottieProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch(animationPath)
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Failed to load animation:", error));
  }, [animationPath]);

  if (!animationData) {
    return <div className={`${className} bg-gray-100 animate-pulse rounded-xl`} />;
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      rendererSettings={{
        preserveAspectRatio: "xMidYMid meet",
      }}
    />
  );
}
