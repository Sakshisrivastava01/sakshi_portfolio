"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrainCircuit, Database, Server, Cpu, Code2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LCNode {
  id: string;
  label: string;
}

interface LCCluster {
  id: string;
  label: string;
  icon: React.ReactNode;
  primaryNodes: LCNode[];
  extendedNodes: LCNode[];
  pathData: string; // SVG path from center (500, 500)
}

// Define the 6 skills domains exactly as requested by the Principal Design Engineer
const CLUSTERS: LCCluster[] = [
  {
    id: "languages",
    label: "Languages",
    icon: <Code2 className="w-5 h-5 text-emerald-400" />,
    primaryNodes: [
      { id: "python", label: "Python" },
      { id: "java", label: "Java" },
      { id: "javascript", label: "JavaScript" },
      { id: "typescript", label: "TypeScript" },
      { id: "cpp", label: "C++" },
      { id: "sql", label: "SQL" },
      { id: "htmlcss", label: "HTML/CSS" }
    ],
    extendedNodes: [],
    pathData: "M 500 500 L 350 200 H 150" // Top-Left Card connection
  },
  {
    id: "genai",
    label: "Generative AI & LLMs",
    icon: <BrainCircuit className="w-5 h-5 text-accent-pink" />,
    primaryNodes: [
      { id: "langchain", label: "LangChain" },
      { id: "langgraph", label: "LangGraph" },
      { id: "openai", label: "OpenAI API" },
      { id: "ollama", label: "Ollama" },
      { id: "rag", label: "RAG" },
      { id: "prompt", label: "Prompt Engineering" },
      { id: "embeddings", label: "Embeddings" },
      { id: "transformers", label: "Transformers" }
    ],
    extendedNodes: [
      { id: "genai_node", label: "GenAI" },
      { id: "llms", label: "LLMs" },
      { id: "tokenization", label: "Tokenization" },
      { id: "ethics", label: "AI Ethics & Bias" }
    ],
    pathData: "M 500 500 H 150" // Middle-Left Card connection
  },
  {
    id: "ml",
    label: "Machine Learning & Data",
    icon: <Cpu className="w-5 h-5 text-[#ffa116]" />,
    primaryNodes: [
      { id: "pytorch", label: "PyTorch" },
      { id: "tensorflow", label: "TensorFlow" },
      { id: "scikit", label: "Scikit-Learn" },
      { id: "pandas", label: "Pandas" },
      { id: "numpy", label: "NumPy" },
      { id: "feature_eng", label: "Feature Engineering" },
      { id: "etl", label: "ETL Pipelines" },
      { id: "mlops", label: "MLOps" }
    ],
    extendedNodes: [
      { id: "preprocessing", label: "Data Preprocessing" },
      { id: "streamlit", label: "Streamlit" },
      { id: "matplotlib", label: "Matplotlib" }
    ],
    pathData: "M 500 500 L 350 800 H 150" // Bottom-Left Card connection
  },
  {
    id: "backend",
    label: "Backend & Cloud",
    icon: <Server className="w-5 h-5 text-accent-purple" />,
    primaryNodes: [
      { id: "fastapi", label: "FastAPI" },
      { id: "flask", label: "Flask" },
      { id: "django", label: "Django" },
      { id: "apis", label: "REST APIs" },
      { id: "websockets", label: "WebSockets" },
      { id: "microservices", label: "Microservices" },
      { id: "aws", label: "AWS" },
      { id: "docker", label: "Docker" },
      { id: "cicd", label: "CI/CD" },
      { id: "cloud_native", label: "Cloud-Native" }
    ],
    extendedNodes: [
      { id: "devops", label: "DevOps Fundamentals" },
      { id: "agile", label: "Agile/Scrum" }
    ],
    pathData: "M 500 500 L 650 200 H 850" // Top-Right Card connection
  },
  {
    id: "databases",
    label: "Databases",
    icon: <Database className="w-5 h-5 text-accent-lavender" />,
    primaryNodes: [
      { id: "postgres", label: "PostgreSQL" },
      { id: "redis", label: "Redis" },
      { id: "mongo", label: "MongoDB" },
      { id: "mysql", label: "MySQL" }
    ],
    extendedNodes: [],
    pathData: "M 500 500 H 850" // Middle-Right Card connection
  },
  {
    id: "core_cs",
    label: "Computer Science Fundamentals",
    icon: <Code2 className="w-5 h-5 text-blue-400" />,
    primaryNodes: [
      { id: "dsa", label: "DSA" },
      { id: "oop", label: "OOP" },
      { id: "sys_design", label: "System Design" },
      { id: "os", label: "Operating Systems" },
      { id: "dbms", label: "DBMS" },
      { id: "networks", label: "Computer Networks" }
    ],
    extendedNodes: [],
    pathData: "M 500 500 L 650 800 H 850" // Bottom-Right Card connection
  }
];

