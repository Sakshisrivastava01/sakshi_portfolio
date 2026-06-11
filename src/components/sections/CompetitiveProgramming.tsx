"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Trophy, Code2, Activity, Award, Star, TrendingUp, Database, BrainCircuit, Globe } from "lucide-react";
import SectionLayout from "./SectionLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import toast, { Toaster } from 'react-hot-toast';

interface PlatformData {
  username: string;
  solved: number | string;
  rating: number | string;
  rank: string;
}

interface CPData {
  platforms: {
    leetcode: PlatformData;
    codeforces: PlatformData;
    codechef: PlatformData;
    gfg: PlatformData;
    hackerrank: PlatformData;
  };
  totalSolved: number;
}

const mockRatingProgression = [
  { name: 'Jan', lc: 1500, cf: 1200 },
  { name: 'Feb', lc: 1600, cf: 1250 },
  { name: 'Mar', lc: 1650, cf: 1280 },
  { name: 'Apr', lc: 1700, cf: 1300 },
  { name: 'May', lc: 1735, cf: 1320 },
];

const mockDsaTopics = [
  { subject: 'Arrays', A: 120, fullMark: 150 },
  { subject: 'Strings', A: 98, fullMark: 150 },
  { subject: 'DP', A: 86, fullMark: 150 },
  { subject: 'Graphs', A: 65, fullMark: 150 },
  { subject: 'Trees', A: 85, fullMark: 150 },
  { subject: 'Math', A: 65, fullMark: 150 },
];

