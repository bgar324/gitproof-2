"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  PenTool,
  Github,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { DemoReportCard } from "./demo-report-card";

interface HeroProps {
  session?: any;
}

export function Hero({ session }: HeroProps) {
  const handleLogin = () => {
    window.location.href = "/api/auth/signin/github";
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Text Content */}
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border text-sm font-medium backdrop-blur-sm"
          >
            <ShieldCheck size={14} className="text-primary" />
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              The Standard for Verified Developer Stats
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1]"
          >
            Your Code, <br />
            Verified.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground/90 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0"
          >
            Stop telling recruiters you're "passionate."{" "}
            <span className="text-foreground font-medium">Prove it.</span>{" "}
            GitProof analyzes your GitHub history to generate a verified,
            data-driven report card that speaks for itself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="group relative h-12 px-8 rounded-full bg-foreground text-background font-medium text-lg hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-2"
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/editor"
                  className="h-12 px-8 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-medium text-lg transition-all flex items-center gap-2 border border-border"
                >
                  <PenTool size={20} />
                  <span>Editor</span>
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="group relative h-12 px-8 rounded-full bg-foreground text-background font-medium text-lg hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-2"
                >
                  <Github size={20} />
                  <span>Connect GitHub</span>
                </button>
                <Link
                  href="/methodology"
                  className="h-12 px-8 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-medium text-lg transition-all flex items-center gap-2 border border-border"
                >
                  <BarChart3 size={20} />
                  View Methodology
                </Link>
              </>
            )}
          </motion.div>

          <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Read-Only Access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-500" />
              No Data Storage
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-500" />
              100% Free for Devs
            </span>
          </div>
        </div>

        {/* Hero Visual: The Report Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 blur-3xl transform rotate-6 scale-110" />
          <DemoReportCard />

          {/* Floating Elements */}
          <div className="absolute -right-8 top-20 bg-card border border-border p-3 rounded-lg shadow-xl animate-bounce-slow">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
              <TrendingUp size={14} />
              <span>Top 1% Consistency</span>
            </div>
          </div>
          <div className="absolute -left-4 bottom-20 bg-card border border-border p-3 rounded-lg shadow-xl animate-bounce-slow delay-700">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
              <Trophy size={14} />
              <span>S-Tier Impact</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
