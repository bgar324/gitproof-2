// app/dashboard/page.tsx
import DashboardView from "./view";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getLanguageColor } from "@/lib/language-colors";
import type { GithubProfile } from "@/lib/github";

export default async function DashboardPage() {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.email || !session?.user?.username) {
    redirect("/");
  }

  // 2. Try DB cache first (include projects for topRepos)
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        orderBy: { impactScore: 'desc' },
        take: 6, // Top 6 for dashboard
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  // 3. Check if cache is stale (> 1 hour old)
  const ONE_HOUR = 60 * 60 * 1000;
  const lastSyncedAt = user.lastSyncedAt || null;
  const now = new Date();
  const isStale = !lastSyncedAt ||
    (now.getTime() - lastSyncedAt.getTime()) > ONE_HOUR;
  const cachedData = (user.profileData || {}) as Partial<GithubProfile>;

  // Map projects to topRepos format
  const topRepos = user.projects.map((p) => ({
    id: p.githubId,
    name: p.name,
    url: p.url,
    desc: p.desc || "",
    stars: p.stars,
    forks: p.forks,
    score: p.impactScore,
    language: p.language || "Markdown",
    color: getLanguageColor(p.language),
    topics: p.topics,
    readme: p.readme || "",
    languages: p.language ? [p.language] : [],
    homepage: p.homepage,
    lastPush: p.lastPush.toISOString(),
    isPublic: true,
    updated: p.lastPush.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    breakdown: { stars: p.stars, forks: p.forks, updatedAt: p.lastPush.toISOString() },
  }));

  // Merge cached data with live projects and user info
  const hybridData: GithubProfile = {
    username: user.username || cachedData.username || session.user.username,
    image: user.image || cachedData.image || session.user.image || "",
    totalContributions: cachedData.totalContributions || 0,
    pullRequests: cachedData.pullRequests || 0,
    repoCount: user.projects.length || cachedData.repoCount || 0,
    streak: cachedData.streak || 0,
    topLanguages: Array.isArray(cachedData.topLanguages) ? cachedData.topLanguages : [],
    hourlyActivity: Array.isArray(cachedData.hourlyActivity) ? cachedData.hourlyActivity : [],
    heatmap: Array.isArray(cachedData.heatmap) ? cachedData.heatmap : [],
    topRepos, // Always fresh from DB
  };

  return (
    <DashboardView
      data={hybridData}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
    />
  );
}
