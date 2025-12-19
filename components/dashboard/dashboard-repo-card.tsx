import { motion } from "framer-motion";
import { ArrowUpRight, Code2, Star, GitFork } from "lucide-react";
import { ImpactTooltip } from "./impact-tooltip";

interface DashboardRepoCardProps {
  repo: {
    name: string;
    desc: string;
    score: number;
    breakdown: {
      stars: number;
      forks: number;
      updatedAt: string;
    };
    isPublic: boolean;
    color: string;
    language: string;
    stars: number;
    forks: number;
    updated: string;
  };
  index: number;
  onClick: () => void;
}

export function DashboardRepoCard({ repo, index, onClick }: DashboardRepoCardProps) {
  return (
    <motion.div
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + index * 0.1 }}
      onClick={onClick}
      className="cursor-pointer block group h-full"
    >
      <div className="h-full bg-card border border-border rounded-xl p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Code2 size={20} />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                {repo.name}
                <ArrowUpRight
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </h4>
              <div className="relative group/score w-fit">
                <div className="text-[10px] text-muted-foreground font-mono cursor-help flex items-center gap-1 hover:text-foreground transition-colors mt-0.5">
                  Impact Score:{" "}
                  <span
                    className={`font-bold ${
                      repo.score >= 40
                        ? "text-emerald-500"
                        : repo.score >= 20
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {repo.score}
                  </span>{" "}
                  / 50
                </div>
                <ImpactTooltip score={repo.score} breakdown={repo.breakdown} />
              </div>
            </div>
          </div>
          {/* {repo.isPublic ? (
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium">
              Public
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground border border-border">
              Private
            </span>
          )} */}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-6 flex-1">
          {repo.desc}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: repo.color }}
              />
              {repo.language}
            </span>
            <span className="flex items-center gap-1">
              <Star size={12} /> {repo.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={12} /> {repo.forks}
            </span>
          </div>
          <div>{repo.updated}</div>
        </div>
      </div>
    </motion.div>
  );
}
