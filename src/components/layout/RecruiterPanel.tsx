"use client";

import { useState } from "react";
import { Download, Mail } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons/SocialIcons";
import { motion, AnimatePresence } from "framer-motion";

export default function RecruiterPanel() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const options = [
    { id: "resume", icon: <Download className="w-5 h-5" />, label: "Download Resume", href: "/Sakshi_Srivastava_Resume.pdf", download: "Sakshi_Srivastava_Resume.pdf" },
    { id: "linkedin", icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn Profile", href: "https://www.linkedin.com/in/sakshisrivastava01" },
    { id: "github", icon: <Github className="w-5 h-5" />, label: "GitHub Profile", href: "https://github.com/Sakshisrivastava01" },
    { id: "contact", icon: <Mail className="w-5 h-5" />, label: "Quick Contact", href: "#contact" },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {options.map((option, index) => (
        <a 
          key={option.id}
          href={option.href}
          download={option.download}
          className="relative group flex items-center"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Glass Button */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 transition-colors group-hover:bg-white/10 group-hover:border-accent-pink/50 group-hover:text-accent-pink"
          >
            {option.icon}
          </motion.div>

          {/* Elegant Tooltip */}
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.2 }}
                className="absolute left-14 px-4 py-2 rounded-xl bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 shadow-xl pointer-events-none whitespace-nowrap"
              >
                <span className="text-xs font-medium tracking-wider text-gray-200">{option.label}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </a>
      ))}
    </div>
  );
}
