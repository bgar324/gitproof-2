import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import RecruiterView from "./view";
import { syncUserData } from "@/lib/sync";

export default async function RecruiterPage() {
  const session = await auth();

  if (!session?.user?.email || !session?.user?.username) {
    if (!session?.user) return redirect("/");
    return <div>Error: Missing GitHub data.</div>;
  }

  const { username, email } = session.user;

  // 1. Fetch User & Projects
  let user = await db.user.findUnique({
    where: { email: email },
    include: {
      projects: {
        orderBy: { impactScore: "desc" },
        take: 6,
      },
    },
  });

  // 2. Check if data is stale (> 1 hour old) or missing
  const ONE_HOUR = 60 * 60 * 1000;
  const isStale = !user?.lastSyncedAt ||
    (Date.now() - user.lastSyncedAt.getTime()) > ONE_HOUR;
  const needsSync = !user || user.projects.length === 0 || isStale;

  // 3. Sync if needed
  if (needsSync) {
    await syncUserData(username, email, session.user.image || "");

    // Re-fetch after sync
    user = await db.user.findUnique({
      where: { email: email },
      include: {
        projects: {
          orderBy: { impactScore: "desc" },
          take: 6,
        },
      },
    });
  }

  if (!user) return <div>Failed to load data.</div>;

  // 3. MAP TO VIEW (Fixing the errors here)
  const viewProjects = user.projects.map((p) => ({
    id: p.id,
    repo: p.name, // ✅ Fixes 'repoName' error
    url: p.url, // ✅ Fixes 'repoUrl' error
    raw_desc: p.desc, // FIXED: was p.description
    recruiter_desc: p.aiDescription,
    tags: p.topics,
    impact_score: p.impactScore,
    isPublic: true,
    readme: p.readme,
  }));

  return <RecruiterView projects={viewProjects} username={username} />;
}
