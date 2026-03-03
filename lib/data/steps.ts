import { Github, Search, ArrowRight, type LucideIcon } from "lucide-react";

export interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const STEPS: Step[] = [
  {
    title: "Connect",
    description:
      "Sign in with GitHub using identity-only auth. GitProof reads public repositories only.",
    icon: Github,
  },
  {
    title: "Analyze",
    description:
      "We sync public repository and activity data, then build a cleaner profile from that evidence.",
    icon: Search,
  },
  {
    title: "Share",
    description:
      "Adjust your bio, choose what to feature, and share a public profile link when it is ready.",
    icon: ArrowRight,
  },
];
