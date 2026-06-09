"use client";

import { useState, useEffect } from "react";
import { Save, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function SEOAdmin() {
  const [formData, setFormData] = useState({
    page_title: "Sakshi Srivastava | AI/ML Engineer",
    meta_description: "Portfolio of Sakshi Srivastava, an AI/ML Engineer specializing in building intelligent systems.",
    keywords: "AI, ML, Software Engineer, Portfolio",
    open_graph_image: "/og-image.jpg",
  });
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    fetchSEO();
  }, []);

  const fetchSEO = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    const { data } = await supabase.from("seo_settings").select("*").single();
    if (data) {
      setFormData({
        page_title: data.page_title || "",
        meta_description: data.meta_description || "",
        keywords: data.keywords ? data.keywords.join(", ") : "",
        open_graph_image: data.open_graph_image || "",
      });
    }
    setInitialFetchDone(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Supabase not connected. Credentials missing.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Saving SEO settings...");

    try {
      const payload = {
        ...formData,
        keywords: formData.keywords.split(",").map(k => k.trim()).filter(Boolean)
      };

      const { data: existingData } = await supabase.from("seo_settings").select("id").single();
      
      let error;
      if (existingData?.id) {
        const { error: updateError } = await supabase.from("seo_settings").update(payload).eq("id", existingData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("seo_settings").insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      toast.success("SEO settings saved successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-white">SEO & Metadata</h1>
        <p className="text-gray-400 mt-2">Manage how your portfolio appears on Google and social media.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="p-4 bg-[#1a1a1a] rounded-xl border border-white/5 font-sans mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Google Preview</span>
          </div>
          <p className="text-[#8ab4f8] text-xl cursor-pointer hover:underline truncate">
            {formData.page_title || "Your Page Title"}
          </p>
          <p className="text-[#006621] text-sm truncate">https://yourportfolio.com</p>
          <p className="text-[#9aa0a6] text-sm mt-1 line-clamp-2">
            {formData.meta_description || "Your meta description will appear here in search results."}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Page Title</label>
          <input 
            type="text" 
            value={formData.page_title}
            onChange={(e) => setFormData({...formData, page_title: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Meta Description</label>
          <textarea 
            value={formData.meta_description}
            onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
            rows={3}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Keywords (Comma separated)</label>
            <input 
              type="text" 
              value={formData.keywords}
              onChange={(e) => setFormData({...formData, keywords: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Open Graph Image URL</label>
            <input 
              type="text" 
              value={formData.open_graph_image}
              onChange={(e) => setFormData({...formData, open_graph_image: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
            />
          </div>
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
