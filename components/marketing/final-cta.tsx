"use client";

import Link from "next/link";
import { Github, LayoutDashboard, PenTool } from "lucide-react";
import { signIn } from "next-auth/react";
import type { Session } from "next-auth";

interface FinalCTAProps {
  session?: Session | null;
}

export function FinalCTA({ session }: FinalCTAProps) {
  const handleLogin = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <section className="px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-3xl border border-border/70 bg-card px-6 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              {session ? "Your profile is ready to refine." : "Start with the work you already have."}
            </h2>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {session
                ? "Open the editor to adjust copy, featured repositories, and visibility."
                : "Connect GitHub, review the generated profile, and publish only when it looks right."}
            </p>
            <p className="text-sm leading-7 text-muted-foreground">
              No private repository access. Public data only.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:opacity-95"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  href="/editor"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
                >
                  <PenTool size={18} />
                  Editor
                </Link>
              </>
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
        </div>
      </div>
    </section>
  );
}
