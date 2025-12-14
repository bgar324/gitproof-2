import { db } from "@/lib/db";
import { fetchGithubProfile, fetchUserRepos } from "@/lib/github";

// --- SCORING ALGORITHM ---
function calculateScore(repo: any) {
  // 1. Popularity (Stars & Forks)
  const popularity = Math.log2(repo.stargazers_count + repo.forks_count * 2 + 1) * 3;

  // 2. Recency (How long ago was it pushed?)
  const daysSincePush = (new Date().getTime() - new Date(repo.pushed_at).getTime()) / (1000 * 3600 * 24);
  let recency = 0;
  if (daysSincePush < 7) recency = 15;       // Super fresh
  else if (daysSincePush < 30) recency = 10; // Fresh
  else if (daysSincePush < 90) recency = 5;  // Recent
  
  // 3. Maturity (Description & Metadata)
  let maturity = 0;
  if (repo.description && repo.description.length > 20) maturity += 5; // Has a real description
  if (repo.homepage) maturity += 3; // Has a live demo link
  if (repo.topics && repo.topics.length > 0) maturity += 2; // Has tags

  return Math.min(Math.round(popularity + recency + maturity), 50);
}

export async function syncUserData(githubUsername: string, email: string, image: string) {
  console.log(`🔄 Syncing data for ${githubUsername}...`);

  // 1. Fetch latest data from GitHub API
  const [profile, repos] = await Promise.all([
    fetchGithubProfile(githubUsername),
    fetchUserRepos(githubUsername)
  ]);

  // 2. Sync User
  const user = await db.user.upsert({
    where: { username: githubUsername },
    update: {
      lastSyncedAt: new Date(),
      avatarUrl: image,
      name: profile.username, 
    },
    create: {
      username: githubUsername,
      email: email,
      avatarUrl: image,
      name: profile.username,
      lastSyncedAt: new Date(),
    }
  });

  // 3. Sync Repositories
  let syncedCount = 0;
  
  for (const repo of repos) {
    // CALCULATE THE SCORE BEFORE SAVING
    const score = calculateScore(repo);

    await db.project.upsert({
      where: {
        userId_repoName: {
          userId: user.id,
          repoName: repo.name
        }
      },
      update: {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        lastPushedAt: new Date(repo.pushed_at),
        description: repo.description,
        topics: repo.topics || [],
        language: repo.language,
        impactScore: score, // <--- SAVING THE SCORE
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        repoName: repo.name,
        repoUrl: repo.html_url,
        description: repo.description,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics || [],
        lastPushedAt: new Date(repo.pushed_at),
        impactScore: score, // <--- SAVING THE SCORE
      }
    });
    syncedCount++;
  }

  console.log(`✅ Synced ${syncedCount} repos for ${githubUsername}`);
  return user;
}