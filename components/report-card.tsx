"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Zap,
  TrendingUp,
  GitCommit,
  Layers, // For "The Architect"
  Cpu, // For "The Machine"
  Rocket, // For "10x Engineer"
  Code2, // Default
  Flame, // For "The Shipper"
  Users, // For "The Influencer"
  Sparkles, // For "The Craftsperson"
  Gem, // For "The Specialist"
  Globe, // For "The Polyglot"
  GitPullRequest, // For "The Collaborator"
  Workflow, // For "The Automator"
  Blocks, // For "The Builder"
  Trophy, // For "The Champion"
  Moon, // For "The Night Owl"
  Zap as Lightning, // For "The Streak Master"
  Heart, // For "Open Source Hero"
  Target, // For "The Perfectionist"
  Shield, // For "The Maintainer"
} from "lucide-react";
import type { UserInsights } from "@/lib/stats";

// --- HELPERS ---

const StatBox = ({
  label,
  value,
  sub,
  subColor = "text-muted-foreground",
}: any) => (
  <div className="flex flex-col items-center justify-center p-4 hover:bg-white/[0.02] transition-colors group">
    <span className="font-serif text-2xl text-foreground font-medium tracking-tight group-hover:scale-105 transition-transform">
      {value}
    </span>
    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mt-1">
      {label}
    </span>
    {sub && (
      <span className={cn("text-[10px] font-mono mt-0.5", subColor)}>
        {sub}
      </span>
    )}
  </div>
);

const InsightRow = ({
  type,
  text,
}: {
  type: "strength" | "weakness";
  text: string;
}) => {
  const isStrength = type === "strength";
  return (
    <div className="flex gap-3 items-start group">
      <div
        className={cn(
          "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 shadow-sm",
          isStrength
            ? "bg-emerald-400 shadow-emerald-500/50"
            : "bg-amber-400 shadow-amber-500/50"
        )}
      />
      <span
        className={cn(
          "text-sm leading-relaxed transition-colors",
          isStrength
            ? "text-foreground/90"
            : "text-muted-foreground group-hover:text-foreground/80"
        )}
      >
        {text}
      </span>
    </div>
  );
};

// --- MAIN COMPONENT ---

