import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ReportCard } from "@/components/report-card";
import {
  Code2,
  Star,
  GitFork,
  Calendar,
  Globe,
  Lock,
  ShieldCheck,
  ExternalLink,
  Github,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  calculateUserStats,
  analyzeUserInsights,
  calculateTopTechnologies,
} from "@/lib/stats";

// Force dynamic rendering to check latest isPublic status
export const dynamic = "force-dynamic";

// --- HELPERS ---
const formatDate = (dateString: Date) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getScoreColor = (score: number) => {
  if (score >= 40)
    return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 20) return "text-amber-600 bg-amber-500/10 border-amber-500/20";
  return "text-red-600 bg-red-500/10 border-red-500/20";
};

// --- COMPONENT: CLEAN REPO CARD ---
const PublicRepoCard = ({ repo }: any) => {
  // Logic: Use homepage if exists, otherwise assume no live demo
  const hasHomepage = !!repo.homepage;

  return (
    <div className="break-inside-avoid mb-6 group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col">
      <div className="p-5 flex flex-col gap-4">
        {/* Header: Title & Meta */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-border/50">
              <Code2
                size={20}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-semibold text-base text-foreground leading-tight group-hover:text-primary transition-colors">
                {repo.name}
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                {/* Score Pill */}
                <div
                  className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1",
                    getScoreColor(repo.impactScore)
                  )}
                >
                  <span className="font-bold">{repo.impactScore}</span>
                  <span className="opacity-70">/50</span>
                </div>
                {/* Visibility */}
                <div className="text-[10px] font-medium text-muted-foreground flex items-center gap-1 opacity-70">
                  {repo.isPublic !== false ? (
                    <Globe size={10} />
                  ) : (
                    <Lock size={10} />
                  )}
                  <span>{repo.isPublic !== false ? "Public" : "Private"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description: Full Height */}
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {repo.aiDescription || repo.desc || "No description provided."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium transition-colors"
          >
            <Github size={14} />
            <span>Code</span>
          </a>

          {hasHomepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/20 text-xs font-medium text-primary transition-colors"
            >
              <ExternalLink size={14} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="px-5 py-3 bg-secondary/30 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-foreground/80">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {repo.language || "Unknown"}
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} /> {repo.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={12} /> {repo.forks}
          </span>
        </div>
        <span className="opacity-60">{formatDate(repo.lastPush)}</span>
      </div>
    </div>
  );
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!username || Array.isArray(username)) return notFound();

  const user = await db.user.findUnique({
    where: { username: username },
    include: {
      projects: {
        where: { isHidden: false },
        orderBy: { impactScore: "desc" },
      },
    },
  });

  if (!user || user.isPublic === false) return notFound();

  const stats = calculateUserStats(user);
  const insights = analyzeUserInsights(user, stats);
  const topTech = calculateTopTechnologies(user, 6);

  // Force limit to top 6
  const featuredProjects = user.projects.slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Pattern: Subtle Dot Grid */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.4] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />

      {/* HERO SECTION */}
      <section className="border-b border-border py-16 md:py-24 bg-background/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Identity */}
            <div className="lg:col-span-5 space-y-8 pt-2">
              <div className="space-y-4">

                {/* Name */}
                <div className="space-y-1">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight">
                    {user.name}
                  </h1>
                  <p className="text-xl text-muted-foreground font-mono">
                    @{user.username}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-lg text-muted-foreground/90 leading-relaxed border-l-2 border-border pl-4">
                {user.bio ||
                  "Full-stack engineer building scalable systems. Verified by GitProof analysis."}
              </p>

              {/* Tech Stack */}
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

            {/* Right: The Report Card */}
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

      {/* BODY: Portfolio (Masonry Layout) */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-border">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground">
              Selected Work
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              High-impact contributions verified by analysis.
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1.5 rounded-full border border-border">
            {featuredProjects.length} Projects Displayed
          </span>
        </div>

        {/* CSS COLUMNS for Bento/Masonry Effect */}
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {featuredProjects.length === 0 ? (
            <div className="break-inside-avoid w-full py-24 text-center border border-dashed border-border rounded-xl bg-secondary/20">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Code2 size={24} />
              </div>
              <p className="text-muted-foreground font-medium">
                No projects featured yet.
              </p>
            </div>
          ) : (
            featuredProjects.map((repo) => (
              <PublicRepoCard key={repo.id} repo={repo} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
