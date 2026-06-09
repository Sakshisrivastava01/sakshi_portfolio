"use client";

import { Activity, Database, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Projects", value: "0", icon: Database, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { label: "Certifications", value: "0", icon: Activity, color: "text-accent-pink", bg: "bg-accent-pink/10", border: "border-accent-pink/20" },
    { label: "Last Updated", value: "Just now", icon: Clock, color: "text-accent-purple", bg: "bg-accent-purple/10", border: "border-accent-purple/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">Welcome to your private portfolio CMS. Select a section from the sidebar to start editing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-panel p-6 rounded-2xl border ${stat.border} flex items-center gap-4`}
            >
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Pending Setup: Database Connection</h2>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
          <h3 className="text-orange-400 font-bold mb-2">Supabase Credentials Missing</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            The CMS frontend architecture is ready, but it cannot fetch or save data until you provide your Supabase Project URL and Anon Key.
          </p>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Once you provide the keys in the chat, I will run the SQL migrations and wire up the data forms!
          </p>
          <Link href="/admin/settings" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors">
            Go to Settings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
