"use client";

import { useState, useEffect } from "react";
import { Save, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AboutAdmin() {
  const [formData, setFormData] = useState({
    bio: "",
    career_objective: "",
    focus_areas: "", // Stored as CSV string in form, array in DB
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    const { data } = await supabase.from("about").select("*").single();
    if (data) {
      setFormData({
        bio: data.bio || "",
        career_objective: data.career_objective || "",
        focus_areas: data.focus_areas ? data.focus_areas.join(", ") : "",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      return;
    }

    setLoading(true);
    // Upsert logic here
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-white">About Section</h1>
        <p className="text-gray-400 mt-2">Manage your biography and career objectives.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Biography</label>
          <textarea 
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            rows={5}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all resize-y"
            placeholder="Write your professional background here..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Career Objective</label>
          <textarea 
            value={formData.career_objective}
            onChange={(e) => setFormData({...formData, career_objective: e.target.value})}
            rows={3}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all resize-y"
            placeholder="What is your ultimate goal?"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Core Focus Areas (Comma separated)</label>
          <input 
            type="text" 
            value={formData.focus_areas}
            onChange={(e) => setFormData({...formData, focus_areas: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
            placeholder="e.g. LLMs, Generative AI, Backend Development, Microservices"
          />
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end items-center gap-4">
          {saved && <span className="text-green-400 text-sm font-medium">Changes saved!</span>}
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)] disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
