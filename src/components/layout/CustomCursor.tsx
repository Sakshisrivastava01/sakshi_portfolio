"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Instant tracking for the cursor
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for a slight trailing glow
  const smoothConfig = { damping: 20, stiffness: 400, mass: 0.2 };
  const smoothX = useSpring(mouseX, smoothConfig);
  const smoothY = useSpring(mouseY, smoothConfig);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setTimeout(() => setIsMobile(true), 0);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        target.closest('[data-cursor="view"]') ||
        target.tagName.toLowerCase() === "button"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isMobile) return null;

  return (
    <>
      {/* Soft Trailing Glow behind the cursor */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible && isHovering ? 0.8 : 0,
        }}
        animate={{
          width: isHovering ? 60 : 20,
          height: isHovering ? 60 : 20,
          background: isHovering ? "radial-gradient(circle, rgba(255, 94, 190, 0.4) 0%, rgba(157, 78, 221, 0) 70%)" : "transparent",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Main Glowing Arrow Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          x: mouseX,
          y: mouseY,
          // Shift the visual center to the top-left tip of the arrow
          translateX: "-4px",
          translateY: "-4px",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 1.15 : 1,
          rotate: isHovering ? -10 : 0
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <svg
          width="28"
          height="32"
          viewBox="0 0 28 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_8px_rgba(255,94,190,0.8)]"
        >
          <defs>
            <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5EBE" />
              <stop offset="100%" stopColor="#9D4EDD" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            d="M2.5 2.5L10.5 29.5L14 18L25.5 14.5L2.5 2.5Z"
            fill="url(#cursorGradient)"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        </svg>
      </motion.div>
    </>
  );
}
