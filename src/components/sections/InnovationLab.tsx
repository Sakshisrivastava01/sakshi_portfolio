"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, ExternalLink, Cpu, X, Sparkles } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/SocialIcons";
import { cn } from "@/lib/utils";

// Project Interface
interface ProjectData {
  id: string;
  title: string;
  tag: string;
  description: string;
  metrics: { label: string; value: string }[];
  tech: string[];
  theme: "pink" | "purple" | "lavender";
  status: "Live" | "Production Ready" | "Active Development" | "Completed";
  links: {
    github: string;
    demo: string;
  };
}

// Data
const PROJECTS: ProjectData[] = [
  {
    id: "project-vaani",
    title: "Vaani-X",
    tag: "AI Communication Platform",
    status: "Active Development",
    theme: "pink",
    description: "An AI-powered communication platform focused on creating seamless human-computer conversations through advanced voice processing, real-time feedback, and low-latency speech pipelines.",
    metrics: [
      { label: "Response Time", value: "<200ms" },
      { label: "Speech Recognition", value: "95%" },
      { label: "Concurrent Users", value: "10k+" }
    ],
    tech: ["Python", "AI", "NLP", "Speech Processing", "Machine Learning", "FastAPI"],
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
    theme: "lavender",
    description: "An AI-driven productivity platform designed to transform raw notes and repositories into intelligent knowledge graphs using Retrieval-Augmented Generation (RAG) and optimized vector searches.",
    metrics: [
      { label: "Query Speed", value: "<100ms" },
      { label: "Context Window", value: "128k" },
      { label: "Retrieval Accuracy", value: "98%" }
    ],
    tech: ["Python", "LLMs", "AI", "RAG", "Vector Search", "NLP", "LangChain"],
    links: {
      github: "https://github.com/KunalGupta25/NoterootAI",
      demo: "https://noteroot-ai.vercel.app"
    }
  },
  {
    id: "project-portfolio",
    title: "AI Portfolio Engine",
    tag: "Next-Gen Developer Canvas",
    status: "Completed",
    theme: "purple",
    description: "A highly interactive, dynamic, and fluid developer portfolio engine utilizing React, Next.js, and Framer Motion to showcase technical engineering logs with optimal performance metrics.",
    metrics: [
      { label: "Lighthouse Performance", value: "100/100" },
      { label: "Animation Lag", value: "0ms" },
      { label: "First Load Time", value: "0.8s" }
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
    links: {
      github: "https://github.com/Sakshisrivastava01/sakshi_portfolio",
      demo: "https://sakshisrivastava.dev"
    }
  }
];

// Visual illustrations inside cards / modals
const VoiceVisual = () => (
  <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-30 bg-[#080205] select-none pointer-events-none">
    <div className="flex gap-2 items-center">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div 
          key={i}
          animate={{ height: ["12px", `${(i * 27) % 60 + 20}px`, "12px"] }}
          transition={{ duration: 1.2 + (i % 3) * 0.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 bg-accent-pink rounded-full shadow-[0_0_8px_rgba(255,182,193,0.3)]"
        />
      ))}
    </div>
  </div>
);

const KnowledgeVisual = () => (
  <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-30 bg-[#020208] select-none pointer-events-none">
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute w-[80%] h-[80%] border border-accent-lavender/10 border-dashed rounded-full flex items-center justify-center"
    >
      <div className="absolute top-2 w-2.5 h-2.5 rounded-full bg-accent-lavender shadow-[0_0_10px_rgba(230,230,250,0.6)]" />
      <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-accent-lavender shadow-[0_0_8px_rgba(230,230,250,0.6)]" />
    </motion.div>
    <Cpu className="w-10 h-10 text-accent-lavender/30 absolute" />
  </div>
);

const EngineVisual = () => (
  <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-30 bg-[#050208] select-none pointer-events-none">
    <motion.div 
      animate={{ scale: [0.9, 1.1, 0.9] }} 
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-12 h-12 bg-accent-purple rounded-full blur-2xl" 
    />
    <BrainCircuit className="w-10 h-10 text-accent-purple/40" />
  </div>
);

export default function InnovationLab() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const themeColors = {
    pink: "hover:border-accent-pink/40 hover:shadow-[0_0_30px_rgba(255,182,193,0.1)] text-accent-pink bg-accent-pink/10 border-accent-pink/30",
    purple: "hover:border-accent-purple/40 hover:shadow-[0_0_30px_rgba(138,43,226,0.1)] text-accent-purple bg-accent-purple/10 border-accent-purple/30",
    lavender: "hover:border-accent-lavender/40 hover:shadow-[0_0_30px_rgba(230,230,250,0.1)] text-accent-lavender bg-accent-lavender/10 border-accent-lavender/30"
  };

  return (
    <section id="innovation-lab" className="relative w-full py-16 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Simplified Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold font-heading tracking-tight mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-lavender to-accent-purple">
                My Work
              </span>
            </h2>
            <p className="text-gray-400 font-light max-w-xl text-base md:text-lg">
              Intelligent systems, scalable backend log architectures, and AI-driven platforms. Click a card to explore.
            </p>
          </div>
        </div>

        {/* Compact Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className={cn(
                "group relative rounded-3xl border border-white/5 glass-panel overflow-hidden flex flex-col h-[280px] justify-between p-6 cursor-pointer hover:bg-white/[0.02] transition-all duration-300",
                themeColors[project.theme]
              )}
            >
              {/* Graphic Placeholder (reduced opacity inside card) */}
              {project.id === "project-vaani" && <VoiceVisual />}
              {project.id === "project-noteroot" && <KnowledgeVisual />}
              {project.id === "project-portfolio" && <EngineVisual />}

              {/* Tag & Status Row */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] text-gray-400 font-mono tracking-wider font-semibold">
                  {project.tag}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white font-mono">
                  {project.status}
                </span>
              </div>

              {/* Title & Description preview */}
              <div className="z-10 mt-6">
                <h3 className="text-2xl font-bold font-heading text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-accent-lavender transition-all">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm font-light line-clamp-3 mt-2">
                  {project.description}
                </p>
              </div>

              {/* Tech stack teaser list */}
              <div className="flex flex-wrap gap-1.5 mt-auto z-10 pt-4 border-t border-white/5">
                {project.tech.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300 font-mono">
                    {t}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 text-gray-500 font-mono">
                    +{project.tech.length - 3} more
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Study Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            {/* Click outside to close */}
            <div className="absolute inset-0 cursor-default" onClick={() => setSelectedProject(null)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-3xl rounded-[2.5rem] border border-white/10 bg-[#0d0c15] p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col gap-6 text-left"
            >
              {/* Header inside modal */}
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-accent-pink" />
                    <span className="text-xs uppercase tracking-widest text-accent-lavender font-mono font-bold">
                      {selectedProject.tag}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold font-heading text-white">
                    {selectedProject.title}
                  </h3>
                </div>
                
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Illustration and Full Description */}
              <div className="relative z-10 space-y-4">
                <p className="text-gray-300 leading-relaxed font-light text-base md:text-lg">
                  {selectedProject.description}
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="relative z-10 grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                {selectedProject.metrics.map((metric) => (
                  <div key={metric.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-lg md:text-xl font-bold font-heading text-white">{metric.value}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5 font-mono">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Full Tech Stack */}
              <div className="relative z-10 space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 font-mono">Engine Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 bg-white/5 border border-white/10 text-gray-300 font-mono rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/5">
                <a 
                  href={selectedProject.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-sm transition-all"
                >
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </a>
                <a 
                  href={selectedProject.links.demo} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-sm transition-all shadow-md"
                >
                  Live Demo
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
