"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  GitGraph,
  LayoutDashboard,
  LogOut,
  Menu,
  PenTool,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Editor",
    href: "/editor",
    icon: PenTool,
  },
];

const shellButtonClass =
  "inline-flex h-10 items-center justify-center rounded-full border border-border/70 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/50";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/92 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-secondary/40 text-foreground">
              <GitGraph size={17} />
            </div>
            <div className="min-w-0 leading-none">
              <div className="font-serif text-lg tracking-tight text-foreground">
                GitProof
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:block">
                Workspace
              </div>
            </div>
          </Link>

          <div className="hidden items-center rounded-full border border-border/70 bg-secondary/30 p-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/settings"
              className={cn(
                shellButtonClass,
                pathname.startsWith("/settings") && "bg-secondary/60",
              )}
            >
              <Settings size={16} className="mr-2" />
              Settings
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={shellButtonClass}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/70 bg-background md:hidden"
            >
              <div className="space-y-2 px-4 py-4">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "border-border/70 bg-secondary/40 text-foreground"
                          : "border-border/70 bg-background text-muted-foreground",
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}

                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                    pathname.startsWith("/settings")
                      ? "border-border/70 bg-secondary/40 text-foreground"
                      : "border-border/70 bg-background text-muted-foreground",
                  )}
                >
                  <Settings size={18} />
                  Settings
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/50"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="w-full flex-1">{children}</div>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}
