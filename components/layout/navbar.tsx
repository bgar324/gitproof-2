"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { GitGraph, LayoutDashboard, LogOut, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { cn } from "@/lib/utils";

interface NavbarProps {
  session?: Session | null;
  variant?: "marketing" | "app" | "public";
}

const chromeButtonClass =
  "inline-flex h-10 items-center justify-center rounded-full border border-border/70 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/50 cursor-pointer";

export function Navbar({ session, variant = "marketing" }: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isAuthenticated = !!session?.user;
  const homeHref = isAuthenticated ? "/dashboard" : "/";

  const navLinks =
    variant === "app" && isAuthenticated
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/settings", label: "Settings" },
        ]
      : [
          { href: "/methodology", label: "Methodology" },
          { href : "/manifesto", label : "Manifesto"},
          { href: "/privacy", label: "Privacy" },
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground hover:cursor-pointer"
      aria-label="Toggle theme"
    >
      {isClient && theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link href={homeHref} className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-secondary/40 text-foreground">
            <GitGraph size={17} />
          </div>
          <div className="min-w-0 leading-none">
            <div className="font-serif text-lg tracking-tight text-foreground">
              GitProof
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center rounded-full border border-border/70 bg-secondary/30 p-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {ThemeToggle}

          {isAuthenticated ? (
            <>
              {(variant === "marketing" || variant === "public") &&
                pathname !== "/dashboard" && (
                  <Link href="/dashboard" className={chromeButtonClass}>
                    <LayoutDashboard size={16} className="mr-2" />
                    Open App
                  </Link>
                )}

              {variant === "app" && (
                <button
                  onClick={handleSignOut}
                  className={chromeButtonClass}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              )}
            </>
          ) : (
            <>
              {variant === "public" ? (
                <Link href="/" className={chromeButtonClass}>
                  Open GitProof
                </Link>
              ) : (
                <button
                  onClick={handleSignIn}
                  className={chromeButtonClass}
                >
                  Connect GitHub
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
