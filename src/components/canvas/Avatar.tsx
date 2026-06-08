"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface AvatarProps {
  isSpeaking: boolean;
}

export default function Avatar({ isSpeaking }: AvatarProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "/avatar.png",
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      undefined,
      (err) => {
        console.warn("Could not load /avatar.png. Using transparent fallback.");
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "rgba(0,0,0,0)";
          ctx.fillRect(0, 0, 1, 1);
        }
        setTexture(new THREE.CanvasTexture(canvas));
      }
    );
  }, []);
  
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  useEffect(() => {
    if (isSpeaking && !analyserRef.current) {
      const audioEl = document.getElementById("avatar-audio") as HTMLAudioElement;
      if (audioEl) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        
        try {
          const source = audioCtx.createMediaElementSource(audioEl);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
        } catch (e) {
          console.warn("Audio source might already be connected", e);
        }

        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      }
    }
  }, [isSpeaking]);
  
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uSpeaking: { value: 0.0 }, // 0 to 1 smooth transition
    uVolume: { value: 0.0 }, // Dynamic Web Audio Volume
    uMouse: { value: new THREE.Vector2(0, 0) },
    uBlink: { value: 0.0 },
    uNod: { value: 0.0 },
    uEyebrow: { value: 0.0 }
  }), [texture]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const time = state.clock.elapsedTime;
    uniforms.uTime.value = time;
    
    // Audio volume processing
    let currentVolume = 0.0;
    if (isSpeaking && analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        sum += dataArrayRef.current[i];
      }
      const avg = sum / dataArrayRef.current.length;
      currentVolume = Math.min(avg / 100, 1.0); // Normalize
    }
    
    uniforms.uVolume.value = THREE.MathUtils.lerp(
      uniforms.uVolume.value,
      currentVolume,
      0.2
    );

    // Eyebrow raise
    uniforms.uEyebrow.value = THREE.MathUtils.lerp(
      uniforms.uEyebrow.value,
      isSpeaking ? 1.0 : 0.0,
      0.05
    );
    
    // Smooth transition for speaking state
    uniforms.uSpeaking.value = THREE.MathUtils.lerp(
      uniforms.uSpeaking.value, 
      isSpeaking ? 1.0 : 0.0, 
      0.08
    );

    // Mouse tracking for realistic head/eye following
    // Clamp to natural movement limits
    const maxRotationX = Math.PI / 15;
    const maxRotationY = Math.PI / 12;
    
    const targetY = THREE.MathUtils.clamp((state.pointer.x * Math.PI) / 8, -maxRotationY, maxRotationY);
    const targetX = THREE.MathUtils.clamp((-state.pointer.y * Math.PI) / 8, -maxRotationX, maxRotationX);
    
    // Smooth easing for head rotation
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY, 0.04);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.04);
    
    // Complex breathing & posture shifts (idle state)
    // Blend multiple sine waves for organic movement
    const breath = Math.sin(time * 1.5) * 0.015;
    const postureShiftX = Math.sin(time * 0.5) * 0.02;
    const postureShiftY = Math.cos(time * 0.4) * 0.01;
    
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, postureShiftY + breath, 0.05);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, postureShiftX, 0.05);
    
    // Natural nodding when speaking
    if (isSpeaking) {
      uniforms.uNod.value = Math.sin(time * 4) * 0.5 + 0.5; // 0 to 1
    } else {
      uniforms.uNod.value = THREE.MathUtils.lerp(uniforms.uNod.value, 0, 0.1);
    }

    // Realistic blinking logic
    // Blink every ~4 seconds, fast blink duration
    const blinkCycle = time % 4.0;
    if (blinkCycle < 0.1 || (blinkCycle > 0.2 && blinkCycle < 0.25)) { 
      // Double blink occasionally
      uniforms.uBlink.value = THREE.MathUtils.lerp(uniforms.uBlink.value, 1.0, 0.3);
    } else {
      uniforms.uBlink.value = THREE.MathUtils.lerp(uniforms.uBlink.value, 0.0, 0.2);
    }
  });

  // Aspect ratio adjustment
  if (!texture) return null;
  const img = texture.image as any;
  const imageAspect = img && img.width ? img.width / img.height : 1;
  const scale = 4.5; // Adjust base size for premium feel

  return (
    <mesh ref={meshRef} scale={[scale * imageAspect, scale, 1]}>
      {/* High segment count for smooth vertex displacement */}
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uSpeaking;
          uniform float uNod;
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Subtle 2.5D depth illusion
            float depth = sin(uv.x * 3.14159) * 0.15;
            pos.z += depth;
            
            // Nodding animation
            if (uv.y > 0.5) {
               float nodFactor = (uv.y - 0.5) * 2.0;
               pos.z += nodFactor * uNod * 0.05 * uSpeaking;
               pos.y -= nodFactor * uNod * 0.02 * uSpeaking;
            }
            
            // Hand Gestures: Displace bottom UVs slightly when speaking
            float isLowerBody = smoothstep(0.4, 0.0, uv.y);
            if (uSpeaking > 0.0 && isLowerBody > 0.0) {
              pos.x += sin(uTime * 1.5) * 0.03 * isLowerBody * uSpeaking;
              pos.y += cos(uTime * 2.0) * 0.02 * isLowerBody * uSpeaking;
            }
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform float uSpeaking;
          uniform float uVolume;
          uniform float uBlink;
          uniform float uEyebrow;
          uniform float uTime;
          varying vec2 vUv;
          
          void main() {
            vec2 distortedUv = vUv;
            
            // Simulated blinking by squishing UVs around eye level (approx uv.y = 0.65)
            float eyeArea = smoothstep(0.55, 0.65, vUv.y) * smoothstep(0.75, 0.65, vUv.y);
            if (uBlink > 0.0 && eyeArea > 0.0) {
              float offset = (vUv.y - 0.65) * uBlink * 0.1;
              distortedUv.y -= offset * eyeArea;
            }

            // Eyebrow Raise when speaking
            float browArea = smoothstep(0.65, 0.75, vUv.y) * smoothstep(0.80, 0.75, vUv.y);
            if (uEyebrow > 0.0 && browArea > 0.0) {
               float browOffset = uEyebrow * 0.015;
               distortedUv.y -= browOffset * browArea;
            }
            
            // Lip Sync: Stretch UVs in mouth area based on audio volume
            // Assuming mouth is around uv.y = 0.52 to 0.58 and uv.x = 0.45 to 0.55
            float mouthArea = smoothstep(0.60, 0.55, vUv.y) * smoothstep(0.50, 0.55, vUv.y) * smoothstep(0.40, 0.50, vUv.x) * smoothstep(0.60, 0.50, vUv.x);
            if (uVolume > 0.01 && mouthArea > 0.0) {
              float mouthOffset = (0.55 - vUv.y) * uVolume * 0.15;
              distortedUv.y += mouthOffset * mouthArea;
            }

            vec4 texColor = texture2D(uTexture, distortedUv);
            
            // Subtle ambient space tint (cool blue/purple)
            vec3 ambientTint = vec3(0.9, 0.92, 1.0);
            texColor.rgb *= ambientTint;

            // Fake Edge Glow / Rim Light based on UVs to separate from background
            float edgeDist = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) * 2.0; 
            // Only apply edge glow where alpha is present (on the character itself)
            float rimLight = smoothstep(0.7, 1.0, edgeDist) * texColor.a;
            vec3 rimColor = vec3(0.8, 0.5, 1.0); // Soft purple rim
            texColor.rgb += rimColor * rimLight * 0.3;

            // Enhanced glow when speaking
            if (uSpeaking > 0.0) {
              vec3 glowColor = vec3(0.54, 0.17, 0.89); // Purple
              vec3 pinkGlow = vec3(1.0, 0.71, 0.76); // Soft Pink
              
              vec3 mixedGlow = mix(glowColor, pinkGlow, sin(uTime * 2.0) * 0.5 + 0.5);
              float glowIntensity = uSpeaking * 0.15;
              texColor.rgb += mixedGlow * glowIntensity * texColor.a;
            }
            
            gl_FragColor = texColor;
          }
        `}
      />
    </mesh>
  );
}
