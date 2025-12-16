"use client";

import {
  GitGraph,
  ArrowRight,
  LayoutDashboard,
  Code2,
  Home,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Variants } from "framer-motion";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: [0.42, 0, 0.58, 1] as const, // Add 'as const' to ensure type safety
  },
};

const scenarios = [
  {
    icon: LayoutDashboard,
    title: "Check Dashboard",
    description: "You may be trying to access a private internal page.",
  },
  {
    icon: Code2,
    title: "Check the URL",
    description: "The path may be incorrect or referencing an old link.",
  },
];

export default function NotFound() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [msg, setMsg] = useState(0);

  const messages = [
    "// Status: 404 — route not found",
    "// git checkout -b page-exists",
    "// endpoint pending deployment",
    "// commit missing",
    "// not-found.tsx rendered",
  ];

  useEffect(() => {
    const id = setInterval(
      () => setMsg((m) => (m + 1) % messages.length),
      3000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="space-y-8 max-w-4xl"
      >
        {/* Icon */}
        <motion.div animate={floatingAnimation} className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30 ring-1 ring-foreground/10">
              <GitGraph
                size={36}
                className="text-primary-foreground"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
            404: Not Found
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            This route doesn’t exist or hasn’t shipped yet.
          </p>
        </div>

        {/* Scenarios */}
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
          {scenarios.map((s, i) => {
            const Icon = s.icon;
            const isHovered = hovered === i;
            return (
              <motion.div
                key={i}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className={`relative p-5 rounded-xl border transition-all duration-300 text-left ${
                  isHovered
                    ? "bg-secondary/60 border-primary/30 shadow-lg shadow-primary/10"
                    : "bg-secondary/40 border-border/50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 ${
                    isHovered
                      ? "bg-primary/10 text-primary scale-110"
                      : "bg-background text-muted-foreground"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Terminal */}
        <div className="max-w-xl mx-auto pt-4">
          <div className="bg-secondary/50 border border-border/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Code2 size={16} className="text-primary" />
              <span className="text-xs font-mono text-muted-foreground">
                SYSTEM LOG
              </span>
            </div>
            <motion.p
              key={msg}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-mono text-primary"
            >
              <span className="text-red-500 font-bold">$ </span>
              {messages[msg]}
            </motion.p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold bg-foreground text-background px-8 py-4 rounded-full hover:scale-105 transition-all shadow-2xl shadow-foreground/20"
          >
            <LayoutDashboard size={18} />
            Dashboard
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-6 py-4"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
