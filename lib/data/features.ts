import {
  Rocket,
  Users,
  Sparkles,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface Feature {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  borderHover: string;
  glowColor: string;
  title: string;
  description: string;
  span?: string;
  rowSpan?: string;
}

export const FEATURES: Feature[] = [
  {
    id: "impact",
    icon: Rocket,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    borderHover: "hover:border-primary/50",
    glowColor: "bg-primary/5",
    title: "Impact Scoring Model",
    description:
      "Aggregates multiple repository signals—including stars, forks, pull request activity, and recency—into a single normalized score that reflects real project impact.",
    span: "md:col-span-2",
  },
  {
    id: "archetypes",
    icon: Users,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    borderHover: "hover:border-purple-500/50",
    glowColor: "bg-purple-500/5",
    title: "Developer Archetype Analysis",
    description:
      "Classifies coding patterns across projects to highlight recurring strengths, workflows, and engineering tendencies—offering a higher-level view of how you build.",
    rowSpan: "md:row-span-2",
  },
  {
    id: "insights",
    icon: Sparkles,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    borderHover: "hover:border-amber-500/50",
    glowColor: "bg-amber-500/5",
    title: "Automated Codebase Insights",
    description:
      "Identifies notable engineering signals such as testing discipline, prototyping speed, and architectural consistency using lightweight heuristics.",
  },
  {
    id: "verified",
    icon: ShieldCheck,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    borderHover: "hover:border-emerald-500/50",
    glowColor: "bg-emerald-500/5",
    title: "Verifiable Public Profiles",
    description:
      "Generate a read-only GitProof link suitable for resumes and applications. All data is sourced directly from public repositories—no manual input or embellishment.",
  },
];
