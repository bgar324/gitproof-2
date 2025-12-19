"use client";

import Link from "next/link";
import { PenTool, Github } from "lucide-react";
import type { Session } from "next-auth";

interface FinalCTAProps {
  session?: Session | null;
}

export function FinalCTA({ session }: FinalCTAProps) {
  const handleLogin = () => {
    window.location.href = "/api/auth/signin/github";
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 skew-y-3 transform origin-bottom-left -z-10" />

      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="font-serif text-5xl md:text-6xl font-bold tracking-tight">
          {session
            ? "Keep building your legacy."
            : "Ready to verify your skills?"}
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
              onClick={handleLogin}
              className="h-14 px-10 rounded-full bg-foreground text-background font-bold text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
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
}