export default function CompetitiveProgramming() {
  const [data, setData] = useState<CPData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (showToast = false) => {
    try {
      if (showToast) setLoading(true);
      const res = await fetch('/api/cp');
      const json = await res.json();
      setData(json);
      if (showToast) toast.success('Data refreshed successfully!');
    } catch (e) {
      console.error(e);
      if (showToast) toast.error('Failed to fetch latest data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Generate GitHub-style heatmap data (mock)
  const [heatmapData] = useState(() => Array.from({ length: 52 * 7 }).map(() => Math.floor(Math.random() * 5)));

  const platformCards = [
    { name: 'LeetCode', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', data: data?.platforms?.leetcode, url: 'https://leetcode.com/u/_sakshi19_/', icon: <Code2 /> },
    { name: 'Codeforces', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', data: data?.platforms?.codeforces, url: 'https://codeforces.com/profile/sakshi_190819', icon: <TrendingUp /> },
    { name: 'CodeChef', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', data: data?.platforms?.codechef, url: 'https://www.codechef.com/users/sakshi_200306', icon: <Trophy /> },
    { name: 'GeeksForGeeks', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30', data: data?.platforms?.gfg, url: 'https://www.geeksforgeeks.org/profile/sakshisrivasq50o', icon: <Database /> },
    { name: 'HackerRank', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30', data: data?.platforms?.hackerrank, url: 'https://www.hackerrank.com/profile/sakshisrivasta41', icon: <Globe /> }
  ];

  return (
    <SectionLayout id="competitive-programming" title="Competitive Programming Journey">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header: Total Solved & Refresh */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-[0_0_20px_rgba(138,43,226,0.4)]">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm tracking-widest uppercase font-semibold mb-1">Total Problems Solved</h3>
              <div className="text-4xl md:text-5xl font-bold font-heading text-white">
                {loading && !data ? <span className="animate-pulse">---</span> : data?.totalSolved || 0}
                <span className="text-accent-pink">+</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => fetchData(true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-pink/50 transition-all duration-300 text-white font-medium disabled:opacity-50 group/btn relative z-10"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-accent-pink' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`} />
            {loading ? 'Syncing...' : 'Sync Latest Data'}
          </button>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {platformCards.map((platform, i) => (
             <motion.a 
               href={platform.url}
               target="_blank"
               rel="noopener noreferrer"
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1, duration: 0.5 }}
               className={`glass-panel p-5 rounded-2xl border border-white/5 hover:${platform.border} transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] relative overflow-hidden group/card flex flex-col h-full`}
             >
               <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${platform.bg} rounded-bl-full opacity-50 group-hover/card:scale-110 transition-transform duration-500`} />
               
               <div className="flex items-center gap-3 mb-4 relative z-10">
                 <div className={`p-2 rounded-xl bg-white/5 ${platform.color}`}>
                   {platform.icon}
                 </div>
                 <h4 className="font-bold text-white tracking-wide">{platform.name}</h4>
               </div>
               
               <div className="space-y-3 relative z-10 flex-grow">
                 <div className="flex justify-between items-center border-b border-white/5 pb-2">
                   <span className="text-gray-500 text-xs uppercase tracking-wider">Solved</span>
                   <span className="font-semibold text-white">
                     {loading && !data ? '...' : platform.data?.solved || 'N/A'}
                   </span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/5 pb-2">
                   <span className="text-gray-500 text-xs uppercase tracking-wider">Rating</span>
                   <span className={`font-semibold ${platform.color}`}>
                     {loading && !data ? '...' : platform.data?.rating || 'N/A'}
                   </span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-gray-500 text-xs uppercase tracking-wider">Rank</span>
                   <span className="font-semibold text-gray-300 text-sm">
                     {loading && !data ? '...' : platform.data?.rank || 'N/A'}
                   </span>
                 </div>
               </div>
             </motion.a>
          ))}
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Rating Progression */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5"
          >
            <h4 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
              <TrendingUp className="text-accent-pink" /> Rating Progression
            </h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockRatingProgression}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} width={40} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '10px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="lc" name="LeetCode" stroke="#facc15" strokeWidth={3} dot={{ r: 4, fill: '#111', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="cf" name="Codeforces" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#111', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* DSA Topic Analysis */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative"
          >
            <h4 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
              <BrainCircuit className="text-accent-purple" /> DSA Mastery Radar
            </h4>
            <div className="h-[300px] w-full absolute inset-0 top-16 md:top-20 z-0 opacity-20 pointer-events-none flex justify-center items-center">
               <div className="w-64 h-64 bg-accent-purple/30 rounded-full blur-[80px]" />
            </div>
            <div className="h-[300px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockDsaTopics}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={12} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="transparent" tick={false} />
                  <Radar name="Strength" dataKey="A" stroke="#c084fc" fill="#c084fc" fillOpacity={0.4} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#c084fc50', borderRadius: '10px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Activity Heatmap & Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Heatmap */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 lg:col-span-2 overflow-x-auto"
          >
            <h4 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
              <Activity className="text-green-400" /> Activity Heatmap
            </h4>
            <div className="min-w-[700px]">
              <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                {heatmapData.map((level, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-sm ${
                      level === 0 ? 'bg-white/5' :
                      level === 1 ? 'bg-accent-purple/40' :
                      level === 2 ? 'bg-accent-purple/70' :
                      level === 3 ? 'bg-accent-pink/70' :
                      'bg-accent-pink'
                    } hover:ring-1 hover:ring-white transition-all cursor-pointer`}
                    title={`Activity Level: ${level}`}
                  />
                ))}
              </div>
              <div className="flex justify-end items-center gap-2 mt-4 text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-[3px]">
                  <div className="w-3 h-3 rounded-sm bg-white/5" />
                  <div className="w-3 h-3 rounded-sm bg-accent-purple/40" />
                  <div className="w-3 h-3 rounded-sm bg-accent-purple/70" />
                  <div className="w-3 h-3 rounded-sm bg-accent-pink/70" />
                  <div className="w-3 h-3 rounded-sm bg-accent-pink" />
                </div>
                <span>More</span>
              </div>
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5"
          >
            <h4 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
              <Award className="text-yellow-400" /> Badges
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: '50 Days Badge', icon: <Star className="text-yellow-400" /> },
                { name: '100 Days Badge', icon: <Star className="text-orange-400" /> },
                { name: 'Annual Badge', icon: <Award className="text-accent-pink" /> },
                { name: 'Top 10%', icon: <Trophy className="text-accent-purple" /> },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-center gap-2">
                  <div className="p-3 rounded-full bg-black/50 shadow-inner">
                    {badge.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-300">{badge.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </SectionLayout>
  );
}
