"use client";

import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-luxury-black">
      {/* Pink Orb */}
      <motion.div
        animate={{
          x: ["-10%", "20%", "-10%"],
          y: ["-10%", "10%", "-10%"],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-accent-pink rounded-full mix-blend-screen opacity-[0.03] filter blur-[100px]"
      />
      
      {/* Purple Orb */}
      <motion.div
        animate={{
          x: ["20%", "-10%", "20%"],
          y: ["10%", "-20%", "10%"],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-[50vw] h-[50vw] bg-accent-purple rounded-full mix-blend-screen opacity-[0.03] filter blur-[120px]"
      />
      
      {/* Lavender Orb */}
      <motion.div
        animate={{
          x: ["0%", "10%", "0%"],
          y: ["20%", "0%", "20%"],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/3 w-[60vw] h-[60vw] bg-accent-lavender rounded-full mix-blend-screen opacity-[0.02] filter blur-[150px]"
      />
      
      {/* Subtle Noise Texture for premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
