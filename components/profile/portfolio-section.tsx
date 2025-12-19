"use client";

import { useState } from "react";
import { Code2 } from "lucide-react";
import { PublicRepoCard } from "./public-repo-card";
import { ScoreModal } from "@/components/dashboard/score-modal";
import type { Project } from "@prisma/client";

interface PortfolioSectionProps {
  projects: Project[];
}

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [showScoreModal, setShowScoreModal] = useState(false);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-border">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">
            Selected Work
          </h2>

          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span>High-impact contributions verified by analysis</span>
            <span className="text-border">•</span>
            <button
              onClick={() => setShowScoreModal(true)}
              className="text-muted-foreground transition-colors hover:underline decoration-dotted underline-offset-2 flex items-center gap-1 hover:cursor-pointer"
            >
              How is this calculated?
            </button>
          </div>
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

      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
      />
    </section>
  );
}
