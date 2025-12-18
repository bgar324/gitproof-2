"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cpu, Zap, TrendingUp } from "lucide-react";
import { DEMO_USER, DEMO_STATS, DEMO_INSIGHTS } from "@/lib/data";

export function DemoReportCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  const rotateX = useTransform(mouseY, [-200, 200], [5, -5]);
  const rotateY = useTransform(mouseX, [-200, 200], [-5, 5]);

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="relative w-full max-w-md mx-auto"
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-primary/10"
      >
        {/* HEADER */}
        <div className="relative p-6 pb-8 border-b border-border bg-muted/5">
          <div className="relative flex justify-between items-start z-10">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full border-2 border-background shadow-lg overflow-hidden bg-secondary">
                <img
                  src={DEMO_USER.image}
                  alt={DEMO_USER.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold tracking-tight text-foreground">
                  {DEMO_USER.name}
                </h2>
                <p className="text-sm text-muted-foreground font-mono mb-2">
                  @{DEMO_USER.username}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-background border border-border shadow-sm">
                  <Cpu size={12} className="text-blue-500" />
                  <span className="text-[10px] font-medium tracking-wide text-foreground uppercase">
                    {DEMO_STATS.archetype}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center bg-amber-500 text-white font-serif text-3xl font-bold rounded-xl shadow-lg shadow-amber-500/20 relative overflow-hidden">
                {DEMO_STATS.grade}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-10 h-10 bg-white/20 blur-xl rounded-full" />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground mt-1.5 uppercase tracking-widest">
                Grade
              </span>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-card">
          <div className="flex flex-col items-center justify-center p-4">
            <span className="font-serif text-xl text-foreground font-medium">
              {DEMO_STATS.impactScore}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
              Impact
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="font-serif text-xl text-foreground font-medium">
              {DEMO_STATS.totalContributions}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
              Commits
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="font-serif text-xl text-foreground font-medium">
              {DEMO_STATS.consistency}%
            </span>
            <span className="text-[9px] uppercase tracking-widest text-emerald-500 mt-1">
              Consistency
            </span>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="p-6 space-y-6 bg-gradient-to-b from-card to-muted/20">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-emerald-500" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                Detected Strengths
              </h3>
            </div>
            <div className="space-y-2.5">
              {DEMO_INSIGHTS.map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <span className="text-xs text-foreground/80 leading-relaxed">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-dashed border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-amber-500" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                Growth Focus
              </h3>
            </div>
            <div className="flex gap-3 items-start">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              <span className="text-xs text-foreground/80 leading-relaxed">
                Documentation coverage is below top-tier standards.
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
