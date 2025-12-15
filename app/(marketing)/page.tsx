// app/page.tsx
"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { 
  Github, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck,
  GitPullRequest,
  Download,
  GitGraph
} from "lucide-react";

// --- SUB-COMPONENTS ---

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
  title, role, grade, delay, strengths, improvements, tags 
}: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
  >
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
         <span className="text-[10px] font-medium text-primary mt-1">GitProof</span>
       </div>
    </div>
    
    <div className="p-6 space-y-6 bg-card">
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={12} className="text-emerald-500"/> Strengths
        </h4>
        {strengths.map((s: string, i: number) => <InsightRow key={i} type="strength" text={s} />)}
      </div>
      <div className="space-y-3 pt-2 border-t border-dashed border-border">
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <TrendingUp size={12} className="text-amber-500"/> Growth Plan
        </h4>
        {improvements.map((s: string, i: number) => <InsightRow key={i} type="weakness" text={s} />)}
      </div>
    </div>
  </motion.div>
);

// --- MAIN PAGE COMPONENT ---

export default function LandingPage() {
  
  const handleLogin = () => {
    // Triggers GitHub OAuth and sends them to /dashboard
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <GitGraph size={18} />
            </div>
            GitProof
          </div>
          <button 
            onClick={handleLogin}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-xs font-medium text-primary mb-8 border border-primary/10"
        >
          <Sparkles size={12} /> The Developer Report Card
        </motion.div>
        
        <h1 className="font-serif text-5xl md:text-7xl mb-8 tracking-tight text-foreground">
          Don't just code.<br />
          <span className="text-muted-foreground italic">Prove it.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto mb-10">
          Turn your GitHub history into verified evidence. We analyze your code, generate a career report card, and give you the AI coaching you need to level up.
        </p>

        {/* Call to Action */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full text-lg font-medium transition-all hover:bg-foreground/90 shadow-xl shadow-primary/10"
        >
          <Github size={20} />
          <span>Connect with GitHub</span>
          <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
        </motion.button>
        
        <p className="mt-4 text-xs text-muted-foreground">
          Read-only access. We never modify your code.
        </p>
      </div>

      {/* The Evidence Grid (The Showcase) */}
      <div className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ReportCard 
            title="The Fast Learner" 
            role="Junior Frontend" 
            grade="B+" 
            delay={0.2}
            tags={[{ text: "High Volume", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" }]}
            strengths={["Consistent daily activity streak (45 days).", "High velocity in React component creation."]}
            improvements={["Commit messages are often one word ('fix').", "PRs lack descriptions."]}
          />
          <ReportCard 
            title="The Architect" 
            role="Senior Backend" 
            grade="A" 
            delay={0.3}
            tags={[{ text: "Reviewer", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" }]}
            strengths={["Top 5% in Code Review depth.", "Complex refactors in Rust with zero regression."]}
            improvements={["Documentation is sparse on core libraries.", "Increase visibility by contributing to open source."]}
          />
          <ReportCard 
            title="The Specialist" 
            role="ML Engineer" 
            grade="A-" 
            delay={0.4}
            tags={[{ text: "Python", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" }]}
            strengths={["Exceptional algorithmic efficiency.", "Maintains 3 popular open-source libraries."]}
            improvements={["Test coverage is below 60%. Aim for 80%.", "Reduce large PR sizes."]}
          />
        </div>
      </div>

      {/* The Value Prop (Merged from Showcase Page) */}
      <div className="pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-border pt-16">
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
      </div>

    </main>
  );
}