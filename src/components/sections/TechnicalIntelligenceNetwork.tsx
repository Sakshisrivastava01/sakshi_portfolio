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
  angle: number;
  radius: number;
  nodes: LCNode[];
}

// Define the 6 skills categories and sub-nodes
const CLUSTERS: LCCluster[] = [
  {
    id: "genai",
    label: "Generative AI & NLP",
    angle: -90, // Top center
    radius: 200,
    nodes: [
      { id: "gen_ai", label: "GenAI", connections: ["llms", "prompt"] },
      { id: "openai", label: "OpenAI API", connections: ["gen_ai", "llms", "langchain"] },
      { id: "ollama", label: "Ollama", connections: ["llms", "rag"] },
      { id: "langchain", label: "LangChain", connections: ["llms", "rag", "langgraph"] },
      { id: "langgraph", label: "LangGraph", connections: ["langchain", "llms"] },
      { id: "llms", label: "LLMs", connections: ["gen_ai", "openai", "transformers"] },
      { id: "rag", label: "RAG", connections: ["embeddings", "langchain"] },
      { id: "prompt", label: "Prompt Engineering", connections: ["llms", "gen_ai"] },
      { id: "tokenization", label: "Tokenization", connections: ["embeddings", "transformers"] },
      { id: "embeddings", label: "Embeddings", connections: ["rag", "tokenization"] },
      { id: "transformers", label: "Transformers", connections: ["llms", "pytorch"] },
      { id: "ethics", label: "AI Ethics", connections: ["llms"] }
    ]
  },
  {
    id: "data_ml",
    label: "Data & ML",
    angle: -30, // Top right
    radius: 210,
    nodes: [
      { id: "tensorflow", label: "TensorFlow", connections: ["pytorch", "scikit"] },
      { id: "pytorch", label: "PyTorch", connections: ["tensorflow", "transformers"] },
      { id: "scikit", label: "Scikit-Learn", connections: ["pandas", "numpy"] },
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
    radius: 200,
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
    radius: 210,
    nodes: [
      { id: "dsa", label: "DSA", connections: ["oop", "algo"] },
      { id: "oop", label: "OOP", connections: ["dsa", "python", "java"] },
      { id: "dbms", label: "DBMS", connections: ["postgres", "mysql"] },
      { id: "os", label: "Operating Systems", connections: ["networks"] },
      { id: "networks", label: "Computer Networks", connections: ["os"] },
      { id: "sys_design", label: "System Design", connections: ["dsa"] }
    ]
  },
  {
    id: "backend_cloud",
    label: "Backend & Cloud",
    angle: 150, // Bottom left
    radius: 200,
    nodes: [
      { id: "fastapi", label: "FastAPI", connections: ["python", "redis"] },
      { id: "flask", label: "Flask", connections: ["python"] },
      { id: "django", label: "Django", connections: ["python", "postgres"] },
      { id: "apis", label: "REST APIs", connections: ["fastapi", "flask", "django"] },
      { id: "websockets", label: "WebSockets", connections: ["fastapi"] },
      { id: "microservices", label: "Microservices", connections: ["sys_design"] },
      { id: "aws", label: "AWS", connections: ["docker"] },
      { id: "docker", label: "Docker", connections: ["aws"] },
      { id: "cloud_native", label: "Cloud Native Architecture", connections: ["aws", "docker"] },
      { id: "devops", label: "DevOps", connections: ["docker", "cicd"] },
      { id: "agile", label: "Agile", connections: [] }
    ]
  },
  {
    id: "languages",
    label: "Languages",
    angle: 210, // Top left
    radius: 210,
    nodes: [
      { id: "python", label: "Python", connections: ["pytorch", "fastapi", "django"] },
      { id: "java", label: "Java", connections: ["oop"] },
      { id: "js", label: "JavaScript", connections: ["ts"] },
      { id: "ts", label: "TypeScript", connections: ["js"] }
    ]
  }
];

// Cross-category neural links to highlight connections
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
  genai: <BrainCircuit className="w-5 h-5 text-accent-pink animate-pulse" />,
  data_ml: <Cpu className="w-5 h-5 text-[#ffa116]" />,
  databases: <Database className="w-5 h-5 text-accent-lavender" />,
  core_cs: <Code2 className="w-5 h-5 text-emerald-400" />,
  backend_cloud: <Server className="w-5 h-5 text-accent-purple" />,
  languages: <Globe className="w-5 h-5 text-blue-400" />
};

