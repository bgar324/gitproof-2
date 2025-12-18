import { Rocket, Users, Sparkles, ShieldCheck, type LucideIcon } from "lucide-react";

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
    title: "Impact Scoring Algorithm",
    description:
      "Our proprietary algorithm doesn't just count commits. It weighs stars, forks, PR complexity, and recency to calculate a true \"Impact Score\" out of 50.",
    span: "md:col-span-2",
  },
  {
    id: "archetypes",
    icon: Users,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    borderHover: "hover:border-purple-500/50",
    glowColor: "bg-purple-500/5",
    title: "20 Developer Archetypes",
    description:
      "Are you \"The Machine\"? \"The Architect\"? Or \"The Open Source Hero\"? Discover your coding identity.",
    rowSpan: "md:row-span-2",
  },
  {
    id: "insights",
    icon: Sparkles,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    borderHover: "hover:border-amber-500/50",
    glowColor: "bg-amber-500/5",
    title: "AI-Powered Insights",
    description:
      "We use heuristics to detect specific strengths like \"High Test Coverage\" or \"Rapid Prototyping.\"",
  },
  {
    id: "verified",
    icon: ShieldCheck,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    borderHover: "hover:border-emerald-500/50",
    glowColor: "bg-emerald-500/5",
    title: "Verified Public Profile",
    description:
      "Share a read-only gitproof.com/u/you link on your resume. No embellishments, just proof.",
  },
];
