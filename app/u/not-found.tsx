"use client";

import { UserX, Lock, TriangleAlert, Home, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
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
    icon: Lock,
    title: "Profile is Private",
    description:
      "This developer has chosen to keep their GitProof profile private.",
  },
  {
    icon: UserX,
    title: "Developer Not Found",
    description: "This developer hasn’t created their GitProof profile yet.",
  },
];

export default function UserNotFound() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="space-y-8 max-w-3xl"
      >
        {/* Icon */}
        <motion.div animate={floatingAnimation} className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl" />
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-red-500/80 flex items-center justify-center shadow-2xl shadow-red-500/30 ring-1 ring-foreground/10">
              <TriangleAlert
                size={48}
                className="text-white"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
            Profile Unavailable
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            This link points to a profile that isn’t public or hasn’t been
            created.
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
                    ? "bg-secondary/60 border-red-500/30 shadow-lg shadow-red-500/10"
                    : "bg-secondary/40 border-border/50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 ${
                    isHovered
                      ? "bg-red-500/10 text-red-500 scale-110"
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

        {/* Recruiter Tip */}
        <div className="max-w-xl mx-auto">
          <div className="bg-secondary/50 border border-border/50 rounded-xl p-5">
            <div className="flex gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">
                  Tip for Recruiters
                </h4>
                <p className="text-sm text-muted-foreground">
                  If this link came from a resume or LinkedIn profile, consider
                  reaching out directly. The developer may not have published
                  their GitProof profile yet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-6 py-3.5"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
