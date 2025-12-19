"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  GitGraph,
  Menu,
  PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "Editor",
    href: "/editor",
    icon: PenTool
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* --- TOP NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <GitGraph size={18} />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight">GitProof</span>
          </Link>

          {/* Desktop Nav (The "Pill") */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/50">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <item.icon size={16} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
             <Link
               href="/settings"
               className={cn(
                 "p-2 rounded-full transition-colors",
                 pathname.startsWith("/settings")
                   ? "bg-secondary text-foreground"
                   : "text-muted-foreground hover:bg-secondary hover:text-foreground"
               )}
               title="Settings"
             >
               <Settings size={20} />
             </Link>
             <div className="w-px h-6 bg-border/50" />
             <button
               onClick={() => signOut({ callbackUrl: "/" })}
               className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-red-500 transition-colors hover:cursor-pointer"
             >
               <LogOut size={16} />
               Sign Out
             </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border bg-background overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                      pathname.startsWith(item.href)
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
                <Link
                   href="/settings"
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                      pathname.startsWith("/settings")
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                   )}
                >
                   <Settings size={18} />
                   Settings
                </Link>
                <button
                   onClick={() => signOut({ callbackUrl: "/" })}
                   className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10"
                >
                   <LogOut size={18} />
                   Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 w-full">
        {children}
      </div>

      {/* Toast Notifications */}
      <Toaster position="bottom-right" richColors />

    </div>
  );
}