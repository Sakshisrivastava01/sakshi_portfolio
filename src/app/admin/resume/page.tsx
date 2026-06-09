"use client";

import { useState, useEffect } from "react";
import { UploadCloud, FileText, Trash2, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ResumeAdmin() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function fetchResume() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase.from("resume").select("*").single();
      if (data) {
        setResumeUrl(data.pdf_url);
        setResumeId(data.id);
      }
    } catch (err: unknown) {
      console.error(err);
      const e = err as { code?: string, message?: string };
      if (e.code !== "PGRST116") { // Ignore no rows returned
        toast.error("Failed to fetch resume.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchResume();
  }, []);


  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Database not connected. Mock upload success.");
      setResumeUrl("/mock-resume.pdf");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading resume...");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `resume-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, file);
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(filePath);

      let dbError;
      if (resumeId) {
        const { error } = await supabase.from("resume").update({ pdf_url: publicUrl, updated_at: new Date() }).eq("id", resumeId);
        dbError = error;
      } else {
        const { data: insertData, error } = await supabase.from("resume").insert([{ pdf_url: publicUrl }]).select().single();
        if (insertData) setResumeId(insertData.id);
        dbError = error;
      }

      if (dbError) throw dbError;

      setResumeUrl(publicUrl);
      toast.success("Resume uploaded successfully!", { id: toastId });
    } catch (err: unknown) {
      console.error(err);
      toast.error(`Upload Error: ${(err as Error).message}`, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !resumeId) return;

    const toastId = toast.loading("Deleting resume...");
    try {
      const { error } = await supabase.from("resume").delete().eq("id", resumeId);
      if (error) throw error;
      setResumeUrl(null);
      setResumeId(null);
      toast.success("Resume deleted!", { id: toastId });
    } catch (err: unknown) {
      console.error(err);
      toast.error(`Delete Error: ${(err as Error).message}`, { id: toastId });
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-white">Resume Management</h1>
        <p className="text-gray-400 mt-2">Upload your latest PDF resume. The site will update instantly.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">Checking status...</div>
        ) : resumeUrl ? (
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Current Resume</h3>
                <p className="text-sm text-gray-500">Live on portfolio</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-white/10 text-accent-lavender transition-colors" title="Download">
                <Download className="w-5 h-5" />
              </a>
              <button onClick={handleDelete} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors" title="Delete">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-accent-purple/50 transition-colors">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-accent-purple transition-colors mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Resume</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">Drag and drop your PDF here, or click to browse files.</p>
            
            <label className="px-6 py-3 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors cursor-pointer shadow-[0_0_15px_rgba(138,43,226,0.3)]">
              {uploading ? "Uploading..." : "Select File"}
              <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
