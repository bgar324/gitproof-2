import Link from "next/link";
import { GitGraph } from "lucide-react";

export function Footer() {
  const links = [
    { href: "/methodology", label: "Methodology" },
    { href: "/manifesto", label: "Manifesto" },
    {
      href: "https://github.com/bgar324/gitproof-2",
      label: "GitHub",
      external: true,
    },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <footer className="w-full border-t border-border bg-background px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-transform">
            <GitGraph size={18} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-serif font-bold text-lg tracking-tight text-foreground">
              GitProof
            </span>
            {/* <span className="hidden sm:block text-muted-foreground/40 text-xs">
              © {currentYear}
            </span> */}
          </div>
        </div>

        {/* Center: Navigation with Dot Dividers */}
        <nav className="flex items-center text-sm font-medium text-muted-foreground">
          {links.map((link, index) => (
            <div key={link.href} className="flex items-center">
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              )}
              {/* Only show the dot if it's not the last item */}
              {index < links.length - 1 && (
                <span className="mx-3 text-border select-none">·</span>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Personal Credit */}
        <div className="text-xs text-muted-foreground/70">
          <p>
            Built by{" "}
            <a
              href="https://bentgarcia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary font-medium transition-colors underline underline-offset-4 decoration-border/50 hover:decoration-primary"
            >
              Benjamin Garcia
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
