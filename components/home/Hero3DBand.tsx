"use client";

import React, { useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function SmartWatch() {
  const watchRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (watchRef.current) {
      // Subtle idle floating animation
      watchRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    }
    if (screenRef.current) {
      // Pulsing glow effect on screen
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.8;
      (screenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });

  return (
    <group 
      ref={watchRef} 
      scale={1.8}
      rotation={[0.2, -0.3, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Watch Case - Premium rounded rectangle */}
      <RoundedBox args={[1.1, 1.4, 0.18]} radius={0.15} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#0a192f"
          roughness={0.15}
          metalness={0.9}
        />
      </RoundedBox>

      {/* Watch Bezel - Brushed metal frame */}
      <RoundedBox args={[1.0, 1.3, 0.2]} radius={0.12} smoothness={4} position={[0, 0, 0.01]}>
        <meshStandardMaterial 
          color="#1a365d"
          roughness={0.2}
          metalness={0.95}
        />
      </RoundedBox>

      {/* Screen Display - Glowing */}
      <mesh ref={screenRef} position={[0, 0, 0.11]}>
        <planeGeometry args={[0.85, 1.1]} />
        <meshStandardMaterial 
          color="#0d1b2a"
          emissive="#4fd1c5"
          emissiveIntensity={0.6}
          roughness={0.1}
        />
      </mesh>

      {/* Screen UI Elements */}
      {/* Time display */}
      <mesh position={[0, 0.35, 0.115]}>
        <planeGeometry args={[0.6, 0.15]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
      </mesh>

      {/* Heart rate circle */}
      <mesh position={[-0.2, 0, 0.115]}>
        <ringGeometry args={[0.12, 0.16, 32]} />
        <meshStandardMaterial color="#f687b3" emissive="#f687b3" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.2, 0, 0.116]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color="#f687b3" emissive="#f687b3" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>

      {/* Activity rings */}
      <mesh position={[0.22, 0.05, 0.115]}>
        <ringGeometry args={[0.1, 0.13, 32]} />
        <meshStandardMaterial color="#68d391" emissive="#68d391" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.22, 0.05, 0.115]}>
        <ringGeometry args={[0.06, 0.09, 32]} />
        <meshStandardMaterial color="#63b3ed" emissive="#63b3ed" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.22, 0.05, 0.115]}>
        <ringGeometry args={[0.02, 0.05, 32]} />
        <meshStandardMaterial color="#fbd38d" emissive="#fbd38d" emissiveIntensity={1} />
      </mesh>

      {/* Status bar dots */}
      {[-0.2, 0, 0.2].map((x, i) => (
        <mesh key={i} position={[x, -0.4, 0.115]}>
          <circleGeometry args={[0.03, 16]} />
          <meshStandardMaterial 
            color={i === 1 ? "#4fd1c5" : "#ffffff"} 
            emissive={i === 1 ? "#4fd1c5" : "#ffffff"} 
            emissiveIntensity={i === 1 ? 1 : 0.3} 
          />
        </mesh>
      ))}

      {/* Digital Crown */}
      <mesh position={[0.62, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 32]} />
        <meshStandardMaterial color="#2d3748" roughness={0.3} metalness={0.9} />
      </mesh>
      
      {/* Side button */}
      <mesh position={[0.6, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
        <meshStandardMaterial color="#4a5568" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Top Band Attachment */}
      <RoundedBox args={[0.5, 0.25, 0.12]} radius={0.04} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#d4c5b0" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      
      {/* Top Band */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.45, 1, 0.08]} />
        <meshStandardMaterial color="#e8dfd0" roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Band curve top */}
      <mesh position={[0, 2.1, -0.3]} rotation={[Math.PI / 3, 0, 0]}>
        <boxGeometry args={[0.45, 0.6, 0.08]} />
        <meshStandardMaterial color="#e8dfd0" roughness={0.7} metalness={0} />
      </mesh>

      {/* Bottom Band Attachment */}
      <RoundedBox args={[0.5, 0.25, 0.12]} radius={0.04} position={[0, -0.8, 0]}>
        <meshStandardMaterial color="#d4c5b0" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      
      {/* Bottom Band */}
      <mesh position={[0, -1.4, 0]}>
        <boxGeometry args={[0.45, 1, 0.08]} />
        <meshStandardMaterial color="#e8dfd0" roughness={0.7} metalness={0} />
      </mesh>
      
      {/* Band curve bottom */}
      <mesh position={[0, -2.1, -0.3]} rotation={[-Math.PI / 3, 0, 0]}>
        <boxGeometry args={[0.45, 0.6, 0.08]} />
        <meshStandardMaterial color="#e8dfd0" roughness={0.7} metalness={0} />
      </mesh>

      {/* Band clasp */}
      <mesh position={[0, -2.4, -0.5]}>
        <boxGeometry args={[0.35, 0.15, 0.06]} />
        <meshStandardMaterial color="#c4b5a0" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <directionalLight position={[0, -5, 0]} intensity={0.2} />
      <pointLight position={[0, 0, 4]} intensity={0.8} color="#4fd1c5" />
      <pointLight position={[-3, 2, 2]} intensity={0.3} color="#f687b3" />
      <SmartWatch />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function Hero3DBand() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      {/* Interaction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm flex items-center gap-2 pointer-events-none">
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <span>Drag to rotate</span>
      </div>
    </div>
  );
}
