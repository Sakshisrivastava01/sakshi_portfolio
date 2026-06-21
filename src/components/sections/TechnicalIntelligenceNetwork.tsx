"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { BrainCircuit, Database, Server, Cpu, Code2, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface LCNode {
  id: string;
  label: string;
}

interface LCCluster {
  id: string;
  label: string;
  angle: number; // angle from core
  nodes: LCNode[];
}

// Define the 6 skills domains exactly as requested
const CLUSTERS: LCCluster[] = [
  {
    id: "genai",
    label: "Generative AI & LLMs",
    angle: -90, // Top center
    nodes: [
      { id: "genai_node", label: "GenAI" },
      { id: "openai", label: "OpenAI API" },
      { id: "ollama", label: "Ollama" },
      { id: "langchain", label: "LangChain" },
      { id: "langgraph", label: "LangGraph" },
      { id: "llms", label: "LLMs" },
      { id: "rag", label: "RAG" },
      { id: "prompt", label: "Prompt Engineering" },
      { id: "tokenization", label: "Tokenization" },
      { id: "embeddings", label: "Embeddings" },
      { id: "transformers", label: "Transformers" },
      { id: "ethics", label: "AI Ethics & Bias" }
    ]
  },
  {
    id: "ml",
    label: "Machine Learning",
    angle: -30, // Top right
    nodes: [
      { id: "scikit", label: "Scikit-Learn" },
      { id: "tensorflow", label: "TensorFlow" },
      { id: "pytorch", label: "PyTorch" },
      { id: "pandas", label: "Pandas" },
      { id: "numpy", label: "NumPy" },
      { id: "preprocessing", label: "Data Preprocessing" },
      { id: "feature_eng", label: "Feature Engineering" },
      { id: "etl", label: "ETL Pipelines" },
      { id: "streamlit", label: "Streamlit" },
      { id: "matplotlib", label: "Matplotlib" },
      { id: "mlops", label: "MLOps" }
    ]
  },
  {
    id: "databases",
    label: "Databases",
    angle: 30, // Bottom right
    nodes: [
      { id: "postgres", label: "PostgreSQL" },
      { id: "mysql", label: "MySQL" },
      { id: "mongo", label: "MongoDB" },
      { id: "redis", label: "Redis" }
    ]
  },
  {
    id: "core_cs",
    label: "Core Computer Science",
    angle: 90, // Bottom center
    nodes: [
      { id: "dsa", label: "DSA" },
      { id: "oop", label: "OOP" },
      { id: "os", label: "Operating Systems" },
      { id: "dbms", label: "DBMS" },
      { id: "networks", label: "Computer Networks" },
      { id: "sys_design", label: "System Design" }
    ]
  },
  {
    id: "backend",
    label: "Backend Engineering",
    angle: 150, // Bottom left
    nodes: [
      { id: "fastapi", label: "FastAPI" },
      { id: "flask", label: "Flask" },
      { id: "django", label: "Django" },
      { id: "apis", label: "REST APIs" },
      { id: "websockets", label: "WebSockets" },
      { id: "microservices", label: "Microservices" }
    ]
  },
  {
    id: "cloud_devops",
    label: "Cloud & DevOps",
    angle: 210, // Top left
    nodes: [
      { id: "docker", label: "Docker" },
      { id: "aws", label: "AWS" },
      { id: "devops", label: "DevOps Fundamentals" },
      { id: "agile", label: "Agile/Scrum" },
      { id: "cicd", label: "CI/CD" },
      { id: "cloud_native", label: "Cloud-Native" }
    ]
  }
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  genai: <BrainCircuit className="w-5 h-5 text-accent-pink animate-pulse" />,
  backend: <Server className="w-5 h-5 text-accent-purple" />,
  ml: <Cpu className="w-5 h-5 text-[#ffa116]" />,
  cloud_devops: <Cloud className="w-5 h-5 text-blue-400" />,
  databases: <Database className="w-5 h-5 text-accent-lavender" />,
  core_cs: <Code2 className="w-5 h-5 text-emerald-400" />
};

