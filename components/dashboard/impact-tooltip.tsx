import { Star, Zap, Shield } from "lucide-react";

interface ImpactTooltipProps {
  score: number;
  breakdown: {
    stars: number;
    forks: number;
    updatedAt: string;
  };
}

export function ImpactTooltip({ score, breakdown }: ImpactTooltipProps) {
  if (!breakdown) return null;

  const daysSince = Math.floor(
    (new Date().getTime() - new Date(breakdown.updatedAt).getTime()) /
      (1000 * 3600 * 24)
  );

  let recencyLabel = "Archived";
  let recencyColor = "text-muted-foreground";
  if (daysSince < 7) {
    recencyLabel = "S-Tier Activity (< 7d)";
    recencyColor = "text-emerald-500";
  } else if (daysSince < 30) {
    recencyLabel = "Active (< 30d)";
    recencyColor = "text-emerald-400";
  } else if (daysSince < 90) {
    recencyLabel = "Recent (< 90d)";
    recencyColor = "text-yellow-500";
  }

  const popularityScore = Math.round(
    Math.log2(breakdown.stars + breakdown.forks * 2 + 1) * 3
  );
  const recencyScore = daysSince < 7 ? 15 : daysSince < 30 ? 10 : daysSince < 90 ? 5 : 0;
  const maturityScore = score - recencyScore - popularityScore;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-4 z-50 hidden group-hover/score:block pointer-events-none">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-border/50">
        <span className="text-xs font-semibold text-foreground">
          Impact Calculation
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          MAX 50
        </span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Star size={10} /> Popularity
          </span>
          <span className="font-mono text-foreground">{popularityScore} pts</span>
        </div>
        <div className="flex justify-between">
          <span className={`${recencyColor} flex items-center gap-1`}>
            <Zap size={10} /> {recencyLabel}
          </span>
          <span className="font-mono text-foreground">{recencyScore} pts</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Shield size={10} /> Maturity
          </span>
          <span className="font-mono text-foreground">{maturityScore} pts</span>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-border/50 flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Total Score
        </span>
        <span className="font-bold text-lg text-primary">{score}</span>
      </div>
    </div>
  );
}
