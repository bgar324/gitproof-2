// lib/github.ts
import { auth } from "@/auth";
import { GraphQLClient, gql } from "graphql-request";

const GITHUB_ENDPOINT = "https://api.github.com/graphql";

// --- Types ---
export interface GithubProfile {
  username: string;
  avatarUrl: string;
  totalContributions: number;
  pullRequests: number;
  repoCount: number;
  streak: number;
  topLanguages: { name: string; color: string; percent: number }[];
  hourlyActivity: { time: string; value: number }[];
  heatmap: { date: string; count: number }[];
  topRepos: {
    name: string;
    url: string;
    stars: number;
    forks: number;
    score: number;
    breakdown: {
      stars: number;
      forks: number;
      updatedAt: string;
    };
    readme: string;      // <--- NEW
    languages: string[]; // <--- NEW
    language: string;
    color: string;
    desc: string;
    updated: string;
    isPublic: boolean;
  }[];
}

const PROFILE_QUERY = gql`
  query {
    viewer {
      login
      avatarUrl
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
      repositories(
        first: 100
        orderBy: { field: PUSHED_AT, direction: DESC }
        ownerAffiliations: OWNER
      ) {
        totalCount
        nodes {
          name
          description
          url
          stargazerCount
          forkCount
          updatedAt
          visibility
          
          # FETCH ALL LANGUAGES (Limit to top 5)
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            nodes {
              name
            }
          }
          
          # FETCH README FILE
          object(expression: "HEAD:README.md") {
            ... on Blob {
              text
            }
          }

          primaryLanguage {
            name
            color
          }

          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 10) {
                  nodes {
                    committedDate
                  }
                }
              }
            }
          }
        }
      }
      pullRequests(first: 1) {
        totalCount
      }
      issues(first: 1) {
        totalCount
      }
    }
  }
`;

function calculateImpactScore(repo: any) {
  const stars = repo.stargazerCount;
  const forks = repo.forkCount;
  const popularityScore = Math.log2(stars + forks * 2 + 1) * 3;

  const daysSinceUpdate =
    (new Date().getTime() - new Date(repo.updatedAt).getTime()) /
    (1000 * 3600 * 24);
  let recencyScore = 0;
  if (daysSinceUpdate < 7) recencyScore = 15;
  else if (daysSinceUpdate < 30) recencyScore = 10;
  else if (daysSinceUpdate < 90) recencyScore = 5;
  else recencyScore = 0;

  let maturityScore = 0;
  if (repo.description && repo.description.length > 20) maturityScore += 3;
  if (repo.visibility === "PUBLIC") maturityScore += 2;
  if (repo.primaryLanguage) maturityScore += 2;

  const rawScore = popularityScore + recencyScore + maturityScore;
  return Math.min(Math.round(rawScore), 50);
}

function getTopRepos(repos: any[]) {
  return repos
    .map((repo: any) => ({
      ...repo,
      impactScore: calculateImpactScore(repo),
    }))
    .sort((a: any, b: any) => b.impactScore - a.impactScore)
    .slice(0, 6)
    .map((repo: any) => ({
      name: repo.name,
      url: repo.url,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      score: repo.impactScore,
      breakdown: {
        stars: repo.stargazerCount,
        forks: repo.forkCount,
        updatedAt: repo.updatedAt,
      },
      // Extract README text safely
      readme: repo.object?.text || "", 
      // Extract array of language names
      languages: repo.languages?.nodes?.map((n: any) => n.name) || [],
      
      language: repo.primaryLanguage?.name || "Markdown",
      color: repo.primaryLanguage?.color || "#6e7681",
      desc: repo.description || "No description provided.",
      updated: new Date(repo.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      isPublic: repo.visibility === "PUBLIC",
    }));
}

function calculateStreak(weeks: any[]): number {
  const days = weeks.flatMap((w) => w.contributionDays).reverse();
  let streak = 0;
  for (const day of days) {
    if (day.contributionCount > 0) streak++;
    else break;
  }
  return streak;
}

function calculateHourlyActivity(repos: any[]) {
  const hours = new Array(24).fill(0);
  repos.forEach((repo: any) => {
    const history = repo.defaultBranchRef?.target?.history?.nodes || [];
    history.forEach((commit: any) => {
      const date = new Date(commit.committedDate);
      const hour = date.getHours();
      hours[hour]++;
    });
  });
  return hours.map((count, i) => ({
    time: i.toString().padStart(2, "0"),
    value: count,
  }));
}

function calculateLanguages(repos: any[]) {
  const langMap: Record<string, { count: number; color: string }> = {};
  let totalWithLang = 0;
  repos.forEach((repo: any) => {
    if (repo.primaryLanguage) {
      const { name, color } = repo.primaryLanguage;
      if (!langMap[name]) langMap[name] = { count: 0, color };
      langMap[name].count++;
      totalWithLang++;
    }
  });
  if (totalWithLang === 0) return [];
  return Object.entries(langMap)
    .map(([name, { count, color }]) => ({
      name,
      color,
      percent: Math.round((count / totalWithLang) * 100),
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);
}

export async function getGitProofData(): Promise<GithubProfile | null> {
  const session = await auth();
  const token = (session as any)?.accessToken;
  
  if (!token) {
    console.error("No access token found in session.");
    return null;
  }

  const client = new GraphQLClient(GITHUB_ENDPOINT, {
    headers: { authorization: `Bearer ${token}` },
  });

  try {
    const data: any = await client.request(PROFILE_QUERY);
    const user = data.viewer;
    const repos = user.repositories.nodes;

    const heatmap = user.contributionsCollection.contributionCalendar.weeks
      .flatMap((w: any) => w.contributionDays)
      .map((d: any) => ({ date: d.date, count: d.contributionCount }));

    return {
      username: user.login,
      avatarUrl: user.avatarUrl,
      totalContributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
      pullRequests: user.pullRequests.totalCount,
      repoCount: user.repositories.totalCount,
      streak: calculateStreak(
        user.contributionsCollection.contributionCalendar.weeks
      ),
      topLanguages: calculateLanguages(repos),
      hourlyActivity: calculateHourlyActivity(repos),
      heatmap,
      topRepos: getTopRepos(repos),
    };
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
    return null;
  }
}