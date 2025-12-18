"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, GitFork, Activity } from "lucide-react";
import { GithubProfile } from "@/lib/github";
import { getTimeAgo } from "@/lib/utils";
import RepoModal from "@/components/repo-modal";
import { useRouter } from "next/navigation";
import { triggerSync } from "@/app/actions";
import {
  AnimatedCard,
  StatCard,
  ActivityHeatmap,
  ScoreModal,
  DashboardHeader,
  TimeRangeSelector,
  FocusHoursCard,
  TopReposHeader,
  DashboardRepoCard,
  TechStackCard,
} from "@/components/dashboard";

export default function DashboardView({
  data,
  lastSyncedAt,
}: {
  data: GithubProfile;
  lastSyncedAt: Date;
}) {
  const router = useRouter();
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"all" | "90d" | "30d">("all");
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(lastSyncedAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(lastSyncedAt));
    }, 60000);
    return () => clearInterval(interval);
  }, [lastSyncedAt]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await triggerSync();
      router.refresh();
      setTimeAgo("just now");
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredHeatmap = useMemo(() => {
    if (timeRange === "all") return data.heatmap;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (timeRange === "30d" ? 30 : 90));
    return data.heatmap.filter((day) => new Date(day.date) >= cutoff);
  }, [data.heatmap, timeRange]);

  const periodContributions = useMemo(() => {
    return filteredHeatmap.reduce((acc, curr) => acc + curr.count, 0);
  }, [filteredHeatmap]);

  const activeDays = useMemo(() => {
    return data.heatmap.filter((d) => d.count > 0).length;
  }, [data.heatmap]);

  const coveragePercent = Math.round((activeDays / 365) * 100);

  return (
    <main className="min-h-screen bg-background pt-8 pb-20 px-6">
      <ScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          username={data.username}
          streak={data.streak}
          image={data.image}
          timeAgo={timeAgo}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedCard delay={0.1}>
            <StatCard
              label="Total Contributions"
              value={data.totalContributions}
              icon={GitCommit}
              trend="All Time"
              color="text-green-500"
            />
          </AnimatedCard>
          <AnimatedCard delay={0.2}>
            <StatCard
              label="Pull Requests"
              value={data.pullRequests}
              icon={GitPullRequest}
              color="text-blue-500"
            />
          </AnimatedCard>
          <AnimatedCard delay={0.3}>
            <StatCard
              label="Repositories"
              value={data.repoCount}
              icon={GitFork}
              color="text-muted-foreground"
            />
          </AnimatedCard>
          <AnimatedCard delay={0.4}>
            <StatCard
              label="Active Days / Year"
              value={`${activeDays} Days`}
              icon={Activity}
              trend={`${coveragePercent}% Coverage`}
              color="text-emerald-500"
            />
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnimatedCard
            className="lg:col-span-2 flex flex-col min-h-[300px]"
            delay={0.5}
            allowOverflow={true}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="font-serif text-xl">Activity Log</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {periodContributions} contributions in{" "}
                  {timeRange === "all"
                    ? "the last year"
                    : `the last ${timeRange}`}
                </p>
              </div>
              <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            </div>
            <div className="flex-1 w-full relative">
              <ActivityHeatmap data={filteredHeatmap} />
            </div>
          </AnimatedCard>

          <AnimatedCard className="flex flex-col" delay={0.6}>
            <FocusHoursCard data={data.hourlyActivity} />
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <TopReposHeader
                repoCount={data.repoCount}
                onInfoClick={() => setIsScoreModalOpen(true)}
              />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.topRepos.slice(0, 6).map((repo, i) => (
                <DashboardRepoCard
                  key={repo.name}
                  repo={repo}
                  index={i}
                  onClick={() => setSelectedRepo(repo)}
                />
              ))}
            </div>
          </div>

          <AnimatedCard delay={0.8} className="h-fit">
            <TechStackCard languages={data.topLanguages} />
          </AnimatedCard>
        </div>
      </div>
      <RepoModal
        repo={selectedRepo}
        isOpen={!!selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />
    </main>
  );
}
