import { Layers, BookOpen } from "lucide-react";
import Link from "next/link";
import { ReportCard } from "@/components/report-card";
import type { ReportUser } from "@/components/report-card";
import type { UserInsights, UserStats } from "@/lib/stats";

interface HeroSectionProps {
  user: ReportUser;
  stats: UserStats;
  insights: UserInsights;
  topTech: string[];
}

export function HeroSection({ user, stats, insights, topTech }: HeroSectionProps) {
  return (
    <section className="border-b border-border py-16 md:py-24 bg-background/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-8 pt-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight">
                  {user.name}
                </h1>
                <p className="text-xl text-muted-foreground font-mono">
                  @{user.username}
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground/90 leading-relaxed border-l-2 border-border pl-4">
              {user.bio ||
                "Full-stack engineer building scalable systems. Verified by GitProof analysis."}
            </p>

            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
            >
              <BookOpen size={14} className="group-hover:scale-110 transition-transform" />
              <span className="underline decoration-dotted underline-offset-2">
                Read our methodology
              </span>
            </Link>

            {topTech.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <Layers size={12} />
                  <span>Primary Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topTech.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded bg-secondary border border-border text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="w-full max-w-[480px]">
              <ReportCard
                user={user}
                stats={stats}
                insights={insights}
                className="shadow-xl shadow-black/5 dark:shadow-black/20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
