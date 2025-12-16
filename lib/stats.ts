import type { User, Project } from "@prisma/client";

// Types for our stats and insights
export interface UserStats {
  impactScore: number;
  totalContributions: number;
  consistency: number;
  repoCount: number;
}

export interface Insight {
  text: string;
  strength: "high" | "medium" | "low";
}

export interface UserInsights {
  strengths: Insight[];
  growthAreas: Insight[];
}

type UserWithProjects = User & {
  projects: Project[];
};

/**
 * Calculate real user statistics from database data
 */
export function calculateUserStats(user: UserWithProjects): UserStats {
  const { projects, profileData } = user;

  // 1. Calculate Impact Score - average of top 6 projects (or all if fewer)
  const projectScores = projects
    .map((p) => p.impactScore)
    .sort((a, b) => b - a);
  const topScores = projectScores.slice(0, 6);
  const impactScore =
    topScores.length > 0
      ? Math.round(topScores.reduce((sum, score) => sum + score, 0) / topScores.length)
      : 0;

  // 2. Calculate Total Contributions
  // Try to use real GitHub data first, fallback to calculated
  let totalContributions = 0;
  if (profileData && typeof profileData === "object" && "totalContributions" in profileData) {
    totalContributions = (profileData as any).totalContributions || 0;
  } else {
    // Fallback: estimate from projects (stars + forks * 2)
    totalContributions = projects.reduce(
      (sum, p) => sum + p.stars + p.forks * 2,
      0
    );
  }

  // 3. Calculate Consistency - % of days with commits in last 365 days
  let consistency = 0;
  if (profileData && typeof profileData === "object" && "heatmap" in profileData) {
    const heatmap = (profileData as any).heatmap as Array<{ date: string; count: number }>;
    if (Array.isArray(heatmap) && heatmap.length > 0) {
      const activeDays = heatmap.filter((d) => d.count > 0).length;
      consistency = Math.round((activeDays / Math.min(heatmap.length, 365)) * 100);
    }
  }

  // 4. Repo Count
  const repoCount = projects.length;

  return {
    impactScore,
    totalContributions,
    consistency,
    repoCount,
  };
}

/**
 * Calculate the user's top technologies based on their projects
 */
