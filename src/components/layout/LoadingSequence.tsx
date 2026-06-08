"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingSequenceProps {
  onComplete: () => void;
}

export default function LoadingSequence({ onComplete }: LoadingSequenceProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Timing sequence for cinematic loading
    // Total duration max 3 seconds
    const t1 = setTimeout(() => setStep(1), 800); // Show "AI/ML ENGINEER"
    const t2 = setTimeout(() => setStep(2), 1600); // Show "Preparing Interactive Experience"
    const t3 = setTimeout(() => {
      setStep(3); // Trigger exit animation
      setTimeout(onComplete, 800); // Tell parent it's done after fade out
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {step < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black text-white"
        >
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.h1
                  key="name"
                  initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-2xl md:text-4xl font-light tracking-[0.2em]"
                >
                  SAKSHI SRIVASTAVA
                </motion.h1>
              )}

              {step === 1 && (
                <motion.h2
                  key="role"
                  initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-accent-pink text-lg md:text-2xl font-light tracking-widest"
                >
                  AI/ML ENGINEER
                </motion.h2>
              )}

              {step === 2 && (
                <motion.div
                  key="preparing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <p className="text-gray-400 text-sm md:text-base font-light tracking-widest mb-4 uppercase">
                    Preparing Interactive Experience
                  </p>
                  <div className="w-48 h-px bg-white/10 overflow-hidden relative">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-accent-purple to-transparent w-1/2"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
