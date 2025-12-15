import ReposView from "./view";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export default async function AllReposPage() {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  // 2. Fetch from database (not GitHub API!)
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