export function ReportCard({
  user,
  stats,
  insights,
  showGrowthFocus = false,
  className,
  totalRepoCount
}: {
  user: any;
  stats: any;
  insights?: UserInsights;
  showGrowthFocus?: boolean;
  className?: string;
  totalRepoCount?: number;
}) {
  // 1. Enhanced Archetype Logic (Icon + Title + Color)
  const getArchetype = () => {
    // Extract additional data from user
    const profileData = (user.profileData || {}) as any;
    const pullRequests = profileData.pullRequests || 0;
    const streak = profileData.streak || 0;
    const projects = user.projects || [];

    // Calculate additional metrics
    const languageMap = new Map<string, number>();
    let totalStars = 0;
    let totalForks = 0;
    let recentActivity = 0;
    let documentedProjects = 0;

    projects.forEach((p: any) => {
      if (p.language) {
        languageMap.set(p.language, (languageMap.get(p.language) || 0) + 1);
      }
      totalStars += p.stars || 0;
      totalForks += p.forks || 0;

      // Use a fixed reference date to avoid hydration mismatches
      const now = new Date().setHours(0, 0, 0, 0); // Normalize to start of day
      const daysSince = (now - new Date(p.lastPush).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 30) recentActivity++;

      if (p.readme && p.readme.length > 500) documentedProjects++;
    });

    const languages = Array.from(languageMap.entries());
    const primaryLanguage = languages.sort((a, b) => b[1] - a[1])[0];
    const languageSpecialization = primaryLanguage ? primaryLanguage[1] / projects.length : 0;
    const documentationRate = projects.length > 0 ? documentedProjects / projects.length : 0;

    // PRIORITY ORDER: Most specific archetypes first, then broader categories

    // 1. THE LEGEND (Elite combination)
    if (stats.impactScore >= 45 && totalStars >= 500 && stats.consistency >= 80) {
      return { title: "The Legend", icon: Trophy, color: "text-amber-400" };
    }

    // 2. THE INFLUENCER (High community engagement)
    if (totalStars >= 200 && totalForks >= 50) {
      return { title: "The Influencer", icon: Users, color: "text-pink-500" };
    }

    // 3. OPEN SOURCE HERO (Many stars + PRs)
    if (totalStars >= 100 && pullRequests >= 50) {
      return { title: "Open Source Hero", icon: Heart, color: "text-red-500" };
    }

    // 4. THE STREAK MASTER (Incredible consistency)
    if (streak >= 100 || stats.consistency >= 85) {
      return { title: "The Streak Master", icon: Lightning, color: "text-yellow-500" };
    }

    // 5. THE MACHINE (Very high consistency)
    if (stats.consistency >= 70) {
      return { title: "The Machine", icon: Cpu, color: "text-blue-500" };
    }

    // 6. THE SHIPPER (High velocity)
    if (recentActivity >= 5 && stats.impactScore >= 25) {
      return { title: "The Shipper", icon: Flame, color: "text-orange-500" };
    }

    // 7. THE CHAMPION (Very high impact)
    if (stats.impactScore >= 40) {
      return { title: "The Champion", icon: Rocket, color: "text-purple-500" };
    }

    // 8. THE PERFECTIONIST (High polish + docs)
    if (documentationRate >= 0.8 && projects.length >= 5) {
      return { title: "The Perfectionist", icon: Target, color: "text-violet-500" };
    }

    // 9. THE CRAFTSPERSON (Good documentation)
    if (documentationRate >= 0.6 && stats.impactScore >= 15) {
      return { title: "The Craftsperson", icon: Sparkles, color: "text-cyan-500" };
    }

    // 10. THE COLLABORATOR (Many PRs)
    if (pullRequests >= 75) {
      return { title: "The Collaborator", icon: GitPullRequest, color: "text-green-500" };
    }

    // 11. THE SPECIALIST (Deep language expertise)
    if (languageSpecialization >= 0.75 && projects.length >= 5 && primaryLanguage) {
      return { title: "The Specialist", icon: Gem, color: "text-emerald-500" };
    }

    // 12. THE POLYGLOT (Many languages)
    if (languages.length >= 6) {
      return { title: "The Polyglot", icon: Globe, color: "text-indigo-500" };
    }

    // 13. THE ARCHITECT (Many projects - based on TOTAL repos, not just visible)
    const totalRepos = totalRepoCount ?? stats.repoCount;
    if (totalRepos >= 20) {
      return { title: "The Architect", icon: Layers, color: "text-slate-500" };
    }

    // 14. THE BUILDER (Good amount of projects - based on TOTAL repos, not just visible)
    if (totalRepos >= 12) {
      return { title: "The Builder", icon: Blocks, color: "text-teal-500" };
    }

    // 15. THE MAINTAINER (Long-term commitment)
    if (stats.repoCount >= 10 && stats.consistency >= 50) {
      return { title: "The Maintainer", icon: Shield, color: "text-blue-600" };
    }

    // 16. THE AUTOMATOR (Workflow specialist - if we detect CI/CD)
    const hasWorkflows = projects.some((p: any) =>
      p.topics?.some((t: string) =>
        ['ci', 'cd', 'automation', 'github-actions'].includes(t.toLowerCase())
      )
    );
    if (hasWorkflows && stats.impactScore >= 20) {
      return { title: "The Automator", icon: Workflow, color: "text-purple-600" };
    }

    // 17. THE CONTRIBUTOR (Active PR contributor)
    if (pullRequests >= 30) {
      return { title: "The Contributor", icon: GitPullRequest, color: "text-lime-500" };
    }

    // 18. ACTIVE BUILDER (Solid activity)
    if (stats.impactScore >= 15) {
      return { title: "Active Builder", icon: Blocks, color: "text-sky-500" };
    }

    // DEFAULT: Based on general activity level
    if (stats.impactScore >= 20) {
      return { title: "Rising Star", icon: Rocket, color: "text-amber-500" };
    }

    if (stats.repoCount >= 5 && stats.impactScore >= 10) {
      return { title: "Full Stack Dev", icon: Code2, color: "text-primary" };
    }

    return { title: "Developer", icon: Code2, color: "text-muted-foreground" };
  };

  const { title, icon: ArchetypeIcon, color: archetypeColor } = getArchetype();

  // 2. Grade Logic (Color + Letter)
  const getGrade = () => {
    if (stats.impactScore > 40)
      return { letter: "S", bg: "bg-amber-500", shadow: "shadow-amber-500/20" };
    if (stats.impactScore > 30)
      return {
        letter: "A",
        bg: "bg-emerald-500",
        shadow: "shadow-emerald-500/20",
      };
    if (stats.impactScore > 20)
      return { letter: "B", bg: "bg-blue-500", shadow: "shadow-blue-500/20" };
    return { letter: "C", bg: "bg-zinc-500", shadow: "shadow-zinc-500/20" };
  };

  const grade = getGrade();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full shadow-2xl shadow-black/5",
        className
      )}
      suppressHydrationWarning
    >
      {/* HEADER */}
      <div className="relative p-6 pb-8 border-b border-border bg-muted/5">
        <div className="relative flex justify-between items-start z-10">
          <div className="flex gap-5 items-center">
            {/* Avatar (Clean, no overlap) */}
            <div className="w-20 h-20 rounded-full border-2 border-background shadow-lg overflow-hidden bg-secondary">
              <img
                src={user.image || ""}
                alt={user.name || "Dev"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Identity */}
            <div>
              <h2 className="text-2xl font-serif font-bold tracking-tight text-foreground mb-1">
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground font-mono mb-3">
                @{user.username}
              </p>

              {/* Archetype Chip */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border shadow-sm">
                <ArchetypeIcon size={12} className={archetypeColor} />
                <span className="text-xs font-medium tracking-wide text-foreground uppercase">
                  {title}
                </span>
              </div>
            </div>
          </div>

          {/* Grade Badge */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-16 h-16 flex items-center justify-center text-white font-serif text-4xl font-bold rounded-xl shadow-lg relative overflow-hidden transition-colors",
                grade.bg,
                grade.shadow
              )}
            >
              {grade.letter}
              {/* Shine effect */}
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-12 h-12 bg-white/20 blur-xl rounded-full" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground mt-2 uppercase tracking-widest">
              Grade
            </span>
          </div>
        </div>
      </div>

      {/* STATS GRID (Realistic Data Only) */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-card">
        {/* We can calculate these easily from the DB */}
        <StatBox
          label="Impact Score"
          value={stats.impactScore}
          sub="Calculated"
        />
        <StatBox
          label="Total Commits"
          value={stats.totalContributions}
          sub="All Time"
        />
        <StatBox
          label="Consistency"
          value={`${stats.consistency}%`}
          sub="Weekly Streak"
          subColor="text-emerald-500"
        />
      </div>

      {/* ANALYSIS */}
      <div className="flex-1 p-8 space-y-8 bg-gradient-to-b from-card to-muted/20">
        {/* Strengths */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-emerald-500" />
              Detected Strengths
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
              Analyzed
            </span>
          </div>
          <div className="space-y-3 pl-1">
            {insights?.strengths && insights.strengths.length > 0 ? (
              insights.strengths.map((strength, index) => (
                <InsightRow
                  key={index}
                  type="strength"
                  text={strength.text}
                />
              ))
            ) : (
              <InsightRow
                type="strength"
                text="Active GitHub contributor"
              />
            )}
          </div>
        </div>

        {/* Growth Focus - Private Section (Editor Only) */}
        {showGrowthFocus && (
          <>
            {/* Separator */}
            <div className="border-t border-dashed border-border/50" />

            {/* Growth */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} className="text-amber-500" />
                  Growth Focus
                </h3>
                <span className="text-[10px] font-mono text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <GitCommit size={10} />
                  Private
                </span>
              </div>
              <div className="space-y-3 pl-1">
                {insights?.growthAreas && insights.growthAreas.length > 0 ? (
                  insights.growthAreas.map((growth, index) => (
                    <InsightRow
                      key={index}
                      type="weakness"
                      text={growth.text}
                    />
                  ))
                ) : (
                  <InsightRow
                    type="weakness"
                    text="Keep building and shipping"
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      {/* <div className="p-6 border-t border-border bg-muted/10 text-center">
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest flex items-center justify-center gap-2">
          <GitCommit size={10} />
          Verified by GitProof &bull; {new Date().getFullYear()}
        </p>
      </div> */}
    </motion.div>
  );
}
