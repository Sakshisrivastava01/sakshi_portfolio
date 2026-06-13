"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Code2, Activity, Award, TrendingUp, Trophy, ExternalLink, Flame, Calendar, Percent, ChevronDown, ChevronUp } from "lucide-react";
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
  hoverText?: string;
  creationDate?: string;
  category?: string;
}

interface LeetCodeData {
  username: string;
  solved: number;
  rating: number;
  rank: string;
  topPercentage: number;
  globalRanking: number;
  contestCount: number;
  badges: LCBadge[];
  history: LCContestHistory[];
  calendar: Record<string, number>;
}

interface CPData {
  leetcode: LeetCodeData;
}

// Helper to format dates consistently in UTC (e.g. DD MMM YYYY)
const formatContestDate = (startTimeSeconds: number): string => {
  const date = new Date(startTimeSeconds * 1000);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
};

// Helper for full date format in UTC (e.g. Sat, Jan 31, 2026)
const formatFullDate = (d: Date): string => {
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

interface BadgeDetail {
  date: string;
  category: "Contest" | "Streak" | "Quest";
  color: string;
  glowColor: string;
}

const formatBadgeDate = (dateStr?: string): string => {
  if (!dateStr) return "N/A";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = MONTHS[monthIdx] || parts[1];
  return `${day} ${monthName} ${year}`;
};

const getBadgeDetails = (badge: LCBadge): BadgeDetail => {
  const name = badge.displayName.toLowerCase();
  const cat = (badge.category || "").toLowerCase();
  
  const date = formatBadgeDate(badge.creationDate);
  let category: "Contest" | "Streak" | "Quest" = "Quest";
  let color = "from-blue-400 to-indigo-600";
  let glowColor = "rgba(59, 130, 246, 0.4)";
  
  if (cat === "annual" || name.includes("days")) {
    category = "Streak";
    color = "from-rose-500 to-red-600";
    glowColor = "rgba(239, 68, 68, 0.4)";
  } else if (cat === "contest" || name.includes("knight") || name.includes("guardian") || name.includes("contest")) {
    category = "Contest";
    color = "from-yellow-400 to-amber-600";
    glowColor = "rgba(251, 191, 36, 0.4)";
  } else if (cat === "dcc" || name.includes("leetcoding")) {
    category = "Quest";
    color = "from-emerald-400 to-teal-600";
    glowColor = "rgba(16, 185, 129, 0.4)";
  } else {
    category = "Quest";
    color = "from-indigo-400 to-purple-600";
    glowColor = "rgba(139, 92, 246, 0.4)";
  }
  
  return { date, category, color, glowColor };
};

// Hexagon Badge Component
function HexagonBadge({ 
  icon, 
  name, 
  date, 
  size = "md", 
  colorClass = "from-amber-400 to-orange-500", 
  glowColor = "rgba(245, 158, 11, 0.4)" 
}: { 
  icon: string; 
  name: string; 
  date: string; 
  size?: "md" | "lg"; 
  colorClass?: string; 
  glowColor?: string; 
}) {
  const isLarge = size === "lg";
  const outerSize = isLarge ? "w-[120px] h-[120px]" : "w-[72px] h-[72px]";
  
  return (
    <div className="flex flex-col items-center text-center">
      <div 
        className={`${outerSize} bg-gradient-to-br ${colorClass} p-[1.5px] hover:scale-105 transition-all duration-300 relative group flex items-center justify-center shrink-0`}
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          filter: `drop-shadow(0 0 8px ${glowColor})`
        }}
      >
        <div 
          className="w-full h-full bg-[#0a0812] flex items-center justify-center"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={icon.startsWith('/') ? `https://leetcode.com${icon}` : icon} 
            alt={name} 
            className={`${isLarge ? 'w-20 h-20' : 'w-11 h-11'} object-contain group-hover:rotate-12 transition-transform duration-500`}
            loading="lazy"
          />
        </div>
      </div>
      
      {name && (
        <span className="font-semibold text-white mt-3 text-xs line-clamp-1 max-w-[120px] font-sans" title={name}>
          {name}
        </span>
      )}
      {date && (
        <span className="text-[10px] text-gray-500 font-mono mt-0.5">{date}</span>
      )}
    </div>
  );
}

