"use client";

import { useState } from "react";
import { Download, Upload, AlertTriangle, Database } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

// List of all tables to backup/restore
const TABLES = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "certifications",
  "education",
  "achievements",
  "contact",
  "social_links",
  "resume",
  "audio",
  "seo_settings",
  "analytics_settings"
];

export default function BackupAdmin() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Database not connected.");
      return;
    }

    setExporting(true);
    const toastId = toast.loading("Exporting database...");

    try {
      const backupData: Record<string, any> = {};

      // Fetch all data from all tables
      for (const table of TABLES) {
        const { data, error } = await supabase.from(table).select("*");
        if (error) {
          console.error(`Error fetching ${table}:`, error);
          continue; // Skip failed tables but continue
        }
        backupData[table] = data;
      }

      // Create JSON Blob and download
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Database exported successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Export error:", err);
      toast.error("Failed to export database.", { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      toast.error("Database not connected.");
      return;
    }

    if (!window.confirm("WARNING: This will append to your current data. Are you sure?")) {
      e.target.value = '';
      return;
    }

    setImporting(true);
    const toastId = toast.loading("Reading backup file...");

    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const jsonStr = event.target?.result as string;
          const backupData = JSON.parse(jsonStr);

          if (typeof backupData !== "object" || backupData === null) {
            toast.error("Invalid backup format: root must be an object.", { id: toastId });
            setImporting(false);
            return;
          }

          let successCount = 0;
          let failCount = 0;

          // Insert data table by table
          for (const table of TABLES) {
            if (backupData[table] && Array.isArray(backupData[table]) && backupData[table].length > 0) {
              toast.loading(`Importing ${table}...`, { id: toastId });
              
              // Remove IDs if you want to avoid conflicts, or keep them if you want exact replica (assuming table empty)
              // For safety, we keep them, but if conflicts occur, it might fail.
              // To cleanly restore, we'd truncate tables first, which is dangerous from frontend.
              // We'll just attempt upsert if ID exists.
              
              const { error } = await supabase.from(table).upsert(backupData[table]);
              if (error) {
                console.error(`Import error for ${table}:`, error);
                failCount++;
              } else {
                successCount++;
              }
            }
          }

          if (failCount > 0) {
            toast.error(`Import completed with errors. ${successCount} tables succeeded, ${failCount} failed.`, { id: toastId });
          } else {
            toast.success("Database imported successfully!", { id: toastId });
          }
        } catch (parseErr) {
          console.error(parseErr);
          toast.error("Invalid JSON format.", { id: toastId });
        } finally {
          setImporting(false);
        }
      };

      reader.readAsText(file);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to import database.", { id: toastId });
      setImporting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-white">Backup & Restore</h1>
        <p className="text-gray-400 mt-2">Export your entire portfolio content as JSON, or import a previous backup.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center group">
          <div className="w-16 h-16 rounded-full bg-accent-purple/20 text-accent-lavender flex items-center justify-center mb-6">
            <Download className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Export Data</h2>
          <p className="text-gray-400 text-sm mb-8">
            Download a complete JSON snapshot of all your portfolio content, including about, projects, skills, and settings.
          </p>
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="w-full px-6 py-3 rounded-xl bg-accent-purple text-white font-medium hover:bg-accent-pink transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(138,43,226,0.3)] disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Download JSON Backup"}
          </button>
        </div>

        {/* Import Card */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center group">
          <div className="w-16 h-16 rounded-full bg-[#F9AB00]/20 text-[#F9AB00] flex items-center justify-center mb-6">
            <Upload className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Import Data</h2>
          <p className="text-gray-400 text-sm mb-8">
            Restore a previous JSON backup. Note: This will upsert records. If you want a fresh restore, clear tables manually first.
          </p>
          <label className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
            {importing ? "Importing..." : "Select Backup File"}
            <input type="file" accept=".json" className="hidden" onChange={handleImport} disabled={importing} />
          </label>
        </div>
      </div>

      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-red-400 mb-1">Important Note</h3>
          <p className="text-sm text-gray-400">
            Media files (images, PDFs, audio) stored in Supabase Storage buckets are <strong className="text-white">NOT</strong> included in this JSON backup. 
            Only the database records and public URLs are saved. You should backup your storage buckets separately via the Supabase Dashboard if necessary.
          </p>
        </div>
      </div>
    </div>
  );
}
