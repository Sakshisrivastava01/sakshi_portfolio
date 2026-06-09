"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { SoftShadows, Stars } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

interface SceneProps {
  isSpeaking: boolean;
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
        
        
        {/* Nebula Fog */}
        <NebulaClouds isSpeaking={isSpeaking} />
      </Suspense>
    </Canvas>
  );
}
