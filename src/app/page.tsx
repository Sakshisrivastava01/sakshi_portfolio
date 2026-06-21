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
  GraduationCap, Trophy, Mail,
  BrainCircuit, CheckCircle2, Code2
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
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto relative pl-6 border-l-2 border-accent-purple/30 space-y-12"
                  >
                    {/* CheeseCakeLabs Internship */}
                    <div className="relative">
                      {/* Timeline Dot Indicator */}
                      <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full bg-accent-purple border-4 border-luxury-black shadow-[0_0_12px_rgba(138,43,226,0.8)]" />
                      
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 hover:border-accent-purple/30 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        {/* Title Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                          <div>
                            <h3 className="text-2xl font-bold font-heading text-white">CheeseCakeLabs</h3>
                            <div className="text-accent-lavender text-sm font-semibold mt-1">
                              Backend Developer Intern
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                            <span>May 2025 – Aug 2025</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-pink" />
                            <span>Remote / Internship</span>
                          </div>
                        </div>

                        {/* Professional Responsibilities Bullets */}
                        <ul className="space-y-3 text-gray-300 text-sm md:text-base font-light mb-8 list-disc pl-5 relative z-10 leading-relaxed">
                          <li>Engineered 8+ custom RESTful API endpoints using Python (Django/Flask) for core backend services.</li>
                          <li>Optimized complex database queries on PostgreSQL, achieving a 30% latency reduction and minimizing database lock constraints.</li>
                          <li>Integrated 5+ third-party service gateways enabling seamless real-time data synchronization.</li>
                          <li>Designed database schemas and executed structured migrations utilizing SQLAlchemy for data consistency.</li>
                        </ul>

                        {/* Technical Accomplishments metrics row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5 relative z-10 select-none">
                          <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="text-xl font-bold text-accent-pink">8+</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mt-1">APIs Built</div>
                          </div>
                          <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="text-xl font-bold text-accent-purple">15+</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mt-1">Queries Opt</div>
                          </div>
                          <div className="text-center p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="text-xl font-bold text-accent-lavender">5+</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mt-1">Integrations</div>
                          </div>
                          <div className="text-center p-3 rounded-2xl bg-accent-purple/10 border border-accent-purple/20">
                            <div className="text-xl font-bold text-white">30%</div>
                            <div className="text-[10px] text-accent-lavender uppercase tracking-widest font-mono mt-1">Speed Gain</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Engineering Milestone placeholder */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-1.5 w-3 h-3 rounded-full bg-gray-700 border-2 border-luxury-black" />
                      <div className="text-gray-500 italic text-sm pl-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse" />
                        Awaiting next engineering milestone...
                      </div>
                    </div>
                  </motion.div>
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
                  <div className="max-w-4xl mx-auto py-10">
                    <div className="relative pl-8 md:pl-0">
                      {/* Animated Glow Line */}
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: "100%" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute left-0 md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-accent-purple via-accent-pink to-accent-lavender transform md:-translate-x-1/2 rounded-full" 
                      />
                      
                      {/* Timeline Items */}
                      <div className="space-y-16">
                        
                        {/* Entry: Class 10 */}
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.6 }}
                          className="relative flex flex-col md:flex-row justify-between items-center w-full group"
                        >
                          <div className="order-1 md:w-5/12 text-right pr-8 hidden md:block">
                            <span className="text-gray-500 font-mono text-sm tracking-widest">FOUNDATION</span>
                          </div>
                          <div className="z-20 flex items-center order-1 bg-black shadow-[0_0_20px_rgba(138,43,226,0.5)] w-10 h-10 rounded-full absolute -left-[19px] md:relative md:left-auto md:mx-auto border-2 border-accent-purple justify-center">
                            <div className="w-3 h-3 bg-accent-purple rounded-full animate-pulse" />
                          </div>
                          <div className="order-1 glass-panel rounded-3xl w-full md:w-5/12 px-8 py-6 border border-white/5 hover:border-accent-purple/50 transition-all duration-300 ml-6 md:ml-0 shadow-lg hover:shadow-[0_0_30px_rgba(138,43,226,0.15)] group">
                            <div className="text-accent-purple text-sm font-semibold tracking-widest uppercase mb-2">Class 10</div>
                            <h3 className="text-2xl font-bold font-heading text-white mb-2">Secondary Education</h3>
                            <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-medium mt-2">
                              Percentage: <span className="text-accent-purple">80%</span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Entry: Class 12 */}
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="relative flex flex-col md:flex-row justify-between items-center w-full group"
                        >
                          <div className="order-1 glass-panel rounded-3xl w-full md:w-5/12 px-8 py-6 border border-white/5 hover:border-accent-lavender/50 transition-all duration-300 ml-6 md:ml-0 md:mr-0 shadow-lg hover:shadow-[0_0_30px_rgba(230,230,250,0.15)] group text-left md:text-right mb-6 md:mb-0">
                            <div className="text-accent-lavender text-sm font-semibold tracking-widest uppercase mb-2">Class 12</div>
                            <h3 className="text-2xl font-bold font-heading text-white mb-2">Higher Secondary</h3>
                            <p className="text-gray-400 font-light mb-4">Divine Sainik School</p>
                            <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-medium md:ml-auto">
                              Percentage: <span className="text-accent-lavender">76.7%</span>
                            </div>
                          </div>
                          <div className="z-20 flex items-center order-1 bg-black shadow-[0_0_20px_rgba(230,230,250,0.5)] w-10 h-10 rounded-full absolute -left-[19px] md:relative md:left-auto md:mx-auto border-2 border-accent-lavender justify-center">
                            <div className="w-3 h-3 bg-accent-lavender rounded-full animate-pulse" />
                          </div>
                          <div className="order-1 md:w-5/12 pl-8 hidden md:block">
                            <span className="text-gray-500 font-mono text-sm tracking-widest">HIGHER SECONDARY</span>
                          </div>
                        </motion.div>

                        {/* Entry: B.Tech */}
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="relative flex flex-col md:flex-row justify-between items-center w-full group"
                        >
                          <div className="order-1 md:w-5/12 text-right pr-8 hidden md:block">
                            <span className="text-gray-500 font-mono text-sm tracking-widest">UNDERGRADUATE</span>
                          </div>
                          <div className="z-20 flex items-center order-1 bg-black shadow-[0_0_30px_rgba(255,182,193,0.8)] w-14 h-14 rounded-full absolute -left-[27px] md:relative md:left-auto md:mx-auto border-2 border-accent-pink justify-center">
                            <GraduationCap className="w-6 h-6 text-accent-pink drop-shadow-[0_0_10px_rgba(255,182,193,1)]" />
                          </div>
                          <div className="order-1 glass-panel rounded-3xl w-full md:w-5/12 px-8 py-6 border border-accent-pink/20 hover:border-accent-pink/50 transition-all duration-300 ml-6 md:ml-0 shadow-[0_0_30px_rgba(255,182,193,0.1)] hover:shadow-[0_0_50px_rgba(255,182,193,0.25)] group relative overflow-hidden">
                            {/* Ambient glow inside card */}
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative z-10">
                              <div className="text-accent-pink text-sm font-semibold tracking-widest uppercase mb-2">2023 – Present</div>
                              <h3 className="text-2xl font-bold font-heading text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-pink group-hover:to-accent-lavender transition-all">B.Tech CSE</h3>
                              <div className="text-accent-lavender text-lg font-medium mb-3">Parul Institute of Technology</div>
                              <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-accent-pink/30 text-white font-medium">
                                CGPA: <span className="text-accent-pink">7.58</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                      </div>
                    </div>
                  </div>
                </SectionLayout>

                {/* 9. CONTACT SECTION */}
                <SectionLayout id="contact" title="Contact Me" className="pb-32 pt-20">
                  <div className="max-w-6xl mx-auto">
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="glass-panel p-8 md:p-12 lg:p-20 rounded-[3rem] border border-white/10 relative overflow-hidden group hover:border-accent-pink/30 transition-colors duration-700"
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-glow rounded-full blur-[120px] opacity-10 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none" />
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                        {/* Left Column: Text and Details */}
                        <div className="flex flex-col justify-center">
                          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 tracking-tight">
                            Let&apos;s build something <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-lavender">meaningful together.</span>
                          </h3>
                          
                          <p className="text-lg md:text-xl text-gray-400 font-light mb-12 leading-relaxed max-w-lg">
                            I am currently exploring opportunities in Backend Engineering and Artificial Intelligence. If you&apos;re building the future, I want to help engineer it.
                          </p>
                          
                          <div className="flex flex-col gap-8">
                            <div className="inline-flex items-center gap-4 text-white hover:text-accent-pink transition-colors w-fit group/email">
                              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover/email:border-accent-pink transition-colors">
                                <Mail className="w-5 h-5" />
                              </div>
                              <span className="text-lg font-medium">sakshisrivastava200306@gmail.com</span>
                            </div>

                            <div className="flex gap-4">
                              {[
                                { icon: <Github className="w-5 h-5" />, label: "GitHub", link: "https://github.com/Sakshisrivastava01" },
                                { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", link: "https://www.linkedin.com/in/sakshi19819/" },
                                { icon: <Code2 className="w-5 h-5" />, label: "LeetCode", link: "https://leetcode.com/u/Sakshisrivastava01/" }
                              ].map((social, i) => (
                                <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" title={social.label} className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 border border-white/10 hover:border-accent-lavender shadow-lg hover:shadow-[0_0_20px_rgba(230,230,250,0.3)]">
                                  {social.icon}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Contact Form */}
                        <div className="bg-black/20 rounded-3xl p-6 md:p-8 border border-white/10 backdrop-blur-sm">
                          <ContactForm />
                        </div>
                      </div>
                      
                      <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm font-light relative z-10">
                        <p className="flex items-center gap-2">
                          © {new Date().getFullYear()} Sakshi Srivastava. 
                          <span className="hidden md:inline">All rights reserved.</span>
                        </p>
                        <div className="flex gap-8 mt-6 md:mt-0">
                          <a href="https://www.codechef.com/users/sakshisrivastava01" target="_blank" rel="noopener noreferrer" className="hover:text-accent-pink transition-colors">CodeChef</a>
                          <a href="https://codeforces.com/profile/sakshisrivastava01" target="_blank" rel="noopener noreferrer" className="hover:text-accent-purple transition-colors">CodeForces</a>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </SectionLayout>

              </main>
            </SmoothScroll>
    </>
  );
}
