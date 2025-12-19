"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReportHeader, getGrade } from "./report/report-header";
import { ReportStats } from "./report/report-stats";
import { ReportInsights } from "./report/report-insights";
import { getArchetype } from "./report/archetype-badge";
import type { UserInsights, UserStats } from "@/lib/stats";
import type { Project, User } from "@prisma/client";

export type ReportUser = User & {
  projects: Project[];
  profileData?: unknown;
};

interface ReportCardProps {
  user: ReportUser;
  stats: UserStats;
  insights?: UserInsights;
  showGrowthFocus?: boolean;
  className?: string;
  totalRepoCount?: number;
}

export function ReportCard({
  user,
  stats,
  insights,
  showGrowthFocus = false,
  className,
  totalRepoCount,
}: ReportCardProps) {
  // Get archetype data
  const {
    title: archetypeTitle,
    icon: archetypeIcon,
    color: archetypeColor,
  } = getArchetype(
    user.projects || [],
    stats,
    user.profileData,
    totalRepoCount
  );

  // Get grade data
  const grade = getGrade(stats.impactScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full shadow-2xl shadow-black/5",
        className
      )}
      suppressHydrationWarning
    >
      <ReportHeader
        name={user.name}
        username={user.username}
        image={user.image}
        archetypeTitle={archetypeTitle}
        archetypeIcon={archetypeIcon}
        archetypeColor={archetypeColor}
        grade={grade}
      />

      <ReportStats stats={stats} />

      <ReportInsights insights={insights} showGrowthFocus={showGrowthFocus} />
    </motion.div>
  );
}
