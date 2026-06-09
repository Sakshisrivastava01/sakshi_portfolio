"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Mock data for preview until Supabase is connected
const MOCK_PROJECTS = [
  { id: "1", name: "CheeseCakeLabs Backend", status: "Completed", featured: true },
  { id: "2", name: "AI Cyber Detection", status: "In Progress", featured: true },
];

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>(MOCK_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // If supabase anon key is missing, just use mock data
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setProjects(MOCK_PROJECTS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (data) setProjects(data);
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
          <h1 className="text-3xl font-bold font-heading text-white">Project Management</h1>
          <p className="text-gray-400 mt-2">Add, edit, or remove projects from the Innovation Lab.</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)]">
          <Plus className="w-5 h-5" />
          Add New Project
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading projects...</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden glass-panel">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 border-b border-white/10 uppercase text-xs tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">{project.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {project.featured ? (
                      <span className="text-accent-pink text-xs uppercase tracking-wider font-bold">Yes</span>
                    ) : (
                      <span className="text-gray-600 text-xs uppercase tracking-wider">No</span>
                    )}
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
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No projects found. Create one to get started.
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
