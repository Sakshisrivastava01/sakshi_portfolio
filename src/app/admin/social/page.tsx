/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Link, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const MOCK_SOCIALS = [
  { id: "1", platform: "LinkedIn", url: "https://linkedin.com/in/sakshisrivastava" },
  { id: "2", platform: "GitHub", url: "https://github.com/sakshisrivastava" },
];

export default function SocialAdmin() {
  const [socials, setSocials] = useState<any[]>(MOCK_SOCIALS);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ platform: "", url: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSocials();
  }, []);

  async function fetchSocials() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setSocials(MOCK_SOCIALS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("social_links").select("*").order("platform");
      if (error) throw error;
      if (data) setSocials(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load social links.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (social?: any) => {
    if (social) {
      setEditingSocial(social);
      setFormData({ platform: social.platform, url: social.url });
    } else {
      setEditingSocial(null);
      setFormData({ platform: "", url: "" });
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
    const toastId = toast.loading(editingSocial ? "Updating platform..." : "Adding platform...");

    try {
      let error;
      if (editingSocial) {
        const { error: updateError } = await supabase.from("social_links").update(formData).eq("id", editingSocial.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("social_links").insert([formData]);
        error = insertError;
      }

      if (error) throw error;
      toast.success(editingSocial ? "Platform updated!" : "Platform added!", { id: toastId });
      setIsModalOpen(false);
      fetchSocials();
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
    
    const toastId = toast.loading("Deleting platform...");
    try {
      const { error } = await supabase.from("social_links").delete().eq("id", deletingId);
      if (error) throw error;
      toast.success("Platform deleted!", { id: toastId });
      setIsDeleteModalOpen(false);
      fetchSocials();
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Social Presence</h1>
          <p className="text-gray-400 mt-2">Manage your external links and platforms.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)]"
        >
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
                    <button onClick={() => handleOpenModal(social)} className="p-2 rounded-lg hover:bg-white/10 text-accent-lavender transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(social.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors" title="Delete">
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{editingSocial ? "Edit Platform" : "Add Platform"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Platform Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  placeholder="e.g. GitHub"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">URL</label>
                <input 
                  type="url" 
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  placeholder="https://..."
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
              <h2 className="text-xl font-bold text-white mb-2">Delete Platform?</h2>
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
