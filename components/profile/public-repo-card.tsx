import { Code2, Star, GitFork, Globe, Lock, Github, ExternalLink } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

function getScoreColor(score: number) {
  if (score >= 40) return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 20) return "text-amber-600 bg-amber-500/10 border-amber-500/20";
  return "text-red-600 bg-red-500/10 border-red-500/20";
}

interface PublicRepoCardProps {
  repo: {
    name: string;
    desc?: string | null;
    aiDescription?: string | null;
    impactScore: number;
    isPublic?: boolean | null;
    url: string;
    homepage?: string | null;
    language?: string | null;
    stars: number;
    forks: number;
    lastPush: Date;
  };
}

export function PublicRepoCard({ repo }: PublicRepoCardProps) {
  const hasHomepage = !!repo.homepage;

  return (
    <div className="break-inside-avoid mb-6 group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col">
      <div className="p-5 flex flex-col gap-4">
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
                <div
                  className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1",
                    getScoreColor(repo.impactScore)
                  )}
                >
                  <span className="font-bold">{repo.impactScore}</span>
                  <span className="opacity-70">/50</span>
                </div>
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

        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {repo.aiDescription || repo.desc || "No description provided."}
          </p>
        </div>

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
              href={repo.homepage || "#"}
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
}
