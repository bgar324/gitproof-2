import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ReportCard } from "@/components/report-card";
import { EditorWorkbench } from "./view";
import { calculateUserStats, analyzeUserInsights } from "@/lib/stats";
import Link from "next/link";
import { TrendingUp, GitCommit, Info, Lock } from "lucide-react";

export default async function EditorPage() {
  const session = await auth();
  if (!session?.user?.email) return redirect("/");

  // Fetch user with ALL projects (for portfolio editor)
  const userWithAllProjects = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        orderBy: { impactScore: "desc" },
      },
    },
  });

  if (!userWithAllProjects) return redirect("/");

  // Fetch user with VISIBLE projects only (for report card stats)
  const userWithVisibleProjects = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        where: { isHidden: false },
        orderBy: { impactScore: "desc" },
      },
    },
  });

  if (!userWithVisibleProjects) return redirect("/");

  // Calculate stats based on VISIBLE projects only (matches public profile)
  const stats = calculateUserStats(userWithVisibleProjects);
  const insights = analyzeUserInsights(userWithVisibleProjects, stats);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background flex flex-col md:flex-row overflow-hidden">
      {/* LEFT: Fixed Report Card + Growth Focus */}
      <section className="w-full md:w-[400px] lg:w-[450px] shrink-0 border-r border-border bg-secondary/10 md:h-[calc(100vh-64px)] md:sticky md:top-16 p-6 overflow-y-auto hidden md:block">
        <div className="h-full flex flex-col gap-4">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl">Your Report Card</h2>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Info size={12} />
                How is this calculated?
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              This is what recruiters see first.
            </p>
          </div>

          {/* Report Card */}
          <ReportCard
            user={userWithVisibleProjects}
            stats={stats}
            insights={insights}
            showGrowthFocus={false}
            className="shadow-sm"
            totalRepoCount={userWithAllProjects.projects.length}
          />

          {/* Growth Focus Section (Private - Editor Only) */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} className="text-amber-500" />
                Growth Focus
              </h3>
              <span className="text-[10px] font-mono text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                <Lock size={10} />
                Private
              </span>
            </div>
            <div className="space-y-3">
              {insights?.growthAreas && insights.growthAreas.length > 0 ? (
                insights.growthAreas.map((growth, index) => (
                  <div key={index} className="flex gap-3 items-start group">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-amber-400 shadow-sm shadow-amber-500/50" />
                    <span className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                      {growth.text}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex gap-3 items-start">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-amber-400 shadow-sm shadow-amber-500/50" />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    Keep building and shipping
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT: Workbench */}
      <section className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-background">
        <div className="w-full h-full p-6 md:p-10">
          <EditorWorkbench
            user={userWithVisibleProjects}
            projects={userWithAllProjects.projects}
          />
        </div>
      </section>
    </main>
  );
}
