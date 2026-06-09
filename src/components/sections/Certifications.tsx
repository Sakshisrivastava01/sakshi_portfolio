"use client";

import { useState } from "react";
import SectionLayout from "./SectionLayout";
import CertificationCard, { Certificate } from "./Certifications/CertificationCard";
import CertificationModal from "./Certifications/CertificationModal";
import { AnimatePresence } from "framer-motion";

// Upgraded certifications data
const certificationsData: Certificate[] = [
  {
    title: "Python Course",
    issuer: "IIT Madras Pravartak GUVI",
    date: "2024",
    credentialId: "GUVI-PY-2024",
    skills: ["Python", "Problem Solving", "Algorithms"],
    image: "/placeholders/cert-ai.jpg", // Replace with real thumbnail
    verifyLink: "#", // Replace with real verify link
  },
  {
    title: "Data Structures and Algorithms in Java",
    issuer: "Apna College",
    date: "2024",
    credentialId: "AC-DSA-2024",
    skills: ["Java", "DSA", "Logic Building", "Time Complexity"],
    image: "/placeholders/cert-ai.jpg", // Replace with real thumbnail
    verifyLink: "#", // Replace with real verify link
  },
  {
    title: "Generative AI with LangChain & Hugging Face",
    issuer: "Udemy",
    date: "2023",
    credentialId: "UC-GenAI-2023",
    skills: ["Generative AI", "LangChain", "Hugging Face", "LLMs"],
    image: "/placeholders/cert-ai.jpg", // Replace with real thumbnail
    verifyLink: "#", // Replace with real verify link
  },
  {
    title: "AWS Academy Graduate",
    issuer: "Cloud Foundations",
    date: "2023",
    credentialId: "AWS-CF-2023",
    skills: ["AWS", "Cloud Architecture", "Deployment", "Networking"],
    image: "/placeholders/cert-ai.jpg", // Replace with real thumbnail
    verifyLink: "#", // Replace with real verify link
  }
];

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

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
