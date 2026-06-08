"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the ecosystem data
const CLUSTERS = [
  {
    id: "ai",
    label: "Artificial Intelligence",
    angle: -90, // Top
    radius: 200,
    nodes: [
      { id: "ml", label: "Machine Learning", connections: ["dl", "tf", "py", "python"] },
      { id: "dl", label: "Deep Learning", connections: ["ml", "cv", "nlp", "tf", "pytorch"] },
      { id: "nlp", label: "NLP", connections: ["dl", "ml"] },
      { id: "cv", label: "Computer Vision", connections: ["dl", "ml"] },
      { id: "tf", label: "TensorFlow", connections: ["ml", "dl", "pytorch"] },
      { id: "pytorch", label: "PyTorch", connections: ["ml", "dl", "tf"] }
    ]
  },
  {
    id: "backend",
    label: "Backend Engineering",
    angle: -18, // Top Right
    radius: 220,
    nodes: [
      { id: "java", label: "Java", connections: ["oop", "apis", "spring"] },
      { id: "python", label: "Python", connections: ["django", "flask", "ml", "ai"] },
      { id: "django", label: "Django", connections: ["python", "apis", "sql"] },
      { id: "flask", label: "Flask", connections: ["python", "apis"] },
      { id: "node", label: "Node.js", connections: ["js", "apis"] },
      { id: "apis", label: "REST APIs", connections: ["java", "python", "node", "django"] }
    ]
  },
  {
    id: "databases",
    label: "Databases",
    angle: 54, // Bottom Right
    radius: 200,
    nodes: [
      { id: "sql", label: "SQL", connections: ["postgres", "dbms"] },
      { id: "postgres", label: "PostgreSQL", connections: ["sql", "django", "sqlalchemy"] },
      { id: "mongo", label: "MongoDB", connections: ["node", "dbms"] },
      { id: "redis", label: "Redis", connections: ["backend", "dbms"] },
      { id: "sqlalchemy", label: "SQLAlchemy", connections: ["python", "sql", "postgres"] }
    ]
  },
  {
    id: "cloud",
    label: "Cloud & Tools",
    angle: 126, // Bottom Left
    radius: 220,
    nodes: [
      { id: "aws", label: "AWS", connections: ["docker", "linux", "backend"] },
      { id: "docker", label: "Docker", connections: ["aws", "linux"] },
      { id: "git", label: "Git", connections: ["tools"] },
      { id: "linux", label: "Linux", connections: ["aws", "docker", "os"] },
      { id: "vercel", label: "Vercel", connections: ["frontend"] },
      { id: "gunicorn", label: "Gunicorn", connections: ["python", "django", "flask"] }
    ]
  },
  {
    id: "foundations",
    label: "Engineering Foundations",
    angle: 198, // Top Left
    radius: 200,
    nodes: [
      { id: "dsa", label: "Data Structures", connections: ["algo", "java", "python"] },
      { id: "algo", label: "Algorithms", connections: ["dsa", "ml"] },
      { id: "oop", label: "OOP", connections: ["java", "python"] },
      { id: "dbms", label: "DBMS", connections: ["sql", "postgres", "mongo"] },
      { id: "os", label: "Operating Systems", connections: ["linux", "networks"] },
      { id: "networks", label: "Computer Networks", connections: ["os", "apis"] }
    ]
  }
];
interface NetworkProps {
  onSkillSelect?: (skill: string) => void;
  activeSkill?: string | null;
}