interface NetworkProps {
  onSkillSelect?: (skill: string) => void;
  activeSkill?: string | null;
}

export default function TechnicalIntelligenceNetwork({ onSkillSelect, activeSkill }: NetworkProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [hoveredClusterId, setHoveredClusterId] = useState<string | null>(null);

  return (
    <div 
      ref={containerRef}
      className="w-full relative max-w-6xl mx-auto px-4 md:px-0 py-6 font-sans"
    >
      {/* SVG Network Lines Overlay (Desktop Only) */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
          {isInView && CLUSTERS.map((cluster) => {
            const isHovered = hoveredClusterId === cluster.id;
            const opacity = hoveredClusterId ? (isHovered ? 0.8 : 0.08) : 0.2;
            
            return (
              <motion.path
                key={`path-${cluster.id}`}
                d={cluster.pathData}
                stroke={isHovered ? "#a855f7" : "#3b0764"}
                strokeWidth={isHovered ? 2.5 : 1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, opacity }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={cn(isHovered ? "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "")}
              />
            );
          })}
        </svg>
      </div>

      {/* MOBILE PROFILE SUMMARY (Top on Mobile/Tablet, hidden on Desktop) */}
      <div className="block lg:hidden mb-8">
        <CenterCoreCard />
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">
        
        {/* LEFT COLUMN: 3 Domain Cards (Languages, GenAI, ML & Data) */}
        <div className="flex flex-col gap-6 lg:col-span-4 h-full">
          {/* Languages */}
          <DomainCard
            cluster={CLUSTERS[0]}
            isAnyCardHovered={hoveredClusterId !== null}
            onHoverChange={(isHovered) => setHoveredClusterId(isHovered ? CLUSTERS[0].id : null)}
            activeSkill={activeSkill}
            onSkillSelect={onSkillSelect}
          />
          {/* Generative AI & LLMs */}
          <DomainCard
            cluster={CLUSTERS[1]}
            isAnyCardHovered={hoveredClusterId !== null}
            onHoverChange={(isHovered) => setHoveredClusterId(isHovered ? CLUSTERS[1].id : null)}
            activeSkill={activeSkill}
            onSkillSelect={onSkillSelect}
          />
          {/* Machine Learning & Data */}
          <DomainCard
            cluster={CLUSTERS[2]}
            isAnyCardHovered={hoveredClusterId !== null}
            onHoverChange={(isHovered) => setHoveredClusterId(isHovered ? CLUSTERS[2].id : null)}
            activeSkill={activeSkill}
            onSkillSelect={onSkillSelect}
          />
        </div>

        {/* CENTER COLUMN: Central AI/ML Engineer Core Hub (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col justify-between h-full">
          <CenterCoreCard />
        </div>

        {/* RIGHT COLUMN: 3 Domain Cards (Backend & Cloud, Databases, CS Fundamentals) */}
        <div className="flex flex-col gap-6 lg:col-span-4 h-full">
          {/* Backend & Cloud */}
          <DomainCard
            cluster={CLUSTERS[3]}
            isAnyCardHovered={hoveredClusterId !== null}
            onHoverChange={(isHovered) => setHoveredClusterId(isHovered ? CLUSTERS[3].id : null)}
            activeSkill={activeSkill}
            onSkillSelect={onSkillSelect}
          />
          {/* Databases */}
          <DomainCard
            cluster={CLUSTERS[4]}
            isAnyCardHovered={hoveredClusterId !== null}
            onHoverChange={(isHovered) => setHoveredClusterId(isHovered ? CLUSTERS[4].id : null)}
            activeSkill={activeSkill}
            onSkillSelect={onSkillSelect}
          />
          {/* Computer Science Fundamentals */}
          <DomainCard
            cluster={CLUSTERS[5]}
            isAnyCardHovered={hoveredClusterId !== null}
            onHoverChange={(isHovered) => setHoveredClusterId(isHovered ? CLUSTERS[5].id : null)}
            activeSkill={activeSkill}
            onSkillSelect={onSkillSelect}
          />
        </div>

      </div>
    </div>
  );
}

/* Central AI/ML Engineer Card component */
function CenterCoreCard() {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl border border-purple-500/20 bg-[#07070B]/50 backdrop-blur-xl relative overflow-hidden flex flex-col items-center justify-center text-center h-full group hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all duration-500 shadow-lg">
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.03] to-transparent pointer-events-none" />
      <div className="absolute inset-8 rounded-full border border-dashed border-purple-500/10 animate-spin-slow pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Pulsing Brain core */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:scale-105 group-hover:border-purple-500/40 transition-all duration-300">
          <BrainCircuit className="w-10 h-10 text-purple-400 animate-pulse" />
        </div>
        
        <h3 className="text-sm uppercase tracking-[0.25em] text-white font-bold leading-tight">
          AI / ML
        </h3>
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent-pink mt-1 font-semibold">
          ENGINEER CORE
        </p>
        
        <div className="mt-4 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] text-emerald-400 font-mono tracking-widest uppercase mb-5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          ACTIVE STACK
        </div>
        
        <p className="text-xs text-gray-300 font-light leading-relaxed mb-6 max-w-[270px] text-center">
          Passionate AI/ML Engineer with a solid foundation in computer science and active hands-on experience building production-grade LLM applications, retrieval-augmented pipelines (RAG), and high-throughput backend services.
        </p>
        
        {/* Stats Row */}
        <div className="w-full grid grid-cols-2 gap-4 pt-5 border-t border-white/5 select-none">
          <div className="text-center border-r border-white/5">
            <div className="text-sm md:text-base font-bold text-accent-pink font-mono">3+ Years</div>
            <div className="text-[8px] text-gray-500 uppercase tracking-wider font-mono mt-0.5">Active Learning</div>
          </div>
          <div className="text-center">
            <div className="text-sm md:text-base font-bold text-accent-purple font-mono">45+ Techs</div>
            <div className="text-[8px] text-gray-500 uppercase tracking-wider font-mono mt-0.5">Mastered</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DomainCardProps {
  cluster: LCCluster;
  isAnyCardHovered: boolean;
  onHoverChange: (isHovered: boolean) => void;
  activeSkill?: string | null;
  onSkillSelect?: (skill: string) => void;
}

function DomainCard({ cluster, isAnyCardHovered, onHoverChange, activeSkill, onSkillSelect }: DomainCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(false);
  };

  const isHighlighted = isHovered || !isAnyCardHovered;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "glass-panel p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between flex-1 group",
        isHighlighted 
          ? "border-purple-500/20 bg-[#08080E]/70 shadow-[0_0_30px_rgba(168,85,247,0.06)] hover:-translate-y-0.5"
          : "border-white/5 bg-[#05050A]/40 opacity-40"
      )}
    >
      {/* Background subtle glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.01] to-transparent pointer-events-none" />

      <div>
        {/* Title row */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-purple-500/30 transition-colors">
            {cluster.icon}
          </div>
          <h4 className="text-sm font-bold text-white tracking-wide font-sans group-hover:text-purple-300 transition-colors">
            {cluster.label}
          </h4>
        </div>

        {/* Core tags list (ALWAYS visible, recruiters scan in 3s) */}
        <div className="flex flex-wrap gap-1.5 select-none">
          {cluster.primaryNodes.map((node) => (
            <button
              key={node.id}
              onClick={() => {
                if (onSkillSelect) {
                  onSkillSelect(node.id);
                  document.getElementById("innovation-lab")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={cn(
                "text-[10px] px-2 py-0.5 rounded border transition-all font-sans cursor-pointer flex items-center gap-1",
                activeSkill === node.id
                  ? "bg-accent-pink/20 border-accent-pink text-white animate-pulse"
                  : "bg-purple-500/5 border-purple-500/10 text-purple-200 hover:text-white hover:border-purple-500/30"
              )}
            >
              {activeSkill === node.id && <Check className="w-2.5 h-2.5 text-accent-pink" />}
              {node.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded tags list (Framer Motion height reveal on button click) */}
      {cluster.extendedNodes.length > 0 && (
        <div className="w-full">
          <motion.div
            initial={false}
            animate={{ 
              height: isExpanded ? "auto" : 0, 
              opacity: isExpanded ? 1 : 0,
              marginTop: isExpanded ? 12 : 0
            }}
            className="overflow-hidden"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="flex flex-wrap gap-1.5 pt-3.5 border-t border-white/5 select-none">
              {cluster.extendedNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    if (onSkillSelect) {
                      onSkillSelect(node.id);
                      document.getElementById("innovation-lab")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded border transition-all font-sans cursor-pointer flex items-center gap-1",
                    activeSkill === node.id
                      ? "bg-accent-pink/20 border-accent-pink text-white"
                      : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                  )}
                >
                  {activeSkill === node.id && <Check className="w-2.5 h-2.5 text-accent-pink" />}
                  {node.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Interactive Expand Details Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full py-1.5 px-3 text-[9px] font-bold font-mono tracking-widest border border-purple-500/20 bg-purple-500/5 hover:bg-purple-600/15 hover:border-purple-500/40 text-purple-300 hover:text-white rounded transition-all duration-200 select-none cursor-pointer text-center"
          >
            {isExpanded ? "SHOW LESS" : "SHOW MORE"}
          </button>
        </div>
      )}
    </div>
  );
}
