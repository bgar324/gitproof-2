"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = [
    { href: "/showcase", label: "Showcase" },
    { href: "/manifesto", label: "Manifesto" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
           {/* Logo Icon */}
           <div className="w-5 h-5 bg-foreground rounded-[4px] group-hover:opacity-80 transition-opacity" />
           <span className="font-serif text-xl font-medium tracking-tight">GitProof</span>
        </Link>
        
        <div className="flex items-center gap-6">
           <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
             {links.map((link) => (
               <Link 
                 key={link.href} 
                 href={link.href}
                 className={`transition-colors hover:text-foreground ${
                   pathname === link.href ? "text-foreground" : "text-muted-foreground"
                 }`}
               >
                 {link.label}
               </Link>
             ))}
           </div>

           <div className="h-4 w-[1px] bg-border hidden sm:block" />

           <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2 rounded-full hover:bg-accent transition-colors"
          >
            {mounted && theme === "dark" ? (
              <Moon size={16} />
            ) : (
              <Sun size={16} />
            )}
          </button>

           <Link 
            href="https://gitproof.vercel.app"
            className="flex items-center gap-2 text-sm font-medium bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
           >
             Get Started <ArrowRight size={14} />
           </Link>
        </div>
      </div>
    </nav>
  );
}