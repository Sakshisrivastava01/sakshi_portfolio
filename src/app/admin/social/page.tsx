"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Link } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MOCK_SOCIALS = [
  { id: "1", platform: "LinkedIn", url: "https://linkedin.com/in/sakshisrivastava" },
  { id: "2", platform: "GitHub", url: "https://github.com/sakshisrivastava" },
];

export default function SocialAdmin() {
  const [socials, setSocials] = useState<any[]>(MOCK_SOCIALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setSocials(MOCK_SOCIALS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("social_links").select("*");
      if (data) setSocials(data);
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
          <h1 className="text-3xl font-bold font-heading text-white">Social Presence</h1>
          <p className="text-gray-400 mt-2">Manage your external links and platforms.</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)]">
          <Plus className="w-5 h-5" />
          Add Platform
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading social links...</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden glass-panel">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 border-b border-white/10 uppercase text-xs tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">URL</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {socials.map((social) => (
                <tr key={social.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <Link className="w-4 h-4 text-accent-lavender" />
                    {social.platform}
                  </td>
                  <td className="px-6 py-4">
                    <a href={social.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent-pink transition-colors">
                      {social.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-white/10 text-accent-lavender transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {socials.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No social links found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
