"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, GitGraph, LogOut, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
interface NavbarProps {
  session?: any;
  variant?: "marketing" | "app";
}

export function Navbar({ session, variant = "marketing" }: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={homeHref} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <GitGraph size={18} />
          </div>
          <span className="font-serif text-lg md:text-xl font-bold tracking-tight">
            GitProof
          </span>
        </Link>

        {/* Nav Links & Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Marketing Links */}
          {variant === "marketing" && (
            <>
              <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
                {marketingLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors hover:text-foreground ${
                      pathname === link.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="h-4 w-[1px] bg-border hidden sm:block" />
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Moon size={16} />
            ) : (
              <Sun size={16} />
            )}
          </button>

          {/* Authentication Actions */}
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

              {variant === "marketing" && pathname !== "/dashboard" && (
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
            <button
              onClick={handleSignIn}
              className="text-sm font-medium px-5 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-full transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
