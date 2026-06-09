"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, GraduationCap, X, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const MOCK_EDUCATION = [
  { id: "1", degree: "B.Tech in Information Technology", school: "University", year: "2024", cgpa: "", description: "" },
];

export default function EducationAdmin() {
  const [education, setEducation] = useState<any[]>(MOCK_EDUCATION);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ degree: "", school: "", year: "", cgpa: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setEducation(MOCK_EDUCATION);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("education").select("*").order("year", { ascending: false });
      if (error) throw error;
      if (data) setEducation(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load education.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (edu?: any) => {
    if (edu) {
      setEditingEdu(edu);
      setFormData({ 
        degree: edu.degree, 
        school: edu.school, 
        year: edu.year, 
        cgpa: edu.cgpa || "", 
        description: edu.description || "" 
      });
    } else {
      setEditingEdu(null);
      setFormData({ degree: "", school: "", year: "", cgpa: "", description: "" });
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
    const toastId = toast.loading(editingEdu ? "Updating education..." : "Adding education...");

    try {
      let error;
      if (editingEdu) {
        const { error: updateError } = await supabase.from("education").update(formData).eq("id", editingEdu.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("education").insert([formData]);
        error = insertError;
      }

      if (error) throw error;
      toast.success(editingEdu ? "Education updated!" : "Education added!", { id: toastId });
      setIsModalOpen(false);
      fetchEducation();
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
    
    const toastId = toast.loading("Deleting education...");
    try {
      const { error } = await supabase.from("education").delete().eq("id", deletingId);
      if (error) throw error;
      toast.success("Education deleted!", { id: toastId });
      setIsDeleteModalOpen(false);
      fetchEducation();
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  const filteredEducation = education.filter(e => 
    e.school.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.degree.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Education Timeline</h1>
          <p className="text-gray-400 mt-2">Manage your academic history and degrees.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)]"
        >
          <Plus className="w-5 h-5" />
          Add Education
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by school or degree..."
          className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
        />
      </div>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading education...</div>
      ) : (
        <div className="space-y-4">
          {filteredEducation.map((edu) => (
            <div key={edu.id} className="glass-panel p-6 rounded-2xl border border-white/10 group hover:border-accent-purple/50 transition-all flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent-lavender group-hover:bg-accent-purple group-hover:text-white transition-colors shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-purple group-hover:to-accent-pink transition-all">
                    {edu.degree}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm font-medium text-gray-300">{edu.school}</p>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <p className="text-xs font-mono text-gray-500">{edu.year}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(edu)} className="p-2 rounded-lg hover:bg-white/10 text-accent-lavender transition-colors" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => confirmDelete(edu.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredEducation.length === 0 && (
            <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
              No education records found.
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{editingEdu ? "Edit Education" : "Add Education"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Degree</label>
                  <input 
                    type="text" 
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">School/University</label>
                  <input 
                    type="text" 
                    required
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Year (e.g. 2020 - 2024)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">CGPA / Score</label>
                  <input 
                    type="text" 
                    value={formData.cgpa}
                    onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Description (Optional)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all resize-y"
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Education?</h2>
              <p className="text-gray-400 text-sm">This action cannot be undone.</p>
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
