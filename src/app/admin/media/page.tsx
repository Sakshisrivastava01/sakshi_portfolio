/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { UploadCloud, FileText, Trash2, File as FileIcon, Image as ImageIcon, Copy, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function MediaAdmin() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setFiles([
        { id: "1", name: "mock-hero-bg.jpg", metadata: { mimetype: "image/jpeg", size: 2400000 } },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.storage.from('media').list();
      if (error) throw error;
      
      // Filter out the hidden folder placeholder (.emptyFolderPlaceholder etc)
      const validFiles = data?.filter(f => f.name !== '.emptyFolderPlaceholder') || [];
      
      // Get public URLs
      const filesWithUrls = validFiles.map(file => {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(file.name);
        return {
          ...file,
          publicUrl
        };
      });

      setFiles(filesWithUrls);
    } catch (err: any) {
      console.error(err);
      toast.error(`Error loading media: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Database not connected. Mock upload success.");
      setFiles([{ id: Date.now().toString(), name: file.name, metadata: { mimetype: file.type, size: file.size }, publicUrl: "" }, ...files]);
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading file...");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
      
      if (uploadError) throw uploadError;

      toast.success("File uploaded successfully!", { id: toastId });
      fetchMedia();
    } catch (err: any) {
      console.error(err);
      toast.error(`Error uploading: ${err.message}`, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (name: string) => {
    setDeletingId(name);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !deletingId) return;

    const toastId = toast.loading("Deleting file...");
    try {
      const { error } = await supabase.storage.from('media').remove([deletingId]);
      if (error) throw error;

      toast.success("File deleted!", { id: toastId });
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      fetchMedia();
    } catch (err: any) {
      console.error(err);
      toast.error(`Error deleting: ${err.message}`, { id: toastId });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const getIcon = (type?: string) => {
    if (!type) return <FileIcon className="w-8 h-8" />;
    if (type.startsWith("image/")) return <ImageIcon className="w-8 h-8" />;
    if (type.includes("pdf")) return <FileText className="w-8 h-8" />;
    return <FileIcon className="w-8 h-8" />;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Media Library</h1>
          <p className="text-gray-400 mt-2">Manage your images, documents, and assets across the site.</p>
        </div>
        
        <label className="px-5 py-2.5 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)] cursor-pointer">
          <UploadCloud className="w-5 h-5" />
          {uploading ? "Uploading..." : "Upload File"}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading media...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {files.map((file) => (
            <div key={file.id || file.name} className="glass-panel p-4 rounded-2xl border border-white/10 group hover:border-accent-purple/50 transition-all flex flex-col items-center text-center relative overflow-hidden bg-white/5">
              
              <div className="w-full aspect-square bg-black/50 rounded-xl border border-white/10 flex items-center justify-center text-gray-500 mb-3 overflow-hidden relative">
                {file.metadata?.mimetype?.startsWith('image/') && file.publicUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
<img src={file.publicUrl} alt={file.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="group-hover:text-accent-lavender transition-colors">
                    {getIcon(file.metadata?.mimetype)}
                  </div>
                )}
                
                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyToClipboard(file.publicUrl)} className="p-2 rounded-lg bg-white/10 text-white hover:bg-accent-purple transition-colors" title="Copy URL">
                    <Copy className="w-4 h-4" />
                  </button>
                  <a href={file.publicUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/10 text-white hover:bg-accent-purple transition-colors" title="Open">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <h3 className="text-sm font-medium text-white truncate w-full" title={file.name}>{file.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{formatSize(file.metadata?.size)}</p>

              <button 
                onClick={() => confirmDelete(file.name)}
                className="absolute top-6 right-6 p-2 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform hover:scale-110" 
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {files.length === 0 && (
            <div className="col-span-full p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mx-auto mb-4">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p>No media files found in your library.</p>
            </div>
          )}
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
              <h2 className="text-xl font-bold text-white mb-2">Delete File?</h2>
              <p className="text-gray-400 text-sm">This action cannot be undone. Any references to this file will break.</p>
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
