"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- CUSTOM 3x3 COMMIT LOADER ---
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      repeat: Infinity,
      repeatType: "reverse" as const, // TypeScript fix for framer-motion type
    },
  },
};

const squareVariants = {
  initial: {
    backgroundColor: "hsl(var(--muted))",
    scale: 1,
    opacity: 0.5,
  },
  animate: {
    backgroundColor: "hsl(var(--primary))",
    scale: 1.1,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const CommitLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-3 gap-1.5"
      >
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            variants={squareVariants}
            className="w-3 h-3 rounded-[2px] shadow-sm shadow-primary/20"
          />
        ))}
      </motion.div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 animate-pulse">
        Initializing GitProof...
      </p>
    </div>
  );
};

// --- REUSABLE "GLASS" SKELETON ---
// --- REUSABLE "GLASS" SKELETON ---
const Skeleton = ({
  className,
  children,
  style,
}: {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={style}
    className={cn(
      "rounded-xl bg-secondary/20 border border-foreground/5 animate-pulse",
      className
    )}
  >
    {children}
  </div>
);

// --- MAIN LOADING PAGE ---
export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-background pt-8 pb-20 px-6 relative overflow-hidden">
      {/* Subtle noise texture overlay for digital feel */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* HEADER SKELETON */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-border/40">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 rounded-full bg-secondary/40" />
            <Skeleton className="h-10 w-64 from-secondary/20 to-secondary/5 bg-gradient-to-r" />
            <Skeleton className="h-5 w-40 rounded-full bg-secondary/30" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full border-2 border-background shadow-sm" />
        </div>

        {/* STATS ROW SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="p-6 h-32 flex flex-col justify-between bg-card/50 backdrop-blur-sm"
            >
              <div className="flex justify-between">
                <Skeleton className="w-8 h-8 rounded-lg bg-secondary/40" />
                <Skeleton className="w-12 h-5 rounded-full bg-secondary/30" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-20 h-8 bg-secondary/50" />
                <Skeleton className="w-28 h-3 rounded-full bg-secondary/30" />
              </div>
            </Skeleton>
          ))}
        </div>

        {/* CHARTS ROW SKELETON - FEATURING THE COMMIT LOADER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 p-6 h-[300px] flex items-center justify-center bg-card/40 backdrop-blur-md relative overflow-hidden group">
            {/* Subtle glow effect behind the loader */}
            <div className="absolute inset-0 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-1000"></div>
            <CommitLoader />
          </Skeleton>
          <Skeleton className="p-6 h-[300px] bg-card/50 backdrop-blur-sm flex flex-col gap-4">
            <Skeleton className="h-6 w-1/3 bg-secondary/40" />
            <div className="flex-1 space-y-3 pt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-2 w-12 rounded-full bg-secondary/30" />
                    <Skeleton className="h-2 w-8 rounded-full bg-secondary/30" />
                  </div>
                  <Skeleton
                    className="h-2 w-full rounded-full bg-secondary/20"
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                  />
                </div>
              ))}
            </div>
          </Skeleton>
        </div>

        {/* REPOS SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-40 mb-4 bg-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-40 p-5 bg-card/50 backdrop-blur-sm flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg bg-secondary/40" />
                    <div className="space-y-2">
                      <Skeleton className="w-32 h-4 bg-secondary/50" />
                      <Skeleton className="w-20 h-2 rounded-full bg-secondary/30" />
                    </div>
                  </div>
                  <Skeleton className="w-full h-2 rounded-full bg-secondary/20 mt-4" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="w-8 h-2 rounded-full bg-secondary/30" />
                    <Skeleton className="w-8 h-2 rounded-full bg-secondary/30" />
                  </div>
                </Skeleton>
              ))}
            </div>
          </div>
          <Skeleton className="p-6 h-64 bg-card/50 backdrop-blur-sm mt-10 lg:mt-0" />
        </div>
      </div>
    </main>
  );
}
