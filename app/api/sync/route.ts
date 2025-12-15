import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Your auth helper
import { prisma } from "@/lib/prisma"; // Your prisma client instance

export async function POST(req: Request) {
  // 1. Authenticate (Security Check)
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { 
      heatmap, 
      totalContributions, 
      pullRequests, 
      repoCount, 
      streak, 
      topLanguages, 
      topRepos, 
      username 
    } = data;

    // 2. Update User Stats (The JSON Blob)
    // We store the heavy visual data (heatmap) in a single JSON column
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username: username, // Ensure username is synced
        lastSyncedAt: new Date(),
        profileData: {
          heatmap,
          totalContributions,
          pullRequests,
          repoCount,
          streak,
          topLanguages,
          hourlyActivity: data.hourlyActivity
        },
      },
    });

    // 3. Upsert Projects (Repositories)
    // We loop through repos and update them if they exist, create if they don't.
    // This is efficient enough for <100 repos.
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    
    if (user) {
      for (const repo of topRepos) {
        // We assume 'repo' has the structure from your formatRepos function
        await prisma.project.upsert({
          where: {
            userId_githubId: {
              userId: user.id,
              githubId: repo.id || 0, // IMPORTANT: Ensure your frontend passes the GitHub ID (databaseId)
            },
          },
          update: {
            name: repo.name,
            desc: repo.desc,
            url: repo.url,
            homepage: repo.homepage,
            language: repo.language,
            topics: repo.topics,
            stars: repo.stars,
            forks: repo.forks,
            lastPush: repo.lastPush ? new Date(repo.lastPush) : new Date(),
            impactScore: repo.score, // Map 'score' to 'impactScore'
            readme: repo.readme,
          },
          create: {
            userId: user.id,
            githubId: repo.id || 0, // Fallback if ID is missing (should verify this in frontend)
            name: repo.name,
            desc: repo.desc,
            url: repo.url,
            homepage: repo.homepage,
            language: repo.language,
            topics: repo.topics,
            stars: repo.stars,
            forks: repo.forks,
            lastPush: repo.lastPush ? new Date(repo.lastPush) : new Date(),
            impactScore: repo.score,
            readme: repo.readme,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}