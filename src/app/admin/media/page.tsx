"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, FileText, Trash2, File as FileIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function MediaAdmin() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setFiles([
        { id: "1", name: "hero-bg.jpg", type: "image/jpeg", size: "2.4 MB" },
        { id: "2", name: "project-thumb.png", type: "image/png", size: "1.1 MB" },
      ]);
      setLoading(false);
      return;
    }

    try {
      // In a real scenario, this lists files from Supabase Storage bucket 'media'
      // const { data, error } = await supabase.storage.from('media').list();
      // if (data) setFiles(data);
      setFiles([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      alert("Database not connected. Mock upload success.");
      setFiles([{ id: Date.now().toString(), name: file.name, type: file.type, size: "1.0 MB" }, ...files]);
      return;
    }

    setUploading(true);
    // await supabase.storage.from('media').upload(file.name, file);
    setUploading(false);
  };

  const getIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-6 h-6" />;
    if (type.includes("pdf")) return <FileText className="w-6 h-6" />;
    return <FileIcon className="w-6 h-6" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Media Library</h1>
          <p className="text-gray-400 mt-2">Manage your images, documents, and assets.</p>
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
            <div key={file.id} className="glass-panel p-4 rounded-2xl border border-white/10 group hover:border-accent-purple/50 transition-all flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-full aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-500 mb-3 group-hover:bg-white/10 group-hover:text-accent-lavender transition-colors">
                {getIcon(file.type)}
              </div>
              <h3 className="text-sm font-medium text-white truncate w-full">{file.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{file.size}</p>

              <button className="absolute top-6 right-6 p-2 rounded-lg bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform hover:scale-110" title="Delete">
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
    </div>
  );
}
