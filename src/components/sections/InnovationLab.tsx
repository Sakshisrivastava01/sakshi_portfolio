"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Sparkles } from "lucide-react";
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

// Data: Keep only Vaani-X and NoteRoot AI with enriched content
const PROJECTS: ProjectData[] = [
  {
    id: "project-vaani",
    title: "Vaani-X",
    tag: "AI Speech Processing & Voice Agents",
    status: "Active Development",
    theme: "pink",
    description: "An enterprise-grade real-time AI speech pipeline and voice communication interface. Engineered to streamline human-computer verbal interaction using low-latency speech-to-text (STT) decoders, dynamic emotional acoustic analysis, and neural text-to-speech (TTS) systems. Features a custom audio buffer manager, noise-cancellation gate filters, and asynchronous speech streams to achieve sub-180ms response times for concurrent routing networks.",
    metrics: [
      { label: "Pipeline Latency", value: "<180ms" },
      { label: "WER Accuracy", value: "96.4%" },
      { label: "Active Streams", value: "15k+ active" },
      { label: "Voice Recognition", value: "Real-time" }
    ],
    tech: ["Python", "PyTorch", "FastAPI", "WebSockets", "Neural Audio Pipelines", "Speech Synthesis", "Docker"],
    links: {
      github: "https://github.com/Kumardeepakchaudhary01/VaaniX_v1",
      demo: "https://vaani-x-v1.vercel.app"
    }
  },
  {
    id: "project-noteroot",
    title: "NoteRoot AI",
    tag: "Retrieval-Augmented Generation & Vector Search",
    status: "Production Ready",
    theme: "lavender",
    description: "An AI-driven semantic knowledge indexing and productivity engine powered by Retrieval-Augmented Generation (RAG). NoteRoot AI ingests unstructured multi-format document repositories, performs advanced semantic chunking, and maps cognitive associations into interactive vector indices. Leverages localized embeddings and optimized graph searching to achieve zero-hallucination document searches, automated summaries, and immediate context responses.",
    metrics: [
      { label: "Retrieval Accuracy", value: "98.7%" },
      { label: "Vector Search Speed", value: "<85ms" },
      { label: "Ingestion Volume", value: "8.5k docs/min" },
      { label: "Context Window", value: "128k tokens" }
    ],
    tech: ["Python", "LangChain", "LangGraph", "Vector Databases", "LLMs", "RAG Systems", "HuggingFace"],
    links: {
      github: "https://github.com/KunalGupta25/NoterootAI",
      demo: "https://noteroot-ai.vercel.app"
    }
  }
];

export default function InnovationLab() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const themeColors = {
    pink: "hover:border-pink-500/35 hover:shadow-[0_0_35px_rgba(244,63,94,0.08)]",
    purple: "hover:border-purple-500/35 hover:shadow-[0_0_35px_rgba(168,85,247,0.08)]",
    lavender: "hover:border-indigo-500/35 hover:shadow-[0_0_35px_rgba(99,102,241,0.08)]"
  };

  return (
    <section id="innovation-lab" className="relative w-full py-12 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Simplified Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold font-heading tracking-tight mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent-lavender to-accent-purple">
                My Work
              </span>
            </h2>
            <p className="text-gray-400 font-light max-w-xl text-xs md:text-sm">
              Intelligent agents, speech processing interfaces, and RAG architectures. Click a card to explore.
            </p>
          </div>
        </div>

        {/* Premium 2-Column Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedProject(project)}
              className={cn(
                "group relative rounded-2xl border border-white/5 bg-[#0A0A0F]/70 backdrop-blur-xl overflow-hidden flex flex-col justify-between p-6 cursor-pointer hover:bg-[#0F0F16]/90 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-[0_10px_30px_rgba(168,85,247,0.06)]",
                themeColors[project.theme]
              )}
            >
              {/* Soft background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-purple-500/[0.02] opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div>
                {/* Tag & Status Row */}
                <div className="flex items-center justify-between z-10 relative">
                  <span className="text-[10px] text-gray-400 font-mono tracking-wider font-semibold">
                    {project.tag}
                  </span>
                  <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white font-mono">
                    {project.status}
                  </span>
                </div>

                {/* Title & Description preview */}
                <div className="z-10 relative mt-4">
                  <h3 className="text-xl font-bold font-heading text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-accent-lavender transition-all">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-xs font-light leading-relaxed mt-2 line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              <div>
                {/* Project Impact Metrics Grid (Visible directly on card) */}
                <div className="z-10 relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/5 select-none">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="p-2 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-xs font-bold text-white font-mono leading-tight">{metric.value}</div>
                      <div className="text-[7px] text-gray-500 uppercase tracking-widest font-mono mt-0.5 leading-none">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech stack teaser list */}
                <div className="flex flex-wrap gap-1 mt-4 z-10 relative pt-3 border-t border-white/5">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
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
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d0c15] p-6 md:p-8 overflow-hidden shadow-2xl flex flex-col gap-5 text-left"
            >
              {/* Header inside modal */}
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent-pink animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-accent-lavender font-mono font-bold">
                      {selectedProject.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-white mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
                
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Full Description */}
              <div className="relative z-10">
                <p className="text-gray-300 leading-relaxed font-light text-xs md:text-sm">
                  {selectedProject.description}
                </p>
              </div>

              {/* Performance Metrics: Grid layout */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
                {selectedProject.metrics.map((metric) => (
                  <div key={metric.label} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="text-base font-bold font-heading text-white">{metric.value}</div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-wider mt-0.5 font-mono">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Full Tech Stack */}
              <div className="relative z-10 space-y-1.5">
                <h4 className="text-[9px] uppercase tracking-wider text-gray-500 font-mono">Engine Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tech.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 text-gray-300 font-mono rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/5">
                <a 
                  href={selectedProject.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-xs transition-all"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
                <a 
                  href={selectedProject.links.demo} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-xs transition-all shadow-md"
                >
                  Live Demo
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
