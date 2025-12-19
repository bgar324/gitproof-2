import { db } from "@/lib/db";
import { fetchGithubProfile, fetchUserRepos } from "@/lib/github";
import type { GithubRepoSummary } from "@/lib/github";
import { sanitizeString, sanitizeStringArray } from "@/lib/sanitize";

/**
 * Calculate impact score for a repository (0-50 scale)
 *
 * Formula breakdown:
 * - Popularity (~40-45%): Log-scaled stars/forks/contributors
 * - Recency (~25-30%): Graceful decay over 365 days
 * - Maturity (~25-30%): Quality signals (README, docs, polish)
 */
function calculateScore(repo: GithubRepoSummary) {
  // 1. POPULARITY SCORE (0-40 points, ~40-45% weight)
  // Increased multiplier from 3 to 4.5 to better reward popular projects
  const popularity = Math.min(
    Math.log2(
      repo.stargazers_count +
      repo.forks_count * 2 +
      1
    ) * 4.5,
    40
  );

  // 2. RECENCY SCORE (0-15 points, ~25-30% weight)
  // Graceful decay: rewards maintained projects, not just actively pushed ones
  const daysSincePush =
    (new Date().getTime() - new Date(repo.pushed_at).getTime()) /
    (1000 * 3600 * 24);

  let recency = 0;
  if (daysSincePush < 7) recency = 15;        // S-tier: Last week
  else if (daysSincePush < 30) recency = 12;  // A-tier: Last month
  else if (daysSincePush < 90) recency = 8;   // B-tier: Last quarter
  else if (daysSincePush < 180) recency = 5;  // C-tier: Last 6 months (NEW)
  else if (daysSincePush < 365) recency = 2;  // D-tier: Last year (NEW)
  // else: 0 (truly abandoned)

  // 3. MATURITY SCORE (0-15 points, ~25-30% weight)
  let maturity = 0;

  // Description quality (0-5 points)
  if (repo.description) {
    if (repo.description.length > 100) maturity += 5;      // Detailed
    else if (repo.description.length > 20) maturity += 3;  // Basic
  }

  // README quality (0-5 points) - NOW ACTUALLY USED!
  if (repo.readme) {
    if (repo.readme.length > 2000) maturity += 5;      // Comprehensive
    else if (repo.readme.length > 500) maturity += 3;  // Good
    else if (repo.readme.length > 100) maturity += 1;  // Minimal
  }

  // Homepage/demo (0-3 points)
  if (repo.homepage) maturity += 3;

  // Topics/tags (0-3 points)
  if (repo.topics) {
    if (repo.topics.length >= 3) maturity += 3;      // Well-tagged
    else if (repo.topics.length >= 1) maturity += 1; // Basic tags
  }

  // Total capped at 15 for maturity
  maturity = Math.min(maturity, 15);

  // FINAL SCORE: Sum all components, cap at 50
  return Math.min(Math.round(popularity + recency + maturity), 50);
}

export async function syncUserData(
  githubUsername: string,
  email: string,
  image: string
) {
  console.log(`🔄 Syncing data for ${githubUsername}...`);

  const [profile, repos] = await Promise.all([
    fetchGithubProfile(githubUsername),
    fetchUserRepos(githubUsername),
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
    },
  });

  for (const repo of repos) {
    const score = calculateScore(repo);

    // 2. Sync Project
    // CRITICAL FIX: Sanitize all string data before DB write
    await db.project.upsert({
      where: {
        userId_githubId: {
          userId: user.id,
          githubId: repo.id,
        },
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
        readme: sanitizeString(repo.readme),
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
        readme: sanitizeString(repo.readme),
      },
    });
  }

  return user;
}