interface NetworkProps {
  onSkillSelect?: (skill: string) => void;
  activeSkill?: string | null;
}

export default function TechnicalIntelligenceNetwork({ onSkillSelect, activeSkill }: NetworkProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Mouse Movement Parallax Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2); // [-1, 1]
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2); // [-1, 1]
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Coordinates helper (Percentage coordinates for HTML, Pixels for SVG)
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

  // Local Planetary/Orbit coordinates helper
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

  // Node highlight checker
  const isNodeHighlighted = (nodeId: string) => {
    if (!hoveredNode) return true;
    if (hoveredNode === "center") return true;
    if (hoveredNode === nodeId) return true;

    // Check if cluster is hovered
    const hoveredCluster = CLUSTERS.find(c => c.id === hoveredNode);
    if (hoveredCluster) {
      if (nodeId === "center" || nodeId === hoveredCluster.id || hoveredCluster.nodes.some(n => n.id === nodeId)) {
        return true;
      }
    }

    // Check if sub-node is hovered
    for (const cluster of CLUSTERS) {
      const node: LCNode | undefined = cluster.nodes.find(n => n.id === hoveredNode);
      if (node) {
        if (nodeId === "center" || nodeId === cluster.id || nodeId === node.id || node.connections.includes(nodeId)) {
          return true;
        }
        // Bidirectional highlight checks
        const targetNode: LCNode | undefined = cluster.nodes.find(n => n.id === nodeId);
        if (targetNode && targetNode.connections.includes(hoveredNode)) {
          return true;
        }
      }
    }

    // Check cross links connections
    for (const link of CROSS_LINKS) {
      if ((link.from === hoveredNode && link.to === nodeId) || (link.to === hoveredNode && link.from === nodeId)) {
        return true;
      }
    }

    return false;
  };

  // Helper to find exact subnode coordinates for cross-category links mapping
  const findNodePixelPos = (nodeId: string) => {
    for (const cluster of CLUSTERS) {
      if (cluster.id === nodeId) {
        return getCoordinates(cluster.angle, cluster.radius);
      }
      const idx = cluster.nodes.findIndex(n => n.id === nodeId);
      if (idx !== -1) {
        const isEven = idx % 2 === 0;
        const subRadius = isEven ? 60 : 95;
        const subAngle = cluster.angle + (idx * 360) / cluster.nodes.length;
        return getSubNodeCoordinates(cluster.angle, cluster.radius, subAngle, subRadius);
      }
    }
    return { xPixel: 0, yPixel: 0 };
  };

  return (
    <>
      {/* Mobile Structured Category List (Fully Responsive Fallback) */}
      <div className="w-full flex flex-col gap-6 md:hidden px-6 py-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex flex-col items-center justify-center w-36 h-36 rounded-full border border-accent-purple/30 bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(138,43,226,0.2)]">
            <BrainCircuit className="w-7 h-7 text-white mb-2 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent-pink font-semibold text-center leading-tight">
              AI / ML<br />Engineer
            </span>
          </div>
        </div>

        {CLUSTERS.map((cluster, i) => (
          <motion.div
            key={cluster.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass-panel p-5 rounded-3xl border border-white/5 shadow-md relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2.5 mb-3">
              {CATEGORY_ICONS[cluster.id]}
              <h4 className="text-base font-bold text-white tracking-wide">
                {cluster.label}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
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
                    "text-xs px-3 py-1.5 rounded-full border transition-colors",
                    activeSkill === node.id
                      ? "bg-accent-purple/30 border-accent-pink text-white"
                      : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
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
        className="hidden md:flex relative w-full h-[800px] md:h-[900px] items-center justify-center overflow-hidden font-sans cursor-default select-none"
      >
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              x: -mouseOffset.x * 35,
              y: -mouseOffset.y * 35,
              scale: hoveredNode ? 1.15 : 1,
              opacity: hoveredNode ? 0.25 : 0.08
            }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="w-[500px] h-[500px] rounded-full bg-accent-purple blur-[120px]"
          />
          <motion.div
            animate={{
              x: -mouseOffset.x * 55,
              y: -mouseOffset.y * 55,
              scale: hoveredNode ? 1.3 : 1.1,
              opacity: hoveredNode ? 0.2 : 0.04
            }}
            transition={{ type: "spring", stiffness: 50, damping: 12 }}
            className="absolute w-[600px] h-[600px] rounded-full bg-accent-pink blur-[150px]"
          />
        </div>

        {/* Unified Interactive Galaxy Container */}
        <motion.div
          animate={{
            x: mouseOffset.x * 20,
            y: mouseOffset.y * 20
          }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="relative z-10 w-full max-w-[1000px] aspect-square"
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-500 -500 1000 1000">
            <defs>
              <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8a2be2" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffb6c1" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {isInView && (
              <>
                {/* Center Core to Clusters links */}
                {CLUSTERS.map((cluster, i) => {
                  const pos = getCoordinates(cluster.angle, cluster.radius);
                  const isHighlighted = isNodeHighlighted(cluster.id);
                  const opacity = hoveredNode ? (isHighlighted ? 0.75 : 0.04) : 0.25;

                  return (
                    <motion.line
                      key={`core-${cluster.id}`}
                      x1="0"
                      y1="0"
                      x2={pos.xPixel}
                      y2={pos.yPixel}
                      stroke={isHighlighted ? "url(#lineGlow)" : "#ffffff"}
                      strokeWidth={isHighlighted ? 2.5 : 1}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity }}
                      transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                    />
                  );
                })}

                {/* Cluster Label to sub-nodes connections */}
                {CLUSTERS.map((cluster) => {
                  const cPos = getCoordinates(cluster.angle, cluster.radius);
                  return cluster.nodes.map((node, j) => {
                    const isEven = j % 2 === 0;
                    const subRadius = isEven ? 60 : 95;
                    const subAngle = cluster.angle + (j * 360) / cluster.nodes.length;
                    const subPos = getSubNodeCoordinates(cluster.angle, cluster.radius, subAngle, subRadius);
                    const isHighlighted = isNodeHighlighted(node.id);
                    const opacity = hoveredNode ? (isHighlighted ? 0.6 : 0.03) : 0.15;

                    return (
                      <motion.line
                        key={`sub-${node.id}`}
                        x1={cPos.xPixel}
                        y1={cPos.yPixel}
                        x2={subPos.xPixel}
                        y2={subPos.yPixel}
                        stroke={isHighlighted ? "#ffb6c1" : "#8a2be2"}
                        strokeWidth={isHighlighted ? 1.5 : 0.6}
                        strokeDasharray={isHighlighted ? "none" : "3 3"}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity }}
                        transition={{ duration: 1, delay: 0.5 + j * 0.05, ease: "easeOut" }}
                      />
                    );
                  });
                })}

                {/* Cross category neural links */}
                {CROSS_LINKS.map((link, idx) => {
                  const start = findNodePixelPos(link.from);
                  const end = findNodePixelPos(link.to);
                  const isHighlighted = hoveredNode && isNodeHighlighted(link.from) && isNodeHighlighted(link.to);
                  const opacity = hoveredNode ? (isHighlighted ? 0.7 : 0.02) : 0.12;

                  return (
                    <motion.line
                      key={`cross-${idx}`}
                      x1={start.xPixel}
                      y1={start.yPixel}
                      x2={end.xPixel}
                      y2={end.yPixel}
                      stroke={isHighlighted ? "#ffb6c1" : "#6a0dad"}
                      strokeWidth={isHighlighted ? 2 : 0.8}
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity }}
                      transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
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
                  transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                  className={cn(
                    "relative flex flex-col items-center justify-center w-40 h-40 rounded-full border border-accent-purple/30 bg-black/50 backdrop-blur-md shadow-[0_0_50px_rgba(138,43,226,0.3)] transition-all duration-500 hover:scale-105",
                    hoveredNode && hoveredNode !== "center" ? "opacity-35 scale-95 shadow-none border-white/5" : ""
                  )}
                  onMouseEnter={() => setHoveredNode("center")}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Glowing Ring Animation */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-accent-pink/30"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-full border border-dotted border-accent-lavender/10"
                  />
                  
                  <BrainCircuit className="w-8 h-8 text-white mb-2 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent-pink font-semibold text-center leading-tight">
                    AI / ML<br />Engineer
                  </span>
                  <div className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-accent-purple/20 border border-accent-purple/40 text-[7px] text-accent-lavender tracking-wider font-mono">
                    CORE HUB
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clusters and Orbital Sub-nodes overlay */}
          <div className="absolute inset-0 z-20">
            {isInView && CLUSTERS.map((cluster) => {
              const cPos = getCoordinates(cluster.angle, cluster.radius);
              const isClusterActive = isNodeHighlighted(cluster.id);
              const clusterOpacity = hoveredNode ? (isClusterActive ? 1 : 0.15) : 1;

              return (
                <div key={cluster.id}>
                  {/* Category Node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: clusterOpacity }}
                    transition={{ duration: 0.7, type: "spring" }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                    style={{ left: `${cPos.x}%`, top: `${cPos.y}%` }}
                    onMouseEnter={() => setHoveredNode(cluster.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <div
                      className={cn(
                        "px-4 py-2 rounded-full border backdrop-blur-md whitespace-nowrap cursor-pointer transition-all duration-300 flex items-center gap-2",
                        isClusterActive || activeSkill === cluster.id
                          ? "bg-accent-purple/20 border-accent-pink shadow-[0_0_20px_rgba(255,182,193,0.4)] text-white scale-110"
                          : "bg-black/60 border-accent-purple/20 text-gray-300 hover:text-white"
                      )}
                    >
                      {CATEGORY_ICONS[cluster.id]}
                      <span className="text-xs font-bold tracking-wide font-sans">{cluster.label}</span>
                    </div>
                  </motion.div>

                  {/* Planetary Sub-nodes */}
                  {cluster.nodes.map((node, j) => {
                    const isEven = j % 2 === 0;
                    const subRadius = isEven ? 60 : 95;
                    const subAngle = cluster.angle + (j * 360) / cluster.nodes.length;
                    const subPos = getSubNodeCoordinates(cluster.angle, cluster.radius, subAngle, subRadius);
                    const isSubActive = isNodeHighlighted(node.id);
                    const nodeOpacity = hoveredNode ? (isSubActive ? 1 : 0.12) : 0.85;

                    return (
                      <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: nodeOpacity }}
                        transition={{ duration: 0.5, delay: 0.3 + j * 0.04 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                        style={{ left: `${subPos.x}%`, top: `${subPos.y}%` }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <button
                          onClick={() => {
                            if (onSkillSelect) {
                              onSkillSelect(node.id);
                              document.getElementById("innovation-lab")?.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className={cn(
                            "px-2.5 py-1 rounded-full border backdrop-blur-md cursor-pointer transition-all duration-300 whitespace-nowrap text-[9px] font-medium tracking-wide",
                            isSubActive || activeSkill === node.id
                              ? "bg-white/15 border-accent-lavender text-white shadow-[0_0_12px_rgba(230,230,250,0.35)] scale-110 z-30"
                              : "bg-transparent border-white/5 text-gray-400 hover:text-white"
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