export default function CompetitiveProgramming() {
  const [data, setData] = useState<CPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllBadges, setShowAllBadges] = useState(false);

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
    const sortedHistory = [...lc.history].sort((a, b) => a.contest.startTime - b.contest.startTime);
    return sortedHistory.map((h) => ({
      name: formatContestDate(h.contest.startTime),
      rating: Math.round(h.rating),
      contestName: h.contest.title
    }));
  }, [lc]);

  // Calculate stats, streaks, active days
  const stats = useMemo(() => {
    if (!lc?.calendar) {
      return { totalSolved: 0, currentStreak: 0, maxStreak: 0, activeDays: 0, consistency: 0 };
    }
    
    const dates = new Set<string>();
    for (const ts of Object.keys(lc.calendar)) {
      const d = new Date(parseInt(ts) * 1000);
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      dates.add(`${yyyy}-${mm}-${dd}`);
    }
    
    const sortedDates = Array.from(dates).sort();
    
    let maxStreak = 0;
    let currentStreak = 0;
    
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    const formatDateStr = (d: Date) => {
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    
    const todayStr = formatDateStr(todayUTC);
    const yesterday = new Date(todayUTC);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = formatDateStr(yesterday);
    
    // Current streak calculation
    if (dates.has(todayStr)) {
      const temp = new Date(todayUTC);
      while (dates.has(formatDateStr(temp))) {
        currentStreak++;
        temp.setUTCDate(temp.getUTCDate() - 1);
      }
    } else if (dates.has(yesterdayStr)) {
      const temp = new Date(yesterday);
      while (dates.has(formatDateStr(temp))) {
        currentStreak++;
        temp.setUTCDate(temp.getUTCDate() - 1);
      }
    }
    
    // Max streak calculation (mid-day UTC to avoid DST transition/day-light savings gaps)
    let prevDateParts: { y: number; m: number; d: number } | null = null;
    let tempStreak = 0;
    sortedDates.forEach((dateStr) => {
      const parts = dateStr.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      
      const currTime = Date.UTC(y, m, d, 12, 0, 0);
      
      if (prevDateParts === null) {
        tempStreak = 1;
      } else {
        const prevTime = Date.UTC(prevDateParts.y, prevDateParts.m, prevDateParts.d, 12, 0, 0);
        const diffTime = currTime - prevTime;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, tempStreak);
      prevDateParts = { y, m, d };
    });
    
    const activeDays = dates.size;
    const consistency = Math.round((activeDays / 365) * 100);
    
    return {
      totalSolved: lc.solved || 0,
      currentStreak,
      maxStreak,
      activeDays,
      consistency
    };
  }, [lc]);

  // Generate heatmap data list
  const heatmapDataList = useMemo(() => {
    if (!lc?.calendar) return [];
    
    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    const endDate = new Date(todayUTC);
    const dayOfWeek = endDate.getUTCDay();
    const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    endDate.setUTCDate(endDate.getUTCDate() + diffToSunday);
    
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - 363);
    
    const days = [];
    const tempDate = new Date(startDate);
    
    const calendarLookup: Record<string, number> = {};
    for (const [ts, c] of Object.entries(lc.calendar)) {
      const subDate = new Date(parseInt(ts) * 1000);
      const key = `${subDate.getUTCFullYear()}-${String(subDate.getUTCMonth() + 1).padStart(2, '0')}-${String(subDate.getUTCDate()).padStart(2, '0')}`;
      calendarLookup[key] = (calendarLookup[key] || 0) + c;
    }
    
    while (tempDate <= endDate) {
      const d = new Date(tempDate);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
      const count = calendarLookup[key] || 0;
      
      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0 && count <= 2) intensity = 1;
      else if (count > 2 && count <= 4) intensity = 2;
      else if (count > 4 && count <= 6) intensity = 3;
      else if (count > 6) intensity = 4;
      
      days.push({
        date: d,
        count,
        intensity,
        key
      });
      
      tempDate.setUTCDate(tempDate.getUTCDate() + 1);
    }
    
    return days;
  }, [lc]);
  
  const weeks = useMemo(() => {
    const w = [];
    for (let i = 0; i < heatmapDataList.length; i += 7) {
      w.push(heatmapDataList.slice(i, i + 7));
    }
    return w;
  }, [heatmapDataList]);

  // Sort badges dynamically by creationDate (descending)
  const sortedBadges = useMemo(() => {
    if (!lc?.badges) return [];
    return [...lc.badges].sort((a, b) => {
      const dateA = a.creationDate || "";
      const dateB = b.creationDate || "";
      return dateB.localeCompare(dateA);
    });
  }, [lc]);

  // Featured badge is the most recent badge
  const featuredBadge = useMemo(() => {
    if (sortedBadges.length === 0) return null;
    return sortedBadges[0];
  }, [sortedBadges]);

  // Remaining badges
  const remainingBadges = useMemo(() => {
    if (sortedBadges.length === 0) return [];
    return sortedBadges.filter(b => b.displayName !== featuredBadge?.displayName);
  }, [sortedBadges, featuredBadge]);

  const displayedBadges = useMemo(() => {
    return showAllBadges ? remainingBadges : remainingBadges.slice(0, 4);
  }, [showAllBadges, remainingBadges]);

  // Badge statistics
  const badgeStats = useMemo(() => {
    if (!lc?.badges) return { total: 0, contest: 0, streak: 0, challenge: 0 };
    let contest = 0;
    let streak = 0;
    let challenge = 0;
    lc.badges.forEach((b) => {
      const { category } = getBadgeDetails(b);
      if (category === "Contest") contest++;
      else if (category === "Streak") streak++;
      else if (category === "Quest") challenge++;
    });
    return {
      total: lc.badges.length,
      contest,
      streak,
      challenge
    };
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
             <div className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 relative z-10">Global Ranking</div>
             <div className="text-4xl font-bold font-heading text-white relative z-10">
               {loading && !lc ? '...' : (lc?.globalRanking ? `#${lc.globalRanking.toLocaleString()}` : 'N/A')}
             </div>
             {lc?.topPercentage !== undefined && lc.topPercentage > 0 && (
               <div className="text-xs text-accent-lavender font-semibold mt-1.5 font-mono relative z-10">
                 Top {lc.topPercentage}%
               </div>
             )}
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
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as { name: string; rating: number; contestName: string };
                          return (
                            <div className="bg-[#111] border border-[#333] p-4 rounded-xl shadow-lg font-sans">
                              <p className="text-xs text-gray-400 font-mono mb-1">{data.name}</p>
                              <p className="text-sm font-bold text-white mb-2 leading-snug">{data.contestName}</p>
                              <div className="flex justify-between items-center gap-6 pt-2 border-t border-white/5">
                                <span className="text-xs text-gray-500 font-mono uppercase">Rating</span>
                                <span className="font-semibold text-[#ffa116]">{data.rating}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
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
                        {formatContestDate(h.contest.startTime)}
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
          
          {/* Consistency Heatmap */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-3xl border border-white/[0.08] bg-[#0b0a12]/75 backdrop-blur-xl lg:col-span-2 flex flex-col shadow-2xl relative overflow-hidden group/heatmap"
          >
            {/* Soft Ambient Light inside card */}
            <div className="absolute -right-24 -top-24 w-48 h-48 bg-[#ffa116]/5 rounded-full blur-[80px] group-hover/heatmap:bg-[#ffa116]/10 transition-colors duration-1000 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 relative z-10">
              <div>
                <h4 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <Activity className="text-[#ffa116]" /> Consistency Tracker
                </h4>
                <p className="text-xs text-gray-500 font-sans mt-0.5">LeetCode contributions map over the past year</p>
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono self-start sm:self-center">
                <span>Less</span>
                <div className="flex gap-[3px]">
                  <div className="w-3 h-3 rounded-[2px] bg-[#1a1625]" title="No activity" />
                  <div className="w-3 h-3 rounded-[2px] bg-[#2f3e1f]" title="1-2 submissions" />
                  <div className="w-3 h-3 rounded-[2px] bg-[#4d6b2d]" title="3-4 submissions" />
                  <div className="w-3 h-3 rounded-[2px] bg-[#79a83b]" title="5-6 submissions" />
                  <div className="w-3 h-3 rounded-[2px] bg-[#c4ff5e] shadow-[0_0_8px_rgba(196,255,94,0.4)]" title="7+ submissions" />
                </div>
                <span>More</span>
              </div>
            </div>
            
            {loading && !lc ? (
              <div className="animate-pulse space-y-4 relative z-10">
                <div className="h-4 bg-white/5 rounded-md w-32 mb-2" />
                <div className="flex gap-1 overflow-x-auto pb-4 select-none">
                  <div className="flex flex-col gap-1 pr-2 justify-between h-[120px] pt-1 shrink-0 w-8">
                    <div className="h-3 bg-white/5 rounded w-6" />
                    <div className="h-3 bg-white/5 rounded w-6" />
                    <div className="h-3 bg-white/5 rounded w-6" />
                    <div className="h-3 bg-white/5 rounded w-6" />
                  </div>
                  <div className="flex gap-1">
                    {Array(35).fill(0).map((_, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        {Array(7).fill(0).map((_, j) => (
                          <div key={j} className="w-3.5 h-3.5 rounded-[3px] bg-white/5" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-6 border-t border-white/5 mt-2">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-16 bg-white/5 rounded-2xl border border-white/5" />
                  ))}
                </div>
              </div>
            ) : lc && weeks.length > 0 ? (
              <div className="relative z-10">
                {/* Heatmap Grid Wrapper */}
                <div className="flex flex-col gap-2">
                  {/* Month Labels Row */}
                  <div className="relative h-5 text-[10px] text-gray-500 font-mono flex">
                    <div className="w-8 shrink-0" />
                    <div className="relative flex-1 h-full select-none">
                      {weeks.map((week, colIndex) => {
                        const prevWeek = weeks[colIndex - 1];
                        const currentMonth = week[0].date.getUTCMonth();
                        const prevMonth = prevWeek ? prevWeek[0].date.getUTCMonth() : -1;
                        
                        if (currentMonth !== prevMonth) {
                          const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                          const monthName = MONTHS[currentMonth];
                          return (
                            <div 
                              key={colIndex} 
                              className="absolute text-center" 
                              style={{ left: `${colIndex * 19}px` }}
                            >
                              {monthName}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                  
                  {/* Heatmap Columns */}
                  <div className="flex gap-1 overflow-x-auto pb-4 custom-scrollbar select-none">
                    {/* Weekdays labels */}
                    <div className="flex flex-col gap-1 pr-2 text-[9px] text-gray-500 font-mono font-semibold shrink-0 w-8">
                      <span className="h-3.5 flex items-center">Mon</span>
                      <span className="h-3.5 flex items-center opacity-0">Tue</span>
                      <span className="h-3.5 flex items-center">Wed</span>
                      <span className="h-3.5 flex items-center opacity-0">Thu</span>
                      <span className="h-3.5 flex items-center">Fri</span>
                      <span className="h-3.5 flex items-center opacity-0">Sat</span>
                      <span className="h-3.5 flex items-center font-bold text-accent-pink">Sun</span>
                    </div>
                    
                    {/* Weeks grid */}
                    <div className="flex gap-1">
                      {weeks.map((week, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-1">
                          {week.map((day) => {
                            let colorClass = "bg-[#1a1625]";
                            let glowColor = "transparent";
                            if (day.intensity === 1) {
                              colorClass = "bg-[#2f3e1f]/80 hover:bg-[#2f3e1f]";
                              glowColor = "rgba(47, 62, 31, 0.2)";
                            } else if (day.intensity === 2) {
                              colorClass = "bg-[#4d6b2d]/90 hover:bg-[#4d6b2d]";
                              glowColor = "rgba(77, 107, 45, 0.4)";
                            } else if (day.intensity === 3) {
                              colorClass = "bg-[#79a83b]/90 hover:bg-[#79a83b]";
                              glowColor = "rgba(121, 168, 59, 0.6)";
                            } else if (day.intensity === 4) {
                              colorClass = "bg-[#c4ff5e] hover:shadow-[0_0_12px_#c4ff5e]";
                              glowColor = "rgba(196, 255, 94, 0.8)";
                            }
                            
                            return (
                              <div key={day.key} className="relative group">
                                <div 
                                  className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-150 hover:scale-125 hover:ring-1 hover:ring-white/80 cursor-pointer ${colorClass}`}
                                  style={{
                                    boxShadow: day.intensity > 0 ? `0 0 8px ${glowColor}` : 'none'
                                  }}
                                />
                                
                                {/* Absolute Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                                  <div className="bg-[#0b0813]/95 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] text-gray-300 whitespace-nowrap shadow-2xl flex flex-col gap-0.5 backdrop-blur-md">
                                    <span className="font-semibold text-white font-sans">{day.count} submissions</span>
                                    <span className="text-gray-500 font-mono">{formatFullDate(day.date)}</span>
                                  </div>
                                  <div className="w-1.5 h-1.5 bg-[#0b0813] border-r border-b border-white/10 rotate-45 -mt-[4px]" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-6 border-t border-white/[0.05] mt-2">
                  {[
                    { label: "Total Solved", value: stats.totalSolved, icon: <Code2 className="text-[#ffa116] w-4.5 h-4.5" /> },
                    { label: "Current Streak", value: `${stats.currentStreak} days`, icon: <Flame className="text-orange-500 w-4.5 h-4.5" /> },
                    { label: "Max Streak", value: `${stats.maxStreak} days`, icon: <Trophy className="text-yellow-500 w-4.5 h-4.5" /> },
                    { label: "Active Days", value: stats.activeDays, icon: <Calendar className="text-blue-400 w-4.5 h-4.5" /> },
                    { label: "Consistency", value: `${stats.consistency}%`, icon: <Percent className="text-emerald-400 w-4.5 h-4.5" /> }
                  ].map((item, i) => (
                    <div key={i} className="glass-panel p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col items-start gap-2.5 group/stat relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity pointer-events-none" />
                      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/[0.05] group-hover/stat:scale-105 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">{item.label}</div>
                        <div className="text-sm font-bold font-heading text-white mt-0.5">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-44 flex items-center justify-center text-gray-500 relative z-10">
                No contribution data available.
              </div>
            )}
          </motion.div>

          {/* LeetCode Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-3xl border border-white/[0.08] bg-[#0b0a12]/75 backdrop-blur-xl flex flex-col shadow-2xl relative overflow-hidden group/badges"
          >
            {/* Soft Ambient Light inside card */}
            <div className="absolute -left-24 -top-24 w-48 h-48 bg-[#8a2be2]/5 rounded-full blur-[80px] group-hover/badges:bg-[#8a2be2]/10 transition-colors duration-1000 pointer-events-none" />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h4 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                  <Award className="text-accent-purple animate-pulse" /> LeetCode Badges
                </h4>
                <p className="text-xs text-gray-500 font-sans mt-0.5">Achievements and consistency milestones</p>
              </div>
            </div>

            {loading && !lc ? (
              <div className="animate-pulse space-y-6 relative z-10">
                <div className="grid grid-cols-4 gap-2">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-14 bg-white/5 rounded-xl border border-white/5" />
                  ))}
                </div>
                <div className="h-36 bg-white/5 rounded-2xl border border-white/5" />
                <div className="grid grid-cols-2 gap-4">
                  {Array(2).fill(0).map((_, i) => (
                    <div key={i} className="h-28 bg-white/5 rounded-2xl border border-white/5" />
                  ))}
                </div>
              </div>
            ) : lc && lc.badges.length > 0 ? (
              <div className="relative z-10 flex flex-col h-full">
                
                {/* Badges Summary Cards */}
                <div className="grid grid-cols-4 gap-2 mb-6 select-none">
                  {[
                    { label: "Earned", value: badgeStats.total, color: "text-white" },
                    { label: "Streak", value: badgeStats.streak, color: "text-rose-400" },
                    { label: "Contest", value: badgeStats.contest, color: "text-amber-500" },
                    { label: "Quest", value: badgeStats.challenge, color: "text-emerald-400" }
                  ].map((stat, i) => (
                    <div key={i} className="glass-panel p-2 rounded-xl border border-white/5 text-center flex flex-col justify-center">
                      <span className="text-[8px] text-gray-500 uppercase font-mono block tracking-wider">{stat.label}</span>
                      <span className={`text-base font-bold font-heading mt-0.5 ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Featured Badge */}
                {featuredBadge && (
                  <div className="glass-panel p-4 rounded-2xl border border-white/5 relative overflow-hidden group/featured mb-6 flex items-center gap-4 shadow-lg hover:border-white/10 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/[0.03] to-accent-pink/[0.03] opacity-50 group-hover/featured:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Large Hexagon */}
                    {(() => {
                      const { color, glowColor } = getBadgeDetails(featuredBadge);
                      return (
                        <HexagonBadge 
                          icon={featuredBadge.icon} 
                          name="" 
                          date="" 
                          size="lg" 
                          colorClass={color}
                          glowColor={glowColor}
                        />
                      );
                    })()}
                    
                    <div className="relative z-10 flex-1 min-w-0">
                      <span className="px-2 py-0.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-lavender text-[8px] font-mono font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(138,43,226,0.2)]">
                        ★ Featured Badge
                      </span>
                      <h5 className="text-sm font-bold font-heading text-white mt-1.5 truncate" title={featuredBadge.displayName}>
                        {featuredBadge.displayName}
                      </h5>
                      <div className="flex gap-4 mt-2">
                        <div>
                          <span className="text-[8px] text-gray-500 uppercase font-mono block">Class</span>
                          <span className="text-[10px] font-semibold text-white font-mono">
                            {getBadgeDetails(featuredBadge).category}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 uppercase font-mono block">Earned</span>
                          <span className="text-[10px] font-semibold text-[#ffa116] font-mono">
                            {getBadgeDetails(featuredBadge).date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remaining Badges Grid */}
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {displayedBadges.map((badge, i) => {
                    const { date, color, glowColor } = getBadgeDetails(badge);
                    return (
                      <motion.div 
                        key={badge.displayName}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-panel p-3.5 rounded-2xl border border-white/5 hover:border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all duration-300 flex flex-col items-center justify-center group/badge-card relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent opacity-0 group-hover/badge-card:opacity-100 transition-opacity pointer-events-none" />
                        <HexagonBadge 
                          icon={badge.icon} 
                          name={badge.displayName} 
                          date={date} 
                          colorClass={color}
                          glowColor={glowColor}
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* View All Button */}
                {remainingBadges.length > 4 && (
                  <button
                    onClick={() => setShowAllBadges(!showAllBadges)}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent-purple/30 text-xs text-gray-300 hover:text-white font-mono transition-all duration-300 group/btn"
                  >
                    {showAllBadges ? (
                      <>
                        Collapse Drawer <ChevronUp className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </>
                    ) : (
                      <>
                        View All Badges ({remainingBadges.length}) <ChevronDown className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full h-44 flex items-center justify-center text-gray-500 relative z-10">
                No badges earned yet.
              </div>
            )}
          </motion.div>

        </div>

      </div>
    </SectionLayout>
  );
}
