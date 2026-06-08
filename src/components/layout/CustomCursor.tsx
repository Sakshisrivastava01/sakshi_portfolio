"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverState, setHoverState] = useState<"idle" | "button" | "view" | "open">("idle");
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse position tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for trailing elements
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Particle tracking
  const [rotation, setRotation] = useState(0);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Detect mobile / touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Determine hover state based on target attributes
      if (target.closest('[data-cursor="view"]')) {
        setHoverState("view");
      } else if (target.closest('a')) {
        setHoverState("open");
      } else if (
        target.closest('button') || 
        target.closest('[role="button"]') ||
        target.tagName.toLowerCase() === "button"
      ) {
        setHoverState("button");
      } else {
        setHoverState("idle");
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  // Orbit Animation Loop
  useEffect(() => {
    if (isMobile) return;
    
    const animateParticles = () => {
      setRotation(prev => (prev + 2) % 360);
      requestRef.current = requestAnimationFrame(animateParticles);
    };
    
    requestRef.current = requestAnimationFrame(animateParticles);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isMobile]);

  if (isMobile) return null;

  // Determine styles based on hover state
  const getOrbitStyles = () => {
    if (hoverState === "view" || hoverState === "open") return { scale: 3.5, opacity: 0 };
    if (hoverState === "button") return { scale: 0.8, backgroundColor: "rgba(255, 182, 193, 0.1)", borderColor: "rgba(255, 182, 193, 0.8)", boxShadow: "0 0 20px rgba(255, 182, 193, 0.5)" };
    return { scale: 1, backgroundColor: "transparent", borderColor: "rgba(230, 230, 250, 0.4)", boxShadow: "none" };
  };

  const particles = [0, 72, 144, 216, 288];

  return (
    <>
      {/* Tiny glowing white star core */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9999] shadow-[0_0_10px_rgba(255,255,255,1)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
          scale: hoverState === "view" || hoverState === "open" ? 0 : 1,
        }}
        animate={{
          scale: isClicking ? 0.5 : (hoverState !== "idle" ? 0 : 1)
        }}
        transition={{ duration: 0.15 }}
      />
      
      {/* Soft lavender orbit ring and hover states */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] border border-accent-lavender/40 flex items-center justify-center backdrop-blur-[1px]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          ...getOrbitStyles(),
          scale: isClicking ? getOrbitStyles().scale * 0.8 : getOrbitStyles().scale,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Click cosmic pulse */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-accent-pink/60 bg-accent-pink/10"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Orbiting Particles */}
      <motion.div
         className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999]"
         style={{
           x: smoothX,
           y: smoothY,
           translateX: "-50%",
           translateY: "-50%",
           opacity: isVisible && hoverState === "idle" ? 1 : 0,
         }}
      >
        <div 
          className="absolute inset-0"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {particles.map((angle, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-accent-lavender rounded-full shadow-[0_0_5px_rgba(230,230,250,1)]"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-20px)`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Hover Text (VIEW / OPEN) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] flex items-center justify-center font-mono text-[10px] tracking-widest font-bold text-black bg-white rounded-full px-3 py-1 shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: (hoverState === "view" || hoverState === "open") && isVisible ? 1 : 0,
          scale: (hoverState === "view" || hoverState === "open") ? (isClicking ? 0.9 : 1) : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {hoverState === "view" ? "VIEW ↗" : "OPEN ↗"}
      </motion.div>
    </>
  );
}
