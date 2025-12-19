import {
  Layers, // For "The Architect"
  Cpu, // For "The Machine"
  Rocket, // For "10x Engineer"
  Code2, // Default
  Flame, // For "The Shipper"
  Users, // For "The Influencer"
  Sparkles, // For "The Craftsperson"
  Gem, // For "The Specialist"
  Globe, // For "The Polyglot"
  GitPullRequest, // For "The Collaborator"
  Workflow, // For "The Automator"
  Blocks, // For "The Builder"
  Trophy, // For "The Champion"
  Zap as Lightning, // For "The Streak Master"
  Heart, // For "Open Source Hero"
  Target, // For "The Perfectionist"
  Shield, // For "The Maintainer"
  type LucideIcon,
} from "lucide-react";
import type { UserStats } from "@/lib/stats";
import type { Project } from "@prisma/client";
import type { GithubProfile } from "@/lib/github";

interface ArchetypeResult {
  title: string;
  icon: LucideIcon;
  color: string;
}

export function getArchetype(
  projects: Project[],
  stats: UserStats,
  profileData?: unknown,
  totalRepoCount?: number
): ArchetypeResult {
  // Extract additional data from user
  const profile = (profileData || {}) as Partial<GithubProfile>;
  const pullRequests = profile.pullRequests || 0;
  const streak = profile.streak || 0;

  // Calculate additional metrics
  const languageMap = new Map<string, number>();
  let totalStars = 0;
  let totalForks = 0;
  let recentActivity = 0;
  let documentedProjects = 0;

  projects.forEach((p) => {
    if (p.language) {
      languageMap.set(p.language, (languageMap.get(p.language) || 0) + 1);
    }
    totalStars += p.stars || 0;
    totalForks += p.forks || 0;

    // Use a fixed reference date to avoid hydration mismatches
    const now = new Date().setHours(0, 0, 0, 0); // Normalize to start of day
    const daysSince =
      (now - new Date(p.lastPush).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 30) recentActivity++;

    if (p.readme && p.readme.length > 500) documentedProjects++;
  });

  const languages = Array.from(languageMap.entries());
  const primaryLanguage = languages.sort((a, b) => b[1] - a[1])[0];
  const languageSpecialization = primaryLanguage
    ? primaryLanguage[1] / projects.length
    : 0;
  const documentationRate =
    projects.length > 0 ? documentedProjects / projects.length : 0;

  // PRIORITY ORDER: Most specific archetypes first, then broader categories

  // 1. THE LEGEND (Elite combination)
  if (
    stats.impactScore >= 45 &&
    totalStars >= 500 &&
    stats.consistency >= 80
  ) {
    return { title: "The Legend", icon: Trophy, color: "text-amber-400" };
  }

  // 2. THE INFLUENCER (High community engagement)
  if (totalStars >= 200 && totalForks >= 50) {
    return { title: "The Influencer", icon: Users, color: "text-pink-500" };
  }

  // 3. OPEN SOURCE HERO (Many stars + PRs)
  if (totalStars >= 100 && pullRequests >= 50) {
    return { title: "Open Source Hero", icon: Heart, color: "text-red-500" };
  }

  // 4. THE STREAK MASTER (Incredible consistency)
  if (streak >= 100 || stats.consistency >= 85) {
    return {
      title: "The Streak Master",
      icon: Lightning,
      color: "text-yellow-500",
    };
  }

  // 5. THE MACHINE (Very high consistency)
  if (stats.consistency >= 70) {
    return { title: "The Machine", icon: Cpu, color: "text-blue-500" };
  }

  // 6. THE SHIPPER (High velocity)
  if (recentActivity >= 5 && stats.impactScore >= 25) {
    return { title: "The Shipper", icon: Flame, color: "text-orange-500" };
  }

  // 7. THE CHAMPION (Very high impact)
  if (stats.impactScore >= 40) {
    return { title: "The Champion", icon: Rocket, color: "text-purple-500" };
  }

  // 8. THE PERFECTIONIST (High polish + docs)
  if (documentationRate >= 0.8 && projects.length >= 5) {
    return {
      title: "The Perfectionist",
      icon: Target,
      color: "text-violet-500",
    };
  }

  // 9. THE CRAFTSPERSON (Good documentation)
  if (documentationRate >= 0.6 && stats.impactScore >= 15) {
    return {
      title: "The Craftsperson",
      icon: Sparkles,
      color: "text-cyan-500",
    };
  }

  // 10. THE COLLABORATOR (Many PRs)
  if (pullRequests >= 75) {
    return {
      title: "The Collaborator",
      icon: GitPullRequest,
      color: "text-green-500",
    };
  }

  // 11. THE SPECIALIST (Deep language expertise)
  if (
    languageSpecialization >= 0.75 &&
    projects.length >= 5 &&
    primaryLanguage
  ) {
    return { title: "The Specialist", icon: Gem, color: "text-emerald-500" };
  }

  // 12. THE POLYGLOT (Many languages)
  if (languages.length >= 6) {
    return { title: "The Polyglot", icon: Globe, color: "text-indigo-500" };
  }

  // 13. THE ARCHITECT (Many projects - based on TOTAL repos, not just visible)
  const totalRepos = totalRepoCount ?? stats.repoCount;
  if (totalRepos >= 20) {
    return { title: "The Architect", icon: Layers, color: "text-slate-500" };
  }

  // 14. THE BUILDER (Good amount of projects - based on TOTAL repos, not just visible)
  if (totalRepos >= 12) {
    return { title: "The Builder", icon: Blocks, color: "text-teal-500" };
  }

  // 15. THE MAINTAINER (Long-term commitment)
  if (stats.repoCount >= 10 && stats.consistency >= 50) {
    return { title: "The Maintainer", icon: Shield, color: "text-blue-600" };
  }

  // 16. THE AUTOMATOR (Workflow specialist - if we detect CI/CD)
  const hasWorkflows = projects.some((p) =>
    p.topics?.some((t: string) =>
      ["ci", "cd", "automation", "github-actions"].includes(t.toLowerCase())
    )
  );
  if (hasWorkflows && stats.impactScore >= 20) {
    return { title: "The Automator", icon: Workflow, color: "text-purple-600" };
  }

  // 17. THE CONTRIBUTOR (Active PR contributor)
  if (pullRequests >= 30) {
    return {
      title: "The Contributor",
      icon: GitPullRequest,
      color: "text-lime-500",
    };
  }

  // 18. ACTIVE BUILDER (Solid activity)
  if (stats.impactScore >= 15) {
    return { title: "Active Builder", icon: Blocks, color: "text-sky-500" };
  }

  // DEFAULT: Based on general activity level
  if (stats.impactScore >= 20) {
    return { title: "Rising Star", icon: Rocket, color: "text-amber-500" };
  }

  if (stats.repoCount >= 5 && stats.impactScore >= 10) {
    return { title: "Full Stack Dev", icon: Code2, color: "text-primary" };
  }

  return { title: "Developer", icon: Code2, color: "text-muted-foreground" };
}

interface ArchetypeBadgeProps {
  title: string;
  icon: LucideIcon;
  color: string;
}

export function ArchetypeBadge({ title, icon: Icon, color }: ArchetypeBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border shadow-sm">
      <Icon size={12} className={color} />
      <span className="text-xs font-medium tracking-wide text-foreground uppercase">
        {title}
      </span>
    </div>
  );
}
