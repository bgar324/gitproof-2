// app/dashboard/page.tsx
import { getGitProofData } from "@/lib/github";
import DashboardView from "./view";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// Helper to sanitize data for PostgreSQL JSON storage
function sanitizeForPostgres(obj: any): any {
  const jsonString = JSON.stringify(obj);
  // Remove null bytes and other problematic Unicode characters
  const sanitized = jsonString.replace(/\\u0000/g, '').replace(/\u0000/g, '');
  return JSON.parse(sanitized);
}

export default async function DashboardPage() {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.email) {
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