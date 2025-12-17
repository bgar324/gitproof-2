import { db } from "@/lib/db";
import { fetchGithubProfile, fetchUserRepos } from "@/lib/github";
import { sanitizeString, sanitizeStringArray } from "@/lib/sanitize";

// ... keep calculateScore function exactly as is ...
function calculateScore(repo: any) {
  const popularity = Math.log2(repo.stargazers_count + repo.forks_count * 2 + 1) * 3;
  const daysSincePush = (new Date().getTime() - new Date(repo.pushed_at).getTime()) / (1000 * 3600 * 24);
  let recency = 0;
  if (daysSincePush < 7) recency = 15;
  else if (daysSincePush < 30) recency = 10;
  else if (daysSincePush < 90) recency = 5;
  
  let maturity = 0;
  if (repo.description && repo.description.length > 20) maturity += 5;
  if (repo.homepage) maturity += 3;
  if (repo.topics && repo.topics.length > 0) maturity += 2;

  return Math.min(Math.round(popularity + recency + maturity), 50);
}

export async function syncUserData(githubUsername: string, email: string, image: string) {
  console.log(`🔄 Syncing data for ${githubUsername}...`);

  const [profile, repos] = await Promise.all([
    fetchGithubProfile(githubUsername),
    fetchUserRepos(githubUsername)
  ]);

  // 1. Sync User
  const user = await db.user.upsert({
    where: { email: email },
    update: {
      lastSyncedAt: new Date(),
      image: image,
      // FIXED: changed profile.login to profile.username
      name: profile.name || profile.username, 
      username: githubUsername,
    },
    create: {
      email: email,
      username: githubUsername,
      image: image,
      // FIXED: changed profile.login to profile.username
      name: profile.name || profile.username, 
      lastSyncedAt: new Date(),
    }
  });

  let syncedCount = 0;
  
  for (const repo of repos) {
    const score = calculateScore(repo);

    // 2. Sync Project
    // CRITICAL FIX: Sanitize all string data before DB write
    await db.project.upsert({
      where: {
        userId_githubId: {
          userId: user.id,
          githubId: repo.id
        }
      },
      update: {
        name: sanitizeString(repo.name),
        url: sanitizeString(repo.html_url),
        desc: sanitizeString(repo.description),
        homepage: sanitizeString(repo.homepage),
        language: sanitizeString(repo.language),
        topics: sanitizeStringArray(repo.topics),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        lastPush: new Date(repo.pushed_at),
        impactScore: score,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        githubId: repo.id,
        name: sanitizeString(repo.name),
        url: sanitizeString(repo.html_url),
        desc: sanitizeString(repo.description),
        homepage: sanitizeString(repo.homepage),
        language: sanitizeString(repo.language),
        topics: sanitizeStringArray(repo.topics),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        lastPush: new Date(repo.pushed_at),
        impactScore: score,
      }
    });
    syncedCount++;
  }

  return user;
}