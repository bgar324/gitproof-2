import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HealthCheck {
  label: string;
  passed: boolean;
  tip: string;
  value: string;
}

interface RepoHealthSidebarProps {
  checks: HealthCheck[];
}

export function getHealthChecks(repo: {
  desc?: string | null;
  readme?: string | null;
  topics?: string[];
  homepage?: string | null;
}): HealthCheck[] {
  return [
    {
      label: "Meaningful Description",
      passed: !!(repo.desc && repo.desc.length > 15),
      tip: "Descriptions under 15 chars look lazy. Explain *what* it does.",
      value: repo.desc ? `${repo.desc.length} chars` : "Missing",
    },
    {
      label: "Comprehensive ReadMe",
      passed: !!(repo.readme && repo.readme.length > 300),
      tip: "Your ReadMe is too short (<300 chars). Add 'Setup' and 'Features'.",
      value: repo.readme ? `${repo.readme.length} chars` : "Missing",
    },
    {
      label: "Discoverable Tags",
      passed: !!(repo.topics && repo.topics.length >= 3),
      tip: "Add at least 3 tags (e.g., 'react', 'database') on GitHub.",
      value: repo.topics ? `${repo.topics.length} tags` : "0 tags",
    },
    {
      label: "Live Demo / Homepage",
      passed: !!repo.homepage,
      tip: "Recruiters want to click things. Add a URL to the repo 'About' section.",
      value: repo.homepage ? "Linked" : "Missing",
    },
  ];
}

export function RepoHealthSidebar({ checks }: RepoHealthSidebarProps) {
  const score = checks.filter((c) => c.passed).length;
  const healthPercent = Math.round((score / checks.length) * 100);

  return (
    <div className="w-full md:w-80 border-r border-border/60 bg-muted/5 flex flex-col shrink-0 overflow-y-auto">
      <div className="p-6 border-b border-border/40">
        <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4">
          Repository Health
        </h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span
            className={cn(
              "text-4xl font-black tracking-tighter",
              healthPercent === 100
                ? "text-emerald-500"
                : healthPercent >= 50
                ? "text-yellow-500"
                : "text-red-500"
            )}
          >
            {healthPercent}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthPercent}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            className={cn(
              "h-full",
              healthPercent === 100
                ? "bg-emerald-500"
                : healthPercent >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
            )}
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {checks.map((check, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full ring-2 ring-offset-1 ring-offset-background",
                    check.passed
                      ? "bg-emerald-500 ring-emerald-500/20"
                      : "bg-muted-foreground/30 ring-muted-foreground/10"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    check.passed ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {check.label}
                </span>
              </div>
            </div>
            {!check.passed && (
              <div className="ml-3.5 pl-3 border-l border-border mt-2">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {check.tip}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
