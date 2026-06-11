"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Code2, Activity, Award, TrendingUp, Trophy, ExternalLink } from "lucide-react";
import SectionLayout from "./SectionLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast, { Toaster } from 'react-hot-toast';

interface LCContestHistory {
  rating: number;
  ranking: number;
  contest: {
    title: string;
    startTime: number;
  };
}

interface LCBadge {
  displayName: string;
  icon: string;
}

interface LeetCodeData {
  username: string;
  solved: number;
  rating: number;
  rank: string;
  contestCount: number;
  badges: LCBadge[];
  history: LCContestHistory[];
  calendar: Record<string, number>;
}

interface CPData {
  leetcode: LeetCodeData;
}

export default function CompetitiveProgramming() {
  const [data, setData] = useState<CPData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (showToast = false) => {
    try {
      if (showToast) setLoading(true);
      const res = await fetch('/api/cp');
      const json = await res.json();
      setData(json);
      if (showToast) toast.success('LeetCode data synced!');
    } catch (error) {
      console.error(error);
      if (showToast) toast.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const lc = data?.leetcode;

  // Format chart data
  const chartData = useMemo(() => {
    if (!lc?.history) return [];
    return lc.history.map((h) => {
      const date = new Date(h.contest.startTime * 1000);
      return {
        name: date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
        rating: Math.round(h.rating),
        contestName: h.contest.title
      };
    });
  }, [lc]);

  // Generate heatmap data: last 365 days
  const heatmapData = useMemo(() => {
    if (!lc?.calendar) return Array(364).fill(0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];
    // Go back 364 days to have 52 complete weeks
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      // so a proper approach is to group by YYYY-MM-DD. 
      // But for simplicity, let's just check the exact timestamp or nearby ones
      // Actually, LC provides exact day timestamps in UTC.
      
      // Better: Convert calendar to a local Date string map for lookup
      let count = 0;
      for (const [ts, c] of Object.entries(lc.calendar)) {
         const subDate = new Date(parseInt(ts) * 1000);
         if (subDate.getFullYear() === d.getFullYear() && 
             subDate.getMonth() === d.getMonth() && 
             subDate.getDate() === d.getDate()) {
             count += c;
         }
      }
      days.push(count);
    }
    return days;
  }, [lc]);

  const recentContests = useMemo(() => {
    if (!lc?.history) return [];
    // Sort descending by time and take top 4
    return [...lc.history]
      .sort((a, b) => b.contest.startTime - a.contest.startTime)
      .slice(0, 4);
  }, [lc]);

  return (
    <SectionLayout id="competitive-programming" title="Competitive Programming Journey">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header / Hero Stats */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-accent-pink/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#ffa116]/10 border border-[#ffa116]/30 flex items-center justify-center shadow-[0_0_30px_rgba(255,161,22,0.15)] shrink-0">
                <Code2 className="w-10 h-10 text-[#ffa116]" />
              </div>
              <div>
                <a href="https://leetcode.com/u/_sakshi19_/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent-pink transition-colors">
                  <h3 className="text-2xl md:text-3xl font-bold font-heading text-white">_sakshi19_</h3>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </a>
                <p className="text-gray-400 mt-1">LeetCode Profile</p>
              </div>
            </div>

            <button 
              onClick={() => fetchData(true)}
              disabled={loading}
              className="mt-4 lg:mt-0 flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ffa116]/50 transition-all duration-300 text-white font-medium disabled:opacity-50 group/btn shrink-0 lg:ml-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ffa116]' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`} />
              {loading ? 'Syncing...' : 'Refresh LeetCode Stats'}
            </button>
          </div>
        </div>

        {/* Hero Statistics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 hover:border-[#ffa116]/30 transition-all duration-300 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-[#ffa116]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 relative z-10">Problems Solved</div>
             <div className="text-4xl font-bold font-heading text-white relative z-10">{loading && !lc ? '...' : lc?.solved || 0}</div>
          </div>
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 hover:border-accent-pink/30 transition-all duration-300 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 relative z-10">Contest Rating</div>
             <div className="text-4xl font-bold font-heading text-[#ffa116] relative z-10">{loading && !lc ? '...' : lc?.rating || 0}</div>
          </div>
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 hover:border-accent-purple/30 transition-all duration-300 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 relative z-10">Global Percentile</div>
             <div className="text-4xl font-bold font-heading text-white relative z-10">{loading && !lc ? '...' : lc?.rank || 'N/A'}</div>
          </div>
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 hover:border-blue-400/30 transition-all duration-300 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 relative z-10">Contests Participated</div>
             <div className="text-4xl font-bold font-heading text-white relative z-10">{loading && !lc ? '...' : lc?.contestCount || 0}</div>
          </div>
        </div>


        {/* Rating Progression Graph */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 w-full"
        >
            <h4 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
              <TrendingUp className="text-[#ffa116]" /> Rating Progression
            </h4>
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} width={40} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '10px' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rating" 
                      name="Rating" 
                      stroke="#ffa116" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#111', strokeWidth: 2 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  {loading ? 'Loading history...' : 'No contest history available.'}
                </div>
              )}
            </div>
          </motion.div>

        {/* Recent Contests */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <h4 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
            <Trophy className="text-accent-pink" /> Recent Contests
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentContests.length > 0 ? (
              recentContests.map((h, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-accent-pink/30 transition-all duration-300 relative overflow-hidden group/contest">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 to-transparent opacity-0 group-hover/contest:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <span className="text-xs text-gray-400 mb-2 block">
                        {new Date(h.contest.startTime * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <h5 className="font-bold font-heading text-white text-base line-clamp-2 mb-4" title={h.contest.title}>{h.contest.title}</h5>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Rank</span>
                        <span className="font-semibold text-white">{h.ranking}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Rating</span>
                        <span className="font-semibold text-[#ffa116]">{Math.round(h.rating)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 flex items-center justify-center py-12 text-gray-500 glass-panel rounded-2xl border border-white/5">
                {loading ? 'Loading contests...' : 'No recent contests.'}
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Heatmap */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 lg:col-span-2 overflow-x-auto"
          >
            <h4 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
              <Activity className="text-[#ffa116]" /> Consistency Tracker
            </h4>
            <div className="min-w-[1040px] overflow-x-auto pb-4">
              <div className="grid grid-rows-7 grid-flow-col gap-[4px]">
                {heatmapData.map((count, i) => {
                  let colorClass = 'bg-white/5';
                  if (count > 0 && count <= 2) colorClass = 'bg-[#ffa116]/40';
                  else if (count > 2 && count <= 5) colorClass = 'bg-[#ffa116]/70';
                  else if (count > 5) colorClass = 'bg-[#ffa116]';
                  
                  return (
                    <div 
                      key={i} 
                      className={`w-4 h-4 rounded-sm ${colorClass} hover:ring-1 hover:ring-white transition-all cursor-pointer`}
                      title={`${count} submissions`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-end items-center gap-2 mt-6 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex gap-[4px]">
                  <div className="w-4 h-4 rounded-sm bg-white/5" />
                  <div className="w-4 h-4 rounded-sm bg-[#ffa116]/40" />
                  <div className="w-4 h-4 rounded-sm bg-[#ffa116]/70" />
                  <div className="w-4 h-4 rounded-sm bg-[#ffa116]" />
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
            className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col"
          >
            <h4 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
              <Award className="text-accent-purple" /> LeetCode Badges
            </h4>
            <div className="grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2">
              {lc?.badges && lc.badges.length > 0 ? (
                lc.badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={badge.icon.startsWith('/') ? `https://leetcode.com${badge.icon}` : badge.icon} 
                        alt={badge.displayName} 
                        className="max-w-full max-h-full drop-shadow-md" 
                        loading="lazy"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-300">{badge.displayName}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex items-center justify-center py-8 text-gray-500">
                  {loading ? 'Loading badges...' : 'No badges earned yet.'}
                </div>
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </SectionLayout>
  );
}
