"use client";

import { ExternalLink, Download, Award, Image as ImageIcon } from "lucide-react";
import { Certification } from "@/data/certifications";

interface CertificationCardProps {
  cert: Certification;
}

export default function CertificationCard({ cert }: CertificationCardProps) {
  return (
    <div className="group relative w-full h-[450px] perspective-1000 [perspective:1000px] cursor-pointer">
      {/* 3D Container */}
      <div className="w-full h-full relative transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] rounded-2xl">
        
        {/* ======================= FRONT SIDE ======================= */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] rounded-3xl overflow-hidden bg-[#0A0A0F] border border-white/10 flex flex-col items-center justify-center p-6 relative">
          {/* Neon Glow Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/30 blur-[60px] rounded-full group-hover:bg-purple-500/40 transition-colors duration-500" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-600/20 blur-[60px] rounded-full group-hover:bg-pink-500/30 transition-colors duration-500" />
          
          {/* Border Glow on Hover */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-500/50 transition-colors duration-500 z-10" />

          {/* Floating Issuer Badge */}
          <div className="absolute top-4 right-4 bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 z-20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/80 font-medium tracking-wide">{cert.issuer}</span>
          </div>

          {/* Center Graphic - NO IMAGE ON FRONT */}
          <div className="relative w-32 h-32 mb-8 z-20 group-hover:scale-105 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
            <div className="relative w-full h-full bg-[#13131A] border border-white/20 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
               <Award className="w-16 h-16 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            </div>
          </div>

          {/* Certificate Title */}
          <div className="relative z-20 text-center w-full">
            <h3 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-white/70 tracking-tight leading-tight group-hover:text-white transition-colors duration-300">
              {cert.title}
            </h3>
            <div className="h-0.5 w-12 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full group-hover:w-24 transition-all duration-500" />
          </div>
        </div>

        {/* ======================= BACK SIDE ======================= */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-[#0A0A0F] border border-white/10 flex flex-col p-6 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative z-50 flex flex-col h-full gap-4">
            {/* Header */}
            <div className="flex-none">
              <h4 className="text-lg font-semibold text-white/90 mb-1 leading-tight">{cert.title}</h4>
              <p className="text-sm text-purple-400/80">{cert.issuer}</p>
              {cert.credentialId && (
                 <p className="text-xs text-gray-400 mt-1 font-mono break-all">ID: {cert.credentialId}</p>
              )}
            </div>

            {/* Skills Tags */}
            <div className="flex-grow overflow-hidden relative">
              <div className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2 pb-2 flex flex-wrap gap-2 content-start">
                {cert.skills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-white/5 border border-purple-500/30 text-purple-200 hover:bg-purple-500/20 hover:border-purple-500/60 transition-all duration-300 whitespace-nowrap"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions (Vertical Mobile, Horizontal Desktop) */}
            <div className="flex-none flex flex-col xl:flex-row gap-4 w-full mt-2">
              {cert.verifyUrl && (
                <a 
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[44px] relative z-50 pointer-events-auto group/btn flex items-center justify-center gap-2 px-3 rounded-xl bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/40 text-purple-200 font-semibold text-[11px] xl:text-xs transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] whitespace-nowrap backdrop-blur-md"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <ExternalLink className="w-4 h-4 shrink-0 group-hover/btn:scale-110 transition-transform" />
                  <span className="truncate">Verify Certificate</span>
                </a>
              )}
              
              {cert.imageUrl && (
                <a 
                  href={cert.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[44px] relative z-50 pointer-events-auto group/btn flex items-center justify-center gap-2 px-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold text-[11px] xl:text-xs transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap backdrop-blur-md"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <ImageIcon className="w-4 h-4 shrink-0 group-hover/btn:scale-110 transition-transform" />
                  <span className="truncate">View Badge</span>
                </a>
              )}

              {cert.pdfUrl && (
                <a 
                  href={cert.pdfUrl}
                  download
                  className="flex-1 min-h-[44px] relative z-50 pointer-events-auto group/btn flex items-center justify-center gap-2 px-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold text-[11px] xl:text-xs transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap backdrop-blur-md"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Download className="w-4 h-4 shrink-0 group-hover/btn:-translate-y-0.5 transition-transform" />
                  <span className="truncate">Download PDF</span>
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
