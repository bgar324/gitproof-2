import { Code2 } from "lucide-react";
import { PublicRepoCard } from "./public-repo-card";

interface PortfolioSectionProps {
  projects: any[];
}

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  return (
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
          {projects.length} Projects Displayed
        </span>
      </div>

      <div className="columns-1 md:columns-2 gap-6 space-y-6">
        {projects.length === 0 ? (
          <div className="break-inside-avoid w-full py-24 text-center border border-dashed border-border rounded-xl bg-secondary/20">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <Code2 size={24} />
            </div>
            <p className="text-muted-foreground font-medium">
              No projects featured yet.
            </p>
          </div>
        ) : (
          projects.map((repo) => <PublicRepoCard key={repo.id} repo={repo} />)
        )}
      </div>
    </section>
  );
}
