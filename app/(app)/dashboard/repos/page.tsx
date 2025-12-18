import ReposView from "./view";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getLanguageColor } from "@/lib/language-colors";

export default async function AllReposPage() {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.email || !session?.user?.username) {
    redirect("/");
  }

  // 2. Fetch user and projects
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        orderBy: { impactScore: 'desc' },
        // No limit - show ALL repos
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  // 3. Check if cache is stale (> 1 hour old) - same as dashboard
  const ONE_HOUR = 60 * 60 * 1000;
  const lastSyncedAt = user.lastSyncedAt || null;
  const isStale = !lastSyncedAt ||
    (Date.now() - lastSyncedAt.getTime()) > ONE_HOUR;

  // 3. Map to expected format
  const repos = user.projects.map((p) => ({
    id: p.githubId,
    name: p.name,
    url: p.url,
    desc: p.desc,
    stars: p.stars,
    forks: p.forks,
    score: p.impactScore,
    language: p.language || "Markdown",
    color: getLanguageColor(p.language),
    topics: p.topics,
    readme: p.readme || "",
    homepage: p.homepage,
    lastPush: p.lastPush.toISOString(),
    isPublic: true, // All synced repos are public
    updated: p.lastPush.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <ReposView
      repos={repos}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
    />
  );
}
