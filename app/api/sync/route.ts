import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sanitizeString, sanitizeStringArray, sanitizeForPostgres } from "@/lib/sanitize";

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
    // CRITICAL FIX: Sanitize all data before database write
    await db.user.update({
      where: { email: session.user.email },
      data: {
        username: sanitizeString(username), // Ensure username is synced and sanitized
        lastSyncedAt: new Date(),
        profileData: sanitizeForPostgres({
          heatmap,
          totalContributions,
          pullRequests,
          repoCount,
          streak,
          topLanguages,
          hourlyActivity: data.hourlyActivity
        }) as any,
      },
    });

    // 3. Upsert Projects (Repositories)
    // We loop through repos and update them if they exist, create if they don't.
    // This is efficient enough for <100 repos.
    const user = await db.user.findUnique({ where: { email: session.user.email } });
    
    if (user) {
      for (const repo of topRepos) {
        // We assume 'repo' has the structure from your formatRepos function
        // CRITICAL FIX: Sanitize all string data before database write
        await db.project.upsert({
          where: {
            userId_githubId: {
              userId: user.id,
              githubId: repo.id || 0, // IMPORTANT: Ensure your frontend passes the GitHub ID (databaseId)
            },
          },
          update: {
            name: sanitizeString(repo.name),
            desc: sanitizeString(repo.desc),
            url: sanitizeString(repo.url),
            homepage: sanitizeString(repo.homepage),
            language: sanitizeString(repo.language),
            topics: sanitizeStringArray(repo.topics),
            stars: repo.stars,
            forks: repo.forks,
            lastPush: repo.lastPush ? new Date(repo.lastPush) : new Date(),
            impactScore: repo.score, // Map 'score' to 'impactScore'
            readme: sanitizeString(repo.readme),
          },
          create: {
            userId: user.id,
            githubId: repo.id || 0, // Fallback if ID is missing (should verify this in frontend)
            name: sanitizeString(repo.name),
            desc: sanitizeString(repo.desc),
            url: sanitizeString(repo.url),
            homepage: sanitizeString(repo.homepage),
            language: sanitizeString(repo.language),
            topics: sanitizeStringArray(repo.topics),
            stars: repo.stars,
            forks: repo.forks,
            lastPush: repo.lastPush ? new Date(repo.lastPush) : new Date(),
            impactScore: repo.score,
            readme: sanitizeString(repo.readme),
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