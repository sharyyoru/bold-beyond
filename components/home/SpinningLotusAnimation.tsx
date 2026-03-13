"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SpinningLotusAnimation() {
  return (
    <div className="relative w-48 h-48">
      {/* Spinning Lotus/Mandala */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="/assets/mandala-logo.svg"
          alt="Lotus"
          width={160}
          height={160}
          className="opacity-40"
        />
      </motion.div>
      
      {/* Floating Smilies with animation */}
      <motion.div 
        className="absolute top-0 left-4 w-12 h-12"
        animate={{ 
          y: [0, -8, 0],
          x: [0, 4, 0],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Image
          src="/assets/excellent-emoticon.svg"
          alt="Happy"
          width={48}
          height={48}
        />
      </motion.div>
      
      <motion.div 
        className="absolute top-0 right-4 w-12 h-12"
        animate={{ 
          y: [0, -6, 0],
          x: [0, -4, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <Image
          src="/assets/great-emoticon.svg"
          alt="Good"
          width={48}
          height={48}
        />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-4 left-6 w-12 h-12"
        animate={{ 
          y: [0, -10, 0],
          x: [0, 2, 0],
        }}
        transition={{ 
          duration: 3.5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Image
          src="/assets/neutral-emoticon.svg"
          alt="Neutral"
          width={48}
          height={48}
        />
      </motion.div>
    </div>
  );
}
