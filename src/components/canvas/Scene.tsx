"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

interface SceneProps {
  isSpeaking: boolean;
}

// Helper functions for deterministic initialization outside of components
const generateStars = (count: number) => {
  const pos = new Float32Array(count * 3);
  const siz = new Float32Array(count);
  const blink = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 20 + Math.random() * 80;
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    
    siz[i] = Math.random() * 2.0 + 0.5;
    blink[i] = Math.random() * 100;
  }
  return [pos, siz, blink];
};

// 1. Twinkling Stars
function TwinklingStars({ count = 3000 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const [positions, sizes, blinkOffsets] = useMemo(() => generateStars(count), [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame((state) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aBlinkOffset" args={[blinkOffsets, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderMaterialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          attribute float aSize;
          attribute float aBlinkOffset;
          varying float vAlpha;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = aSize * (300.0 / -mvPosition.z);
            
            // Random blinking effect
            vAlpha = 0.5 + 0.5 * sin(uTime * 2.0 + aBlinkOffset);
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            // Circular particle
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            // Soft glow
            float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
          }
        `}
      />
    </points>
  );
}

const generateAsteroids = (count: number) => {
  return Array.from({ length: count }, () => ({
    pos: new THREE.Vector3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100 - 20
    ),
    rot: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
    speed: new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    ),
    rotSpeed: new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    ),
    scale: Math.random() * 0.5 + 0.1
  }));
};

// 2. Parallax Asteroids
function Asteroids({ count = 100 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const asteroidData = useMemo(() => generateAsteroids(count), [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    asteroidData.forEach((data, i) => {
      // Move
      data.pos.addScaledVector(data.speed, delta);
      // Rotate
      data.rot.addScaledVector(data.rotSpeed, delta);
      
      // Wrap around bounds
      if (data.pos.x > 50) data.pos.x = -50;
      if (data.pos.x < -50) data.pos.x = 50;
      if (data.pos.y > 50) data.pos.y = -50;
      if (data.pos.y < -50) data.pos.y = 50;
      if (data.pos.z > 30) data.pos.z = -70;
      if (data.pos.z < -70) data.pos.z = 30;

      dummy.position.copy(data.pos);
      dummy.rotation.set(data.rot.x, data.rot.y, data.rot.z);
      dummy.scale.set(data.scale, data.scale, data.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#1a1a24" 
        roughness={0.8} 
        metalness={0.2}
      />
    </instancedMesh>
  );
}

const generateComets = (count: number) => {
  return Array.from({ length: count }, () => ({
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      -50 - Math.random() * 50
    ),
    velocity: new THREE.Vector3(
      (Math.random() + 0.5) * 20, // Move right
      (Math.random() - 0.5) * 10,
      (Math.random() + 0.5) * 20  // Move forward
    ),
    length: Math.random() * 10 + 5,
    delay: Math.random() * 10
  }));
};

// 3. Comets / Shooting Stars
function Comets({ count = 5 }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const comets = useMemo(() => generateComets(count), [count]);

  const materials = useMemo(() => {
    const colors = ["#4CC9F0", "#FF5EBE", "#9D4EDD"];
    return colors.map(c => new THREE.MeshBasicMaterial({ 
      color: c, 
      transparent: true, 
      opacity: 0.8,
      blending: THREE.AdditiveBlending 
    }));
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    comets.forEach((comet, i) => {
      if (comet.delay > 0) {
        comet.delay -= delta;
        return;
      }
      
      comet.position.addScaledVector(comet.velocity, delta);
      
      // Reset if out of bounds
      if (comet.position.x > 50 || comet.position.z > 20 || comet.position.y > 50 || comet.position.y < -50) {
        comet.position.set(
          -50 - Math.random() * 20,
          (Math.random() - 0.5) * 100,
          -50 - Math.random() * 50
        );
        comet.delay = Math.random() * 5;
      }
      
      const mesh = groupRef.current!.children[i] as THREE.Mesh;
      if (mesh) {
        mesh.position.copy(comet.position);
        // Point the cylinder in the direction of velocity
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), comet.velocity.clone().normalize());
      }
    });
  });

  return (
    <group ref={groupRef}>
      {comets.map((comet, i) => (
        <mesh key={i} position={comet.position}>
          <cylinderGeometry args={[0.05, 0.2, comet.length, 8]} />
          <primitive object={materials[i % materials.length]} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

// 4. Nebula Clouds
function NebulaClouds({ isSpeaking }: { isSpeaking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.02;
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {/* Dark Purple Cloud */}
      <mesh position={[-15, 8, -10]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial color="#12001F" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Neon Purple Cloud */}
      <mesh position={[15, -8, -15]}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial color="#9D4EDD" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Neon Pink Cosmic Fog */}
      <mesh position={[0, -12, -5]}>
        <sphereGeometry args={[18, 32, 32]} />
        <meshBasicMaterial color="#FF5EBE" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Electric Blue Core */}
      <mesh position={[0, 5, -20]}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshBasicMaterial color="#4CC9F0" transparent opacity={isSpeaking ? 0.15 : 0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function Scene({ isSpeaking }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.1} color="#12001F" />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#9D4EDD" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#FF5EBE" />
      <spotLight position={[0, 0, 10]} intensity={3} color="#4CC9F0" angle={0.5} penumbra={1} />

      <Suspense fallback={null}>
        <TwinklingStars count={4000} />
        <Asteroids count={150} />
        <Comets count={8} />
        <NebulaClouds isSpeaking={isSpeaking} />
      </Suspense>
    </Canvas>
  );
}
