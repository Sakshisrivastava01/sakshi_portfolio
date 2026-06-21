"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { SoftShadows } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";

interface SceneProps {
  isSpeaking: boolean;
}

// Interactive Starfield Particle Layer
interface StarfieldProps {
  count: number;
  size: number;
  depth: number;
  speed: number;
  color: string;
}

// Simple deterministic seeded PRNG helper to satisfy React hooks purity rule
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
}

function StarfieldLayer({ count, size, depth, speed, color }: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random points in a 3D box purely
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rng = createSeededRandom(count + depth);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rng() - 0.5) * 50;
      pos[i * 3 + 1] = (rng() - 0.5) * 50;
      // Position them within a specific depth slice
      pos[i * 3 + 2] = (rng() - 0.5) * 40 - depth;
    }
    return pos;
  }, [count, depth]);

  useFrame((state) => {
    if (pointsRef.current) {
      const { x, y } = state.pointer; // Normalized pointer coordinates (-1 to 1)

      // Drift rotation
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.008 * speed;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.004 * speed;

      // Smooth parallax reaction to cursor (opposite direction of mouse)
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, -x * 2.5 * speed, 0.05);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, -y * 2.5 * speed, 0.05);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// A simple nebula component (with smooth cursor parallax)
function NebulaClouds({ isSpeaking }: { isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock, pointer }) => {
    if (groupRef.current) {
      // Rotation
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.015;
      
      // Dynamic shift based on pointer
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, -pointer.x * 1.5, 0.04);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -pointer.y * 1.5, 0.04);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -12]}>
      {/* Deep Purple Cloud */}
      <mesh position={[-8, 4, -5]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial color="#200530" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Pink Cosmic Fog */}
      <mesh position={[8, -4, -8]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial color="#300515" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Lavender Energy Center */}
      <mesh position={[0, 2, -2]}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color={isSpeaking ? "#401060" : "#200530"} transparent opacity={isSpeaking ? 0.3 : 0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
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
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[2, 5, 4]} 
        intensity={1.0} 
        color="#e0eaff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, -1, 2]} intensity={3} color="#ffb6c1" />
      <spotLight 
        position={[0, 3, -4]} 
        intensity={8} 
        color="#8a2be2" 
        angle={0.6} 
        penumbra={1} 
      />

      <Suspense fallback={null}>
        {/* Parallax Starfield Layers (Background, Midground, Foreground) */}
        <StarfieldLayer count={1500} size={0.06} depth={30} speed={0.4} color="#e6e6fa" />
        <StarfieldLayer count={800} size={0.12} depth={15} speed={0.8} color="#ffffff" />
        <StarfieldLayer count={300} size={0.18} depth={5} speed={1.3} color="#ffb6c1" />
        
        {/* Nebula Fog */}
        <NebulaClouds isSpeaking={isSpeaking} />
      </Suspense>
    </Canvas>
  );
}
