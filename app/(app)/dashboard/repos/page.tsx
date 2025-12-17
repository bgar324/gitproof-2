import ReposView from "./view";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { syncUserData } from "@/lib/sync";

export default async function AllReposPage() {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.email || !session?.user?.username) {
    redirect("/");
  }

  // 2. Fetch user and check staleness
  let user = await db.user.findUnique({
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
  const isStale = !user?.lastSyncedAt ||
    (Date.now() - user.lastSyncedAt.getTime()) > ONE_HOUR;

  // 4. If stale, sync repos to database
  if (isStale) {
    console.log("🔄 Repos are stale, triggering sync...");
    await syncUserData(
      session.user.username,
      session.user.email,
      session.user.image || ""
    );

    // Refetch user with updated projects
    user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        projects: {
          orderBy: { impactScore: 'desc' },
        },
      },
    });

    if (!user) {
      redirect("/");
    }
  }

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
    color: "#6e7681", // Default gray
    topics: p.topics,
    readme: p.readme || "",
    homepage: p.homepage,
    lastPush: p.lastPush.toISOString(),
    isPublic: true, // All synced repos are public
    updated: p.lastPush.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return <ReposView repos={repos} />;
}