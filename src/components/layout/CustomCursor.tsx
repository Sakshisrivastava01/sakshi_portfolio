"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoverState, setHoverState] = useState<"idle" | "link" | "button" | "card">("idle");
  const [isClicking, setIsClicking] = useState(false);

  // Instant tracking for the arrow
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Position for the floating label
  const labelX = useMotionValue(-100);
  const labelY = useMotionValue(-100);

  useEffect(() => {
    // Detect touch device
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setTimeout(() => setIsMobile(true), 0);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      labelX.set(e.clientX + 25);
      labelY.set(e.clientY + 25);

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('[data-cursor="view"]')) {
         setHoverState("card");
      } else if (target.closest('a')) {
         setHoverState("link");
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
  }, [mouseX, mouseY, labelX, labelY, isVisible]);

  if (isMobile) return null;

  const getCursorStyle = () => {
     switch (hoverState) {
       case "link":
         return { scale: 1.15, filter: "drop-shadow(0 0 10px rgba(255, 94, 190, 0.8))" };
       case "button":
         return { scale: 1.2, filter: "drop-shadow(0 0 12px rgba(157, 78, 221, 0.9))" };
       case "card":
         return { scale: 1.1, filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))" };
       default:
         return { scale: 1, filter: "drop-shadow(0 0 6px rgba(255, 94, 190, 0.4))" };
     }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: mouseX,
          y: mouseY,
          // Minor negative translation so the tip of the arrow is perfectly on the actual mouse click point
          translateX: "-2px", 
          translateY: "-2px",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isClicking ? 0.9 : getCursorStyle().scale,
          filter: getCursorStyle().filter
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <svg
          width="20"
          height="22"
          viewBox="0 0 24 24"
          fill="rgba(255, 255, 255, 0.9)"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          {/* Classic premium arrow pointer shape */}
          <path d="M5.5 3.5L18.5 10.5L12 13L9.5 19.5L5.5 3.5Z" />
        </svg>

        {/* Instant Click Ripple Pulse */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-accent-pink/60 bg-accent-pink/10 mix-blend-screen"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Label for Cards */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] flex items-center justify-center font-mono text-[10px] tracking-widest font-bold text-black bg-white rounded-full px-3 py-1 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        style={{
          x: labelX,
          y: labelY,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: hoverState === "card" && isVisible ? 1 : 0,
          scale: hoverState === "card" ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
      >
        VIEW ↗
      </motion.div>
    </>
  );
}
