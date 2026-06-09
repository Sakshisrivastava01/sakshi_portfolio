"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BrainCircuit, ShieldAlert, ExternalLink, FileText, Cpu, Server } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/SocialIcons";
import { cn } from "@/lib/utils";

// Types
interface ProjectData {
  id: string;
  title: string;
  tag: string;
  description: React.ReactNode;
  metrics: { label: string; value: string }[];
  tech: string[];
  icon: React.ReactNode;
  theme: "pink" | "purple" | "lavender";
  status: "Live" | "Production Ready" | "Active Development";
  isFlagship?: boolean;
  links: {
    github: string;
    demo: string;
  };
}

// Data
const PROJECTS: ProjectData[] = [
  {
    id: "project-dangen",
    title: "DANGEN",
    tag: "Flagship Project",
    isFlagship: true,
    status: "Live",
    icon: <ShieldAlert className="w-6 h-6" />,
    theme: "purple",
    description: "AI-powered cyber defense platform for real-time threat detection and intelligent anomaly monitoring.",
    metrics: [
      { label: "Uptime", value: "99.9%" },
      { label: "Threat Detection", value: "<50ms" },
      { label: "Accuracy", value: "99.2%" }
    ],
    tech: ["Python", "Machine Learning", "TensorFlow", "Cyber Security", "Flask", "Data Analytics"],
    links: {
      github: "https://github.com/Sakshisrivastava01/cyber_threatdangen",
      demo: "https://cyber-threatdangen.vercel.app"
    }
  },
  {
    id: "project-vaani",
    title: "Vaani-X",
    tag: "AI Communication Platform",
    status: "Active Development",
    icon: <BrainCircuit className="w-6 h-6" />,
    theme: "pink",
    description: "AI-powered communication platform focused on creating seamless human-computer conversations through speech processing.",
    metrics: [
      { label: "Response Time", value: "<200ms" },
      { label: "Speech Recognition", value: "95%" },
      { label: "Concurrent Users", value: "10k+" }
    ],
    tech: ["Python", "AI", "NLP", "Speech Processing", "Machine Learning"],
    links: {
      github: "https://github.com/Kumardeepakchaudhary01/VaaniX_v1",
      demo: "https://vaani-x-v1.vercel.app"
    }
  },
  {
    id: "project-noteroot",
    title: "NoteRoot AI",
    tag: "AI Productivity Platform",
    status: "Production Ready",
    icon: <FileText className="w-6 h-6" />,
    theme: "lavender",
    description: "AI productivity platform transforming notes into intelligent knowledge systems using RAG and vector search.",
    metrics: [
      { label: "Query Speed", value: "<100ms" },
      { label: "Context Window", value: "128k" },
      { label: "Retrieval Accuracy", value: "98%" }
    ],
    tech: ["Python", "LLMs", "AI", "RAG", "Vector Search", "NLP"],
    links: {
      github: "https://github.com/KunalGupta25/NoterootAI",
      demo: "https://noteroot-ai.vercel.app"
    }
  }
];

// Abstract Visual Generators for Project "Screenshots"
const CyberAbstractVisual = () => (
  <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity duration-1000 bg-[#020005]">
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Network Nodes Grid */}
      <svg className="absolute w-[150%] h-[150%] opacity-30" viewBox="0 0 100 100">
        <motion.path 
          d="M10,50 L40,20 L70,50 L40,80 Z M10,50 L70,50 M40,20 L40,80 M25,35 L55,65 M25,65 L55,35" 
          stroke="rgba(138,43,226,0.5)" 
          strokeWidth="0.2" 
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      {/* Central Shield/Core */}
      <motion.div 
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.8, 0.3] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-48 h-48 border-[1px] border-accent-purple rounded-full mix-blend-screen shadow-[0_0_50px_rgba(138,43,226,0.3)] flex items-center justify-center" 
      >
        <Server className="w-16 h-16 text-accent-purple/50" />
      </motion.div>
      <div className="absolute w-full h-full bg-gradient-to-t from-black via-transparent to-black" />
    </div>
  </div>
);

