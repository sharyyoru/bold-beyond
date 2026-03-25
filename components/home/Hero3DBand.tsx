"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

// Brand colors
const COLORS = {
  sea: "#5BB5B0",
  seaDark: "#4A9A96",
  sand: "#E8D5C4",
  sandDark: "#D4C4B3",
  sky: "#6B9BC3",
  skyDark: "#5A8AB2",
};

function SmartWatch() {
  const watchRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (watchRef.current) {
      watchRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
    }
  });

  return (
    <group 
      ref={watchRef} 
      scale={1.6}
      position={[2.5, 0, 0]}
      rotation={[0.15, -0.4, 0]}
    >
      {/* Watch Case - Sea color */}
      <RoundedBox args={[1.1, 1.4, 0.18]} radius={0.15} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={COLORS.seaDark}
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>

      {/* Watch Bezel */}
      <RoundedBox args={[1.0, 1.3, 0.2]} radius={0.12} smoothness={4} position={[0, 0, 0.01]}>
        <meshStandardMaterial 
          color={COLORS.sea}
          roughness={0.15}
          metalness={0.9}
        />
      </RoundedBox>

      {/* Screen Display - Sky gradient effect */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[0.85, 1.1]} />
        <meshStandardMaterial 
          color={COLORS.sky}
          roughness={0.1}
        />
      </mesh>

      {/* Bold & Beyond Logo - Simple B icon */}
      <mesh position={[0, 0.15, 0.12]}>
        <ringGeometry args={[0.18, 0.25, 32]} />
        <meshStandardMaterial color={COLORS.seaDark} />
      </mesh>
      <mesh position={[0, 0.15, 0.125]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial color={COLORS.sand} />
      </mesh>
      
      {/* "B&B" Text representation - simple shapes */}
      <mesh position={[0, -0.25, 0.12]}>
        <planeGeometry args={[0.5, 0.08]} />
        <meshStandardMaterial color={COLORS.seaDark} />
      </mesh>

      {/* Digital Crown - Sand accent */}
      <mesh position={[0.62, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 32]} />
        <meshStandardMaterial color={COLORS.sandDark} roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Side button */}
      <mesh position={[0.6, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
        <meshStandardMaterial color={COLORS.sand} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Top Band Attachment - Sand color */}
      <RoundedBox args={[0.5, 0.25, 0.12]} radius={0.04} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={COLORS.sandDark} roughness={0.5} metalness={0.2} />
      </RoundedBox>
      
      {/* Top Band */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.45, 1, 0.08]} />
        <meshStandardMaterial color={COLORS.sand} roughness={0.6} metalness={0} />
      </mesh>
      
      {/* Band curve top */}
      <mesh position={[0, 2.1, -0.3]} rotation={[Math.PI / 3, 0, 0]}>
        <boxGeometry args={[0.45, 0.6, 0.08]} />
        <meshStandardMaterial color={COLORS.sand} roughness={0.6} metalness={0} />
      </mesh>

      {/* Bottom Band Attachment */}
      <RoundedBox args={[0.5, 0.25, 0.12]} radius={0.04} position={[0, -0.8, 0]}>
        <meshStandardMaterial color={COLORS.sandDark} roughness={0.5} metalness={0.2} />
      </RoundedBox>
      
      {/* Bottom Band */}
      <mesh position={[0, -1.4, 0]}>
        <boxGeometry args={[0.45, 1, 0.08]} />
        <meshStandardMaterial color={COLORS.sand} roughness={0.6} metalness={0} />
      </mesh>
      
      {/* Band curve bottom */}
      <mesh position={[0, -2.1, -0.3]} rotation={[-Math.PI / 3, 0, 0]}>
        <boxGeometry args={[0.45, 0.6, 0.08]} />
        <meshStandardMaterial color={COLORS.sand} roughness={0.6} metalness={0} />
      </mesh>

      {/* Band clasp - Sky accent */}
      <mesh position={[0, -2.4, -0.5]}>
        <boxGeometry args={[0.35, 0.15, 0.06]} />
        <meshStandardMaterial color={COLORS.skyDark} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />
      <pointLight position={[3, 0, 4]} intensity={0.5} color={COLORS.sea} />
      <SmartWatch />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  );
}

export default function Hero3DBand() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      {/* Interaction hint */}
      <div className="absolute bottom-8 right-8 text-white/40 text-sm flex items-center gap-2 pointer-events-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <span>Drag to interact</span>
      </div>
    </div>
  );
}
