"use client";

import { motion } from "framer-motion";
import { Play, ArrowRight, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AudioState = "idle" | "playing" | "paused" | "finished" | "error";

interface FirstImpressionProps {
  audioState: AudioState;
  currentTime: number;
  duration: number;
  onToggleAudio: () => void;
}

export default function FirstImpressionExperience({ audioState, currentTime, duration, onToggleAudio }: FirstImpressionProps) {
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center z-10 px-6 md:px-12 lg:px-24 pt-20 overflow-hidden">
      
      {/* Central Content Area: Identity & Intro */}
      <div className="flex flex-col items-center text-center space-y-8 z-20 relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="flex items-center space-x-2 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-accent-pink" />
          <span className="text-sm tracking-widest uppercase font-medium text-gray-300">
            AI/ML Engineer
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight mb-6 text-white leading-tight">
            SAKSHI <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-lavender via-white to-accent-pink">
              SRIVASTAVA
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mb-4">
            Building intelligent systems that transform data into meaningful solutions.
          </p>
          <p className="text-gray-400 max-w-2xl leading-relaxed font-light">
            Passionate about artificial intelligence, machine learning, backend engineering, and creating scalable technology solutions.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-4 pt-4 relative"
        >
          {/* Ambient Glows that pulse behind the buttons when speaking */}
          <div className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] transition-all duration-1000 z-[-1]",
            audioState === "playing" ? "w-[400px] h-[400px] bg-accent-pink opacity-30 animate-pulse scale-110" : "w-[200px] h-[200px] bg-accent-glow opacity-0 scale-90"
          )} />

          <button 
            onClick={onToggleAudio}
            aria-label={audioState === "playing" ? "Pause Introduction" : audioState === "paused" ? "Resume Introduction" : audioState === "finished" ? "Replay Introduction" : audioState === "error" ? "Audio Unavailable" : "Meet Sakshi"}
            onKeyDown={(e) => {
               if (e.key === "Enter" || e.key === " ") {
                 e.preventDefault();
                 onToggleAudio();
               }
            }}
            className={cn(
              "group relative px-8 py-4 rounded-full flex items-center space-x-3 overflow-hidden transition-all duration-500 active:scale-95",
              audioState === "error"
                ? "bg-white/5 text-gray-400 border border-white/5 opacity-80"
                : audioState === "playing" || audioState === "paused"
                ? "bg-white/10 text-white shadow-[0_0_40px_rgba(138,43,226,0.3)] border border-accent-purple/50" 
                : "bg-white text-black hover:bg-gray-200 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500",
              audioState === "error" ? "bg-white/10" : audioState === "playing" || audioState === "paused" ? "bg-accent-purple" : "bg-black/10 group-hover:bg-black/20"
            )}>
              {audioState === "playing" ? (
                <div className="flex items-center space-x-1 h-3">
                  <span className="w-1 h-full bg-white animate-sound-wave" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-full bg-white animate-sound-wave" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-full bg-white animate-sound-wave" style={{ animationDelay: '300ms' }} />
                </div>
              ) : audioState === "error" ? (
                <AlertCircle className="w-4 h-4 text-gray-400" />
              ) : audioState === "finished" ? (
                <RefreshCw className="w-4 h-4 ml-0.5 text-black" />
              ) : (
                <Play className={cn("w-4 h-4 ml-1", audioState === "paused" ? "text-white" : "text-black")} fill={audioState === "paused" ? "white" : "black"} />
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold tracking-wide text-lg">
                {audioState === "playing" ? "Pause Introduction" : audioState === "paused" ? "Resume Introduction" : audioState === "finished" ? "Replay Introduction" : audioState === "error" ? "Audio Unavailable" : "Meet Sakshi"}
              </span>
              {(audioState === "playing" || audioState === "paused") && (
                <span className="text-xs text-accent-lavender font-mono mt-0.5">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>
          </button>

          <button className="px-8 py-4 rounded-full glass-panel hover:bg-white/10 transition-all duration-300 text-white flex items-center space-x-2 border border-white/5 hover:border-white/20">
            <span>Explore My Work</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