const VoiceAbstractVisual = () => (
  <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity duration-1000 bg-[#050002]">
    <div className="relative w-full h-full flex items-center justify-center gap-3">
      {/* Waveforms representing Voice/Speech */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <motion.div 
          key={i}
          animate={{ height: ["20px", `${(i * 37) % 200 + 50}px`, "20px"] }}
          transition={{ duration: 1.2 + (i % 4) * 0.3, repeat: Infinity, ease: "easeInOut" }}
          className="w-2 md:w-3 bg-gradient-to-t from-accent-pink/20 via-accent-pink to-accent-pink/20 rounded-full shadow-[0_0_15px_rgba(255,182,193,0.5)]"
        />
      ))}
      <motion.div 
        animate={{ scale: [1, 2.5], opacity: [0.4, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
        className="absolute w-32 h-32 bg-accent-pink rounded-full mix-blend-screen filter blur-[50px]" 
      />
    </div>
  </div>
);

const KnowledgeAbstractVisual = () => (
  <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity duration-1000 bg-[#020205]">
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Knowledge Graph Nodes */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-[120%] h-[120%] border border-accent-lavender/10 border-dashed rounded-full flex items-center justify-center"
      >
        <div className="absolute top-10 w-4 h-4 rounded-full bg-accent-lavender shadow-[0_0_20px_rgba(230,230,250,0.8)]" />
        <div className="absolute bottom-20 left-20 w-3 h-3 rounded-full bg-accent-lavender shadow-[0_0_15px_rgba(230,230,250,0.8)]" />
        <div className="absolute top-40 right-20 w-5 h-5 rounded-full bg-accent-lavender shadow-[0_0_25px_rgba(230,230,250,0.8)]" />
      </motion.div>
      <Cpu className="w-24 h-24 text-accent-lavender/40 absolute z-10" />
      <motion.div 
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-64 h-64 bg-accent-lavender rounded-full mix-blend-screen filter blur-[80px]" 
      />
    </div>
  </div>
);

export default function InnovationLab() {
  return (
    <section id="innovation-lab" className="relative w-full py-32 px-6 md:px-12 lg:px-24 border-t border-white/5">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-24 relative z-10 flex flex-col md:items-center text-left md:text-center">
        <h2 className="text-5xl md:text-6xl font-bold font-heading tracking-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-lavender to-accent-purple">
            Featured Engineering Projects
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl">
          Building intelligent systems, AI products, and scalable applications that solve real-world problems.
        </p>
      </div>

      {/* Projects Timeline/Showcase */}
      <div className="max-w-7xl mx-auto space-y-16 md:space-y-32">
        {PROJECTS.map((project, index) => (
          <ProjectShowcase 
            key={project.id} 
            project={project} 
            index={index} 
          />
        ))}
      </div>
      
    </section>
  );
}

// Subcomponent: Premium Horizontal Project Card
function ProjectShowcase({ project, index }: { project: ProjectData; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

  // Alternate layout on desktop: Image Left vs Image Right
  const isImageRight = index % 2 !== 0;

  // Theme styling helpers
  const themeColors = {
    pink: {
      borderHover: "hover:border-accent-pink/50",
      shadowHover: "hover:shadow-[0_0_60px_rgba(255,182,193,0.15)]",
      text: "text-accent-pink",
      bgSubtle: "bg-accent-pink/10",
      borderSubtle: "border-accent-pink/30",
      gradientBtn: "bg-gradient-to-r from-accent-pink to-accent-purple hover:from-white hover:to-white hover:text-black",
      glowHover: "hover:shadow-[0_0_30px_rgba(255,182,193,0.6)]"
    },
    purple: {
      borderHover: "hover:border-accent-purple/50",
      shadowHover: "hover:shadow-[0_0_60px_rgba(138,43,226,0.15)]",
      text: "text-accent-purple",
      bgSubtle: "bg-accent-purple/10",
      borderSubtle: "border-accent-purple/30",
      gradientBtn: "bg-gradient-to-r from-accent-purple to-accent-lavender hover:from-white hover:to-white hover:text-black",
      glowHover: "hover:shadow-[0_0_30px_rgba(138,43,226,0.6)]"
    },
    lavender: {
      borderHover: "hover:border-accent-lavender/50",
      shadowHover: "hover:shadow-[0_0_60px_rgba(230,230,250,0.15)]",
      text: "text-accent-lavender",
      bgSubtle: "bg-accent-lavender/10",
      borderSubtle: "border-accent-lavender/30",
      gradientBtn: "bg-gradient-to-r from-accent-lavender to-accent-purple hover:from-white hover:to-white hover:text-black",
      glowHover: "hover:shadow-[0_0_30px_rgba(230,230,250,0.6)]"
    }
  };

  const theme = themeColors[project.theme];

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity, y }}
      data-cursor="view"
      className={cn(
        "group relative w-full rounded-[2rem] md:rounded-[3rem] border border-white/10 glass-panel overflow-hidden flex flex-col lg:flex-row shadow-2xl transition-all duration-700",
        theme.borderHover,
        theme.shadowHover
      )}
    >
      {/* 1. Visual Presentation (Banner/Screenshot Placeholder) */}
      <div className={cn(
        "relative w-full lg:w-[45%] h-[300px] md:h-[400px] lg:h-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 bg-black/40",
        isImageRight ? "lg:order-2 lg:border-r-0 lg:border-l" : "lg:order-1"
      )}>
        {project.id === "project-dangen" && <CyberAbstractVisual />}
        {project.id === "project-vaani" && <VoiceAbstractVisual />}
        {project.id === "project-noteroot" && <KnowledgeAbstractVisual />}
        
        {/* Hover zoom overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
      </div>

      {/* 2. Content & Details */}
      <div className={cn(
        "relative w-full lg:w-[55%] p-8 md:p-12 lg:p-16 flex flex-col justify-center",
        isImageRight ? "lg:order-1" : "lg:order-2"
      )}>
        {/* Tag & Status Badge */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className={cn("px-4 py-1.5 rounded-full bg-white/5 border backdrop-blur-md flex items-center gap-2", theme.borderSubtle)}>
              <span className={cn(
                "w-2 h-2 rounded-full",
                project.status === "Live" ? "bg-green-500 animate-pulse" : 
                project.status === "Production Ready" ? "bg-blue-400" : "bg-yellow-500"
              )} />
              <span className="text-xs text-white font-mono tracking-wider font-semibold">
                {project.status}
              </span>
            </div>
            {project.isFlagship && (
              <div className="px-4 py-1.5 rounded-full border border-accent-purple/50 bg-accent-purple/20 text-accent-lavender text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(138,43,226,0.3)]">
                ★ Flagship Project
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 leading-tight">
          {project.title}
        </h3>

        {/* One-line impact statement */}
        <p className="text-gray-300 font-medium text-lg md:text-xl leading-relaxed mb-8 border-l-2 border-white/20 pl-4">
          {project.description}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {project.metrics.map((metric, i) => (
            <div key={i} className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
              <span className={cn("text-2xl font-bold font-heading mb-1", theme.text)}>{metric.value}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">{metric.label}</span>
            </div>
          ))}
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {project.tech.map((t, i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-mono shadow-sm hover:bg-white/10 transition-colors">
              {t}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-auto">
          <a 
            href={project.links.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all font-medium text-white group/btn"
          >
            <Github className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
            Source Code
          </a>
          <a 
            href={project.links.demo} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
              "flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold transition-all shadow-lg hover:scale-105 active:scale-95",
              theme.gradientBtn,
              theme.glowHover
            )}
          >
            Live Demo
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

