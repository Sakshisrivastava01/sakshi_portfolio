"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function HeroAdmin() {
  const [formData, setFormData] = useState({
    name: "Sakshi Srivastava",
    title: "AI/ML Engineer",
    subtitle: "Building the future of artificial intelligence",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  async function fetchHero() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    const { data } = await supabase.from("hero").select("*").single();
    if (data) setFormData(data);
    setInitialFetchDone(true);
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchHero();
  }, []);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Supabase not connected. Credentials missing.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Saving hero section...");
    
    try {
      // Check if a row exists
      const { data: existingData } = await supabase.from("hero").select("id").single();
      
      let error;
      if (existingData?.id) {
        // Update
        const { error: updateError } = await supabase.from("hero").update(formData).eq("id", existingData.id);
        error = updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase.from("hero").insert([formData]);
        error = insertError;
      }

      if (error) throw error;
      toast.success("Hero section saved successfully!", { id: toastId });
    } catch (err: unknown) {
      console.error(err);
      toast.error(`Error: ${(err as Error).message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-white">Hero Section</h1>
        <p className="text-gray-400 mt-2">Manage the main landing screen text and profile.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Display Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Professional Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Subtitle</label>
          <input 
            type="text" 
            value={formData.subtitle}
            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Hero Description (Optional)</label>
          <textarea 
            value={formData.description || ""}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all resize-none"
          />
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end items-center gap-4">
          <button 
            type="submit"
            disabled={loading || !initialFetchDone}
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
