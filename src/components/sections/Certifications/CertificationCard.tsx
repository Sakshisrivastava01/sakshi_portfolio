"use client";

import { useState, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { Certification } from "@/data/certifications";

interface CertificationCardProps {
  cert: Certification;
}

export default function CertificationCard({ cert }: CertificationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlight({ x, y });

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Max tilt = 8 degrees for premium physics feel
    const tiltX = -(y - yc) / (rect.height / 2) * 8;
    const tiltY = (x - xc) / (rect.width / 2) * 8;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group w-full h-[190px] [perspective:1000px] cursor-default"
    >
      <div 
        className="relative w-full h-full duration-500 ease-out rounded-xl shadow-lg transition-all"
        style={{ 
          transformStyle: "preserve-3d",
          transform: isHovered 
            ? `rotateY(180deg) rotateX(${tilt.x}deg) rotateY(${-tilt.y}deg)` 
            : 'rotateY(0deg) rotateX(0deg) rotateY(0deg)',
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Spotlight glow tracking */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl z-20"
          style={{
            background: `radial-gradient(150px circle at ${spotlight.x}px ${spotlight.y}px, rgba(168,85,247,0.12), transparent 80%)`,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        />

        {/* FRONT SIDE */}
        <div 
          className="absolute inset-0 w-full h-full p-4 flex flex-col justify-between border border-white/5 bg-[#07070B]/70 backdrop-blur-xl rounded-xl"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)"
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] text-purple-400 font-semibold tracking-widest uppercase font-mono truncate max-w-[70%]">
              {cert.issuer}
            </span>
            <span className="shrink-0 flex items-center gap-1 text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-medium">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Verifiable
            </span>
          </div>

          {/* Certificate Title */}
          <div className="my-auto">
            <h4 className="text-sm font-bold text-white/95 leading-snug line-clamp-2 font-sans group-hover:text-purple-300 transition-colors">
              {cert.title}
            </h4>
          </div>

          {/* Bottom Row: Skills covered tags */}
          <div className="flex flex-wrap gap-1 mt-auto">
            {cert.skills.slice(0, 3).map((skill, i) => (
              <span 
                key={i} 
                className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400 font-sans"
              >
                {skill}
              </span>
            ))}
            {cert.skills.length > 3 && (
              <span className="text-[8px] px-1.5 py-0.5 text-gray-500 font-sans font-medium">
                +{cert.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* BACK SIDE */}
        <div 
          className="absolute inset-0 w-full h-full p-4 flex flex-col justify-between bg-[#08080E]/95 border border-purple-500/20 rounded-xl"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {/* Status Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
            <span className="text-[8px] text-gray-500 font-mono uppercase">CREDENTIAL STATUS</span>
            <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono font-bold">
              <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
              Active & Verified
            </span>
          </div>

          {/* Core Info */}
          <div className="flex flex-col gap-1.5 my-auto text-left">
            <div>
              <span className="text-[8px] text-gray-500 font-mono uppercase block">ISSUED BY</span>
              <span className="text-[10px] text-white font-medium">{cert.issuer}</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-500 font-mono uppercase block">KEY LEARNINGS</span>
              <p className="text-[9px] text-gray-300 line-clamp-2 leading-relaxed font-sans">
                {cert.skills.join(", ")}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t border-white/5">
            {cert.verifyUrl && (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-7 flex items-center justify-center rounded bg-purple-600/15 border border-purple-500/30 hover:bg-purple-600/30 text-purple-200 hover:text-white font-semibold text-[9px] transition-all duration-200"
              >
                Verify Link
              </a>
            )}
            {(cert.pdfUrl || cert.imageUrl) && (
              <a
                href={cert.pdfUrl || cert.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-7 flex items-center justify-center rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white font-semibold text-[9px] transition-all duration-200"
              >
                Download Cert
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
