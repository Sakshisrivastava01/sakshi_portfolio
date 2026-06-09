"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Code2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MOCK_SKILLS = [
  { id: "1", name: "Python", category: "Languages", proficiency: 95 },
  { id: "2", name: "React", category: "Frontend", proficiency: 90 },
];

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>(MOCK_SKILLS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setSkills(MOCK_SKILLS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("skills").select("*").order("category");
      if (data) setSkills(data);
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
          <h1 className="text-3xl font-bold font-heading text-white">Skills Management</h1>
          <p className="text-gray-400 mt-2">Manage your technical intelligence network.</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)]">
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading skills...</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden glass-panel">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 border-b border-white/10 uppercase text-xs tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4">Skill Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Proficiency</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <Code2 className="w-4 h-4 text-accent-lavender" />
                    {skill.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
                      {skill.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 text-xs">{skill.proficiency}%</span>
                      <div className="w-24 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-accent-purple" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                    </div>
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
              {skills.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No skills found. Create one to get started.
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
