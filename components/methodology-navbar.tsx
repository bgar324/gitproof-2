"use client";

import Link from "next/link";
import { GitGraph, LogOut, LayoutDashboard } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

interface MethodologyNavbarProps {
  isAuthenticated: boolean;
}

export function MethodologyNavbar({ isAuthenticated }: MethodologyNavbarProps) {
  return (
    <header className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: GitProof Logo */}
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <GitGraph size={18} />
          </div>
          <span className="font-serif font-bold text-lg tracking-tight">
            GitProof
          </span>
        </Link>

        {/* Right: Auth-dependent actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
              <div className="w-px h-6 bg-border/50" />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors hover:cursor-pointer"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="text-sm font-medium px-5 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-full transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
