"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, GitGraph, LogOut, LayoutDashboard } from "lucide-react";
import { useSyncExternalStore } from "react";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { cn } from "@/lib/utils";

interface NavbarProps {
  session?: Session | null;
  variant?: "marketing" | "app" | "public";
}

export function Navbar({ session, variant = "marketing" }: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isAuthenticated = !!session?.user;
  const homeHref = isAuthenticated ? "/dashboard" : "/";

  const marketingLinks = [
    { href: "/methodology", label: "Methodology" },
    { href: "/manifesto", label: "Manifesto" },
  ];

  const handleSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const ThemeToggle = (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-accent transition-colors hover:cursor-pointer"
      aria-label="Toggle theme"
    >
      {isClient && theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={homeHref} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <GitGraph size={18} />
          </div>
          <span className="font-serif text-lg md:text-xl font-bold tracking-tight">
            GitProof
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* MARKETING VARIANT */}
          {variant === "marketing" && (
            <>
              <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
                {marketingLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "transition-colors hover:text-foreground",
                      pathname === link.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
            </>
          )}

          {/* PUBLIC VARIANT */}
          {variant === "public" && ThemeToggle}

          {/* MARKETING / APP THEME TOGGLE */}
          {variant !== "public" && ThemeToggle}

          {/* AUTH ACTIONS */}
          {isAuthenticated ? (
            <>
              {variant === "app" && (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <div className="w-px h-6 bg-border/50" />
                </>
              )}

              {(variant === "marketing" || variant === "public") &&
                pathname !== "/dashboard" &&
                session?.user && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-full transition-all"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-secondary" />
                    )}
                    <span className="hidden sm:inline text-sm font-medium">
                      @{session.user.username || session.user.name || "user"}
                    </span>
                  </Link>
                )}

              {variant === "app" && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
            </>
          ) : (
            <>
              {variant === "public" ? (
                <Link
                  href="/"
                  className="text-xs font-medium bg-foreground text-background px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                >
                  Claim Your Profile
                </Link>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="text-sm font-medium px-5 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-full transition-all"
                >
                  Sign In
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
