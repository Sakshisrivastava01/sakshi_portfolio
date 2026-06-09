"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MOCK_ACHIEVEMENTS = [
  { id: "1", title: "Smart India Hackathon", description: "Winner", date: "2023" },
];

export default function AchievementsAdmin() {
  const [achievements, setAchievements] = useState<any[]>(MOCK_ACHIEVEMENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setAchievements(MOCK_ACHIEVEMENTS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("achievements").select("*").order("date", { ascending: false });
      if (data) setAchievements(data);
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
          <h1 className="text-3xl font-bold font-heading text-white">Achievements & Awards</h1>
          <p className="text-gray-400 mt-2">Manage your hackathon wins and milestones.</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)]">
          <Plus className="w-5 h-5" />
          Add Achievement
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading achievements...</div>
      ) : (
        <div className="space-y-4">
          {achievements.map((ach) => (
            <div key={ach.id} className="glass-panel p-6 rounded-2xl border border-white/10 group hover:border-accent-purple/50 transition-all flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent-lavender group-hover:bg-accent-purple group-hover:text-white transition-colors shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-purple group-hover:to-accent-pink transition-all">
                    {ach.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm font-medium text-gray-300">{ach.description}</p>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <p className="text-xs font-mono text-gray-500">{ach.date}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-white/10 text-accent-lavender transition-colors" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {achievements.length === 0 && (
            <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
              No achievements found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
