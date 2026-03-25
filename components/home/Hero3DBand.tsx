"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function SmartBand() {
  const bandRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bandRef.current) {
      bandRef.current.rotation.y += 0.008;
      bandRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={bandRef} scale={2.2}>
      {/* Main Band Body - Curved torus shape */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.15, 32, 100, Math.PI * 1.6]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Band Clasp */}
      <mesh position={[0, 0, -0.95]}>
        <boxGeometry args={[0.3, 0.15, 0.1]} />
        <meshStandardMaterial color="#d4cfc5" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Watch Face Housing */}
      <mesh position={[0, 0, 1]}>
        <boxGeometry args={[0.7, 0.9, 0.15]} />
        <meshStandardMaterial color="#1a365d" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Screen Display */}
      <mesh position={[0, 0, 1.08]}>
        <planeGeometry args={[0.55, 0.75]} />
        <meshStandardMaterial color="#4fd1c5" emissive="#4fd1c5" emissiveIntensity={0.5} />
      </mesh>

      {/* Heart icon */}
      <mesh position={[0, 0.15, 1.09]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial color="#f687b3" emissive="#f687b3" emissiveIntensity={0.8} />
      </mesh>

      {/* Metrics bars */}
      <mesh position={[-0.15, -0.15, 1.09]}>
        <boxGeometry args={[0.08, 0.25, 0.01]} />
        <meshStandardMaterial color="#68d391" emissive="#68d391" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -0.15, 1.09]}>
        <boxGeometry args={[0.08, 0.35, 0.01]} />
        <meshStandardMaterial color="#63b3ed" emissive="#63b3ed" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.15, -0.15, 1.09]}>
        <boxGeometry args={[0.08, 0.2, 0.01]} />
        <meshStandardMaterial color="#fbd38d" emissive="#fbd38d" emissiveIntensity={0.6} />
      </mesh>

      {/* Side button */}
      <mesh position={[0.38, 0.1, 1]}>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />
        <meshStandardMaterial color="#718096" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Crown */}
      <mesh position={[0.4, -0.15, 1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 32]} />
        <meshStandardMaterial color="#a0aec0" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#4fd1c5" />
      <SmartBand />
    </>
  );
}

export default function Hero3DBand() {
  return (
    <div className="w-full h-[500px] lg:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
