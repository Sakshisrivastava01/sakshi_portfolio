"use client";

import { ExternalLink, Download, Award } from "lucide-react";
import { Certification } from "@/data/certifications";

interface CertificationCardProps {
  cert: Certification;
}

export default function CertificationCard({ cert }: CertificationCardProps) {
  return (
    <div className="group relative w-full rounded-2xl bg-[#0A0A0F]/75 backdrop-blur-xl border border-white/5 hover:border-purple-500/30 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] hover:-translate-y-1">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-600/10 blur-2xl rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-colors" />

      <div className="relative z-10 flex gap-4">
        {/* Certification Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:scale-105 transition-transform duration-300">
          <Award className="w-6 h-6 text-purple-400 drop-shadow-[0_0_4px_rgba(168,85,247,0.5)]" />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase font-mono">{cert.issuer}</span>
            {cert.credentialId && (
              <span className="text-[9px] text-gray-500 font-mono hidden sm:inline" title={`Credential ID: ${cert.credentialId}`}>
                ID: {cert.credentialId.length > 12 ? `${cert.credentialId.substring(0, 10)}...` : cert.credentialId}
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors font-sans mb-2">
            {cert.title}
          </h4>

          {/* Skills tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {cert.skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-gray-400 font-sans">
                {skill}
              </span>
            ))}
            {cert.skills.length > 3 && (
              <span className="text-[9px] px-1.5 py-0.5 text-gray-500 font-sans">
                +{cert.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex gap-2 pt-3 border-t border-white/5 mt-auto">
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[30px] flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/25 text-purple-300 hover:text-white font-semibold text-[10px] transition-all duration-200"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Verify</span>
          </a>
        )}
        {(cert.pdfUrl || cert.imageUrl) && (
          <a
            href={cert.pdfUrl || cert.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[30px] flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white font-semibold text-[10px] transition-all duration-200"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </a>
        )}
      </div>
    </div>
  );
}
