import { motion } from "framer-motion";
import {
  Code2,
  Star,
  GitFork,
  Plus,
  X,
  Loader2,
  Sparkles,
  Calendar,
  Lock,
  Globe,
} from "lucide-react";
import { cn, formatDate, getScoreColor } from "@/lib/utils";
import { getLanguageColor } from "@/lib/language-colors";
import type { ProjectWithPublic } from "./types";

interface EditorRepoCardProps {
  repo: ProjectWithPublic;
  isSelected: boolean;
  onToggle: (repo: ProjectWithPublic) => void;
  onUpdateDesc: (id: string, newDesc: string) => void;
  onRewrite: (id: string) => void;
  isRewriting: boolean;
  currentDescription: string;
}

export function EditorRepoCard({
  repo,
  isSelected,
  onToggle,
  onUpdateDesc,
  onRewrite,
  isRewriting,
  currentDescription,
}: EditorRepoCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative bg-card border rounded-xl transition-all duration-200 overflow-hidden flex flex-col h-full",
        isSelected
          ? "border-primary/40 shadow-md ring-1 ring-primary/10"
          : "border-border hover:border-primary/30 opacity-90 hover:opacity-100"
      )}
    >
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0",
                isSelected
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/50 text-muted-foreground group-hover:bg-secondary"
              )}
            >
              <Code2 size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm text-foreground line-clamp-1">
                  {repo.name}
                </h4>
                <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border shrink-0">
                  <span className={cn("font-bold", getScoreColor(repo.impactScore))}>
                    {repo.impactScore}
                  </span>
                  /50
                </div>
              </div>

              {!isSelected && (
                <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  />
                  {repo.language || "Plain Text"}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onToggle(repo)}
            className={cn(
              "p-1.5 rounded-md transition-all shrink-0",
              isSelected
                ? "text-muted-foreground hover:text-red-500 hover:bg-red-500/10 hover:cursor-pointer"
                : "text-primary hover:bg-primary/10 hover:cursor-pointer"
            )}
            title={isSelected ? "Remove from Portfolio" : "Add to Portfolio"}
          >
            {isSelected ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>

        {!isSelected && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {repo.desc || "No description provided."}
          </p>
        )}

        {isSelected && (
          <div className="space-y-4 mt-1">
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              {/* <div className="flex items-center gap-2">
                {repo.isPublic !== false ? (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium flex items-center gap-1">
                    <Globe size={10} /> Public
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground border border-border flex items-center gap-1">
                    <Lock size={10} /> Private
                  </span>
                )}
              </div> */}

              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  />
                  {repo.language || "Text"}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={12} /> {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={12} /> {repo.forks}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(repo.lastPush)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Description
                </span>
                <button
                  onClick={() => onRewrite(repo.id)}
                  disabled={isRewriting}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 border border-primary/20 text-[10px] font-medium text-primary hover:bg-primary/10 transition-colors disabled:opacity-70 disabled:cursor-wait hover:cursor-pointer"
                >
                  {isRewriting ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    <Sparkles size={10} />
                  )}
                  Rewrite
                </button>
              </div>
              <textarea
                className="w-full bg-secondary/30 hover:bg-secondary/50 focus:bg-background border border-transparent focus:border-primary/30 rounded-lg p-3 text-xs leading-relaxed resize-none outline-none transition-all placeholder:text-muted-foreground/50 font-mono disabled:opacity-70"
                rows={4}
                placeholder="Describe your impact..."
                value={currentDescription}
                onChange={(e) => onUpdateDesc(repo.id, e.target.value)}
                disabled={isRewriting}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
