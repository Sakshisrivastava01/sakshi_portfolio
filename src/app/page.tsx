"use client";

import { useState, useEffect, useRef } from "react";
import SmoothScroll from "@/components/layout/SmoothScroll";
import FirstImpressionExperience from "@/components/first-impression/FirstImpressionExperience";
import SectionLayout from "@/components/sections/SectionLayout";
import TechnicalIntelligenceNetwork from "@/components/sections/TechnicalIntelligenceNetwork";
import InnovationLab from "@/components/sections/InnovationLab";
import Certifications from "@/components/sections/Certifications";
import CompetitiveProgramming from "@/components/sections/CompetitiveProgramming";


import { motion } from "framer-motion";
import { 
  Trophy, Mail,
  BrainCircuit, CheckCircle2, Code2, MapPin
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons/SocialIcons";
import ContactForm from "@/components/sections/ContactForm";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

export type AudioState = "idle" | "playing" | "paused" | "finished";

export default function Home() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl] = useState("/import.mp3");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const contactRef = useRef<HTMLDivElement>(null);
  const [contactSpotlight, setContactSpotlight] = useState({ x: 0, y: 0 });
  const [isContactHovered, setIsContactHovered] = useState(false);

  const handleContactMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!contactRef.current) return;
    const rect = contactRef.current.getBoundingClientRect();
    setContactSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const el = document.getElementById("global-audio") as HTMLAudioElement;
    audioRef.current = el;
    if (el && el.duration) {
      setTimeout(() => {
        setDuration(el.duration);
      }, 0);
    }
  }, []);

  const handleToggleAudio = async () => {
    if (!audioRef.current) return;

    if (audioState === "playing") {
      audioRef.current.pause();
      return;
    }

    try {
      if (audioState === "finished") {
        audioRef.current.currentTime = 0;
      }
      await audioRef.current.play();
    } catch {
      // Intentionally swallow to prevent console errors from autoplay policies
    }
  };

  const isSpeaking = audioState === "playing";

  return (
    <>
      <audio 
        id="global-audio" 
        src={audioUrl}
        preload="auto" 
        onPlay={() => setAudioState("playing")}
        onPause={() => {
          if (audioRef.current && audioRef.current.currentTime !== audioRef.current.duration) {
             setAudioState("paused");
          }
        }}
        onEnded={() => { 
          setAudioState("finished"); 
        }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        crossOrigin="anonymous"
      />

      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <Scene isSpeaking={isSpeaking} />
      </div>

      <SmoothScroll>
        <main className="relative min-h-screen bg-transparent overflow-hidden selection:bg-accent-glow selection:text-accent-pink">
                
                <FirstImpressionExperience 
                  audioState={audioState} 
                  currentTime={currentTime} 
                  duration={duration} 
                  onToggleAudio={handleToggleAudio} 
                />
                
                {/* 2. ABOUT SECTION */}
                <SectionLayout id="about" title="About">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-light">
                      <p>
                        I&apos;m Sakshi Srivastava, a Computer Science student passionate about Artificial Intelligence, Machine Learning, and intelligent software development.
                      </p>
                      <p>
                        I enjoy building AI-powered applications and scalable backend systems that solve real-world problems.
                      </p>
                      <p>
                        With a strong foundation in problem-solving and software engineering, I continuously explore emerging technologies, work on innovative projects, and turn ideas into impactful solutions. My goal is to leverage AI and technology to create products that are both meaningful and efficient.
                      </p>
                    </div>
                    <div className="glass-panel p-10 rounded-3xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <h3 className="text-2xl font-semibold font-heading mb-6 text-white flex items-center gap-3">
                          <BrainCircuit className="text-accent-pink" />
                          Core Focus
                        </h3>
                        <ul className="space-y-4">
                          {[
                            "Building Intelligent Systems",
                            "Scalable Backend Architecture",
                            "Modern Software Engineering",
                            "Real-world Problem Solving"
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-400">
                              <CheckCircle2 className="w-5 h-5 text-accent-purple" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </SectionLayout>

                {/* 3. SKILLS SECTION */}
                <SectionLayout id="intelligence" title="Technical Skills">
                  <TechnicalIntelligenceNetwork onSkillSelect={setActiveSkill} activeSkill={activeSkill} />
                </SectionLayout>

                {/* 4. PROJECTS SECTION (INNOVATION LAB) */}
                <InnovationLab />

                {/* 5. EXPERIENCE SECTION */}
                <SectionLayout id="experience" title="Experience">
                  <div className="max-w-4xl mx-auto relative pl-6 border-l border-white/10 space-y-8">
                    {/* CheeseCakeLabs Internship */}
                    <div className="relative">
                      {/* Timeline Dot Indicator */}
                      <div className="absolute -left-[31px] top-2 w-3 h-3 rounded-full bg-accent-purple border-2 border-black shadow-[0_0_10px_rgba(138,43,226,0.6)]" />
                      
                      <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0A0A0F]/65 backdrop-blur-xl hover:border-purple-500/20 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Title Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 relative z-10">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold text-white">CheeseCakeLabs</h3>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-accent-purple/10 border border-accent-purple/20 text-accent-lavender font-mono font-medium">Internship</span>
                            </div>
                            <div className="text-gray-300 text-sm font-medium mt-0.5">
                              Backend Developer Intern
                            </div>
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono flex flex-col sm:items-end gap-0.5">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-accent-pink" /> May 2025 – Aug 2025</span>
                            <span className="text-[10px] text-gray-500">Remote / Internship</span>
                          </div>
                        </div>

                        {/* Professional Responsibilities Bullets */}
                        <ul className="space-y-2 text-gray-300 text-xs md:text-sm font-light mb-6 list-disc pl-5 relative z-10 leading-relaxed">
                          <li>Engineered 8+ custom RESTful API endpoints using Python (Django/Flask) for core backend services.</li>
                          <li>Optimized complex database queries on PostgreSQL, achieving a 30% latency reduction and minimizing database lock constraints.</li>
                          <li>Integrated 5+ third-party service gateways enabling seamless real-time data synchronization.</li>
                          <li>Designed database schemas and executed structured migrations utilizing SQLAlchemy for data consistency.</li>
                        </ul>

                        {/* Technical Accomplishments metrics row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5 relative z-10 select-none">
                          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-lg font-bold text-accent-pink">8+</div>
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mt-1">APIs Built</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-lg font-bold text-accent-purple">15+</div>
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mt-1">Queries Opt</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-lg font-bold text-accent-lavender">5+</div>
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mt-1">Integrations</div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
                            <div className="text-lg font-bold text-white">30%</div>
                            <div className="text-[9px] text-accent-lavender uppercase tracking-widest font-mono mt-1">Speed Gain</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionLayout>

                {/* 6. ACHIEVEMENTS SECTION */}
                <SectionLayout id="achievements" title="Achievements">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                     {/* Smart India Hackathon */}
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       viewport={{ once: true, margin: "-50px" }}
                       className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-accent-purple/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                     >
                       <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                       <div className="relative z-10">
                         <div className="flex items-center justify-between mb-4">
                           <Trophy className="w-6 h-6 text-accent-purple" />
                           <span className="px-2.5 py-0.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-lavender text-[9px] font-mono font-semibold uppercase tracking-wider">
                             National Finalist
                           </span>
                         </div>
                         <h4 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-accent-lavender transition-colors">
                           Smart India Hackathon 2024
                         </h4>
                         <p className="text-xs text-gray-400 font-light leading-relaxed">
                           Selected participant for national level hackathon as a Backend Developer. Designed core database schemas and API specifications.
                         </p>
                       </div>
                     </motion.div>

                     {/* Footprints Hackathon */}
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       viewport={{ once: true, margin: "-50px" }}
                       className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-accent-pink/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                     >
                       <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                       <div className="relative z-10">
                         <div className="flex items-center justify-between mb-4">
                           <Trophy className="w-6 h-6 text-accent-pink" />
                           <span className="px-2.5 py-0.5 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-[9px] font-mono font-semibold uppercase tracking-wider">
                             1st Runner-Up
                           </span>
                         </div>
                         <h4 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-accent-pink transition-colors">
                           Footprints Hackathon
                         </h4>
                         <p className="text-xs text-gray-400 font-light leading-relaxed">
                           Achieved 1st Runner-Up position in MSU Vadodara hackathon. Engineered highly responsive pipelines under tight deadline constraints.
                         </p>
                       </div>
                     </motion.div>

                      {/* AI Engineering Projects */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-accent-lavender/30 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-lavender/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <BrainCircuit className="w-6 h-6 text-accent-lavender" />
                            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-mono font-semibold uppercase tracking-wider">
                              AI & ML
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-accent-lavender transition-colors">
                            AI Engineering Projects
                          </h4>
                          <p className="text-xs text-gray-400 font-light leading-relaxed">
                            Designed and deployed production-grade AI applications using LLMs, RAG pipelines, FastAPI, cloud-native architectures, and modern MLOps workflows.
                          </p>
                        </div>
                      </motion.div>
                    </div>
                 </SectionLayout>

                {/* COMPETITIVE PROGRAMMING SECTION */}
                <CompetitiveProgramming />

                {/* 7. CERTIFICATIONS SECTION */}
                <Certifications />

                {/* 8. EDUCATION SECTION */}
                <SectionLayout id="education" title="Education">
                  <div className="max-w-3xl mx-auto py-2">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0A0A0F]/65 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/20 transition-all duration-300"
                    >
                      {/* Ambient card glow background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-transparent pointer-events-none" />

                      <div className="relative z-10 space-y-6 text-left">
                        {/* Timeline Item 1: B.Tech CSE */}
                        <div className="relative pl-6 border-l border-purple-500/30">
                          {/* Dot Indicator */}
                          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-pink shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <h3 className="text-base font-bold text-white leading-snug">Bachelor of Technology in Computer Science</h3>
                            <span className="text-[10px] text-accent-pink font-mono bg-accent-pink/10 border border-accent-pink/20 px-2.5 py-0.5 rounded font-semibold w-fit shrink-0">2023 – Present</span>
                          </div>
                          <p className="text-xs text-gray-300 font-medium">Parul Institute of Technology</p>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-[11px] text-gray-400 font-light">
                            <span>CGPA: <strong className="text-white font-semibold font-mono">7.58</strong></span>
                            <span className="hidden sm:inline text-white/10">|</span>
                            <span>Coursework: <strong className="text-white/80 font-normal">Data Structures, Algorithms, DBMS, Operating Systems, OOP, Computer Networks, System Design</strong></span>
                          </div>

                          <div className="mt-3 select-none">
                            <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Key Achievements</span>
                            <ul className="list-disc pl-4 text-xs text-gray-300 font-light space-y-1">
                              <li><strong>Smart India Hackathon 2024</strong>: National Finalist as a Backend Developer.</li>
                              <li><strong>MSU Footprints Hackathon</strong>: 1st Runner-Up position in Vadodara hackathon.</li>
                              <li><strong>Open-Source Systems</strong>: Engineered Vaani-X speech buffers & NoteRoot AI retrieval logic.</li>
                            </ul>
                          </div>
                        </div>

                        {/* Timeline Item 2: Class 12 */}
                        <div className="relative pl-6 border-l border-purple-500/30">
                          {/* Dot Indicator */}
                          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-lavender shadow-[0_0_8px_rgba(230,230,250,0.4)]" />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <h3 className="text-base font-bold text-white leading-snug">Higher Secondary Education (Class 12)</h3>
                            <span className="text-[10px] text-accent-lavender font-mono bg-accent-lavender/10 border border-accent-lavender/20 px-2.5 py-0.5 rounded font-semibold w-fit shrink-0">2021 – 2023</span>
                          </div>
                          <p className="text-xs text-gray-300 font-medium">Divine Sainik School</p>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-400 font-light">
                            <span>Percentage: <strong className="text-white font-semibold font-mono">76.7%</strong></span>
                            <span className="hidden sm:inline text-white/10">|</span>
                            <span>Stream: <strong className="text-white/80 font-normal">Science (PCM)</strong></span>
                          </div>

                          <div className="mt-3 select-none">
                            <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Key Achievements</span>
                            <ul className="list-disc pl-4 text-xs text-gray-300 font-light space-y-1">
                              <li>Ranked in top 15% of class in Science PCM under CBSE board.</li>
                              <li>Maintained distinction score in Advanced Mathematics and Physics.</li>
                            </ul>
                          </div>
                        </div>

                        {/* Timeline Item 3: Class 10 */}
                        <div className="relative pl-6">
                          {/* Dot Indicator */}
                          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <h3 className="text-base font-bold text-white leading-snug">Secondary Education (Class 10)</h3>
                            <span className="text-[10px] text-accent-purple font-mono bg-accent-purple/10 border border-accent-purple/20 px-2.5 py-0.5 rounded font-semibold w-fit shrink-0">2019 – 2021</span>
                          </div>
                          <p className="text-xs text-gray-300 font-medium">Divine Sainik School</p>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-400 font-light">
                            <span>Percentage: <strong className="text-white font-semibold font-mono">80.0%</strong></span>
                          </div>

                          <div className="mt-3 select-none">
                            <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Key Achievements</span>
                            <ul className="list-disc pl-4 text-xs text-gray-300 font-light space-y-1">
                              <li>Awarded Academic Distinction Grade in core Science and Mathematics subjects.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </SectionLayout>

                {/* 9. CONTACT SECTION */}
                <SectionLayout id="contact" title="Contact Me" className="pb-16 pt-8">
                  <div className="max-w-6xl mx-auto">
                    <div 
                      ref={contactRef}
                      onMouseMove={handleContactMouseMove}
                      onMouseEnter={() => setIsContactHovered(true)}
                      onMouseLeave={() => setIsContactHovered(false)}
                      className="glass-panel p-6 md:p-10 rounded-2xl border border-white/5 bg-[#0A0A0F]/65 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/20 transition-all duration-500"
                    >
                      {/* Mouse Interactive Spotlight glow */}
                      <div 
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-0"
                        style={{
                          background: isContactHovered 
                            ? `radial-gradient(400px circle at ${contactSpotlight.x}px ${contactSpotlight.y}px, rgba(168,85,247,0.06), transparent 80%)` 
                            : ""
                        }}
                      />
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                        {/* Left Column: Personal Statement & Availability details */}
                        <div className="flex flex-col justify-center text-left">
                          <span className="text-[10px] font-mono font-bold text-accent-pink uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            Open to AI/ML Engineering Opportunities
                          </span>
                          
                          <h3 className="text-3xl font-bold font-heading text-white mb-4 tracking-tight leading-tight">
                            Let&apos;s build the future <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink via-white to-accent-lavender">together.</span>
                          </h3>
                          
                          <p className="text-sm text-gray-400 font-light mb-8 leading-relaxed">
                            I am currently exploring opportunities in Machine Learning, Backend Architecture, and Generative AI systems. If you have an open position or are working on an exciting new product, feel free to reach out. I typically respond within 24 hours.
                          </p>
                          
                          <div className="flex flex-col gap-4">
                            <a 
                              href="mailto:sakshisrivastava200306@gmail.com" 
                              className="inline-flex items-center gap-3 text-gray-300 hover:text-accent-pink transition-colors w-fit group/link"
                            >
                              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/link:border-accent-pink transition-colors shrink-0">
                                <Mail className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium font-mono">sakshisrivastava200306@gmail.com</span>
                            </a>

                            <div className="inline-flex items-center gap-3 text-gray-300 w-fit">
                              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                                <MapPin className="w-4 h-4 text-accent-lavender" />
                              </div>
                              <span className="text-sm font-medium font-mono">Gujarat, India (Remote Available)</span>
                            </div>

                            {/* Direct Resume Download Link */}
                            <a 
                              href="/Sakshi_Srivastava_Resume_2026.pdf" 
                              download="Sakshi_Srivastava_Resume_2026.pdf"
                              className="inline-flex items-center gap-3 text-gray-300 hover:text-accent-pink transition-colors w-fit group/resume"
                            >
                              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover/resume:border-accent-pink transition-colors shrink-0">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-pink opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-pink"></span>
                                </span>
                              </div>
                              <span className="text-sm font-semibold font-mono underline decoration-accent-purple/40 group-hover:decoration-accent-pink transition-colors">Download Resume PDF</span>
                            </a>

                            <div className="flex gap-3 pt-3 border-t border-white/5 max-w-xs">
                              {[
                                { icon: <Github className="w-4 h-4" />, label: "GitHub", link: "https://github.com/Sakshisrivastava01" },
                                { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", link: "https://www.linkedin.com/in/sakshi19819/" },
                                { icon: <Code2 className="w-4 h-4" />, label: "LeetCode", link: "https://leetcode.com/u/Sakshisrivastava01/" }
                              ].map((social, i) => (
                                <a 
                                  key={i} 
                                  href={social.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  title={social.label} 
                                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-200 border border-white/5 hover:border-accent-lavender"
                                >
                                  {social.icon}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Contact Form */}
                        <div className="bg-black/20 rounded-2xl p-5 md:p-6 border border-white/5 backdrop-blur-sm relative z-10">
                          <ContactForm />
                        </div>
                      </div>
                      
                      <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-gray-500 text-xs font-light relative z-10">
                        <p className="flex items-center gap-1.5">
                          © {new Date().getFullYear()} Sakshi Srivastava. 
                          <span className="hidden md:inline">All rights reserved.</span>
                        </p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                          <a href="https://www.codechef.com/users/sakshisrivastava01" target="_blank" rel="noopener noreferrer" className="hover:text-accent-pink transition-colors">CodeChef</a>
                          <a href="https://codeforces.com/profile/sakshisrivastava01" target="_blank" rel="noopener noreferrer" className="hover:text-accent-purple transition-colors">CodeForces</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionLayout>

              </main>
            </SmoothScroll>
    </>
  );
}
