"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    // Map section IDs to human readable names
    const sectionNames: Record<string, string> = {
      "first-impression": "First Impression",
      "about": "About",
      "education": "Education",
      "experience": "Experience",
      "intelligence": "Tech Ecosystem",
      "innovation-lab": "Innovation Lab",
      "certifications": "Certifications",
      "achievements": "Milestones",
      "contact": "Contact"
    };

    const sections = document.querySelectorAll("section[id]");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (sectionNames[id]) {
              setActiveSection(sectionNames[id]);
            }
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" } // Trigger when section is mostly in the middle
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex items-center gap-6 pointer-events-none hidden lg:flex">
      {/* Current Section Name */}
      <motion.div 
        key={activeSection}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="text-[10px] uppercase tracking-[0.3em] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-pink"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {activeSection}
      </motion.div>

      {/* Progress Track */}
      <div className="relative w-[1px] h-32 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent-pink to-accent-purple shadow-[0_0_10px_rgba(255,182,193,0.8)] origin-top"
          style={{ scaleY, height: "100%" }}
        />
      </div>
    </div>
  );
}
