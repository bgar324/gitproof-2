import { Star, Info } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { EditorRepoCard } from "./editor-repo-card";
import type { ProjectWithPublic } from "./types";

interface FeaturedSectionProps {
  featuredRepos: ProjectWithPublic[];
  featuredCount: number;
  descriptionChanges: Map<string, string>;
  rewritingProjectId: string | null;
  onToggle: (repo: ProjectWithPublic) => void;
  onUpdateDesc: (id: string, desc: string) => void;
  onRewrite: (id: string) => void;
}

export function FeaturedSection({
  featuredRepos,
  featuredCount,
  descriptionChanges,
  rewritingProjectId,
  onToggle,
  onUpdateDesc,
  onRewrite,
}: FeaturedSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Star size={12} className="text-amber-500" /> Featured
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            {featuredCount} / 6
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/10 rounded-lg text-xs text-blue-600/80">
          <Info size={14} className="shrink-0" />
          <span>
            Rewriting descriptions here updates your{" "}
            <strong>GitProof Profile</strong> only. Your GitHub READMEs remain
            untouched.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {featuredRepos.length === 0 && (
            <div className="col-span-full p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">
                No repositories selected yet.
              </p>
              <p className="text-xs text-muted-foreground/50 mt-1">
                Select from your library below.
              </p>
            </div>
          )}
          {featuredRepos.map((repo) => {
            const currentDescription =
              descriptionChanges.get(repo.id) ||
              repo.aiDescription ||
              repo.desc ||
              "";
            return (
              <EditorRepoCard
                key={repo.id}
                repo={repo}
                isSelected={true}
                onToggle={onToggle}
                onUpdateDesc={onUpdateDesc}
                onRewrite={onRewrite}
                isRewriting={rewritingProjectId === repo.id}
                currentDescription={currentDescription}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
