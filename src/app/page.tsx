"use client";

import { useState, useEffect, useRef } from "react";
import SmoothScroll from "@/components/layout/SmoothScroll";
import FirstImpressionExperience from "@/components/first-impression/FirstImpressionExperience";
import SectionLayout from "@/components/sections/SectionLayout";
import TechnicalIntelligenceNetwork from "@/components/sections/TechnicalIntelligenceNetwork";
import InnovationLab from "@/components/sections/InnovationLab";
import Certifications from "@/components/sections/Certifications";
import CompetitiveProgramming from "@/components/sections/CompetitiveProgramming";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { 
  GraduationCap, Database, Terminal, 
  Trophy, Mail,
  BrainCircuit, CheckCircle2, Network, Activity, Code2
} from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons/SocialIcons";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

function Counter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, motionValue, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = prefix + Intl.NumberFormat("en-US").format(Math.floor(latest)) + suffix;
      }
    });
  }, [springValue, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export type AudioState = "idle" | "playing" | "paused" | "finished";

export default function Home() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl] = useState("/import.mp3");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.getElementById("global-audio") as HTMLAudioElement;
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
                        I am a Computer Science Engineering student specializing in Artificial Intelligence, currently pursuing my B.Tech at Parul Institute of Technology.
                      </p>
                      <p>
                        My passion lies at the intersection of <strong className="text-white font-medium">Artificial Intelligence, Machine Learning, and Backend Engineering</strong>. I thrive on building scalable software systems that bridge the gap between theoretical models and real-world applications.
                      </p>
                      <p>
                        I am deeply focused on solving complex, real-world problems through intelligent systems, modern software engineering practices, and a relentless drive for continuous learning.
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
                <SectionLayout id="intelligence" title="Technical Intelligence Network">
                  <TechnicalIntelligenceNetwork onSkillSelect={setActiveSkill} activeSkill={activeSkill} />
                </SectionLayout>

                {/* 4. PROJECTS SECTION (INNOVATION LAB) */}
                <InnovationLab />

                {/* 5. EXPERIENCE SECTION */}
                <SectionLayout id="experience" title="Experience Log">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="w-full rounded-2xl glass-panel border border-white/10 shadow-[0_0_30px_rgba(138,43,226,0.1)] overflow-hidden font-mono text-sm md:text-base group hover:border-accent-purple/30 transition-colors">
                      {/* Terminal Header */}
                      <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10">
                        <div className="flex gap-2 mr-4">
                          <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div className="text-gray-500 text-xs tracking-wider flex-1 text-center">sakshi@deployment-dashboard:~</div>
                      </div>
                      
                      {/* Terminal Body */}
                      <div className="p-6 md:p-8 text-gray-300">
                        <div className="mb-8">
                          <span className="text-accent-pink font-bold">sakshi</span>
                          <span className="text-white">@portfolio</span>
                          <span className="text-gray-500"> ~ % </span>
                          <span className="text-accent-lavender">cat active_deployments.log</span>
                        </div>
                        
                        <div className="space-y-8 pl-0 md:pl-4 border-l border-white/10">
                          {/* CheeseCakeLabs Internship */}
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-accent-purple shadow-[0_0_10px_rgba(138,43,226,0.8)] hidden md:block" />
                            
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 relative z-10">
                              <div>
                                <h3 className="text-3xl font-bold font-heading text-white mb-2">CheeseCakeLabs</h3>
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-accent-lavender text-sm font-semibold tracking-wider">
                                    Backend Developer Intern
                                  </span>
                                  <span className="px-3 py-1 rounded-md bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-sm font-mono flex items-center gap-2 shadow-[0_0_10px_rgba(138,43,226,0.1)]">
                                    <Terminal className="w-3 h-3" /> Backend Specialization
                                  </span>
                                  <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 text-xs font-mono">
                                    May 2025 – Aug 2025
                                  </span>
                                </div>
                              </div>
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(138,43,226,0.4)]">
                                <Terminal className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            
                            {/* Deployment Metrics Dashboard Style */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                              <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-pink/30 transition-colors flex items-start gap-4">
                                <div className="p-2 rounded-full bg-green-500/10 text-green-400 shrink-0">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-white mb-1">
                                    <Counter value={8} suffix="+" />
                                  </div>
                                  <div className="text-xs text-gray-400 uppercase tracking-wider">APIs</div>
                                </div>
                              </div>
                              
                              <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-lavender/30 transition-colors flex items-start gap-4">
                                <div className="p-2 rounded-full bg-accent-lavender/10 text-accent-lavender shrink-0">
                                  <Database className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-white mb-1">
                                    <Counter value={15} suffix="+" />
                                  </div>
                                  <div className="text-xs text-gray-400 uppercase tracking-wider">Query Optimizations</div>
                                </div>
                              </div>
                              
                              <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-400/30 transition-colors flex items-start gap-4">
                                <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 shrink-0">
                                  <Network className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-white mb-1">
                                    <Counter value={5} suffix="+" />
                                  </div>
                                  <div className="text-xs text-gray-400 uppercase tracking-wider">Integrations</div>
                                </div>
                              </div>

                              <div className="p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/30 hover:border-accent-pink/50 transition-colors flex items-start gap-4 shadow-[0_0_15px_rgba(138,43,226,0.1)]">
                                <div className="p-2 rounded-full bg-accent-pink/20 text-accent-pink shrink-0">
                                  <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-white mb-1">
                                    <Counter value={30} suffix="%" />
                                  </div>
                                  <div className="text-xs text-accent-lavender uppercase tracking-wider">Performance Improvement</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-6">
                              {["Architecture", "Query Optimization", "API Design", "Database Modeling"].map((tag, i) => (
                                <span key={i} className="text-xs px-3 py-1 rounded-full bg-black/40 border border-white/10 text-gray-400">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Awaiting Next Entry */}
                          <div className="relative pt-6">
                            <div className="absolute -left-[21px] top-[26px] w-2 h-2 rounded-full border-2 border-gray-600 bg-transparent hidden md:block" />
                            <div className="text-gray-500 italic flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gray-600 animate-pulse" />
                              Awaiting next engineering milestone...
                            </div>
                          </div>

                        </div>
                        
                        <div className="mt-8 flex items-center">
                          <span className="text-accent-pink font-bold">sakshi</span>
                          <span className="text-white">@portfolio</span>
                          <span className="text-gray-500"> ~ % </span>
                          <span className="w-2.5 h-5 bg-white/70 animate-pulse ml-2" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SectionLayout>

                {/* 6. ACHIEVEMENTS SECTION */}
                <SectionLayout id="achievements" title="Milestones">
                   <div className="space-y-6 max-w-4xl mx-auto">
                     {[
                       { title: "Smart India Hackathon 2024", role: "Backend Developer", highlight: "Selected participant for national level hackathon." },
                       { title: "Footprints Hackathon", role: "1st Runner-Up", highlight: "MSU Vadodara" }
                     ].map((achievement, index) => (
                       <motion.div 
                         key={index} 
                         initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                         whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                         viewport={{ once: true, margin: "-100px" }}
                         transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                         className="flex items-center gap-8 glass-panel p-6 md:p-8 rounded-3xl border border-white/5 hover:border-accent-purple/40 transition-colors group relative overflow-hidden"
                       >
                         {/* Flare effect on entry */}
                         <motion.div 
                           initial={{ x: "-100%", opacity: 0 }}
                           whileInView={{ x: "200%", opacity: [0, 0.5, 0] }}
                           viewport={{ once: true, margin: "-100px" }}
                           transition={{ duration: 1.5, ease: "easeInOut" }}
                           className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" 
                         />
                         
                         <div className="hidden md:flex w-16 h-16 shrink-0 rounded-full bg-white/5 items-center justify-center group-hover:bg-accent-purple group-hover:shadow-[0_0_30px_rgba(138,43,226,0.5)] transition-all duration-500">
                           <Trophy className="w-6 h-6 text-accent-purple group-hover:text-white" />
                         </div>
                         <div className="relative z-10">
                           <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                             <h4 className="text-white font-bold font-heading text-xl md:text-2xl group-hover:text-accent-lavender transition-colors">{achievement.title}</h4>
                             <span className="px-3 py-1 rounded-full bg-accent-purple/20 text-accent-lavender text-xs font-semibold tracking-wider uppercase w-fit border border-accent-purple/30">
                               {achievement.role}
                             </span>
                           </div>
                           <p className="text-gray-400 font-light">{achievement.highlight}</p>
                         </div>
                       </motion.div>
                     ))}
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
                <SectionLayout id="contact" title="Get in Touch" className="pb-32 pt-20">
                  <div className="max-w-4xl mx-auto">
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="glass-panel p-8 md:p-20 rounded-[3rem] border border-white/10 text-center relative overflow-hidden group hover:border-accent-pink/30 transition-colors duration-700"
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-glow rounded-full blur-[120px] opacity-10 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none" />
                      
                      <h3 className="text-4xl md:text-6xl font-bold font-heading text-white mb-8 relative z-10 tracking-tight">
                        Let&apos;s build something <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-lavender">meaningful together.</span>
                      </h3>
                      
                      <p className="text-xl md:text-2xl text-gray-400 font-light mb-16 leading-relaxed max-w-2xl mx-auto relative z-10">
                        I am currently exploring opportunities in Backend Engineering and Artificial Intelligence. If you&apos;re building the future, I want to help engineer it.
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-6 relative z-10">
                        <a 
                          href="mailto:sakshisrivastava01@gmail.com?subject=Portfolio%20Inquiry&body=Hello%20Sakshi%2C%0A%0A"
                          className="px-10 py-5 rounded-full bg-white text-black font-bold hover:bg-accent-pink hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,182,193,0.5)] hover:scale-105 flex items-center space-x-3 text-lg group/btn"
                        >
                          <Mail className="w-6 h-6 group-hover/btn:animate-pulse" />
                          <span>Contact Me</span>
                        </a>
                        
                        <div className="flex gap-4">
                          {[
                            { icon: <Github className="w-6 h-6" />, label: "GitHub", link: "https://github.com/Sakshisrivastava01" },
                            { icon: <Linkedin className="w-6 h-6" />, label: "LinkedIn", link: "https://www.linkedin.com/in/sakshisrivastava01" },
                            { icon: <Code2 className="w-6 h-6" />, label: "LeetCode", link: "https://leetcode.com/u/Sakshisrivastava01/" }
                          ].map((social, i) => (
                            <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" title={social.label} className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 border border-white/10 hover:border-accent-lavender shadow-lg hover:shadow-[0_0_20px_rgba(230,230,250,0.3)]">
                              {social.icon}
                            </a>
                          ))}
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
