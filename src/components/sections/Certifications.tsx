"use client";

import { useState, useEffect } from "react";
import SectionLayout from "./SectionLayout";
import CertificationCard, { Certificate } from "./Certifications/CertificationCard";
import CertificationModal from "./Certifications/CertificationModal";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const FALLBACK_DATA: Certificate[] = [
  {
    title: "Python Course",
    issuer: "IIT Madras Pravartak GUVI",
    date: "2024",
    credentialId: "GUVI-PY-2024",
    skills: ["Python", "Problem Solving", "Algorithms"],
    image: "/placeholders/cert-ai.jpg",
    verifyLink: "#",
  },
  {
    title: "Data Structures and Algorithms in Java",
    issuer: "Apna College",
    date: "2024",
    credentialId: "AC-DSA-2024",
    skills: ["Java", "DSA", "Logic Building", "Time Complexity"],
    image: "/placeholders/cert-ai.jpg",
    verifyLink: "#",
  }
];

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [certificationsData, setCertificationsData] = useState<Certificate[]>(FALLBACK_DATA);

  useEffect(() => {
    async function fetchCerts() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
      
      try {
        const { data } = await supabase.from("certifications").select("*").order("created_at", { ascending: false });
        if (data && data.length > 0) {
          // Map DB columns to frontend interface
          const mapped = data.map((cert: any) => ({
             title: cert.title,
             issuer: cert.issuer,
             date: cert.issue_date || "2024",
             credentialId: cert.credential_id,
             skills: cert.skills || [],
             image: cert.image_url || "/placeholders/cert-ai.jpg",
             verifyLink: cert.verify_url || "#"
          }));
          setCertificationsData(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch certifications from Supabase", e);
      }
    }
    fetchCerts();
  }, []);

  return (
    <SectionLayout id="certifications" title="Professional Certifications">
      {/* Subtitle */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-gray-400 text-lg md:text-xl font-light">
          Continuous learning through industry-recognized certifications in <span className="text-white font-medium">AI, Machine Learning, Backend Engineering, Cloud Computing, and Software Development.</span>
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {certificationsData.map((cert, index) => (
          <CertificationCard
            key={index}
            cert={cert}
            index={index}
            onView={(c) => setSelectedCert(c)}
          />
        ))}
      </div>

      {/* Modal View */}
      <AnimatePresence>
        {selectedCert && (
          <CertificationModal
            cert={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </AnimatePresence>
    </SectionLayout>
  );
}
