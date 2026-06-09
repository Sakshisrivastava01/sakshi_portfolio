"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FolderKanban, X, Search, UploadCloud, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const MOCK_PROJECTS = [
  { id: "1", name: "CheeseCakeLabs Backend", status: "Completed", featured: true, description: "", tech_stack: [], github_url: "", live_url: "", image_url: "", banner_url: "" },
];

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>(MOCK_PROJECTS);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: "", description: "", status: "In Progress", featured: false,
    github_url: "", live_url: "", image_url: "", banner_url: "", tech_stack: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setProjects(MOCK_PROJECTS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setProjects(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: any) => {
    if (project) {
      setEditingProject(project);
      setFormData({ 
        name: project.name, 
        description: project.description || "", 
        status: project.status || "In Progress", 
        featured: project.featured || false,
        github_url: project.github_url || "",
        live_url: project.live_url || "",
        image_url: project.image_url || "",
        banner_url: project.banner_url || "",
        tech_stack: project.tech_stack ? project.tech_stack.join(", ") : ""
      });
    } else {
      setEditingProject(null);
      setFormData({ 
        name: "", description: "", status: "In Progress", featured: false,
        github_url: "", live_url: "", image_url: "", banner_url: "", tech_stack: ""
      });
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
    const toastId = toast.loading(editingProject ? "Updating project..." : "Adding project...");

    try {
      const payload = {
        ...formData,
        tech_stack: formData.tech_stack.split(",").map(s => s.trim()).filter(Boolean)
      };

      let error;
      if (editingProject) {
        const { error: updateError } = await supabase.from("projects").update(payload).eq("id", editingProject.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("projects").insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      toast.success(editingProject ? "Project updated!" : "Project added!", { id: toastId });
      setIsModalOpen(false);
      fetchProjects();
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
    
    const toastId = toast.loading("Deleting project...");
    try {
      const { error } = await supabase.from("projects").delete().eq("id", deletingId);
      if (error) throw error;
      toast.success("Project deleted!", { id: toastId });
      setIsDeleteModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      toast.error("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Database not connected. Mock upload success.");
      setFormData(prev => ({ ...prev, [type === 'image' ? 'image_url' : 'banner_url']: `/mock-${type}.jpg` }));
      return;
    }

    const isImage = type === 'image';
    isImage ? setUploadingImage(true) : setUploadingBanner(true);
    const toastId = toast.loading(`Uploading ${type}...`);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError, data } = await supabase.storage.from('media').upload(filePath, file);
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, [isImage ? 'image_url' : 'banner_url']: publicUrl }));
      toast.success(`${type} uploaded successfully!`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Error uploading ${type}: ${err.message}`, { id: toastId });
    } finally {
      isImage ? setUploadingImage(false) : setUploadingBanner(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Project Management</h1>
          <p className="text-gray-400 mt-2">Add, edit, or remove projects from the Innovation Lab.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)]"
        >
          <Plus className="w-5 h-5" />
          Add New Project
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
        />
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
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <FolderKanban className="w-4 h-4 text-accent-lavender" />
                    {project.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${project.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
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
                    <button onClick={() => handleOpenModal(project)} className="p-2 rounded-lg hover:bg-white/10 text-accent-lavender transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(project.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-24 pb-12">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl my-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111] z-10 rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">{editingProject ? "Edit Project" : "Add Project"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Planned">Planned</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Tech Stack (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.tech_stack}
                    onChange={(e) => setFormData({...formData, tech_stack: e.target.value})}
                    placeholder="React, Node.js, Supabase"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 pt-8">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-pink"></div>
                  </label>
                  <span className="text-sm font-semibold text-gray-300">Featured Project</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">GitHub URL</label>
                  <input 
                    type="url" 
                    value={formData.github_url}
                    onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Live URL</label>
                  <input 
                    type="url" 
                    value={formData.live_url}
                    onChange={(e) => setFormData({...formData, live_url: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Thumbnail Image</label>
                  {formData.image_url && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                      <img src={formData.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData({...formData, image_url: ""})} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white hover:bg-red-500/80 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {!formData.image_url && (
                    <label className="w-full aspect-video border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-purple/50 transition-colors group">
                      <ImageIcon className="w-6 h-6 text-gray-500 group-hover:text-accent-purple mb-2" />
                      <span className="text-xs text-gray-400">{uploadingImage ? "Uploading..." : "Upload Thumbnail"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploadingImage} />
                    </label>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Banner Image</label>
                  {formData.banner_url && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                      <img src={formData.banner_url} alt="Banner" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData({...formData, banner_url: ""})} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white hover:bg-red-500/80 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {!formData.banner_url && (
                    <label className="w-full aspect-video border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-purple/50 transition-colors group">
                      <ImageIcon className="w-6 h-6 text-gray-500 group-hover:text-accent-purple mb-2" />
                      <span className="text-xs text-gray-400">{uploadingBanner ? "Uploading..." : "Upload Banner"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'banner')} disabled={uploadingBanner} />
                    </label>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex gap-3 sticky bottom-0 bg-[#111] pb-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || uploadingImage || uploadingBanner}
                  className="flex-1 px-4 py-3 rounded-xl bg-accent-purple hover:bg-accent-pink text-white font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Project"}
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
              <h2 className="text-xl font-bold text-white mb-2">Delete Project?</h2>
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
