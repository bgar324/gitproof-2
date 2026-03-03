"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  Github,
  LayoutDashboard,
  PenTool,
  ShieldCheck,
} from "lucide-react";
import { signIn } from "next-auth/react";
import type { Session } from "next-auth";
import { DemoReportCard } from "./demo-report-card";

interface HeroProps {
  session?: Session | null;
}

const trustPoints = [
  "Public repositories only",
  "Encrypted GitHub tokens at rest",
  "Delete stored data from Settings",
];

export function Hero({ session }: HeroProps) {
  const handleLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <section className="px-6 pt-24 pb-16 sm:pt-28 lg:pt-32 lg:pb-24">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border/70 bg-gradient-to-b from-background to-secondary/20 p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground"
            >
              <ShieldCheck size={14} className="text-emerald-500" />
              Public GitHub data, presented more clearly
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="space-y-5"
            >
              <h1 className="max-w-3xl font-serif text-5xl leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                A simpler public profile for your GitHub work.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                GitProof turns your public repositories and activity into a cleaner,
                easier-to-review profile. It is built for clarity, not hype.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:opacity-95"
                  >
                    <LayoutDashboard size={18} />
                    Open Dashboard
                  </Link>
                  <Link
                    href="/editor"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
                  >
                    <PenTool size={18} />
                    Open Editor
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:opacity-95 hover:cursor-pointer"
                  >
                    <Github size={18} />
                    Connect GitHub
                  </button>
                  <Link
                    href="/methodology"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
                  >
                    <BarChart3 size={18} />
                    How scoring works
                  </Link>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="grid gap-3 sm:grid-cols-3"
            >
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-border/70 bg-background/80 px-4 py-4"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Trust
                  </div>
                  <p className="text-sm leading-6 text-foreground/85">{point}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="lg:pl-4"
          >
            <DemoReportCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
