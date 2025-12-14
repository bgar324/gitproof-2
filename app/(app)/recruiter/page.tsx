import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import RecruiterView from "./view";
import { syncUserData } from "@/lib/sync";

export default async function RecruiterPage() {
  const session = await auth();

  // DEBUG: Uncomment this if you get stuck again to see what's missing
  // console.log("Session data:", session?.user);

  // 1. CHECK: Ensure we have the critical data
  if (!session?.user?.email || !session?.user?.username) {
    // If missing, show error instead of redirecting so you know why
    if (!session?.user) return redirect("/");
    return (
      <div className="p-10 text-red-500">
        Error: Missing GitHub data. <br />
        Email:{" "}
        {session.user.email
          ? "Found"
          : "Missing (Check GitHub Privacy Settings)"}{" "}
        <br />
        Username: {session.user.username ? "Found" : "Missing"}
      </div>
    );
  }

  const username = session.user.username; // This is now "bgar324"
  const email = session.user.email;

  // 2. Try to find user in DB
  let user = await db.user.findUnique({
    where: { email: email },
    include: {
      projects: {
        orderBy: { impactScore: "desc" }, // <--- Sort by Impact, not Stars
        take: 6, // <--- Limit to top 10
      },
    },
  });

  // 3. FIRST TIME SYNC
  if (!user || user.projects.length === 0) {
    await syncUserData(username, email, session.user.image || "");

    user = await db.user.findUnique({
      where: { email: email },
      include: { projects: { orderBy: { stars: "desc" } } },
    });
  }

  if (!user) return <div>Failed to load data.</div>;

  const viewProjects = user.projects.map((p) => ({
    id: p.id,
    repo: p.repoName,
    url: p.repoUrl,
    raw_desc: p.description,
    recruiter_desc: p.aiDescription,
    tags: p.topics,
    impact_score: p.impactScore,
    isPublic: true,
    readme: p.readme,
  }));

  return <RecruiterView projects={viewProjects} username={username} />;
}
