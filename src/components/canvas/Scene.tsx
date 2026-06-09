"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { SoftShadows, Stars, Sparkles, Line } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

interface SceneProps {
  isSpeaking: boolean;
}

// Deterministic random generators for constellations
const generateConstellations = (count: number) => {
  return Array.from({ length: count }, () => {
    const numStars = Math.floor(Math.random() * 4) + 3; // 3 to 6 stars per constellation
    
    // Base position for the constellation
    const baseX = (Math.random() - 0.5) * 80;
    const baseY = (Math.random() - 0.5) * 60;
    const baseZ = -30 - Math.random() * 30; // Deep in the background
    
    const points: [number, number, number][] = [];
    
    // Generate star points clustered around the base
    for (let i = 0; i < numStars; i++) {
      points.push([
        baseX + (Math.random() - 0.5) * 15,
        baseY + (Math.random() - 0.5) * 15,
        baseZ + (Math.random() - 0.5) * 5
      ]);
    }

    // Connect stars (simple linear path for a constellation-like look)
    const fadeSpeed = 0.5 + Math.random() * 1.5;
    const fadeOffset = Math.random() * Math.PI * 2;

    return { points, fadeSpeed, fadeOffset };
  });
};

function Constellations({ count = 8 }) {
  const constellationData = useMemo(() => generateConstellations(count), [count]);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    
    // Iterate over children (groups of lines)
    groupRef.current.children.forEach((child, index) => {
      const data = constellationData[index];
      // Slow pulsing fade
      const opacity = 0.1 + Math.sin(time * data.fadeSpeed + data.fadeOffset) * 0.08;
      
      child.children.forEach((mesh) => {
        const material = (mesh as any).material;
        if (material && material.transparent) {
          material.opacity = opacity;
        }
      });
    });
    
    // Very slow rotation of all constellations
    groupRef.current.rotation.y = time * 0.01;
  });

  return (
    <group ref={groupRef}>
      {constellationData.map((data, i) => {
        // Create an array of Vector3s for Line geometry
        const vectors = data.points.map(p => new THREE.Vector3(...p));
        
        return (
          <group key={i}>
            {/* The connecting lines */}
            <Line
              points={vectors}
              color="white"
              lineWidth={0.5}
              transparent
              opacity={0.15}
            />
            {/* The star nodes */}
            {data.points.map((p, j) => (
              <mesh key={j} position={p}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color="white" transparent opacity={0.6} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

// A simple nebula component (restored from original)
function NebulaClouds({ isSpeaking }: { isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.03;
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {/* Deep Purple Cloud */}
      <mesh position={[-8, 4, -5]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial color="#200530" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Pink Cosmic Fog */}
      <mesh position={[8, -4, -8]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial color="#300515" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Lavender Energy Center */}
      <mesh position={[0, 2, -2]}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color={isSpeaking ? "#401060" : "#200530"} transparent opacity={isSpeaking ? 0.4 : 0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function Scene({ isSpeaking }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <SoftShadows size={10} samples={10} focus={0.5} />
      
      {/* Cinematic Lighting Setup */}
      {/* Dim ambient light for deep space feel */}
      <ambientLight intensity={0.2} />
      
      {/* Key Light: Soft, cool tone for a digital assistant feel */}
      <directionalLight 
        position={[2, 5, 4]} 
        intensity={1.0} 
        color="#e0eaff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Fill Light: Pink Edge Glow */}
      <pointLight position={[-4, -1, 2]} intensity={3} color="#ffb6c1" />
      
      {/* Rim/Back Light: Deep Purple separating avatar from background */}
      <spotLight 
        position={[0, 3, -4]} 
        intensity={8} 
        color="#8a2be2" 
        angle={0.6} 
        penumbra={1} 
      />

      <Suspense fallback={null}>
        {/* Deep Space Background Layer */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        
        {/* New Constellations Layer */}
        <Constellations count={8} />

        {/* Energy Particles / Cosmic Dust */}
        <Sparkles 
          count={400} 
          scale={25} 
          size={isSpeaking ? 4 : 2} 
          speed={isSpeaking ? 0.8 : 0.2} 
          opacity={isSpeaking ? 0.8 : 0.4}
          color="#e0b0ff" // Lavender particles
        />
        
        {/* Nebula Fog */}
        <NebulaClouds isSpeaking={isSpeaking} />
      </Suspense>
    </Canvas>
  );
}
