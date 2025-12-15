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
} from "lucide-react";

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

export function ReportCard({ user, stats, className }: any) {
  // 1. Archetype Logic (Icon + Title)
  const getArchetype = () => {
    if (stats.consistency > 90)
      return { title: "The Machine", icon: Cpu, color: "text-blue-500" };
    if (stats.repoCount > 20)
      return { title: "The Architect", icon: Layers, color: "text-indigo-500" };
    if (stats.impactScore > 100)
      return { title: "10x Engineer", icon: Rocket, color: "text-orange-500" };
    return { title: "Full Stack Dev", icon: Code2, color: "text-primary" };
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
              AI Analysis
            </span>
          </div>
          <div className="space-y-3 pl-1">
            <InsightRow
              type="strength"
              text="Exceptional code review depth in TypeScript projects."
            />
            <InsightRow
              type="strength"
              text="Maintains 99.9% test coverage on core libraries."
            />
            <InsightRow
              type="strength"
              text="High velocity shipper (Avg PR merge: 4h)."
            />
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-dashed border-border/50" />

        {/* Growth */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} className="text-amber-500" />
              Growth Focus
            </h3>
          </div>
          <div className="space-y-3 pl-1">
            <InsightRow
              type="weakness"
              text="Documentation coverage is below top-tier standards."
            />
            <InsightRow
              type="weakness"
              text="Increase visibility by contributing to open source."
            />
          </div>
        </div>
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
