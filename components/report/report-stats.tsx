import { StatBox } from "./stat-box";
import type { UserStats } from "@/lib/stats";

interface ReportStatsProps {
  stats: UserStats;
}

export function ReportStats({ stats }: ReportStatsProps) {
  return (
    <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-card">
      <StatBox
        label="Impact Score"
        value={stats.impactScore}
        sub="Calculated"
      />
      <StatBox
        label="Total Commits"
        value={stats.totalContributions}
        sub="All Time"
      />
      <StatBox
        label="Consistency"
        value={`${stats.consistency}%`}
        sub="Weekly Streak"
        subColor="text-emerald-500"
      />
    </div>
  );
}
