"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BrainCircuit, Database, Server, Cloud, Cpu } from "lucide-react";

// Categorized Ecosystem Data
const CATEGORIES = [
  {
    id: "ai",
    label: "Artificial Intelligence & ML",
    icon: <BrainCircuit className="w-5 h-5 text-accent-pink" />,
    color: "from-accent-pink/20 to-accent-pink/5",
    skills: [
      { id: "ml", label: "Machine Learning", connections: ["dl", "tf", "pytorch"] },
      { id: "dl", label: "Deep Learning", connections: ["ml", "cv", "nlp", "tf", "pytorch"] },
      { id: "nlp", label: "Natural Language Processing (NLP)", connections: ["dl", "ml"] },
      { id: "cv", label: "Computer Vision", connections: ["dl", "ml"] },
      { id: "tf", label: "TensorFlow", connections: ["ml", "dl", "pytorch"] },
      { id: "pytorch", label: "PyTorch", connections: ["ml", "dl", "tf"] }
    ]
  },
  {
    id: "backend",
    label: "Backend Engineering",
    icon: <Server className="w-5 h-5 text-accent-purple" />,
    color: "from-accent-purple/20 to-accent-purple/5",
    skills: [
      { id: "java", label: "Java", connections: ["oop", "apis"] },
      { id: "python", label: "Python", connections: ["django", "flask", "ml"] },
      { id: "django", label: "Django", connections: ["python", "apis", "postgres"] },
      { id: "flask", label: "Flask", connections: ["python", "apis"] },
      { id: "node", label: "Node.js", connections: ["apis", "mongo"] },
      { id: "apis", label: "REST APIs", connections: ["java", "python", "node", "django"] }
    ]
  },
  {
    id: "databases",
    label: "Databases & Storage",
    icon: <Database className="w-5 h-5 text-accent-lavender" />,
    color: "from-accent-lavender/20 to-accent-lavender/5",
    skills: [
      { id: "sql", label: "SQL", connections: ["postgres", "sqlalchemy"] },
      { id: "postgres", label: "PostgreSQL", connections: ["sql", "django", "sqlalchemy"] },
      { id: "mongo", label: "MongoDB", connections: ["node"] },
      { id: "redis", label: "Redis", connections: ["backend"] },
      { id: "sqlalchemy", label: "SQLAlchemy", connections: ["python", "sql", "postgres"] }
    ]
  },
  {
    id: "cloud",
    label: "Cloud & Development Tools",
    icon: <Cloud className="w-5 h-5 text-blue-400" />,
    color: "from-blue-500/20 to-blue-500/5",
    skills: [
      { id: "aws", label: "AWS (Cloud)", connections: ["docker", "linux", "backend"] },
      { id: "docker", label: "Docker", connections: ["aws", "linux"] },
      { id: "git", label: "Git", connections: [] },
      { id: "linux", label: "Linux / OS", connections: ["aws", "docker"] },
      { id: "vercel", label: "Vercel", connections: [] },
      { id: "gunicorn", label: "Gunicorn", connections: ["python", "django"] }
    ]
  },
  {
    id: "foundations",
    label: "Software Foundations",
    icon: <Cpu className="w-5 h-5 text-emerald-400" />,
    color: "from-emerald-500/20 to-emerald-500/5",
    skills: [
      { id: "dsa", label: "Data Structures", connections: ["algo", "java", "python"] },
      { id: "algo", label: "Algorithms", connections: ["dsa", "ml"] },
      { id: "oop", label: "OOP Principles", connections: ["java", "python"] },
      { id: "dbms", label: "DBMS Architecture", connections: ["sql", "postgres", "mongo"] },
      { id: "os", label: "Operating Systems", connections: ["linux"] },
      { id: "networks", label: "Computer Networks", connections: ["apis"] }
    ]
  }
];

interface NetworkProps {
  onSkillSelect?: (skill: string) => void;
  activeSkill?: string | null;
}

export default function TechnicalIntelligenceNetwork({ onSkillSelect, activeSkill }: NetworkProps = {}) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Helper to check if a skill is connected to the hovered skill
  const isSkillConnected = (skillId: string) => {
    if (!hoveredSkill) return false;
    if (hoveredSkill === skillId) return true;

    // Search for the hovered skill's connections
    for (const cat of CATEGORIES) {
      const skill = cat.skills.find(s => s.id === hoveredSkill);
      if (skill) {
        return skill.connections.includes(skillId);
      }
    }
    return false;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category, catIdx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-white/10 shadow-lg relative overflow-hidden group flex flex-col justify-between"
          >
            {/* Ambient Card Background Glow */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none", category.color)} />
            
            <div className="relative z-10">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold font-heading text-white tracking-wide">
                  {category.label}
                </h3>
              </div>

              {/* Skills tags/chips list */}
              <div className="flex flex-wrap gap-2.5">
                {category.skills.map((skill) => {
                  const isHovered = hoveredSkill === skill.id;
                  const isConnected = isSkillConnected(skill.id);
                  const isActive = activeSkill === skill.id;

                  return (
                    <motion.button
                      key={skill.id}
                      onMouseEnter={() => setHoveredSkill(skill.id)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onClick={() => {
                        if (onSkillSelect) {
                          onSkillSelect(skill.id);
                          // Smooth scroll down to projects showcase
                          document.getElementById("innovation-lab")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "text-xs px-3.5 py-2 rounded-full border transition-all duration-300 cursor-pointer font-medium tracking-wide",
                        isActive
                          ? "bg-accent-purple text-white border-accent-pink shadow-[0_0_15px_rgba(255,182,193,0.3)]"
                          : isHovered
                          ? "bg-white/10 border-white/30 text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                          : isConnected
                          ? "bg-accent-purple/20 border-accent-lavender/30 text-accent-lavender shadow-[0_0_10px_rgba(230,230,250,0.15)]"
                          : "bg-white/5 border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/10"
                      )}
                    >
                      {skill.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
