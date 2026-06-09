/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Code2, X, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const MOCK_SKILLS = [
  { id: "1", name: "Python", category: "Languages", proficiency: 95 },
  { id: "2", name: "React", category: "Frontend", proficiency: 90 },
];

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>(MOCK_SKILLS);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", category: "Frontend", proficiency: 80 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setSkills(MOCK_SKILLS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("skills").select("*").order("category");
      if (error) throw error;
      if (data) setSkills(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill?: any) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({ name: skill.name, category: skill.category, proficiency: skill.proficiency });
    } else {
      setEditingSkill(null);
      setFormData({ name: "", category: "Frontend", proficiency: 80 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Supabase not connected.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(editingSkill ? "Updating skill..." : "Adding skill...");

    try {
      let error;
      if (editingSkill) {
        const { error: updateError } = await supabase.from("skills").update(formData).eq("id", editingSkill.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("skills").insert([formData]);
        error = insertError;
      }

      if (error) throw error;
      toast.success(editingSkill ? "Skill updated!" : "Skill added!", { id: toastId });
      setIsModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !deletingId) return;
    
    const toastId = toast.loading("Deleting skill...");
    try {
      const { error } = await supabase.from("skills").delete().eq("id", deletingId);
      if (error) throw error;
      toast.success("Skill deleted!", { id: toastId });
      setIsDeleteModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  const filteredSkills = skills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Skills Management</h1>
          <p className="text-gray-400 mt-2">Manage your technical intelligence network.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)]"
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills by name or category..."
          className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
        />
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
              {filteredSkills.map((skill) => (
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
                    <button onClick={() => handleOpenModal(skill)} className="p-2 rounded-lg hover:bg-white/10 text-accent-lavender transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(skill.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSkills.length === 0 && (
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{editingSkill ? "Edit Skill" : "Add Skill"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Skill Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  placeholder="e.g. React"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                >
                  <option value="Languages">Languages</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Tools">Tools</option>
                  <option value="Cloud">Cloud</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Databases">Databases</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 flex justify-between">
                  <span>Proficiency</span>
                  <span className="text-accent-lavender">{formData.proficiency}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={formData.proficiency}
                  onChange={(e) => setFormData({...formData, proficiency: parseInt(e.target.value)})}
                  className="w-full accent-accent-purple h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="pt-6 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-accent-purple hover:bg-accent-pink text-white font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Skill?</h2>
              <p className="text-gray-400 text-sm">This action cannot be undone. Are you sure you want to remove this skill?</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