interface NetworkProps {
  onSkillSelect?: (skill: string) => void;
  activeSkill?: string | null;
}

export default function TechnicalIntelligenceNetwork({ onSkillSelect, activeSkill }: NetworkProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [hoveredClusterId, setHoveredClusterId] = useState<string | null>(null);
  const [hoveredSubNodeId, setHoveredSubNodeId] = useState<string | null>(null);
  const [hoveredCenter, setHoveredCenter] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const CLUSTER_RADIUS = 190; // Spacing distance from core to domain nodes

  // Parallax Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setHoveredClusterId(null);
    setHoveredSubNodeId(null);
    setHoveredCenter(false);
  };

  // Convert polar coordinates to percentage relative coordinates for HTML elements
  const getCoordinates = (angleDeg: number, radius: number, centerPct = 50) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const radiusPct = (radius / 500) * 50;
    return {
      x: centerPct + radiusPct * Math.cos(angleRad),
      y: centerPct + radiusPct * Math.sin(angleRad),
      xPixel: radius * Math.cos(angleRad),
      yPixel: radius * Math.sin(angleRad)
    };
  };

  // Convert polar coordinates relative to a cluster node center
  const getRadialSubNodeCoordinates = (
    clusterAngle: number,
    clusterRadius: number,
    subAngle: number,
    subRadius: number,
    centerPct = 50
  ) => {
    const clusterAngleRad = (clusterAngle * Math.PI) / 180;
    const subAngleRad = (subAngle * Math.PI) / 180;

    const cxPixel = clusterRadius * Math.cos(clusterAngleRad);
    const cyPixel = clusterRadius * Math.sin(clusterAngleRad);

    const sxPixel = cxPixel + subRadius * Math.cos(subAngleRad);
    const syPixel = cyPixel + subRadius * Math.sin(subAngleRad);

    return {
      x: centerPct + (sxPixel / 500) * 50,
      y: centerPct + (syPixel / 500) * 50,
      xPixel: sxPixel,
      yPixel: syPixel
    };
  };

  const isClusterOpen = (clusterId: string) => hoveredClusterId === clusterId;

  // Node highlight calculator
  const isNodeHighlighted = (nodeId: string) => {
    if (hoveredCenter) return true;
    if (!hoveredClusterId && !hoveredSubNodeId) return true;

    if (hoveredSubNodeId) {
      if (nodeId === "center" || nodeId === hoveredClusterId || nodeId === hoveredSubNodeId) return true;
      return false;
    }

    if (hoveredClusterId) {
      if (nodeId === "center" || nodeId === hoveredClusterId) return true;
      const cluster = CLUSTERS.find(c => c.id === hoveredClusterId);
      if (cluster && cluster.nodes.some(n => n.id === nodeId)) return true;
      return false;
    }

    return false;
  };

  return (
    <>
      {/* Mobile Accordion / Fallback list */}
      <div className="w-full flex flex-col gap-4 md:hidden px-4 py-4">
        <div className="flex items-center justify-center mb-2">
          <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full border border-accent-purple/30 bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(138,43,226,0.15)]">
            <BrainCircuit className="w-6 h-6 text-white mb-1.5 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-accent-pink font-semibold text-center leading-tight">
              AI / ML<br />Engineer
            </span>
          </div>
        </div>

        {CLUSTERS.map((cluster, i) => (
          <motion.div
            key={cluster.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="p-4 rounded-xl border border-white/5 bg-[#0A0A0F]/70 backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              {CATEGORY_ICONS[cluster.id]}
              <h4 className="text-xs font-bold text-white tracking-wide">
                {cluster.label}
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cluster.nodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => {
                    if (onSkillSelect) {
                      onSkillSelect(node.id);
                      document.getElementById("innovation-lab")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "text-[10px] px-2 py-1 rounded bg-white/5 border transition-colors",
                    activeSkill === node.id
                      ? "border-accent-pink bg-accent-pink/15 text-white"
                      : "border-white/5 text-gray-400 hover:text-white"
                  )}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop SVG / HTML Interactive Skills Network */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden md:flex relative w-full h-[600px] items-center justify-center overflow-hidden font-sans cursor-default select-none"
      >
        {/* Parallax Background Glowing Spotlights */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              x: -mouseOffset.x * 20,
              y: -mouseOffset.y * 20,
              scale: hoveredClusterId ? 1.1 : 1,
              opacity: hoveredClusterId ? 0.15 : 0.05
            }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="w-[450px] h-[450px] rounded-full bg-accent-purple/20 blur-[100px]"
          />
        </div>

        {/* Core Galaxy Container */}
        <motion.div
          animate={{
            x: mouseOffset.x * 15,
            y: mouseOffset.y * 15
          }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="relative z-10 w-full max-w-[700px] aspect-square"
        >
          {/* SVG Connection Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-500 -500 1000 1000">
            <defs>
              <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8a2be2" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffb6c1" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {isInView && (
              <>
                {/* Center Core to Domain Node lines */}
                {CLUSTERS.map((cluster, i) => {
                  const pos = getCoordinates(cluster.angle, CLUSTER_RADIUS);
                  const isHighlighted = isNodeHighlighted(cluster.id);
                  const opacity = hoveredCenter || hoveredClusterId === cluster.id || (hoveredSubNodeId && isNodeHighlighted(cluster.id)) ? 0.7 : 0.15;

                  return (
                    <motion.line
                      key={`core-${cluster.id}`}
                      x1="0"
                      y1="0"
                      x2={pos.xPixel}
                      y2={pos.yPixel}
                      stroke={isHighlighted ? "url(#lineGlow)" : "#ffffff"}
                      strokeWidth={isHighlighted ? 2.5 : 0.8}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity }}
                      transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }}
                    />
                  );
                })}

                {/* Domain Node to radial bloomed sub-nodes connections */}
                {CLUSTERS.map((cluster) => {
                  const cPos = getCoordinates(cluster.angle, CLUSTER_RADIUS);
                  const isOpen = isClusterOpen(cluster.id);
                  const N = cluster.nodes.length;

                  return cluster.nodes.map((node, j) => {
                    const subAngle = j * (360 / N);
                    const currentSubRadius = isOpen ? (j % 2 === 0 ? 65 : 90) : 0;
                    const subPos = getRadialSubNodeCoordinates(cluster.angle, CLUSTER_RADIUS, subAngle, currentSubRadius);
                    const isSubActive = isNodeHighlighted(node.id);

                    return (
                      <motion.line
                        key={`sub-${node.id}`}
                        animate={{
                          x1: cPos.xPixel,
                          y1: cPos.yPixel,
                          x2: subPos.xPixel,
                          y2: subPos.yPixel,
                          opacity: isOpen ? (hoveredSubNodeId ? (hoveredSubNodeId === node.id ? 0.8 : 0.1) : 0.3) : 0
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 15,
                          mass: 0.8
                        }}
                        stroke={isSubActive && hoveredSubNodeId === node.id ? "#ffa116" : "#8a2be2"}
                        strokeWidth={isSubActive && hoveredSubNodeId === node.id ? 1.5 : 0.6}
                        strokeDasharray="2 2"
                      />
                    );
                  });
                })}
              </>
            )}
          </svg>

          {/* Central glowing AI/ML Engineer Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
            <AnimatePresence>
              {isInView && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                  className={cn(
                    "relative flex flex-col items-center justify-center w-32 h-32 rounded-full border border-accent-purple/20 bg-black/60 backdrop-blur-md shadow-[0_0_35px_rgba(138,43,226,0.18)] transition-all duration-300 hover:scale-105",
                    (hoveredClusterId || hoveredSubNodeId) && !hoveredCenter ? "opacity-30 scale-95 shadow-none border-white/5" : ""
                  )}
                  onMouseEnter={() => setHoveredCenter(true)}
                  onMouseLeave={() => setHoveredCenter(false)}
                >
                  <BrainCircuit className="w-6 h-6 text-white mb-1.5 animate-pulse" />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-accent-pink font-semibold text-center leading-tight">
                    AI / ML<br />Engineer
                  </span>
                  <div className="absolute -bottom-1 px-1.5 py-0.5 rounded-full bg-accent-purple/20 border border-accent-purple/40 text-[6px] text-accent-lavender tracking-wider font-mono">
                    CORE
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Surround Clusters and Radial Sub-nodes Overlay */}
          <div className="absolute inset-0 z-20">
            {isInView && CLUSTERS.map((cluster) => {
              const cPos = getCoordinates(cluster.angle, CLUSTER_RADIUS);
              const isClusterActive = isNodeHighlighted(cluster.id);
              const isAnyClusterHovered = hoveredClusterId !== null || hoveredSubNodeId !== null;
              
              // Fade unhovered clusters slightly
              const clusterOpacity = hoveredCenter || (isAnyClusterHovered && !isClusterActive) ? 0.25 : 1;

              return (
                <div key={cluster.id}>
                  {/* Large Premium Domain Node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: clusterOpacity }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                    style={{ left: `${cPos.x}%`, top: `${cPos.y}%` }}
                    onMouseEnter={() => setHoveredClusterId(cluster.id)}
                  >
                    <div
                      className={cn(
                        "px-4 py-2.5 rounded-xl border backdrop-blur-md whitespace-nowrap cursor-pointer transition-all duration-300 flex items-center gap-2",
                        isClusterActive
                          ? "bg-accent-purple/35 border-accent-pink shadow-[0_0_20px_rgba(255,182,193,0.35)] text-white scale-105"
                          : "bg-[#09090F]/90 border-accent-purple/10 text-gray-300 hover:text-white"
                      )}
                    >
                      {CATEGORY_ICONS[cluster.id]}
                      <span className="text-[11px] font-bold tracking-wide font-sans">{cluster.label}</span>
                    </div>
                  </motion.div>

                  {/* radial blooming Sub-Nodes (Rendered around the domain node center) */}
                  {cluster.nodes.map((node, j) => {
                    const N = cluster.nodes.length;
                    const subAngle = j * (360 / N);
                    const isOpen = isClusterOpen(cluster.id);
                    
                    // Alternate radii to guarantee zero overlap
                    const currentSubRadius = isOpen ? (j % 2 === 0 ? 65 : 90) : 0;
                    const subPos = getRadialSubNodeCoordinates(cluster.angle, CLUSTER_RADIUS, subAngle, currentSubRadius);
                    const isSubActive = isNodeHighlighted(node.id);
                    const nodeOpacity = isOpen ? (isSubActive ? 1 : 0.15) : 0;

                    return (
                      <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: isOpen ? 1 : 0, 
                          opacity: nodeOpacity,
                          left: `${subPos.x}%`,
                          top: `${subPos.y}%`
                        }}
                        transition={{ 
                          type: "spring",
                          stiffness: 110,
                          damping: 14,
                          mass: 0.6
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-auto"
                        style={{ left: `${subPos.x}%`, top: `${subPos.y}%` }}
                        onMouseEnter={() => {
                          setHoveredClusterId(cluster.id);
                          setHoveredSubNodeId(node.id);
                        }}
                        onMouseLeave={() => {
                          setHoveredSubNodeId(null);
                        }}
                      >
                        <button
                          onClick={() => {
                            if (onSkillSelect) {
                              onSkillSelect(node.id);
                              document.getElementById("innovation-lab")?.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className={cn(
                            "px-2 py-0.5 rounded border backdrop-blur-md cursor-pointer transition-all duration-200 whitespace-nowrap text-[9px] font-medium tracking-wider shadow-sm",
                            isSubActive || activeSkill === node.id
                              ? "bg-white/10 border-accent-lavender text-white shadow-[0_0_8px_rgba(230,230,250,0.25)] scale-105 z-30"
                              : "bg-transparent border-white/5 text-gray-500 hover:text-white"
                          )}
                        >
                          {node.label}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
}
