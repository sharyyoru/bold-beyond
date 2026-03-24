"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // -1 to 1, negative = slower, positive = faster
  direction?: "up" | "down";
}

export function Parallax({ 
  children, 
  className = "", 
  speed = 0.5,
  direction = "up" 
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const factor = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * factor, -100 * speed * factor]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  backgroundSpeed?: number;
  contentSpeed?: number;
}

export function ParallaxSection({ 
  children, 
  className = "",
  backgroundSpeed = 0.3,
  contentSpeed = 0.1
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", `${backgroundSpeed * 100}%`]);
  const contentY = useTransform(scrollYProgress, [0, 1], [30, -30 * contentSpeed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.section 
      ref={ref} 
      className={`relative ${className}`}
      style={{ opacity }}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      />
      <motion.div 
        className="relative z-10"
        style={{ y: contentY, scale }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxBackground({ 
  children, 
  className = "",
  speed = 0.5
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 20}%`, `${speed * 20}%`]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div 
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{ y }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return { ref, y, opacity, scrollYProgress };
}

export default Parallax;
