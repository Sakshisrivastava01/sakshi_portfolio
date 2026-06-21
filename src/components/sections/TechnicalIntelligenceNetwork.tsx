"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { BrainCircuit, Database, Server, Cpu, Code2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LCNode {
  id: string;
  label: string;
  connections: string[];
}

interface LCCluster {
  id: string;
  label: string;
  angle: number; // angle from core
  nodes: LCNode[];
}

// Define the 6 skills categories and sub-nodes exactly as requested
const CLUSTERS: LCCluster[] = [
  {
    id: "genai",
    label: "Generative AI & NLP",
    angle: -90, // Top center
    nodes: [
      { id: "genai_node", label: "GenAI", connections: ["llms", "prompt"] },
      { id: "openai", label: "OpenAI API", connections: ["genai_node", "llms", "langchain"] },
      { id: "ollama", label: "Ollama", connections: ["llms", "rag"] },
      { id: "langchain", label: "LangChain", connections: ["llms", "rag", "langgraph"] },
      { id: "langgraph", label: "LangGraph", connections: ["langchain", "llms"] },
      { id: "llms", label: "LLMs", connections: ["genai_node", "openai", "transformers"] },
      { id: "rag", label: "RAG", connections: ["embeddings", "langchain"] },
      { id: "prompt", label: "Prompt Engineering", connections: ["llms", "genai_node"] },
      { id: "tokenization", label: "Tokenization", connections: ["embeddings", "transformers"] },
      { id: "embeddings", label: "Embeddings", connections: ["rag", "tokenization"] },
      { id: "transformers", label: "Transformers", connections: ["llms", "pytorch"] },
      { id: "ethics", label: "AI Ethics & Bias Mitigation", connections: ["llms"] }
    ]
  },
  {
    id: "data_ml",
    label: "Data & ML",
    angle: -30, // Top right
    nodes: [
      { id: "scikit", label: "Scikit-Learn", connections: ["pandas", "numpy"] },
      { id: "tensorflow", label: "TensorFlow", connections: ["pytorch", "scikit"] },
      { id: "pytorch", label: "PyTorch", connections: ["tensorflow", "transformers"] },
      { id: "pandas", label: "Pandas", connections: ["numpy", "preprocessing"] },
      { id: "numpy", label: "NumPy", connections: ["pandas", "scikit"] },
      { id: "preprocessing", label: "Data Preprocessing", connections: ["feature_eng"] },
      { id: "feature_eng", label: "Feature Engineering", connections: ["preprocessing", "mlops"] },
      { id: "etl", label: "ETL Pipelines", connections: ["pandas", "mlops"] },
      { id: "streamlit", label: "Streamlit", connections: ["matplotlib", "python"] },
      { id: "matplotlib", label: "Matplotlib", connections: ["pandas", "streamlit"] },
      { id: "cicd", label: "CI/CD", connections: ["mlops", "devops"] },
      { id: "mlops", label: "MLOps", connections: ["pytorch", "tensorflow", "cicd"] }
    ]
  },
  {
    id: "databases",
    label: "Databases",
    angle: 30, // Bottom right
    nodes: [
      { id: "postgres", label: "PostgreSQL", connections: ["redis", "django"] },
      { id: "mysql", label: "MySQL", connections: ["postgres"] },
      { id: "mongo", label: "MongoDB", connections: ["redis"] },
      { id: "redis", label: "Redis", connections: ["postgres", "fastapi"] }
    ]
  },
  {
    id: "core_cs",
    label: "Core CS",
    angle: 90, // Bottom center
    nodes: [
      { id: "dsa", label: "DSA", connections: ["oop", "sys_design"] },
      { id: "oop", label: "OOP", connections: ["dsa", "python", "java"] },
      { id: "os", label: "Operating Systems", connections: ["networks"] },
      { id: "dbms", label: "DBMS", connections: ["postgres", "mysql"] },
      { id: "networks", label: "Computer Networks", connections: ["os"] },
      { id: "sys_design", label: "System Design", connections: ["dsa"] }
    ]
  },
  {
    id: "backend_cloud",
    label: "Backend & Cloud",
    angle: 150, // Bottom left
    nodes: [
      { id: "fastapi", label: "FastAPI", connections: ["python", "redis"] },
      { id: "flask", label: "Flask", connections: ["python"] },
      { id: "django", label: "Django", connections: ["python", "postgres"] },
      { id: "apis", label: "REST APIs", connections: ["fastapi", "flask", "django"] },
      { id: "websockets", label: "WebSockets", connections: ["fastapi"] },
      { id: "microservices", label: "Microservices", connections: ["sys_design"] },
      { id: "cloud_native", label: "Cloud-Native Architecture", connections: ["aws", "docker"] },
      { id: "docker", label: "Docker", connections: ["aws"] },
      { id: "aws", label: "AWS", connections: ["docker"] },
      { id: "devops", label: "DevOps Fundamentals", connections: ["docker", "cicd"] },
      { id: "agile", label: "Agile/Scrum", connections: [] }
    ]
  },
  {
    id: "languages",
    label: "Languages",
    angle: 210, // Top left
    nodes: [
      { id: "python", label: "Python", connections: ["pytorch", "fastapi", "django"] },
      { id: "java", label: "Java", connections: ["oop"] },
      { id: "js", label: "JavaScript", connections: ["ts"] },
      { id: "ts", label: "TypeScript", connections: ["js"] }
    ]
  }
];

