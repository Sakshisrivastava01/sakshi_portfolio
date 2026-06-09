"use client";

import { useState, useEffect } from "react";
import { Save, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ContactAdmin() {
  const [formData, setFormData] = useState({
    email: "sakshisrivastava524@gmail.com",
    phone: "",
    location: "India",
  });
  const [loading, setLoading] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  async function fetchContact() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    const { data } = await supabase.from("contact").select("*").single();
    if (data) setFormData(data);
    setInitialFetchDone(true);
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchContact();
  }, []);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Supabase not connected. Credentials missing.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Saving contact info...");

    try {
      const { data: existingData } = await supabase.from("contact").select("id").single();
      
      let error;
      if (existingData?.id) {
        const { error: updateError } = await supabase.from("contact").update(formData).eq("id", existingData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("contact").insert([formData]);
        error = insertError;
      }

      if (error) throw error;
      toast.success("Contact info saved successfully!", { id: toastId });
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
        <h1 className="text-3xl font-bold font-heading text-white">Contact Information</h1>
        <p className="text-gray-400 mt-2">Manage your public contact details.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300">Location</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">Phone Number (Optional)</label>
          <input 
            type="text" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
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
