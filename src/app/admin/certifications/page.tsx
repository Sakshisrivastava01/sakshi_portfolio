"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MOCK_CERTS = [
  { id: "1", title: "Generative AI with LangChain", issuer: "Udemy" },
  { id: "2", title: "AWS Academy Graduate", issuer: "Cloud Foundations" },
];

export default function CertificationsAdmin() {
  const [certs, setCerts] = useState<any[]>(MOCK_CERTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setCerts(MOCK_CERTS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("certifications").select("*").order("created_at", { ascending: false });
      if (data) setCerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Certifications Management</h1>
          <p className="text-gray-400 mt-2">Manage your professional credentials and PDF uploads.</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)]">
          <Plus className="w-5 h-5" />
          Add Certification
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading certifications...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => (
            <div key={cert.id} className="glass-panel p-6 rounded-2xl border border-white/10 group hover:border-accent-purple/50 transition-all flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent-lavender group-hover:bg-accent-purple group-hover:text-white transition-colors shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-purple group-hover:to-accent-pink transition-all">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mt-1">{cert.issuer}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-white/10 text-accent-lavender transition-colors" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {certs.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
              No certifications found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
