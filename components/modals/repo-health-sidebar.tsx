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
  const descLength = repo.desc?.length || 0;
  const readmeLength = repo.readme?.length || 0;
  const topicCount = repo.topics?.length || 0;

  return [
    {
      label: "Quality Description",
      passed: descLength > 100,
      tip: descLength > 20
        ? "Good start! Write 100+ characters for maximum impact score (+5 points)."
        : "Add a detailed description (100+ chars) to earn +5 maturity points.",
      value: descLength > 0 ? `${descLength} chars` : "Missing",
    },
    {
      label: "Comprehensive README",
      passed: readmeLength > 2000,
      tip: readmeLength > 500
        ? "Good documentation! Write 2000+ characters for maximum impact (+5 points)."
        : readmeLength > 100
        ? "Expand your README to 500+ chars for +3 points, or 2000+ for +5 points."
        : "Add a detailed README (500+ chars) to earn up to +5 maturity points.",
      value: readmeLength > 0 ? `${readmeLength} chars` : "Missing",
    },
    {
      label: "Well-Tagged Repository",
      passed: topicCount >= 3,
      tip: topicCount >= 1
        ? "Add 2 more tags to earn +3 maturity points (currently +1)."
        : "Add 3+ relevant tags (e.g., 'react', 'typescript') for +3 maturity points.",
      value: `${topicCount} tag${topicCount !== 1 ? 's' : ''}`,
    },
    {
      label: "Live Demo / Homepage",
      passed: !!repo.homepage,
      tip: "Add a live demo URL or homepage to earn +3 maturity points. Recruiters love clicking things!",
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
