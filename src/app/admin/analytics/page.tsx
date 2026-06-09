"use client";

import { useState, useEffect } from "react";
import { Save, BarChart2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AnalyticsAdmin() {
  const [formData, setFormData] = useState({
    google_analytics_id: "",
    vercel_analytics_enabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  async function fetchAnalytics() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    const { data } = await supabase.from("analytics_settings").select("*").single();
    if (data) {
      setFormData({
        google_analytics_id: data.google_analytics_id || "",
        vercel_analytics_enabled: data.vercel_analytics_enabled ?? true,
      });
    }
    setInitialFetchDone(true);
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchAnalytics();
  }, []);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Supabase not connected. Credentials missing.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Saving analytics settings...");

    try {
      const { data: existingData } = await supabase.from("analytics_settings").select("id").single();
      
      let error;
      if (existingData?.id) {
        const { error: updateError } = await supabase.from("analytics_settings").update(formData).eq("id", existingData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("analytics_settings").insert([formData]);
        error = insertError;
      }

      if (error) throw error;
      toast.success("Analytics settings saved successfully!", { id: toastId });
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
        <h1 className="text-3xl font-bold font-heading text-white">Analytics Settings</h1>
        <p className="text-gray-400 mt-2">Manage tracking and visitor analytics tools.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-8">
        
        <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center shrink-0 border border-white/10 text-white">
              <svg viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Vercel Web Analytics</h3>
              <p className="text-sm text-gray-500">Native tracking provided by Vercel.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={formData.vercel_analytics_enabled}
              onChange={(e) => setFormData({...formData, vercel_analytics_enabled: e.target.checked})}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
          </label>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#F9AB00]/20 flex items-center justify-center shrink-0 border border-[#F9AB00]/30 text-[#F9AB00]">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Google Analytics</h3>
              <p className="text-sm text-gray-500">Universal tracking property ID.</p>
            </div>
          </div>
          <div className="pt-2">
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Measurement ID (G-XXXXXXXXXX)</label>
            <input 
              type="text" 
              value={formData.google_analytics_id}
              onChange={(e) => setFormData({...formData, google_analytics_id: e.target.value})}
              placeholder="G-..."
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
