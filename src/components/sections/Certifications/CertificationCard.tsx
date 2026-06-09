"use client";

import { motion } from "framer-motion";
import { ExternalLink, Award, Calendar } from "lucide-react";

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  skills: string[];
  image: string;
  verifyLink: string;
  pdfUrl?: string;
}

interface CertificationCardProps {
  cert: Certificate;
  index: number;
  onView: (cert: Certificate) => void;
}

export default function CertificationCard({ cert, index, onView }: CertificationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-6 glass-panel border border-white/10 hover:border-accent-purple/50 transition-all duration-500 shadow-lg hover:shadow-[0_15px_40px_rgba(138,43,226,0.15)]"
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/0 to-accent-pink/0 group-hover:from-accent-purple/10 group-hover:to-accent-pink/5 transition-colors duration-500 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Icon & Issuer */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:bg-accent-purple group-hover:text-white group-hover:border-accent-purple/50 transition-all shadow-[0_0_0_rgba(138,43,226,0)] group-hover:shadow-[0_0_20px_rgba(138,43,226,0.4)]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-1">{cert.issuer}</p>
            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
              <Calendar className="w-3 h-3" />
              {cert.date}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold font-heading text-white mb-4 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-purple group-hover:to-accent-pink transition-all">
          {cert.title}
        </h3>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
          {cert.skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-mono uppercase tracking-wider group-hover:border-accent-purple/30 transition-colors">
              {skill}
            </span>
          ))}
          {cert.skills.length > 3 && (
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-mono">
              +{cert.skills.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-auto">
          <button
            onClick={() => onView(cert)}
            data-cursor="view"
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 border border-white/5 transition-colors text-center"
          >
            View Certificate
          </button>
          <a
            href={cert.verifyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-xl bg-accent-purple/10 text-accent-lavender border border-accent-purple/30 flex items-center justify-center hover:bg-accent-purple hover:text-white hover:shadow-[0_0_15px_rgba(138,43,226,0.4)] transition-all shrink-0"
            title="Verify Credential"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
