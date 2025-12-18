import { Github, Search, ArrowRight, type LucideIcon } from "lucide-react";

export interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const STEPS: Step[] = [
  {
    title: "Connect",
    description: "Sign in with GitHub. We scan your public history securely.",
    icon: Github,
  },
  {
    title: "Analyze",
    description: "Our engine crunches the numbers to find your strengths.",
    icon: Search,
  },
  {
    title: "Share",
    description: "Get your public URL and add it to your resume/LinkedIn.",
    icon: ArrowRight,
  },
];
