import { auth } from "@/auth";
import { GraphQLClient, gql } from "graphql-request";

const GITHUB_ENDPOINT = "https://api.github.com/graphql";

// --- Types ---
export interface GithubProfile {
  username: string;
  image: string;
  totalContributions: number;
  pullRequests: number;
  repoCount: number;
  streak: number;
  topLanguages: { name: string; color: string; percent: number }[];
  hourlyActivity: { time: string; value: number }[];
  heatmap: { date: string; count: number }[];
  topRepos: any[];
}

// --- SHARED QUERY ---
const PROFILE_QUERY = gql`
  query {
    viewer {
      login
      name
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
        privacy: PUBLIC
      ) {
        totalCount
        nodes {
          databaseId
          name
          description
          url
          homepageUrl
          stargazerCount
          forkCount
          updatedAt
          visibility
          
          # Languages
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            nodes {
              name
            }
          }

          # Topics
          repositoryTopics(first: 5) {
            nodes {
              topic {
                name
              }
            }
          }
          
          # Readme
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
    }
  }
`;

// --- HELPER: Get Authenticated Client ---
async function getClient() {
  const session = await auth();
  const token = (session as any)?.accessToken;
  if (!token) throw new Error("No access token found.");
  
  return new GraphQLClient(GITHUB_ENDPOINT, {
    headers: { authorization: `Bearer ${token}` },
  });
}

// --- SYNC EXPORTS ---
export async function fetchGithubProfile(username: string) {
  const client = await getClient();
  const data: any = await client.request(PROFILE_QUERY);
  return {
    username: data.viewer.login,
    name: data.viewer.name || data.viewer.login,
    avatarUrl: data.viewer.avatarUrl,
  };
}

export async function fetchUserRepos(username: string) {
  const client = await getClient();
  const data: any = await client.request(PROFILE_QUERY);

  return data.viewer.repositories.nodes.map((repo: any) => ({
    id: repo.databaseId,
    name: repo.name,
    description: repo.description,
    html_url: repo.url,
    homepage: repo.homepageUrl,
    language: repo.primaryLanguage?.name,
    stargazers_count: repo.stargazerCount,
    forks_count: repo.forkCount,
    pushed_at: repo.updatedAt,
    topics: repo.repositoryTopics?.nodes.map((n: any) => n.topic.name) || [],
    readme: repo.object?.text || ""
  }));
}

export async function fetchRepoReadme(username: string, repo: string) {
  return "";
}

// --- DASHBOARD EXPORTS ---
export async function getGitProofData(): Promise<GithubProfile | null> {
  const client = await getClient();

  try {
    const data: any = await client.request(PROFILE_QUERY);
    const user = data.viewer;
    const repos = user.repositories.nodes;

    return {
      username: user.login,
      image: user.avatarUrl,
      totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
      pullRequests: user.pullRequests.totalCount,
      repoCount: user.repositories.totalCount,
      streak: calculateStreak(user.contributionsCollection.contributionCalendar.weeks),
      topLanguages: calculateLanguages(repos),
      hourlyActivity: calculateHourlyActivity(repos),
      heatmap: user.contributionsCollection.contributionCalendar.weeks
        .flatMap((w: any) => w.contributionDays)
        .map((d: any) => ({ date: d.date, count: d.contributionCount })),
      topRepos: getTopRepos(repos),
    };
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
    return null;
  }
}

// --- SCORING ALGORITHM (MATCHING SYNC.TS) ---
function calculateImpactScore(repo: any) {
  // 1. Popularity
  const stars = repo.stargazerCount;
  const forks = repo.forkCount;
  const popularity = Math.log2(stars + forks * 2 + 1) * 3;

  // 2. Recency
  const daysSinceUpdate = (new Date().getTime() - new Date(repo.updatedAt).getTime()) / (1000 * 3600 * 24);
  let recency = 0;
  if (daysSinceUpdate < 7) recency = 15;
  else if (daysSinceUpdate < 30) recency = 10;
  else if (daysSinceUpdate < 90) recency = 5;

  // 3. Maturity (The updated logic)
  let maturity = 0;
  if (repo.description && repo.description.length > 20) maturity += 5; // Long description
  if (repo.homepageUrl) maturity += 3; // Homepage (called homepageUrl in GraphQL)
  
  // Check for topics safely
  const hasTopics = repo.repositoryTopics?.nodes?.length > 0;
  if (hasTopics) maturity += 2;

  return Math.min(Math.round(popularity + recency + maturity), 50);
}

function getTopRepos(repos: any[]) {
  return repos
    .map((repo: any) => ({ ...repo, impactScore: calculateImpactScore(repo) }))
    .sort((a: any, b: any) => b.impactScore - a.impactScore)
    // .slice(0, 6)
    .map((repo: any) => ({
      id: repo.databaseId,
      name: repo.name,
      url: repo.url,
      homepage: repo.homepageUrl,
      topics: repo.repositoryTopics?.nodes?.map((n: any) => n.topic.name) || [],
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      score: repo.impactScore,
      breakdown: { stars: repo.stargazerCount, forks: repo.forkCount, updatedAt: repo.updatedAt },
      readme: repo.object?.text || "",
      languages: repo.languages?.nodes?.map((n: any) => n.name) || [],
      language: repo.primaryLanguage?.name || "Markdown",
      color: repo.primaryLanguage?.color || "#6e7681",
      desc: repo.description || "",
      updated: new Date(repo.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      lastPush: repo.updatedAt,
      isPublic: repo.visibility === "PUBLIC",
    }));
}

// --- UTILS (No changes) ---
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
      hours[date.getHours()]++;
    });
  });
  return hours.map((count, i) => ({ time: i.toString().padStart(2, "0"), value: count }));
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
    .map(([name, { count, color }]) => ({ name, color, percent: Math.round((count / totalWithLang) * 100) }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5);
}