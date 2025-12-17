"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import {
  Github,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Code2,
  GitGraph,
  Zap,
  BarChart3,
  Users,
  Search,
  Cpu,
  Rocket,
  Trophy,
  Flame,
  Gem,
  Globe,
  GitPullRequest,
  Workflow,
  Blocks,
  Moon,
  Heart,
  Target,
  Shield,
  Layers,
  LayoutDashboard,
  PenTool,
} from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

// --- MOCK DATA FOR DEMO CARD ---
const DEMO_USER = {
  name: "Benjamin Garcia",
  username: "bgar324",
  image: "https://github.com/bgar324.png",
};

const DEMO_STATS = {
  impactScore: 42,
  totalContributions: 1042,
  consistency: 98,
  grade: "S",
  archetype: "The Machine",
};

// --- ARCHETYPE DATA ---
const ARCHETYPES = [
  {
    icon: Layers,
    label: "The Architect",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "group-hover:border-indigo-500/50",
  },
  {
    icon: Cpu,
    label: "The Machine",
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    border: "group-hover:border-slate-500/50",
  },
  {
    icon: Rocket,
    label: "10x Engineer",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "group-hover:border-orange-500/50",
  },
  {
    icon: Code2,
    label: "Full Stack Dev",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/50",
  },
  {
    icon: Flame,
    label: "The Shipper",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "group-hover:border-red-500/50",
  },
  {
    icon: Users,
    label: "The Influencer",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "group-hover:border-pink-500/50",
  },
  {
    icon: Sparkles,
    label: "The Craftsperson",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "group-hover:border-amber-500/50",
  },
  {
    icon: Gem,
    label: "The Specialist",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/50",
  },
  {
    icon: Globe,
    label: "The Polyglot",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "group-hover:border-cyan-500/50",
  },
  {
    icon: GitPullRequest,
    label: "The Collaborator",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "group-hover:border-violet-500/50",
  },
  {
    icon: Workflow,
    label: "The Automator",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    border: "group-hover:border-teal-500/50",
  },
  {
    icon: Blocks,
    label: "The Builder",
    color: "text-yellow-600",
    bg: "bg-yellow-600/10",
    border: "group-hover:border-yellow-600/50",
  },
  {
    icon: Trophy,
    label: "The Champion",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "group-hover:border-yellow-400/50",
  },
  {
    icon: Moon,
    label: "The Night Owl",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "group-hover:border-purple-400/50",
  },
  {
    icon: Zap,
    label: "Streak Master",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "group-hover:border-yellow-500/50",
  },
  {
    icon: Heart,
    label: "Open Source Hero",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "group-hover:border-rose-500/50",
  },
  {
    icon: Target,
    label: "The Perfectionist",
    color: "text-red-600",
    bg: "bg-red-600/10",
    border: "group-hover:border-red-600/50",
  },
  {
    icon: Shield,
    label: "The Maintainer",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "group-hover:border-sky-500/50",
  },
  {
    icon: GitPullRequest,
    label: "The Contributor",
    color: "text-lime-500",
    bg: "bg-lime-500/10",
    border: "group-hover:border-lime-500/50",
  },
  {
    icon: Blocks,
    label: "Active Builder",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "group-hover:border-sky-400/50",
  },
];

