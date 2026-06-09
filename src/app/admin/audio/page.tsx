"use client";

import { useState, useEffect, useRef } from "react";
import { UploadCloud, Music, Trash2, Play, Pause } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AudioAdmin() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioId, setAudioId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchAudio() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from("audio").select("*").single();
        
        if (error) {
          if (error.code !== "PGRST116") { // Ignore no rows returned
            toast.error("Failed to fetch audio.");
          }
        } else if (data) {
          setAudioId(data.id);
          setAudioUrl(data.audio_url);
        }
      } catch (err: unknown) {
        console.error(err);
        const e = err as { code?: string, message?: string };
        if (e.code !== "PGRST116") { // Ignore no rows returned
          toast.error("Failed to fetch audio.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAudio();
    const currentAudio = audioRef.current;
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("audio/")) {
      toast.error("Only audio files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Database not connected. Mock upload success.");
      setAudioUrl("/mock-intro.mp3");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading audio...");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `audio-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('audio').upload(filePath, file);
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(filePath);

      let dbError;
      if (audioId) {
        const { error } = await supabase.from("audio").update({ audio_url: publicUrl, updated_at: new Date() }).eq("id", audioId);
        dbError = error;
      } else {
        const { data: insertData, error } = await supabase.from("audio").insert([{ audio_url: publicUrl }]).select().single();
        if (insertData) setAudioId(insertData.id);
        dbError = error;
      }

      if (dbError) throw dbError;

      setAudioUrl(publicUrl);
      toast.success("Audio uploaded successfully!", { id: toastId });
    } catch (err: unknown) {
      console.error(err);
      toast.error(`Upload Error: ${(err as Error).message}`, { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !audioId) return;

    const toastId = toast.loading("Deleting audio...");
    try {
      const { error } = await supabase.from("audio").delete().eq("id", audioId);
      if (error) throw error;
      
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      
      setAudioUrl(null);
      setAudioId(null);
      toast.success("Audio deleted!", { id: toastId });
    } catch (err: unknown) {
      console.error(err);
      toast.error(`Delete Error: ${(err as Error).message}`, { id: toastId });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-white">Audio Introduction</h1>
        <p className="text-gray-400 mt-2">Manage the voice note for your interactive hero section.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        {loading ? (
          <div className="text-center text-gray-500 animate-pulse">Checking status...</div>
        ) : audioUrl ? (
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              onEnded={() => setIsPlaying(false)} 
              className="hidden" 
            />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent-purple/20 text-accent-lavender flex items-center justify-center shrink-0">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">intro.mp3</h3>
                <p className="text-sm text-gray-500">Currently active on live site</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={togglePlay} className="p-2 rounded-lg hover:bg-white/10 text-accent-lavender transition-colors" title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
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
            <h3 className="text-xl font-bold text-white mb-2">Upload Audio</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">Upload your intro.mp3 file to introduce yourself to visitors.</p>
            
            <label className="px-6 py-3 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors cursor-pointer shadow-[0_0_15px_rgba(138,43,226,0.3)]">
              {uploading ? "Uploading..." : "Select File"}
              <input type="file" accept=".mp3,audio/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
