// app/dashboard/page.tsx
import { getGitProofData } from "@/lib/github";
import DashboardView from "./view";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { syncUserData } from "@/lib/sync";
import { GitHubRateLimitError } from "@/lib/rate-limit";
import { sanitizeForPostgres } from "@/lib/sanitize";

export default async function DashboardPage() {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.email || !session?.user?.username) {
    redirect("/");
  }

  // 2. Try DB cache first (include projects for topRepos)
  let user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        orderBy: { impactScore: 'desc' },
        take: 6, // Top 6 for dashboard
      },
    },
  });

  // 3. Check if cache is stale (> 1 hour old)
  const ONE_HOUR = 60 * 60 * 1000;
  const isStale = !user?.lastSyncedAt ||
    (Date.now() - user.lastSyncedAt.getTime()) > ONE_HOUR;

  // 4. Fetch fresh data if stale or missing
  if (!user || !user.profileData || isStale) {
    console.log("🔄 Data is stale, syncing repos to database...");

    try {
      // Sync repos to projects table
      await syncUserData(
        session.user.username,
        session.user.email,
        session.user.image || ""
      );

      // Fetch fresh data for dashboard
      const freshData = await getGitProofData();
      if (!freshData) {
        redirect("/");
      }

      // 5. Save to cache (sanitize to remove null bytes)
      const sanitizedData = sanitizeForPostgres(freshData);
      await db.user.update({
        where: { email: session.user.email },
        data: {
          profileData: sanitizedData as any,
          lastSyncedAt: new Date(),
        },
      });

      return <DashboardView data={freshData} lastSyncedAt={new Date()} />;
    } catch (error: any) {
      // CRITICAL FIX: Handle rate limit errors gracefully
      if (error instanceof GitHubRateLimitError) {
        // Return error state view instead of crashing
        return (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-card border border-red-500/20 rounded-xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">⏱️</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Rate Limit Reached
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {error.message}
              </p>
              <p className="text-xs text-muted-foreground">
                GitHub limits API requests to prevent abuse. Your data will sync
                automatically after the limit resets.
              </p>
            </div>
          </div>
        );
      }

      // For other errors, redirect to home
      console.error("Dashboard sync error:", error);
      redirect("/");
    }
  }

  // 6. Use cached data + live projects from DB
  const cachedData = user.profileData as any;

  // Map projects to topRepos format
  const topRepos = user.projects.map((p) => ({
    id: p.githubId,
    name: p.name,
    url: p.url,
    desc: p.desc,
    stars: p.stars,
    forks: p.forks,
    score: p.impactScore,
    language: p.language || "Markdown",
    color: "#6e7681",
    topics: p.topics,
    readme: p.readme || "",
    homepage: p.homepage,
    lastPush: p.lastPush.toISOString(),
    isPublic: true,
    updated: p.lastPush.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    breakdown: { stars: p.stars, forks: p.forks, updatedAt: p.lastPush.toISOString() },
  }));

  // Merge cached data with live projects and user info
  const hybridData = {
    ...cachedData,
    topRepos, // Always fresh from DB
    image: user.image || cachedData.image, // Ensure avatar is included
    username: user.username || cachedData.username,
  };

  return <DashboardView data={hybridData} lastSyncedAt={user.lastSyncedAt || new Date()} />;
}