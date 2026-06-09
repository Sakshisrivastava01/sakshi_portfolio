"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface SceneProps {
  isSpeaking: boolean;
}

// 1. High-Fidelity Galaxy
function Galaxy() {
  const texture = useTexture("/galaxy.png");
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[25, -20, -40]} rotation={[0, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </mesh>
  );
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

// 2. Twinkling Stars
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
            vAlpha = 0.5 + 0.5 * sin(uTime * 2.0 + aBlinkOffset);
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
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
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 80 - 30
    ),
    rot: new THREE.Vector3(0, 0, Math.random() * Math.PI * 2),
    speed: new THREE.Vector3(
      -10 - Math.random() * 15, // Move left rapidly
      -5 - Math.random() * 10,  // Move down
      (Math.random() - 0.5) * 5
    ),
    rotSpeed: new THREE.Vector3(
      0, 0, (Math.random() - 0.5) * 1.5
    ),
    scale: Math.random() * 4 + 2
  }));
};

// 3. Realistic Falling Asteroids
function Asteroids({ count = 15 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const texture = useTexture("/asteroid.png");
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const asteroidData = useMemo(() => generateAsteroids(count), [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    asteroidData.forEach((data, i) => {
      // Move diagonally
      data.pos.addScaledVector(data.speed, delta);
      // Rotate slowly around Z axis (since it's a 2D plane)
      data.rot.addScaledVector(data.rotSpeed, delta);
      
      // Wrap around bounds
      if (data.pos.x < -60) data.pos.x = 60 + Math.random() * 20;
      if (data.pos.y < -50) data.pos.y = 50 + Math.random() * 20;

      dummy.position.copy(data.pos);
      // Planes always face the camera, so we only rotate around Z
      dummy.rotation.set(0, 0, data.rot.z);
      dummy.scale.set(data.scale, data.scale, data.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        alphaTest={0.1}
        depthWrite={false}
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
      (Math.random() + 0.5) * 30, // Move right fast
      (Math.random() - 0.5) * 15,
      (Math.random() + 0.5) * 30  // Move forward fast
    ),
    length: Math.random() * 15 + 10,
    delay: Math.random() * 8
  }));
};

// 4. Glowing Comets
function Comets({ count = 5 }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const comets = useMemo(() => generateComets(count), [count]);

  const materials = useMemo(() => {
    const colors = ["#4CC9F0", "#FF5EBE", "#9D4EDD"];
    return colors.map(c => new THREE.MeshBasicMaterial({ 
      color: c, 
      transparent: true, 
      opacity: 0.9,
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
      if (comet.position.x > 60 || comet.position.z > 20 || comet.position.y > 60 || comet.position.y < -60) {
        comet.position.set(
          -60 - Math.random() * 20,
          (Math.random() - 0.5) * 100,
          -50 - Math.random() * 50
        );
        comet.delay = Math.random() * 3;
      }
      
      const mesh = groupRef.current!.children[i] as THREE.Mesh;
      if (mesh) {
        mesh.position.copy(comet.position);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), comet.velocity.clone().normalize());
      }
    });
  });

  return (
    <group ref={groupRef}>
      {comets.map((comet, i) => (
        <mesh key={i} position={comet.position}>
          <cylinderGeometry args={[0.08, 0.4, comet.length, 8]} />
          <primitive object={materials[i % materials.length]} attach="material" />
        </mesh>
      ))}
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
      <Suspense fallback={null}>
        <Galaxy />
        <TwinklingStars count={4000} />
        <Asteroids count={12} />
        <Comets count={6} />
      </Suspense>
    </Canvas>
  );
}
