"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  GitPullRequest,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utils file, or just use inline

// --- COMPONENTS ---

const Tag = ({ text, color }: { text: string, color: string }) => (
  <span className={`text-[10px] px-2 py-0.5 rounded border ${color} font-medium tracking-wide uppercase`}>
    {text}
  </span>
);

const InsightRow = ({ type, text }: { type: "strength" | "weakness", text: string }) => (
  <div className="flex items-start gap-3 text-sm">
    <div className={`mt-0.5 ${type === "strength" ? "text-emerald-500" : "text-amber-500"}`}>
      {type === "strength" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
    </div>
    <span className="text-muted-foreground leading-snug">{text}</span>
  </div>
);

const ReportCard = ({ 
  title, 
  role, 
  grade, 
  delay, 
  strengths, 
  improvements, 
  tags 
}: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
  >
    {/* Header */}
    <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-start">
       <div>
         <div className="flex gap-2 mb-2">
           {tags.map((t: any) => <Tag key={t.text} text={t.text} color={t.color} />)}
         </div>
         <h3 className="font-serif text-2xl text-foreground">{title}</h3>
         <p className="text-xs text-muted-foreground font-mono mt-1 uppercase tracking-wider">{role}</p>
       </div>
       <div className="flex flex-col items-center">
         <div className="w-14 h-14 rounded-full border-2 border-primary/20 flex items-center justify-center font-serif text-2xl bg-background text-foreground shadow-inner">
           {grade}
         </div>
         <span className="text-[10px] font-medium text-primary mt-1">GitProof Score</span>
       </div>
    </div>
    
    {/* Body - The AI Analysis */}
    <div className="p-6 space-y-6 bg-card">
      
      {/* Strengths Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={12} className="text-emerald-500"/> Identify Strengths
        </h4>
        {strengths.map((s: string, i: number) => (
          <InsightRow key={i} type="strength" text={s} />
        ))}
      </div>

      {/* Improvements Section - THIS IS HOW WE HELP */}
      <div className="space-y-3 pt-2 border-t border-dashed border-border">
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <TrendingUp size={12} className="text-amber-500"/> Growth Plan
        </h4>
        {improvements.map((s: string, i: number) => (
          <InsightRow key={i} type="weakness" text={s} />
        ))}
      </div>
    </div>

    {/* Footer / Action */}
    <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-between items-center group-hover:bg-primary/5 transition-colors">
       <span className="text-xs text-muted-foreground flex items-center gap-1">
         <ShieldCheck size={12} /> Verified by GitHub API
       </span>
       <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline">
         View Full Report <ArrowRight size={12} />
       </button>
    </div>
  </motion.div>
);

export default function ShowcasePage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-xs font-medium text-primary mb-6 border border-primary/10"
        >
          <Sparkles size={12} /> For Developers, By Developers
        </motion.div>
        
        <h1 className="font-serif text-5xl md:text-7xl mb-6 text-foreground tracking-tight">
          Don't just code.<br />
          <span className="text-muted-foreground italic">Prove it.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground font-light leading-relaxed">
          GitProof analyzes your commit history to highlight your hidden strengths and gives you concrete advice to level up. 
          <span className="text-foreground font-medium"> It's your automated career coach.</span>
        </p>
      </div>

      {/* The Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Card 1: The Junior (Needs Guidance) */}
        <ReportCard 
          title="The Fast Learner" 
          role="Junior Frontend Dev" 
          grade="B+" 
          delay={0.1}
          tags={[{ text: "High Volume", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" }]}
          strengths={[
            "Consistent daily activity streak (45 days).",
            "High velocity in React component creation."
          ]}
          improvements={[
            "Commit messages are often one word ('fix'). Use Conventional Commits.",
            "PRs lack descriptions. Add context for reviewers."
          ]}
        />

        {/* Card 2: The Senior (Needs Recognition) */}
        <ReportCard 
          title="The Architect" 
          role="Senior Backend Engineer" 
          grade="A" 
          delay={0.2}
          tags={[{ text: "Reviewer", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" }]}
          strengths={[
            "Top 5% in Code Review depth and feedback.",
            "Complex refactors in Rust with zero regression."
          ]}
          improvements={[
            "Documentation is sparse on core libraries.",
            "Increase visibility by contributing to 1 public repo."
          ]}
        />

        {/* Card 3: The Specialist (Hiring Ready) */}
        <ReportCard 
          title="The Algo Expert" 
          role="Machine Learning Eng" 
          grade="A-" 
          delay={0.3}
          tags={[{ text: "Python", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" }]}
          strengths={[
            "Exceptional algorithmic efficiency in Python.",
            "Maintains 3 popular open-source libraries."
          ]}
          improvements={[
            "Test coverage is below 60%. Aim for 80%.",
            "Reduce large PR sizes to improve merge speed."
          ]}
        />
      </div>

      {/* The "How it Helps" Value Prop */}
      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-border pt-16">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto text-foreground">
            <GitPullRequest size={24} />
          </div>
          <h3 className="font-serif text-xl">1. Connect & Analyze</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We scan your public repos (and private, if you choose) to build a holistic map of your coding habits, not just lines of code.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto text-foreground">
            <Sparkles size={24} />
          </div>
          <h3 className="font-serif text-xl">2. AI Coaching</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our LLM identifies patterns: "You code late at night," "You ignore tests," or "You're a great reviewer." We tell you what your boss won't.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto text-foreground">
            <Download size={24} />
          </div>
          <h3 className="font-serif text-xl">3. Export Evidence</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Generate a PDF report card to attach to your resume. Prove your skills with data, not just bullet points on LinkedIn.
          </p>
        </div>
      </div>
    </main>
  );
}