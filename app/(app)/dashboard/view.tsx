// app/dashboard/view.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCommit,
  GitPullRequest,
  Star,
  Zap,
  GitFork,
  ArrowUpRight,
  Terminal,
  Clock,
  Code2,
  Shield,
  Info,
  X,
  Activity,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { GithubProfile } from "@/lib/github";
import { cn } from "@/lib/utils";
import RepoModal from "@/components/repo-modal";
import Link from "next/link";
import { createPortal } from "react-dom"; // <--- Add this

// --- SUB-COMPONENTS ---

const Card = ({
  children,
  className,
  delay = 0,
  allowOverflow = false,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={cn(
      "bg-card border border-border rounded-xl p-6 relative",
      allowOverflow ? "overflow-visible" : "overflow-hidden",
      className
    )}
  >
    {children}
  </motion.div>
);

const StatGeneric = ({ label, value, icon: Icon, trend, color }: any) => (
  <div className="flex flex-col h-full justify-between">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-secondary/50 rounded-lg text-foreground/80">
        <Icon size={20} />
      </div>
      {trend && (
        <span
          className={`text-xs font-medium flex items-center gap-1 bg-secondary px-2 py-1 rounded ${color}`}
        >
          {trend}
        </span>
      )}
    </div>
    <div>
      <h4 className="text-3xl font-serif font-medium tracking-tight text-foreground">
        {value}
      </h4>
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mt-1">
        {label}
      </p>
    </div>
  </div>
);

// --- HEATMAP COMPONENT ---
const ActivityGrid = ({
  data,
}: {
  data: { date: string; count: number }[];
}) => {
  return (
    <div className="flex flex-wrap gap-1 content-start py-2">
      {data.map((day) => {
        let colorClass = "bg-secondary/40";
        if (day.count > 0) colorClass = "bg-emerald-500/40";
        if (day.count > 4) colorClass = "bg-emerald-500/70";
        if (day.count > 10) colorClass = "bg-emerald-500";

        const dateLabel = new Date(day.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return (
          <div key={day.date} className="group relative">
            <div
              className={`w-3 h-3 rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-20 ${colorClass}`}
            />
            <div className="pointer-events-none absolute bottom-[140%] left-1/2 -translate-x-1/2 hidden group-hover:block z-50 min-w-[120px]">
              <div className="relative bg-popover/95 backdrop-blur-md border border-border shadow-2xl rounded-lg p-3 text-[10px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
                <span className="font-serif text-lg font-medium text-foreground">
                  {day.count}
                </span>
                <span className="text-muted-foreground uppercase tracking-widest text-[9px] mb-1">
                  Contributions
                </span>
                <div className="w-full h-px bg-border/50 my-1" />
                <span className="text-foreground/80 font-medium whitespace-nowrap">
                  {dateLabel}
                </span>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-popover border-r border-b border-border rotate-45" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 backdrop-blur-md border border-border shadow-2xl rounded-lg p-3 text-[10px] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200 min-w-[100px]">
        <span className="font-serif text-lg font-medium text-foreground">
          {payload[0].value}
        </span>
        <span className="text-muted-foreground uppercase tracking-widest text-[9px] mb-1">
          Commits
        </span>
        <div className="w-full h-px bg-border/50 my-1" />
        <span className="text-foreground/80 font-medium whitespace-nowrap">
          {/* Format "14" to "2 PM" or keep as "14:00" */}
          {parseInt(label) > 12
            ? `${parseInt(label) - 12} PM`
            : parseInt(label) === 12
            ? "12 PM"
            : parseInt(label) === 0
            ? "12 AM"
            : `${parseInt(label)} AM`}
        </span>
      </div>
    );
  }
  return null;
};

// ... (Keep ImpactTooltip and ScoreExplanationModal exactly as before) ...
const ImpactTooltip = ({
  score,
  breakdown,
}: {
  score: number;
  breakdown: any;
}) => {
  if (!breakdown) return null;
  const daysSince = Math.floor(
    (new Date().getTime() - new Date(breakdown.updatedAt).getTime()) /
      (1000 * 3600 * 24)
  );
  let recencyLabel = "Archived";
  let recencyColor = "text-muted-foreground";
  if (daysSince < 7) {
    recencyLabel = "S-Tier Activity (< 7d)";
    recencyColor = "text-emerald-500";
  } else if (daysSince < 30) {
    recencyLabel = "Active (< 30d)";
    recencyColor = "text-emerald-400";
  } else if (daysSince < 90) {
    recencyLabel = "Recent (< 90d)";
    recencyColor = "text-yellow-500";
  }
  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-4 z-50 hidden group-hover/score:block pointer-events-none">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-border/50">
        <span className="text-xs font-semibold text-foreground">
          Impact Calculation
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          MAX 50
        </span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Star size={10} /> Popularity
          </span>
          <span className="font-mono text-foreground">
            {Math.round(
              Math.log2(breakdown.stars + breakdown.forks * 2 + 1) * 3
            )}{" "}
            pts
          </span>
        </div>
        <div className="flex justify-between">
          <span className={`${recencyColor} flex items-center gap-1`}>
            <Zap size={10} /> {recencyLabel}
          </span>
          <span className="font-mono text-foreground">
            {daysSince < 7 ? 15 : daysSince < 30 ? 10 : daysSince < 90 ? 5 : 0}{" "}
            pts
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Shield size={10} /> Maturity
          </span>
          <span className="font-mono text-foreground">
            {score -
              (daysSince < 7
                ? 15
                : daysSince < 30
                ? 10
                : daysSince < 90
                ? 5
                : 0) -
              Math.round(
                Math.log2(breakdown.stars + breakdown.forks * 2 + 1) * 3
              )}{" "}
            pts
          </span>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-border/50 flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Total Score
        </span>
        <span className="font-bold text-lg text-primary">{score}</span>
      </div>
    </div>
  );
};

const ScoreExplanationModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: "spring", damping: 25, stiffness: 300 },
              }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-background border border-border/50 shadow-2xl rounded-xl flex flex-col overflow-hidden pointer-events-auto ring-1 ring-white/10"
            >
              {/* Header */}
              <div className="p-6 border-b border-border/50 bg-muted/20 backdrop-blur flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="text-emerald-500" size={18} />
                    Impact Algorithm
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    How we calculate the 0-50 score.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 bg-card/50">
                <div className="space-y-4">
                  {/* Metric 1 */}
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      <Star size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground flex items-center gap-2">
                        1. Popularity (Logarithmic)
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          ~40%
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        We use a log scale so viral repos don't break the chart.
                        <br />
                        <span className="opacity-70">
                          Formula: Forks (2x) + Stars (1x).
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground flex items-center gap-2">
                        2. Recency Decay
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          ~30%
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Code rots. We penalize inactivity.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[9px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded">
                          &lt;7d: +15pts
                        </span>
                        <span className="text-[9px] border border-yellow-500/30 bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded">
                          &lt;30d: +10pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                      <Code2 size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground flex items-center gap-2">
                        3. Project Maturity
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          ~30%
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        We parse your <code>README.md</code> size and language
                        complexity to distinguish "Hello World" apps from real
                        engineering.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border/50 bg-muted/20 text-center">
                <p className="text-[10px] text-muted-foreground">
                  This algorithm runs locally. It updates every time you sync.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

// --- MAIN VIEW ---

export default function DashboardView({ data }: { data: GithubProfile }) {
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"all" | "90d" | "30d">("all");
  const [selectedRepo, setSelectedRepo] = useState<any>(null);

  // Removed: Client-side sync now handled on server (dashboard/page.tsx)
  // Data is cached in User.profileData with 1-hour TTL

  // --- 1. FILTER LOGIC ---
  const filteredHeatmap = useMemo(() => {
    if (timeRange === "all") return data.heatmap;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (timeRange === "30d" ? 30 : 90));
    return data.heatmap.filter((day) => new Date(day.date) >= cutoff);
  }, [data.heatmap, timeRange]);

  const periodContributions = useMemo(() => {
    return filteredHeatmap.reduce((acc, curr) => acc + curr.count, 0);
  }, [filteredHeatmap]);

  // --- 2. NEW METRIC: Consistency (Active Days) ---
  const activeDays = useMemo(() => {
    return data.heatmap.filter((d) => d.count > 0).length;
  }, [data.heatmap]);

  const coveragePercent = Math.round((activeDays / 365) * 100);

  // --- 3. DYNAMIC HEADER MESSAGING ---
  const getStreakMessage = (streak: number) => {
    if (streak === 0)
      return "The blank canvas is yours. Start a new streak today.";
    if (streak < 5) return "You're building momentum. Keep the chain going.";
    return "You are unstoppable. Great consistency.";
  };

  return (
    <main className="min-h-screen bg-background pt-8 pb-20 px-6">
      <ScoreExplanationModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* --- HEADER (ENHANCED) --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-border">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2 text-sm">
              <span className="flex items-center gap-2 px-2 py-1 bg-secondary rounded-full text-xs font-mono">
                <Terminal size={10} /> GP-2
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
              Welcome back, {data.username}.
            </h1>

            {/* ENHANCED SUBTITLE */}
            <div className="flex items-center gap-3 mt-3">
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                  data.streak > 0
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <Zap
                  size={12}
                  className={data.streak > 0 ? "fill-current" : ""}
                />
                {data.streak} Day Streak
                {data.streak > 0 && <ArrowUpRight size={12} />}
              </div>
              <p className="text-muted-foreground text-sm font-light">
                {getStreakMessage(data.streak)}
              </p>
            </div>
          </motion.div>

          <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
            <img
              src={data.image}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* --- ROW 1: Stats (Replaced 4th Card) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card delay={0.1}>
            <StatGeneric
              label="Total Contributions"
              value={data.totalContributions}
              icon={GitCommit}
              trend="All Time"
              color="text-green-500"
            />
          </Card>
          <Card delay={0.2}>
            <StatGeneric
              label="Pull Requests"
              value={data.pullRequests}
              icon={GitPullRequest}
              color="text-blue-500"
            />
          </Card>
          <Card delay={0.3}>
            <StatGeneric
              label="Repositories"
              value={data.repoCount}
              icon={GitFork}
              color="text-muted-foreground"
            />
          </Card>

          {/* REPLACED "Streak" WITH "Consistency" */}
          <Card delay={0.4}>
            <StatGeneric
              label="Active Days / Year"
              value={`${activeDays} Days`}
              icon={Activity}
              trend={`${coveragePercent}% Coverage`} // Show coverage % as the trend
              color="text-emerald-500" // Green if good, maybe generic for now
            />
          </Card>
        </div>

        {/* --- ROW 2: Heatmap & Charts --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card
            className="lg:col-span-2 flex flex-col min-h-[300px]"
            delay={0.5}
            allowOverflow={true}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="font-serif text-xl">Activity Log</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {periodContributions} contributions in{" "}
                  {timeRange === "all"
                    ? "the last year"
                    : `the last ${timeRange}`}
                </p>
              </div>
              <div className="flex bg-secondary/50 p-1 rounded-lg">
                {(["30d", "90d", "all"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-md transition-all",
                      timeRange === range
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    {range === "all" ? "All Year" : range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <ActivityGrid data={filteredHeatmap} />
            </div>
          </Card>

          <Card className="flex flex-col" delay={0.6}>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-muted-foreground" />
              <h3 className="font-serif text-lg">Focus Hours</h3>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.hourlyActivity}>
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                    content={<CustomBarTooltip />}
                  />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {data.hourlyActivity.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.value > 5
                            ? "hsl(var(--primary))"
                            : "hsl(var(--secondary))"
                        }
                      />
                    ))}
                  </Bar>
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    stroke="hsl(var(--muted-foreground))"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* --- ROW 3: Top Repos --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Header Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-end justify-between mb-6" // increased mb-4 to mb-6 for breathing room
            >
              {/* Left: Title & Context */}
              <div>
                <h3 className="font-serif text-xl mb-1">Top Repositories</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Ranked by Impact Score</span>
                  <span className="text-border">•</span>
                  <button
                    onClick={() => setIsScoreModalOpen(true)}
                    className="hover:text-primary transition-colors hover:underline decoration-dotted underline-offset-2 flex items-center gap-1"
                  >
                    How is this calculated?
                  </button>
                </div>
              </div>

              {/* Right: Action */}
              <Link
                href="/dashboard/repos"
                className="group flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors pb-1"
              >
                View Archive
                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md ml-1 text-[10px] group-hover:bg-primary/20 transition-colors">
                  {data.repoCount}
                </span>
                <ArrowUpRight
                  size={12}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.topRepos.slice(0, 6).map((repo, i) => (
                <motion.div
                  key={repo.name}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  onClick={() => setSelectedRepo(repo)} // <--- Add this!
                  className="cursor-pointer block group h-full"
                >
                  <div className="h-full bg-card border border-border rounded-xl p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Code2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                            {repo.name}
                            <ArrowUpRight
                              size={12}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </h4>
                          <div className="relative group/score w-fit">
                            <div className="text-[10px] text-muted-foreground font-mono cursor-help flex items-center gap-1 hover:text-foreground transition-colors mt-0.5">
                              Impact Score:{" "}
                              <span
                                className={`font-bold ${
                                  repo.score >= 40
                                    ? "text-emerald-500"
                                    : repo.score >= 20
                                    ? "text-yellow-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {repo.score}
                              </span>{" "}
                              / 50
                            </div>
                            <ImpactTooltip
                              score={repo.score}
                              breakdown={repo.breakdown}
                            />
                          </div>
                        </div>
                      </div>
                      {repo.isPublic ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium">
                          Public
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground border border-border">
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-6 flex-1">
                      {repo.desc}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: repo.color }}
                          />
                          {repo.language}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={12} /> {repo.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork size={12} /> {repo.forks}
                        </span>
                      </div>
                      <div>{repo.updated}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Card delay={0.8} className="h-fit">
            <h3 className="font-serif text-lg mb-6">Tech Stack</h3>
            <div className="space-y-5">
              {data.topLanguages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-medium text-foreground">
                      {lang.name}
                    </span>
                    <span className="text-muted-foreground">
                      {lang.percent}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lang.percent}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <RepoModal
        repo={selectedRepo}
        isOpen={!!selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />
    </main>
  );
}
