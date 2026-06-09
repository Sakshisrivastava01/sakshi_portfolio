"use client";

import { motion } from "framer-motion";
import { X, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { Certificate } from "./CertificationCard";

interface CertificationModalProps {
  cert: Certificate | null;
  onClose: () => void;
}

export default function CertificationModal({ cert, onClose }: CertificationModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (cert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [cert]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && cert) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cert, onClose]);

  if (!cert) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2.5rem] glass-panel border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col md:flex-row bg-[#050505]/95"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:text-accent-pink transition-colors border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Large Certificate Preview */}
        <div className="w-full md:w-3/5 bg-black/50 relative border-b md:border-b-0 md:border-r border-white/5 p-8 flex items-center justify-center min-h-[300px]">
          {/* Subtle Ambient Glow behind image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-accent-purple/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 group">
             {/* Replace with next/image in production when actual thumbnails are available */}
             <div 
               className="w-full h-full bg-cover bg-center"
               style={{ backgroundImage: `url(${cert.image})` }}
             />
             {/* If no image exists, this fallback gradient will look beautiful */}
             {cert.image === "/placeholders/cert-ai.jpg" && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] to-[#2d1b4e] flex items-center justify-center flex-col gap-4 text-center p-6">
                  <ShieldCheck className="w-16 h-16 text-accent-lavender opacity-50" />
                  <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Preview Unavailable</p>
                  <p className="text-white/30 text-xs">Awaiting high-res thumbnail upload</p>
                </div>
             )}
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col overflow-y-auto">
          <div className="flex-1">
            <span className="px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-lavender text-xs font-semibold tracking-wider uppercase mb-6 inline-block">
              {cert.issuer}
            </span>
            
            <h2 className="text-3xl font-bold font-heading text-white mb-2 leading-tight">
              {cert.title}
            </h2>
            
            <p className="text-gray-400 font-mono text-sm mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Issued {cert.date}
            </p>

            <div className="space-y-6">
              {cert.credentialId && (
                <div>
                  <h4 className="text-gray-500 text-xs font-semibold tracking-widest uppercase mb-2">Credential ID</h4>
                  <p className="text-white font-mono bg-white/5 px-3 py-2 rounded-lg border border-white/5">{cert.credentialId}</p>
                </div>
              )}

              <div>
                <h4 className="text-gray-500 text-xs font-semibold tracking-widest uppercase mb-3">Skills Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-accent-purple" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col gap-3">
            <a
              href={cert.verifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-accent-purple text-white font-bold hover:bg-accent-pink transition-colors text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_30px_rgba(255,182,193,0.5)]"
            >
              <ShieldCheck className="w-5 h-5" />
              Verify Credential
            </a>
            
            {cert.pdfUrl && (
              <a
                href={cert.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 border border-white/10 transition-colors text-center flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
