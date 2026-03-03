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
    title: "Repository Scoring",
    description:
      "Combines public repository signals like stars, forks, recent activity, and maintenance into one score that is easier to review quickly.",
    span: "md:col-span-2",
  },
  {
    id: "archetypes",
    icon: Users,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    borderHover: "hover:border-purple-500/50",
    glowColor: "bg-purple-500/5",
    title: "Work Pattern Summary",
    description:
      "Summarizes recurring patterns across your visible work so the profile reads like a clear snapshot instead of a list of repositories.",
    rowSpan: "md:row-span-2",
  },
  {
    id: "insights",
    icon: Sparkles,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    borderHover: "hover:border-amber-500/50",
    glowColor: "bg-amber-500/5",
    title: "Repository Insights",
    description:
      "Pulls out a few plain-language observations from your public repositories and metadata to make the profile more readable.",
  },
  {
    id: "verified",
    icon: ShieldCheck,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    borderHover: "hover:border-emerald-500/50",
    glowColor: "bg-emerald-500/5",
    title: "Public Profile Link",
    description:
      "Publish a GitProof URL you can share. The stats come from public GitHub data, while your bio and featured repositories stay editable.",
  },
];