const CROSS_LINKS = [
  { from: "python", to: "pytorch" },
  { from: "python", to: "fastapi" },
  { from: "python", to: "django" },
  { from: "langchain", to: "llms" },
  { from: "langchain", to: "rag" },
  { from: "pytorch", to: "tensorflow" },
  { from: "fastapi", to: "postgres" },
  { from: "dsa", to: "sys_design" }
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  genai: <BrainCircuit className="w-4 h-4 text-accent-pink animate-pulse" />,
  data_ml: <Cpu className="w-4 h-4 text-[#ffa116]" />,
  databases: <Database className="w-4 h-4 text-accent-lavender" />,
  core_cs: <Code2 className="w-4 h-4 text-emerald-400" />,
  backend_cloud: <Server className="w-4 h-4 text-accent-purple" />,
  languages: <Globe className="w-4 h-4 text-blue-400" />
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

  const CLUSTER_RADIUS = 185; // Distance from center hub to cluster centers

  // Mouse Movement Parallax Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({ x: x * 0.4, y: y * 0.4 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setHoveredClusterId(null);
    setHoveredSubNodeId(null);
    setHoveredCenter(false);
  };

  // Coordinates helper (Percentage coordinates for HTML overlay, Pixels for SVG drawing)
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

  // Local crescent dome coordinates helper: pointing away from the center (along cluster angle)
  const getSubNodeCoordinates = (
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

  // Node highlight checker for focused aesthetic
  const isNodeHighlighted = (nodeId: string) => {
    if (hoveredCenter) return true;
    if (!hoveredClusterId && !hoveredSubNodeId) return true;

    if (hoveredSubNodeId) {
      if (nodeId === "center" || nodeId === hoveredClusterId || nodeId === hoveredSubNodeId) return true;
      const cluster = CLUSTERS.find(c => c.id === hoveredClusterId);
      const node = cluster?.nodes.find(n => n.id === hoveredSubNodeId);
      if (node && node.connections.includes(nodeId)) return true;

      // Cross links bidirectional
      for (const link of CROSS_LINKS) {
        if ((link.from === hoveredSubNodeId && link.to === nodeId) || (link.to === hoveredSubNodeId && link.from === nodeId)) {
          return true;
        }
      }
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

  const findNodePixelPos = (nodeId: string) => {
    for (const cluster of CLUSTERS) {
      if (cluster.id === nodeId) {
        return getCoordinates(cluster.angle, CLUSTER_RADIUS);
      }
      const idx = cluster.nodes.findIndex(n => n.id === nodeId);
      if (idx !== -1) {
        const isOpen = isClusterOpen(cluster.id);
        const currentSubRadius = isOpen ? (idx % 2 === 0 ? 60 : 85) : 0;
        const N = cluster.nodes.length;
        const deltaAngle = N > 1 ? 150 / (N - 1) : 0;
        const deltaPhi = N > 1 ? -75 + idx * deltaAngle : 0;
        const subAngle = cluster.angle + deltaPhi;
        return getSubNodeCoordinates(cluster.angle, CLUSTER_RADIUS, subAngle, currentSubRadius);
      }
    }
    return { xPixel: 0, yPixel: 0 };
  };

  return (
    <>
      {/* Mobile Structured Fallback (Responsive list) */}
      <div className="w-full flex flex-col gap-5 md:hidden px-4 py-6">
        <div className="flex items-center justify-center mb-4">
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

      {/* Desktop Interactive SVG Galaxy Network */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden md:flex relative w-full h-[600px] items-center justify-center overflow-hidden font-sans cursor-default select-none"
      >
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              x: -mouseOffset.x * 20,
              y: -mouseOffset.y * 20,
              scale: hoveredClusterId ? 1.1 : 1,
              opacity: hoveredClusterId ? 0.15 : 0.05
            }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="w-[400px] h-[400px] rounded-full bg-accent-purple/20 blur-[100px]"
          />
        </div>

        {/* Unified Interactive Galaxy Container */}
        <motion.div
          animate={{
            x: mouseOffset.x * 12,
            y: mouseOffset.y * 12
          }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="relative z-10 w-full max-w-[700px] aspect-square"
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-500 -500 1000 1000">
            <defs>
              <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8a2be2" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffb6c1" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {isInView && (
              <>
                {/* Center Core to Clusters links */}
                {CLUSTERS.map((cluster, i) => {
                  const pos = getCoordinates(cluster.angle, CLUSTER_RADIUS);
                  const isHighlighted = isNodeHighlighted(cluster.id);
                  const opacity = hoveredCenter || hoveredClusterId === cluster.id || (hoveredSubNodeId && isNodeHighlighted(cluster.id)) ? 0.6 : 0.15;

                  return (
                    <motion.line
                      key={`core-${cluster.id}`}
                      x1="0"
                      y1="0"
                      x2={pos.xPixel}
                      y2={pos.yPixel}
                      stroke={isHighlighted ? "url(#lineGlow)" : "#ffffff"}
                      strokeWidth={isHighlighted ? 2 : 0.8}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity }}
                      transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }}
                    />
                  );
                })}

                {/* Cluster Label to sub-nodes connections (Visible only when blooming/open) */}
                {CLUSTERS.map((cluster) => {
                  const cPos = getCoordinates(cluster.angle, CLUSTER_RADIUS);
                  const isOpen = isClusterOpen(cluster.id);

                  return cluster.nodes.map((node, j) => {
                    const idx = j;
                    const N = cluster.nodes.length;
                    const deltaAngle = N > 1 ? 150 / (N - 1) : 0;
                    const deltaPhi = N > 1 ? -75 + idx * deltaAngle : 0;
                    const subAngle = cluster.angle + deltaPhi;
                    const currentSubRadius = isOpen ? (idx % 2 === 0 ? 60 : 85) : 0;
                    const subPos = getSubNodeCoordinates(cluster.angle, CLUSTER_RADIUS, subAngle, currentSubRadius);
                    const isSubActive = isNodeHighlighted(node.id);

                    return (
                      <motion.line
                        key={`sub-${node.id}`}
                        animate={{
                          x1: cPos.xPixel,
                          y1: cPos.yPixel,
                          x2: subPos.xPixel,
                          y2: subPos.yPixel,
                          opacity: isOpen ? (hoveredSubNodeId ? (hoveredSubNodeId === node.id || node.connections.includes(hoveredSubNodeId) ? 0.75 : 0.08) : 0.25) : 0
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

                {/* Cross category neural links */}
                {CROSS_LINKS.map((link, idx) => {
                  const start = findNodePixelPos(link.from);
                  const end = findNodePixelPos(link.to);
                  const isLinkActive = hoveredSubNodeId === link.from || hoveredSubNodeId === link.to;
                  const opacity = isLinkActive ? 0.75 : 0.02;

                  return (
                    <motion.line
                      key={`cross-${idx}`}
                      animate={{
                        x1: start.xPixel,
                        y1: start.yPixel,
                        x2: end.xPixel,
                        y2: end.yPixel,
                        opacity: opacity
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        mass: 0.8
                      }}
                      stroke="#ffa116"
                      strokeWidth={isLinkActive ? 1.5 : 0.5}
                      strokeDasharray="3 3"
                    />
                  );
                })}
              </>
            )}
          </svg>

          {/* Central Core: AI / ML Engineer */}
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
                    CORE HUB
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clusters and Orbital Sub-nodes overlay */}
          <div className="absolute inset-0 z-20">
            {isInView && CLUSTERS.map((cluster) => {
              const cPos = getCoordinates(cluster.angle, CLUSTER_RADIUS);
              const isClusterActive = isNodeHighlighted(cluster.id);
              const clusterOpacity = hoveredCenter || hoveredClusterId === cluster.id || (hoveredSubNodeId && isNodeHighlighted(cluster.id)) ? 1 : 0.4;

              return (
                <div key={cluster.id}>
                  {/* Category Node */}
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
                        "px-3.5 py-1.5 rounded-full border backdrop-blur-md whitespace-nowrap cursor-pointer transition-all duration-200 flex items-center gap-1.5",
                        isClusterActive || activeSkill === cluster.id
                          ? "bg-accent-purple/20 border-accent-pink shadow-[0_0_15px_rgba(255,182,193,0.3)] text-white scale-105"
                          : "bg-black/85 border-accent-purple/10 text-gray-400 hover:text-white"
                      )}
                    >
                      {CATEGORY_ICONS[cluster.id]}
                      <span className="text-[10px] font-bold tracking-wide font-sans">{cluster.label}</span>
                    </div>
                  </motion.div>

                  {/* Orbital Sub-nodes (Bloomed Outward when parent is hovered) */}
                  {cluster.nodes.map((node, j) => {
                    const idx = j;
                    const N = cluster.nodes.length;
                    const deltaAngle = N > 1 ? 150 / (N - 1) : 0;
                    const deltaPhi = N > 1 ? -75 + idx * deltaAngle : 0;
                    const subAngle = cluster.angle + deltaPhi;
                    const isOpen = isClusterOpen(cluster.id);
                    const currentSubRadius = isOpen ? (idx % 2 === 0 ? 60 : 85) : 0;
                    const subPos = getSubNodeCoordinates(cluster.angle, CLUSTER_RADIUS, subAngle, currentSubRadius);
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
                          stiffness: 120,
                          damping: 14,
                          mass: 0.6
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
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
                            "px-2 py-0.5 rounded border backdrop-blur-md cursor-pointer transition-all duration-200 whitespace-nowrap text-[9px] font-medium tracking-wider",
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
