"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Github, LayoutDashboard } from "lucide-react";
import { signIn } from "next-auth/react";
import type { Session } from "next-auth";
import { ARCHETYPES } from "@/lib/data";

interface ArchetypeCarouselProps {
  session?: Session | null;
}

export function ArchetypeCarousel({ session }: ArchetypeCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = ARCHETYPES[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? ARCHETYPES.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === ARCHETYPES.length - 1 ? 0 : current + 1,
    );
  };

  const handleLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <section className="px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-3xl border border-border/70 bg-card px-6 py-8 sm:px-8 lg:px-10">
        <div className="max-w-2xl space-y-4">
          <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
            Archetypes
          </h2>
          <p className="text-base leading-8 text-muted-foreground sm:text-lg">
            GitProof groups visible patterns into shorthand labels. They are a
            quick summary of how someone tends to build, not a final judgment.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="rounded-3xl border border-border/70 bg-background px-6 py-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Active archetype
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {activeIndex + 1} of {ARCHETYPES.length}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  aria-label="Previous archetype"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary/60 hover:cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goToNext}
                  aria-label="Next archetype"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary/60 hover:cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-border/70 bg-secondary/25 px-6 py-6"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${active.bg} ${active.color}`}
                >
                  <active.icon size={26} />
                </div>

                <h3 className="font-serif text-3xl tracking-tight text-foreground">
                  {active.label}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                  This label highlights a recurring pattern in visible project and
                  activity data. It is meant to make the profile easier to scan.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="rounded-3xl border border-border/70 bg-secondary/25 px-6 py-6">
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Next step
            </div>
            <h3 className="mt-3 font-serif text-3xl tracking-tight text-foreground">
              Build the profile, then decide what stays visible.
            </h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              The archetypes are one layer of the summary. The full profile also
              includes your visible repositories, activity, and the edits you choose
              to keep.
            </p>

            <div className="mt-6">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:opacity-95"
                >
                  <LayoutDashboard size={18} />
                  Open Dashboard
                </Link>
              ) : (
                <button
                  onClick={handleLogin}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:opacity-95 hover:cursor-pointer"
                >
                  <Github size={18} />
                  Connect GitHub
                </button>
              )}
            </div>

            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              Public repositories only. No private repo access.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
