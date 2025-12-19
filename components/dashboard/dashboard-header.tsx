"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Terminal, Zap, ArrowUpRight, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  username: string;
  streak: number;
  image: string;
  timeAgo: string;
  isRefreshing: boolean;
  isStale: boolean;
  hasSynced: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({
  username,
  streak,
  image,
  timeAgo,
  isRefreshing,
  isStale,
  hasSynced,
  onRefresh,
}: DashboardHeaderProps) {
  const getStreakMessage = (s: number) => {
    if (s === 0) return "The blank canvas is yours. Start a new streak today.";
    if (s < 5) return "You're building momentum. Keep the chain going.";
    return "You are unstoppable. Great consistency.";
  };
  const buttonLabel = isRefreshing ? "Syncing..." : isStale ? "Sync now" : "Refresh";

  return (
    <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-border">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="flex items-center gap-2 text-muted-foreground mb-2 text-sm">
          <span className="flex items-center gap-2 px-2 py-1 bg-secondary rounded-full text-xs font-mono">
            <Terminal size={10} /> GP-2
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
          Welcome back, {username}.
        </h1>

        <div className="flex items-center gap-3 mt-3">
          <div
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
              streak > 0
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <Zap size={12} className={streak > 0 ? "fill-current" : ""} />
            {streak} Day Streak
            {streak > 0 && <ArrowUpRight size={12} />}
          </div>
          <p className="text-muted-foreground text-sm font-light">
            {getStreakMessage(streak)}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/50 text-muted-foreground border border-border/50">
          <Clock size={10} className="opacity-60" />
          <span>{hasSynced ? `Synced ${timeAgo}` : "Never synced"}</span>
        </div>

        {isStale && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <span>Data stale</span>
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 px-3 rounded-lg border border-border/50 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/50 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
        >
          <RefreshCw size={12} className={cn(isRefreshing && "animate-spin")} />
          {buttonLabel}
        </button>

        <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
          {image ? (
            <Image
              src={image}
              alt="Avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
        </div>
      </motion.div>
    </div>
  );
}
