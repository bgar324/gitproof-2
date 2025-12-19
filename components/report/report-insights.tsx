import { Zap, TrendingUp, GitCommit } from "lucide-react";
import { InsightRow } from "./insight-row";
import type { UserInsights } from "@/lib/stats";

interface ReportInsightsProps {
  insights?: UserInsights;
  showGrowthFocus?: boolean;
}

export function ReportInsights({
  insights,
  showGrowthFocus = false,
}: ReportInsightsProps) {
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 bg-gradient-to-b from-card to-muted/20">
      {/* Strengths */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <h3 className="text-[10px] sm:text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
            <Zap size={12} className="text-emerald-500 sm:w-[14px] sm:h-[14px]" />
            Detected Strengths
          </h3>
          <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 sm:px-2 py-0.5 rounded">
            Analyzed
          </span>
        </div>
        <div className="space-y-2.5 sm:space-y-3 pl-0.5 sm:pl-1">
          {insights?.strengths && insights.strengths.length > 0 ? (
            insights.strengths.map((strength, index) => (
              <InsightRow key={index} type="strength" text={strength.text} />
            ))
          ) : (
            <InsightRow type="strength" text="Active GitHub contributor" />
          )}
        </div>
      </div>

      {/* Growth Focus - Private Section (Editor Only) */}
      {showGrowthFocus && (
        <>
          {/* Separator */}
          <div className="border-t border-dashed border-border/50" />

          {/* Growth */}
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                <TrendingUp size={12} className="text-amber-500 sm:w-[14px] sm:h-[14px]" />
                Growth Focus
              </h3>
              <span className="text-[9px] sm:text-[10px] font-mono text-amber-600 bg-amber-500/10 border border-amber-500/20 px-1.5 sm:px-2 py-0.5 rounded flex items-center gap-1">
                <GitCommit size={9} className="sm:w-[10px] sm:h-[10px]" />
                Private
              </span>
            </div>
            <div className="space-y-2.5 sm:space-y-3 pl-0.5 sm:pl-1">
              {insights?.growthAreas && insights.growthAreas.length > 0 ? (
                insights.growthAreas.map((growth, index) => (
                  <InsightRow key={index} type="weakness" text={growth.text} />
                ))
              ) : (
                <InsightRow type="weakness" text="Keep building and shipping" />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