// --- COMPONENT: INTERACTIVE SCROLL WHEEL ---
const InteractiveArchetypeWheel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-[400px] w-full group/wheel">
      {/* Gradient Masks for "Wheel" fade effect */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />

      {/* Scrollable Container with CSS Snapping */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide pb-24 pt-24 px-4 space-y-4"
      >
        {ARCHETYPES.map((type, i) => (
          <div key={i} className="snap-center shrink-0">
            <motion.div
              whileHover={{ scale: 1.02, x: 4 }}
              className={`
                 flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-white/5 backdrop-blur-sm transition-all group
                 hover:bg-secondary/80 ${type.border}
               `}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${type.bg} group-hover:bg-opacity-100`}
              >
                <type.icon
                  size={24}
                  className={`${type.color} transition-colors`}
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">
                  {type.label}
                </h4>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENT: 3D DEMO REPORT CARD ---
const LandingReportCard = () => {
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
              {[
                "Exceptional code review depth in TypeScript.",
                "Maintains 99.9% test coverage on core libs.",
                "High velocity shipper (Avg PR merge: 4h).",
              ].map((text, i) => (
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
};

// --- HERO SECTION ---
const Hero = ({ onLogin, session }: { onLogin: () => void; session: any }) => (
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
                onClick={onLogin}
                className="group relative h-12 px-8 rounded-full bg-foreground text-background font-medium text-lg hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-2 hover:cursor-pointer"
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
        <LandingReportCard />

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

// --- BENTO GRID FEATURES ---
const FeaturesBento = () => {
  return (
    <section className="py-24 px-6 bg-secondary/30 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold">
            More Than Just a Commit Graph
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We dig deeper than green squares. Our engine analyzes quality,
            complexity, and impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {/* Card 1: Large - Impact */}
          <div className="md:col-span-2 bg-card border border-border rounded-3xl p-8 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <Rocket size={24} />
              </div>
              <h3 className="text-2xl font-bold">Impact Scoring Algorithm</h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Our proprietary algorithm doesn't just count commits. It weighs
                stars, forks, PR complexity, and recency to calculate a true
                "Impact Score" out of 50.
              </p>
            </div>
          </div>

          {/* Card 2: Tall - Archetypes (WITH INTERACTIVE WHEEL) */}
          <div className="md:row-span-2 bg-card border border-border rounded-3xl relative overflow-hidden group hover:border-purple-500/50 transition-colors flex flex-col">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

            {/* Header Content */}
            <div className="relative z-10 p-8 pb-0">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                20 Developer Archetypes
              </h3>
              <p className="text-muted-foreground mb-4">
                Are you "The Machine"? "The Architect"? Or "The Open Source
                Hero"? Discover your coding identity.
              </p>
            </div>

            {/* THE INTERACTIVE WHEEL */}
            <div className="flex-1 min-h-[400px] mt-4 relative">
              <InteractiveArchetypeWheel />
            </div>
          </div>

          {/* Card 3: Standard - Insights */}
          <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
            <p className="text-muted-foreground text-sm">
              We use heuristics to detect specific strengths like "High Test
              Coverage" or "Rapid Prototyping."
            </p>
          </div>

          {/* Card 4: Standard - Verified */}
          <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Verified Public Profile</h3>
            <p className="text-muted-foreground text-sm">
              Share a read-only{" "}
              <span className="font-mono text-emerald-500">
                gitproof.com/u/you
              </span>{" "}
              link on your resume. No embellishments, just proof.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- HOW IT WORKS (Simplified) ---
const Steps = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl font-bold">
            From GitHub to Hired in 3 Steps
          </h2>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-border md:hidden" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Connect",
                desc: "Sign in with GitHub. We scan your public history securely.",
                icon: Github,
              },
              {
                title: "Analyze",
                desc: "Our engine crunches the numbers to find your strengths.",
                icon: Search,
              },
              {
                title: "Share",
                desc: "Get your public URL and add it to your resume/LinkedIn.",
                icon: ArrowRight,
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex md:flex-col items-center md:text-center gap-6 relative"
              >
                <div className="w-14 h-14 rounded-full bg-background border-2 border-primary flex items-center justify-center shrink-0 z-10 shadow-lg shadow-primary/10">
                  <step.icon size={24} className="text-primary" />
                </div>
                <div className="pt-2 md:pt-0">
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FINAL CTA ---
const FinalCTA = ({
  onLogin,
  session,
}: {
  onLogin: () => void;
  session: any;
}) => (
  <section className="py-32 px-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-primary/5 skew-y-3 transform origin-bottom-left -z-10" />

    <div className="max-w-3xl mx-auto text-center space-y-8">
      <h2 className="font-serif text-5xl md:text-6xl font-bold tracking-tight">
        {session ? "Keep building your legacy." : "Ready to verify your skills?"}
      </h2>
      <p className="text-xl text-muted-foreground">
        {session
          ? "Update your profile preferences and generate your latest report card."
          : "Join thousands of developers who are letting their code do the talking."}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {session ? (
          <Link
            href="/editor"
            className="h-14 px-10 rounded-full bg-foreground text-background font-bold text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
          >
            <PenTool size={22} />
            Go to Editor
          </Link>
        ) : (
          <button
            onClick={onLogin}
            className="h-14 px-10 rounded-full bg-foreground text-background font-bold text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3 hover:cursor-pointer"
          >
            <Github size={22} />
            Claim Your Profile
          </button>
        )}
      </div>

      {!session && (
        <p className="text-xs text-muted-foreground font-mono opacity-70">
          Takes &lt; 30 seconds · No credit card required
        </p>
      )}
    </div>
  </section>
);

// --- MAIN PAGE COMPONENT ---
export default function LandingPage() {
  const { data: session } = useSession();

  const handleLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl font-bold flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <GitGraph size={18} />
            </div>
            GitProof
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/methodology"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Methodology
            </Link>
            {session?.user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-full transition-all"
              >
                <img
                  src={(session.user as any).image || ""}
                  alt={(session.user as any).name || "User"}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium text-foreground hidden sm:inline">
                  @{(session.user as any).username || session.user.name}
                </span>
              </Link>
            ) : (
              <button
                onClick={handleLogin}
                className="text-sm font-medium px-5 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-full transition-all hover:cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Sections */}
      <Hero onLogin={handleLogin} session={session} />
      <FeaturesBento />
      <Steps />
      <FinalCTA onLogin={handleLogin} session = {session}/>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-serif font-bold text-foreground">
              GitProof
            </span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link
              href="/methodology"
              className="hover:text-primary transition-colors"
            >
              How Scoring Works
            </Link>
            <a
              href="https://github.com/bgar324/gitproof-2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
