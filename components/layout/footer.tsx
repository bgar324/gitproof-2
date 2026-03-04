import Link from "next/link";
import { GitGraph } from "lucide-react";

export function Footer() {
  const links = [
    { href: "/methodology", label: "Methodology" },
    { href: "/privacy", label: "Privacy" },
    { href : "/manifesto", label : "Manifesto"},
    {
      href: "https://github.com/bgar324/gitproof-2",
      label: "GitHub",
      external: true,
    },
  ];

  return (
    <footer className="border-t border-border/70 bg-secondary/15 px-6 py-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background text-foreground">
              <GitGraph size={17} />
            </div>
            <div className="leading-none">
              <div className="font-serif text-lg tracking-tight text-foreground">
                GitProof
              </div>
            </div>
          </div>

          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            GitProof reads public GitHub data, stores synced profile data and your
            saved edits, and lets you publish a cleaner public profile.
          </p>

          <div className="text-xs text-muted-foreground">
            Built by{" "}
            <a
              href="https://bentgarcia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground transition-colors hover:text-primary"
            >
              Benjamin Garcia
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center rounded-full border border-border/70 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex h-10 items-center rounded-full border border-border/70 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