export function calculateTopTechnologies(
  user: UserWithProjects,
  limit: number = 5
): string[] {
  const projects = user.projects || [];
  const techFrequency = new Map<string, { display: string; count: number }>();

  const addTech = (tech: string, weight: number) => {
    const key = tech.toLowerCase();
    const existing = techFrequency.get(key);
    if (existing) {
      existing.count += weight;
    } else {
      // Normalize display name: split by hyphens, uppercase each word
      const display = tech
        .split(/[-\s]+/)
        .map((word) => word.toUpperCase())
        .join(" ");
      techFrequency.set(key, { display, count: weight });
    }
  };

  projects.forEach((project) => {
    // Count primary language (weighted 3x higher)
    if (project.language) {
      addTech(project.language, 3);
    }

    // Count topics/tags (weighted 1x)
    if (project.topics && Array.isArray(project.topics)) {
      project.topics.forEach((topic: string) => {
        addTech(topic, 1);
      });
    }
  });

  // Sort by frequency and return top N
  return Array.from(techFrequency.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((item) => item.display);
}

/**
 * Analyze user data and generate personalized insights using heuristics
 */
export function analyzeUserInsights(
  user: UserWithProjects,
  stats: UserStats
): UserInsights {
  const { projects, profileData } = user;
  const strengths: Insight[] = [];
  const growthAreas: Insight[] = [];

  // Extract additional data from profileData
  const profileDataObj = (profileData || {}) as any;
  const topLanguages = profileDataObj.topLanguages || [];
  const pullRequests = profileDataObj.pullRequests || 0;
  const streak = profileDataObj.streak || 0;
  const heatmap = profileDataObj.heatmap || [];

  // Analyze languages
  const languageMap = new Map<string, number>();
  projects.forEach((p) => {
    if (p.language) {
      languageMap.set(p.language, (languageMap.get(p.language) || 0) + 1);
    }
  });
  const languages = Array.from(languageMap.entries()).sort((a, b) => b[1] - a[1]);
  const primaryLanguage = languages[0]?.[0];

  // Analyze project maturity
  const matureProjects = projects.filter(
    (p) =>
      (p.desc && p.desc.length > 20) ||
      p.homepage ||
      (p.topics && p.topics.length > 0)
  );
  const maturityRate = projects.length > 0 ? matureProjects.length / projects.length : 0;

  // Analyze activity patterns
  const recentProjects = projects.filter((p) => {
    const daysSince = (Date.now() - new Date(p.lastPush).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince < 30;
  });
  const veryRecentProjects = projects.filter((p) => {
    const daysSince = (Date.now() - new Date(p.lastPush).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince < 7;
  });

  // Analyze popularity
  const popularProjects = projects.filter((p) => p.stars >= 10 || p.forks >= 5);
  const highImpactProjects = projects.filter((p) => p.impactScore >= 30);

  // Calculate documentation rate
  const documentedProjects = projects.filter((p) => p.readme && p.readme.length > 500);
  const documentationRate = projects.length > 0 ? documentedProjects.length / projects.length : 0;

  // ======================
  // STRENGTHS DETECTION
  // ======================

  // 1. Consistency & Activity Patterns
  if (stats.consistency >= 90) {
    strengths.push({
      text: "Exceptional consistency - active 90%+ of days",
      strength: "high",
    });
  } else if (stats.consistency >= 70) {
    strengths.push({
      text: "Strong commit consistency throughout the year",
      strength: "medium",
    });
  } else if (streak >= 30) {
    strengths.push({
      text: `Impressive ${streak}-day contribution streak`,
      strength: "medium",
    });
  }

  // 2. Impact & Quality
  if (stats.impactScore >= 40) {
    strengths.push({
      text: "Elite-tier impact score across portfolio",
      strength: "high",
    });
  } else if (stats.impactScore >= 30) {
    strengths.push({
      text: "High-impact project portfolio",
      strength: "high",
    });
  } else if (highImpactProjects.length >= 3) {
    strengths.push({
      text: `${highImpactProjects.length} projects with exceptional impact`,
      strength: "medium",
    });
  }

  // 3. Popularity & Community
  if (popularProjects.length >= 5) {
    strengths.push({
      text: "Strong community engagement across multiple repos",
      strength: "high",
    });
  } else if (popularProjects.length >= 2) {
    strengths.push({
      text: "Building projects that attract users and contributors",
      strength: "medium",
    });
  }

  const maxStars = Math.max(...projects.map((p) => p.stars), 0);
  if (maxStars >= 100) {
    strengths.push({
      text: `Popular project with ${maxStars}+ stars`,
      strength: "high",
    });
  } else if (maxStars >= 50) {
    strengths.push({
      text: `Growing project with ${maxStars} stars`,
      strength: "medium",
    });
  }

  // 4. Language Expertise
  if (primaryLanguage) {
    const primaryCount = languageMap.get(primaryLanguage) || 0;
    const specialization = primaryCount / projects.length;

    if (specialization >= 0.7 && primaryCount >= 5) {
      strengths.push({
        text: `Deep ${primaryLanguage} specialization (${primaryCount} projects)`,
        strength: "high",
      });
    } else if (languages.length >= 5) {
      strengths.push({
        text: `Polyglot developer - ${languages.length}+ languages`,
        strength: "medium",
      });
    } else if (primaryCount >= 3) {
      strengths.push({
        text: `Strong ${primaryLanguage} expertise`,
        strength: "medium",
      });
    }
  }

  // 5. Technology Stack Detection
  const frontendLangs = ["TypeScript", "JavaScript", "Vue", "Svelte"];
  const backendLangs = ["Go", "Rust", "Python", "Java", "C#", "Ruby"];
  const systemsLangs = ["C", "C++", "Rust", "Go", "Zig"];

  const hasFrontend = projects.some(
    (p) => p.language && frontendLangs.includes(p.language)
  );
  const hasBackend = projects.some(
    (p) => p.language && backendLangs.includes(p.language)
  );
  const hasSystems = projects.some(
    (p) => p.language && systemsLangs.includes(p.language)
  );

  if (hasFrontend && hasBackend) {
    strengths.push({
      text: "Full-stack versatility across frontend and backend",
      strength: "high",
    });
  } else if (hasSystems) {
    strengths.push({
      text: "Systems programming expertise",
      strength: "high",
    });
  }

  // 6. Project Velocity
  if (veryRecentProjects.length >= 3) {
    strengths.push({
      text: "High velocity - multiple active projects this week",
      strength: "medium",
    });
  } else if (recentProjects.length >= 5) {
    strengths.push({
      text: "Consistently shipping - 5+ active projects this month",
      strength: "medium",
    });
  }

  // 7. Documentation & Polish
  if (documentationRate >= 0.8 && projects.length >= 5) {
    strengths.push({
      text: "Exceptional documentation standards",
      strength: "high",
    });
  } else if (maturityRate >= 0.7) {
    strengths.push({
      text: "Well-polished projects with descriptions and topics",
      strength: "medium",
    });
  }

  // 8. Collaboration
  if (pullRequests >= 100) {
    strengths.push({
      text: `Prolific contributor - ${pullRequests}+ pull requests`,
      strength: "high",
    });
  } else if (pullRequests >= 50) {
    strengths.push({
      text: "Active open source collaborator",
      strength: "medium",
    });
  }

  // 9. Portfolio Size
  if (stats.repoCount >= 30) {
    strengths.push({
      text: `Extensive portfolio - ${stats.repoCount} repositories`,
      strength: "medium",
    });
  } else if (stats.repoCount >= 15) {
    strengths.push({
      text: "Diverse project portfolio",
      strength: "medium",
    });
  }

  // ======================
  // GROWTH AREAS DETECTION
  // ======================

  // 1. Consistency Gaps
  if (stats.consistency < 40 && streak < 7) {
    growthAreas.push({
      text: "Build a more consistent contribution rhythm",
      strength: "high",
    });
  } else if (stats.consistency < 60) {
    growthAreas.push({
      text: "Increase contribution frequency for better visibility",
      strength: "medium",
    });
  }

  // 2. Documentation Gaps
  if (documentationRate < 0.3 && projects.length >= 5) {
    growthAreas.push({
      text: "Add comprehensive READMEs to showcase project value",
      strength: "high",
    });
  } else if (documentationRate < 0.5) {
    growthAreas.push({
      text: "Improve documentation coverage across projects",
      strength: "medium",
    });
  }

  // 3. Community Engagement
  if (popularProjects.length === 0 && projects.length >= 5) {
    growthAreas.push({
      text: "Focus on discoverability and community building",
      strength: "high",
    });
  } else if (pullRequests < 10 && stats.repoCount >= 10) {
    growthAreas.push({
      text: "Increase collaboration through pull requests",
      strength: "medium",
    });
  }

  // 4. Project Polish
  if (maturityRate < 0.4 && projects.length >= 5) {
    growthAreas.push({
      text: "Add homepages and topics to improve discoverability",
      strength: "medium",
    });
  }

  // 5. Impact Opportunities
  if (stats.impactScore < 20 && projects.length >= 5) {
    growthAreas.push({
      text: "Focus on fewer projects with higher quality and impact",
      strength: "high",
    });
  } else if (highImpactProjects.length === 0 && projects.length >= 3) {
    growthAreas.push({
      text: "Develop a signature high-impact project",
      strength: "medium",
    });
  }

  // 6. Recent Activity
  if (recentProjects.length === 0 && projects.length > 0) {
    growthAreas.push({
      text: "Resume active development on existing projects",
      strength: "high",
    });
  } else if (veryRecentProjects.length === 0 && recentProjects.length < 2) {
    growthAreas.push({
      text: "Increase development velocity on current projects",
      strength: "medium",
    });
  }

  // 7. Diversity vs Specialization
  if (languages.length === 1 && projects.length >= 5) {
    growthAreas.push({
      text: "Explore additional languages to broaden skill set",
      strength: "low",
    });
  } else if (languages.length >= 8 && !primaryLanguage) {
    growthAreas.push({
      text: "Develop deeper expertise in core technologies",
      strength: "medium",
    });
  }

  // 8. Portfolio Size
  if (stats.repoCount < 3) {
    growthAreas.push({
      text: "Build more projects to demonstrate breadth",
      strength: "medium",
    });
  }

  // ======================
  // PRIORITIZATION & LIMITS
  // ======================

  // Sort by strength and limit to top insights
  const sortByStrength = (a: Insight, b: Insight) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.strength] - order[b.strength];
  };

  const topStrengths = strengths.sort(sortByStrength).slice(0, 4);
  const topGrowthAreas = growthAreas.sort(sortByStrength).slice(0, 3);

  // Fallbacks if no insights detected
  if (topStrengths.length === 0) {
    topStrengths.push({
      text: "Active GitHub presence",
      strength: "medium",
    });
  }

  if (topGrowthAreas.length === 0) {
    topGrowthAreas.push({
      text: "Continue building and shipping projects",
      strength: "medium",
    });
  }

  return {
    strengths: topStrengths,
    growthAreas: topGrowthAreas,
  };
}