export default function TechnicalIntelligenceNetwork({ onSkillSelect, activeSkill }: NetworkProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Helper to determine node positions on a circle (returns percentage values)
  const getCoordinates = (angleDeg: number, radius: number, centerPct = 50) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    // Base scale: 500 is the center (half of 1000px viewBox), so radius is relative to 500
    const radiusPct = (radius / 500) * 50;
    return {
      x: centerPct + radiusPct * Math.cos(angleRad),
      y: centerPct + radiusPct * Math.sin(angleRad),
      xPixel: radius * Math.cos(angleRad),
      yPixel: radius * Math.sin(angleRad)
    };
  };

  // Helper to check if a node is connected to the hovered node
  const isNodeConnected = (nodeId: string, clusterId: string) => {
    if (!hoveredNode) return false;
    if (hoveredNode === nodeId || hoveredNode === clusterId) return true;
    
    for (const cluster of CLUSTERS) {
      if (cluster.id === hoveredNode && cluster.nodes.some(n => n.id === nodeId)) return true;
      for (const node of cluster.nodes) {
        if (node.id === hoveredNode && (node.connections.includes(nodeId) || cluster.id === clusterId)) return true;
      }
    }
    return false;
  };

  // SVG Line definitions for the core to clusters
  const lines = CLUSTERS.map((cluster) => {
    const pos = getCoordinates(cluster.angle, cluster.radius);
    return { id: cluster.id, x2: pos.xPixel, y2: pos.yPixel };
  });

  return (
    <>
      {/* Mobile-Specific Premium Layout */}
      <div className="w-full flex flex-col gap-6 md:hidden px-6 py-12">
        <div className="flex items-center justify-center mb-8">
           <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border border-accent-purple/30 bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(138,43,226,0.3)]">
             <BrainCircuit className="w-6 h-6 text-white mb-2" />
             <span className="text-[9px] uppercase tracking-[0.2em] text-accent-pink font-semibold text-center leading-tight">
               Tech<br/>Ecosystem
             </span>
           </div>
        </div>
        
        {CLUSTERS.map((cluster, i) => (
          <motion.div 
            key={cluster.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-panel p-6 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h4 className="text-lg font-bold text-white mb-4 tracking-wide relative z-10">
              {cluster.label}
            </h4>
            <div className="flex flex-wrap gap-2 relative z-10">
              {cluster.nodes.map(node => (
                <span 
                  key={node.id} 
                  onClick={() => {
                    if (onSkillSelect) {
                      onSkillSelect(node.id);
                      document.getElementById("innovation-lab")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border font-light cursor-pointer transition-colors",
                    activeSkill === node.id 
                      ? "bg-accent-purple/30 border-accent-pink text-white" 
                      : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-accent-pink/50"
                  )}
                >
                  {node.label}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Interactive SVG Network */}
      <div ref={containerRef} className="hidden md:flex relative w-full h-[800px] md:h-[900px] items-center justify-center overflow-hidden font-sans">
      
      {/* Background ambient glow based on hover */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ 
            scale: hoveredNode ? 1.2 : 1,
            opacity: hoveredNode ? 0.3 : 0.1
          }}
          transition={{ duration: 0.8 }}
          className="w-[500px] h-[500px] rounded-full bg-accent-purple blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: hoveredNode ? 1.5 : 1.2,
            opacity: hoveredNode ? 0.2 : 0.05
          }}
          transition={{ duration: 0.8 }}
          className="absolute w-[600px] h-[600px] rounded-full bg-accent-pink blur-[150px]" 
        />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] aspect-square">
        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-500 -500 1000 1000">
          {isInView && lines.map((line, i) => {
            const isHighlighted = hoveredNode && (hoveredNode === line.id || isNodeConnected(line.id, line.id));
            const opacity = hoveredNode ? (isHighlighted ? 0.6 : 0.05) : 0.2;
            const strokeColor = isHighlighted ? "#ffb6c1" : "#8a2be2";
            
            return (
              <motion.g key={line.id}>
                {/* Core to Cluster line */}
                <motion.line
                  x1="0" y1="0" x2={line.x2} y2={line.y2}
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? 2 : 1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.2, ease: "easeOut" }}
                />
                
                {/* Cluster to Sub-nodes lines */}
                {CLUSTERS[i].nodes.map((node, j) => {
                  const nodeAngle = CLUSTERS[i].angle + (j - (CLUSTERS[i].nodes.length - 1) / 2) * 20;
                  const nodePos = getCoordinates(nodeAngle, CLUSTERS[i].radius + 120);
                  const isNodeHighlighted = hoveredNode && (hoveredNode === node.id || isNodeConnected(node.id, CLUSTERS[i].id));
                  const nodeOpacity = hoveredNode ? (isNodeHighlighted ? 0.5 : 0.05) : 0.15;
                  
                  return (
                    <motion.line
                      key={node.id}
                      x1={line.x2} y1={line.y2} x2={nodePos.xPixel} y2={nodePos.yPixel}
                      stroke={isNodeHighlighted ? "#e6e6fa" : "#ffffff"}
                      strokeWidth={isNodeHighlighted ? 1.5 : 0.5}
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: nodeOpacity }}
                      transition={{ duration: 1, delay: 1.5 + (i * 0.1) + (j * 0.05), ease: "easeOut" }}
                    />
                  );
                })}
              </motion.g>
            );
          })}
        </svg>

        {/* Central Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <AnimatePresence>
            {isInView && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                className={cn(
                  "relative flex flex-col items-center justify-center w-40 h-40 rounded-full border border-accent-purple/30 bg-black/40 backdrop-blur-md shadow-[0_0_50px_rgba(138,43,226,0.3)] transition-all duration-500",
                  hoveredNode ? "shadow-[0_0_80px_rgba(255,182,193,0.5)] border-accent-pink/50 scale-105" : ""
                )}
              >
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-accent-lavender/20"
                />
                <BrainCircuit className="w-8 h-8 text-white mb-2" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent-pink font-semibold text-center leading-tight">
                  Sakshi's<br/>Tech Ecosystem
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clusters and Nodes HTML Overlay */}
        <div className="absolute inset-0 z-20">
          {isInView && CLUSTERS.map((cluster, i) => {
            const pos = getCoordinates(cluster.angle, cluster.radius);
            const isClusterHighlighted = hoveredNode && (hoveredNode === cluster.id || isNodeConnected(cluster.id, cluster.id));
            const clusterOpacity = hoveredNode ? (isClusterHighlighted ? 1 : 0.2) : 1;

            return (
              <div key={cluster.id}>
                {/* Cluster Label */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: clusterOpacity }}
                  transition={{ duration: 0.8, delay: 1 + i * 0.2, type: "spring" }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onMouseEnter={() => setHoveredNode(cluster.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className={cn(
                    "px-4 py-2 rounded-full border backdrop-blur-md whitespace-nowrap cursor-pointer transition-all duration-300",
                    isClusterHighlighted || activeSkill === cluster.id
                      ? "bg-accent-purple/20 border-accent-pink shadow-[0_0_20px_rgba(255,182,193,0.4)] text-white scale-110" 
                      : "bg-black/40 border-accent-purple/30 text-gray-300 hover:text-white hover:border-accent-purple/60"
                  )}
                  onClick={() => {
                    if (onSkillSelect) {
                      onSkillSelect(cluster.id);
                      document.getElementById("innovation-lab")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}>
                    <span className="text-sm font-medium tracking-wide">{cluster.label}</span>
                  </div>
                </motion.div>

                {/* Sub-nodes */}
                {cluster.nodes.map((node, j) => {
                  const nodeAngle = cluster.angle + (j - (cluster.nodes.length - 1) / 2) * 20;
                  const nPos = getCoordinates(nodeAngle, cluster.radius + 120); 
                  const isNodeHighlighted = hoveredNode && (hoveredNode === node.id || isNodeConnected(node.id, cluster.id));
                  const nodeOpacity = hoveredNode ? (isNodeHighlighted ? 1 : 0.1) : 0.8;

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: nodeOpacity }}
                      transition={{ duration: 0.5, delay: 2 + (i * 0.1) + (j * 0.05) }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                      style={{ left: `${nPos.x}%`, top: `${nPos.y}%` }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div 
                        className={cn(
                          "px-3 py-1.5 rounded-full border backdrop-blur-md cursor-pointer transition-all duration-300 whitespace-nowrap",
                          isNodeHighlighted || activeSkill === node.id
                            ? "bg-white/10 border-accent-lavender text-white shadow-[0_0_15px_rgba(230,230,250,0.3)] scale-110 z-30" 
                            : "bg-transparent border-white/10 text-gray-400 hover:text-gray-200"
                        )}
                        onClick={() => {
                          if (onSkillSelect) {
                            onSkillSelect(node.id);
                            document.getElementById("innovation-lab")?.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      >
                        <span className="text-xs font-light">{node.label}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </>
  );
}
