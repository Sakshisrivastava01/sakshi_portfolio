"use client";

import SectionLayout from "./SectionLayout";
import CertificationCard from "./Certifications/CertificationCard";
import { certifications } from "@/data/certifications";

export default function Certifications() {
  return (
    <SectionLayout id="certifications" title="CERTIFICATIONS">
      {/* Subtitle */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
          Verified credentials showcasing expertise in <span className="text-white font-medium">Artificial Intelligence, Machine Learning, Data Science, Cloud Computing, Software Development,</span> and <span className="text-white font-medium">Generative AI</span>.
        </p>
        
        {/* Animated glowing underline beneath heading logic (applies below the subtitle area to anchor the section) */}
        <div className="flex justify-center mt-8">
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-pulse" />
        </div>
      </div>

      {/* Responsive Grid: 3 cols Desktop, 2 cols Tablet, 1 col Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 md:px-0">
        {certifications.map((cert, index) => (
          <CertificationCard
            key={cert.id || index}
            cert={cert}
            index={index}
          />
        ))}
      </div>
    </SectionLayout>
  );
}
