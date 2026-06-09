"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Award, X, Search, UploadCloud, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const MOCK_CERTS = [
  { id: "1", title: "Generative AI with LangChain", issuer: "Udemy", issue_date: "", credential_id: "", verify_url: "", image_url: "", pdf_url: "", skills: [] },
];

export default function CertificationsAdmin() {
  const [certs, setCerts] = useState<any[]>(MOCK_CERTS);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    title: "", issuer: "", issue_date: "", credential_id: "",
    verify_url: "", image_url: "", pdf_url: "", skills: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setCerts(MOCK_CERTS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("certifications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setCerts(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load certifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cert?: any) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({ 
        title: cert.title, 
        issuer: cert.issuer, 
        issue_date: cert.issue_date || "", 
        credential_id: cert.credential_id || "",
        verify_url: cert.verify_url || "",
        image_url: cert.image_url || "",
        pdf_url: cert.pdf_url || "",
        skills: cert.skills ? cert.skills.join(", ") : ""
      });
    } else {
      setEditingCert(null);
      setFormData({ 
        title: "", issuer: "", issue_date: "", credential_id: "",
        verify_url: "", image_url: "", pdf_url: "", skills: ""
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
    const toastId = toast.loading(editingCert ? "Updating certification..." : "Adding certification...");

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean)
      };

      let error;
      if (editingCert) {
        const { error: updateError } = await supabase.from("certifications").update(payload).eq("id", editingCert.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("certifications").insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      toast.success(editingCert ? "Certification updated!" : "Certification added!", { id: toastId });
      setIsModalOpen(false);
      fetchCerts();
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
    
    const toastId = toast.loading("Deleting certification...");
    try {
      const { error } = await supabase.from("certifications").delete().eq("id", deletingId);
      if (error) throw error;
      toast.success("Certification deleted!", { id: toastId });
      setIsDeleteModalOpen(false);
      fetchCerts();
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`, { id: toastId });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (type === 'image' && !file.type.startsWith('image/')) {
      toast.error("Only image files are allowed.");
      return;
    }
    if (type === 'pdf' && file.type !== 'application/pdf') {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Database not connected. Mock upload success.");
      setFormData(prev => ({ ...prev, [type === 'image' ? 'image_url' : 'pdf_url']: `/mock-${type}.${type === 'image' ? 'jpg' : 'pdf'}` }));
      return;
    }

    const isImage = type === 'image';
    isImage ? setUploadingImage(true) : setUploadingPdf(true);
    const toastId = toast.loading(`Uploading ${type}...`);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `certificates/${fileName}`;

      const { error: uploadError, data } = await supabase.storage.from('media').upload(filePath, file);
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, [isImage ? 'image_url' : 'pdf_url']: publicUrl }));
      toast.success(`${type} uploaded successfully!`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Error uploading ${type}: ${err.message}`, { id: toastId });
    } finally {
      isImage ? setUploadingImage(false) : setUploadingPdf(false);
    }
  };

  const filteredCerts = certs.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Certifications Management</h1>
          <p className="text-gray-400 mt-2">Manage your professional credentials and PDF uploads.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)]"
        >
          <Plus className="w-5 h-5" />
          Add Certification
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or issuer..."
          className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
        />
      </div>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading certifications...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCerts.map((cert) => (
            <div key={cert.id} className="glass-panel p-6 rounded-2xl border border-white/10 group hover:border-accent-purple/50 transition-all flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent-lavender group-hover:bg-accent-purple group-hover:text-white transition-colors shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-purple group-hover:to-accent-pink transition-all">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mt-1">{cert.issuer}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(cert)} className="p-2 rounded-lg hover:bg-white/10 text-accent-lavender transition-colors" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => confirmDelete(cert.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredCerts.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
              No certifications found.
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-24 pb-12">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl my-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111] z-10 rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">{editingCert ? "Edit Certification" : "Add Certification"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Certification Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Issuing Organization</label>
                  <input 
                    type="text" 
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Issue Date</label>
                  <input 
                    type="text" 
                    value={formData.issue_date}
                    onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                    placeholder="e.g. Aug 2024"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Credential ID</label>
                  <input 
                    type="text" 
                    value={formData.credential_id}
                    onChange={(e) => setFormData({...formData, credential_id: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="Python, LangChain, React"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Verify URL (External Link)</label>
                  <input 
                    type="url" 
                    value={formData.verify_url}
                    onChange={(e) => setFormData({...formData, verify_url: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Certificate Image Preview (JPG/PNG)</label>
                  {formData.image_url && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData({...formData, image_url: ""})} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white hover:bg-red-500/80 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {!formData.image_url && (
                    <label className="w-full aspect-video border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-purple/50 transition-colors group">
                      <UploadCloud className="w-6 h-6 text-gray-500 group-hover:text-accent-purple mb-2" />
                      <span className="text-xs text-gray-400">{uploadingImage ? "Uploading..." : "Upload Image"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploadingImage} />
                    </label>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300">Certificate Document (PDF)</label>
                  {formData.pdf_url && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 flex items-center justify-center bg-white/5">
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-300">PDF Uploaded</span>
                      </div>
                      <button type="button" onClick={() => setFormData({...formData, pdf_url: ""})} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white hover:bg-red-500/80 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {!formData.pdf_url && (
                    <label className="w-full aspect-video border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-purple/50 transition-colors group">
                      <FileText className="w-6 h-6 text-gray-500 group-hover:text-accent-purple mb-2" />
                      <span className="text-xs text-gray-400">{uploadingPdf ? "Uploading..." : "Upload PDF"}</span>
                      <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} disabled={uploadingPdf} />
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
                  disabled={isSubmitting || uploadingImage || uploadingPdf}
                  className="flex-1 px-4 py-3 rounded-xl bg-accent-purple hover:bg-accent-pink text-white font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Certification"}
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
              <h2 className="text-xl font-bold text-white mb-2">Delete Certification?</h2>
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
