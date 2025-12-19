/* eslint-disable react/no-unescaped-entities */
import {
  BookOpen,
  BarChart3,
  TrendingUp,
  Zap,
  Trophy,
} from "lucide-react";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function MethodologyPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar session={session} variant="app" />

      {/* Add top padding to account for fixed navbar */}
      <div className="pt-16"></div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Title Section */}
        <div className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary">
            <BookOpen size={12} />
            Methodology & Calculations
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
            How GitProof Analyzes
            <span className="block text-primary mt-2">Developer Profiles</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A comprehensive technical overview of our metrics, heuristics, and
            analytical framework for evaluating developer contributions.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
            <span>Last Updated: December 2025</span>
            <span>•</span>
            <span>Version 1.0</span>
          </div>
        </div>

        {/* Abstract */}
        <section className="mb-16 p-8 bg-secondary/30 border border-border rounded-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Abstract
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            GitProof employs a multi-dimensional analytical framework to assess
            developer contributions across impact, consistency, collaboration,
            and craft. Our methodology combines quantitative metrics from
            GitHub's API with sophisticated heuristics to generate personalized
            insights. This document details the mathematical foundations,
            algorithmic processes, and decision trees underlying each component
            of the GitProof Report Card.
          </p>
        </section>

        {/* Table of Contents */}
        <nav className="mb-16 p-6 bg-card border border-border rounded-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">
            Contents
          </h2>
          <ol className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-muted-foreground">1.</span>
              <a href="#impact-score" className="text-primary hover:underline">
                Impact Score Calculation
              </a>
            </li>
            <li className="flex gap-2">
              <span className="text-muted-foreground">2.</span>
              <a href="#consistency" className="text-primary hover:underline">
                Consistency Metrics
              </a>
            </li>
            <li className="flex gap-2">
              <span className="text-muted-foreground">3.</span>
              <a href="#archetypes" className="text-primary hover:underline">
                Developer Archetypes
              </a>
            </li>
            <li className="flex gap-2">
              <span className="text-muted-foreground">4.</span>
              <a href="#strengths" className="text-primary hover:underline">
                Strength Detection Heuristics
              </a>
            </li>
            <li className="flex gap-2">
              <span className="text-muted-foreground">5.</span>
              <a href="#growth" className="text-primary hover:underline">
                Growth Focus Analysis
              </a>
            </li>
            <li className="flex gap-2">
              <span className="text-muted-foreground">6.</span>
              <a href="#grade" className="text-primary hover:underline">
                Grade Assignment
              </a>
            </li>
          </ol>
        </nav>

        {/* Section 1: Impact Score */}
        <section id="impact-score" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-primary" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              1. Impact Score Calculation
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mt-8 mb-4">1.1 Overview</h3>
            <p className="text-foreground/80 leading-relaxed">
              The Impact Score represents the weighted average of a developer's
              most significant projects, capped at 50 points. We calculate
              individual project scores using a composite formula that considers
              popularity, recency, and maturity.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              1.2 Per-Project Score Formula
            </h3>
            <div className="bg-card border border-border rounded-lg p-6 font-mono text-sm my-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  {"// Popularity Component (~40% weight)"}
                </p>
                <p>popularity = log₂(stars + forks × 2 + 1) × 3</p>
                <p className="text-muted-foreground mt-4">
                  {"// Recency Component (~30% weight)"}
                </p>
                <p>if daysSincePush &lt; 7: recency = 15</p>
                <p>if daysSincePush &lt; 30: recency = 10</p>
                <p>if daysSincePush &lt; 90: recency = 5</p>
                <p>else: recency = 0</p>
                <p className="text-muted-foreground mt-4">
                  {"// Maturity Component (~30% weight)"}
                </p>
                <p>maturity = 0</p>
                <p>if description.length &gt; 20: maturity += 5</p>
                <p>if homepage exists: maturity += 3</p>
                <p>if topics.length &gt; 0: maturity += 2</p>
                <p className="text-muted-foreground mt-4">
                  {"// Final Score"}
                </p>
                <p className="text-primary">
                  score = min(popularity + recency + maturity, 50)
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              1.3 Portfolio Aggregation
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              We take the <strong>average of the top 6 project scores</strong>{" "}
              to represent overall impact. This approach:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 my-4">
              <li>Rewards developers with multiple high-quality projects</li>
              <li>Prevents single outlier projects from skewing results</li>
              <li>Encourages consistent quality across portfolio</li>
              <li>Scales fairly for developers at different career stages</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Consistency */}
        <section id="consistency" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              2. Consistency Metrics
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mt-8 mb-4">2.1 Definition</h3>
            <p className="text-foreground/80 leading-relaxed">
              Consistency measures the percentage of days with at least one
              commit over the trailing 365-day period, based on GitHub
              contribution data.
            </p>

            <div className="bg-card border border-border rounded-lg p-6 font-mono text-sm my-6">
              <div className="space-y-2">
                <p>
                  activeDays = heatmap.filter(day =&gt; day.count &gt; 0).length
                </p>
                <p>totalDays = min(heatmap.length, 365)</p>
                <p className="text-primary mt-2">
                  consistency = round((activeDays / totalDays) × 100)
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4">2.2 Thresholds</h3>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <div className="text-sm font-mono text-emerald-500 mb-1">
                  ≥85%
                </div>
                <div className="text-sm font-medium">Elite Consistency (Streak Master)</div>
              </div>
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <div className="text-sm font-mono text-blue-500 mb-1">≥70%</div>
                <div className="text-sm font-medium">Very High (The Machine)</div>
              </div>
              <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
                <div className="text-sm font-mono text-cyan-500 mb-1">≥50%</div>
                <div className="text-sm font-medium">High (The Maintainer)</div>
              </div>
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <div className="text-sm font-mono text-amber-500 mb-1">
                  &lt;40%
                </div>
                <div className="text-sm font-medium">Growth Opportunity</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Archetypes */}
        <section id="archetypes" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Trophy size={20} className="text-purple-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              3. Developer Archetypes
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed mb-6">
              Developer archetypes are assigned using a priority-ordered
              decision tree. The system checks conditions from most exclusive to
              most common, assigning the first matching archetype.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              3.1 Archetype Criteria (Priority Order)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              The system evaluates conditions from top to bottom, assigning the first matching archetype. More exclusive archetypes are checked first.
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "The Legend",
                  color: "amber",
                  criteria:
                    "Impact ≥45 AND Total Stars ≥500 AND Consistency ≥80%",
                },
                {
                  title: "The Influencer",
                  color: "pink",
                  criteria: "Total Stars ≥200 AND Total Forks ≥50",
                },
                {
                  title: "Open Source Hero",
                  color: "red",
                  criteria: "Total Stars ≥100 AND Pull Requests ≥50",
                },
                {
                  title: "The Streak Master",
                  color: "yellow",
                  criteria: "Streak ≥100 days OR Consistency ≥85%",
                },
                {
                  title: "The Machine",
                  color: "blue",
                  criteria: "Consistency ≥70%",
                },
                {
                  title: "The Shipper",
                  color: "orange",
                  criteria: "≥5 projects active this month AND Impact ≥25",
                },
                {
                  title: "The Champion",
                  color: "purple",
                  criteria: "Impact Score ≥40",
                },
                {
                  title: "The Perfectionist",
                  color: "violet",
                  criteria: "Documentation Rate ≥80% AND ≥5 projects",
                },
                {
                  title: "The Craftsperson",
                  color: "cyan",
                  criteria: "Documentation Rate ≥60% AND Impact ≥15",
                },
                {
                  title: "The Collaborator",
                  color: "green",
                  criteria: "Pull Requests ≥75",
                },
                {
                  title: "The Specialist",
                  color: "emerald",
                  criteria: "≥75% projects in one language AND ≥5 projects",
                },
                {
                  title: "The Polyglot",
                  color: "indigo",
                  criteria: "≥6 different languages",
                },
                {
                  title: "The Architect",
                  color: "slate",
                  criteria: "≥20 total repositories (includes hidden projects)",
                },
                {
                  title: "The Builder",
                  color: "teal",
                  criteria: "≥12 total repositories (includes hidden projects)",
                },
                {
                  title: "The Maintainer",
                  color: "blue",
                  criteria: "≥10 repositories AND Consistency ≥50%",
                },
                {
                  title: "The Automator",
                  color: "purple",
                  criteria: "Has CI/CD/automation topics AND Impact ≥20",
                },
                {
                  title: "The Contributor",
                  color: "lime",
                  criteria: "Pull Requests ≥30",
                },
                {
                  title: "Active Builder",
                  color: "sky",
                  criteria: "Impact Score ≥15",
                },
                {
                  title: "Rising Star",
                  color: "amber",
                  criteria: "Impact Score ≥20 (default for active developers)",
                },
                {
                  title: "Full Stack Dev",
                  color: "primary",
                  criteria: "≥5 repositories AND Impact ≥10 (default for builders)",
                },
              ].map((archetype, index) => (
                <div
                  key={index}
                  className="p-4 bg-card border border-border rounded-lg flex justify-between items-start"
                >
                  <div>
                    <div className="font-semibold text-foreground mb-1">
                      {archetype.title}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {archetype.criteria}
                    </div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded bg-${archetype.color}-500/10 text-${archetype.color}-500 border border-${archetype.color}-500/20`}
                  >
                    Priority {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/30 border border-border rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Default Fallback
              </h4>
              <p className="text-sm text-muted-foreground">
                If no archetype criteria are met, the system assigns{" "}
                <span className="font-mono text-foreground">"Developer"</span> as a
                neutral fallback. This typically indicates a newer profile or one
                with limited public activity. Build up your impact score to ≥15 (Active Builder),
                or get 5+ repos with ≥10 impact (Full Stack Dev) to unlock more specific archetypes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Strengths */}
        <section id="strengths" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Zap size={20} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              4. Strength Detection Heuristics
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed mb-6">
              Strengths are detected across 9 dimensions using rule-based
              heuristics. Each insight is assigned a strength level
              (high/medium/low) and the top 4 are displayed.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              4.1 Detection Categories
            </h3>

            <div className="space-y-6">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  Consistency & Activity
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 font-mono">
                  <li>• Consistency ≥90% → "Exceptional consistency" [HIGH]</li>
                  <li>
                    • Consistency ≥70% → "Strong commit consistency" [MEDIUM]
                  </li>
                  <li>
                    • Streak ≥30 days → "Impressive X-day streak" [MEDIUM]
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  Impact & Quality
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 font-mono">
                  <li>• Impact ≥40 → "Elite-tier impact score" [HIGH]</li>
                  <li>• Impact ≥30 → "High-impact portfolio" [HIGH]</li>
                  <li>
                    • ≥3 projects with Impact ≥30 → "X high-impact projects"
                    [MEDIUM]
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  Community Engagement
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 font-mono">
                  <li>
                    • ≥5 projects with 10+ stars → "Strong community engagement"
                    [HIGH]
                  </li>
                  <li>
                    • Max stars ≥100 → "Popular project with X stars" [HIGH]
                  </li>
                  <li>• Pull Requests ≥100 → "Prolific contributor" [HIGH]</li>
                </ul>
              </div>

              <div className="border-l-4 border-cyan-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  Language Expertise
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 font-mono">
                  <li>
                    • ≥70% specialization + ≥5 projects → "Deep X
                    specialization" [HIGH]
                  </li>
                  <li>• ≥5 languages → "Polyglot developer" [MEDIUM]</li>
                  <li>
                    • Full-stack detection → "Full-stack versatility" [HIGH]
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-foreground mb-2">
                  Documentation & Polish
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 font-mono">
                  <li>
                    • ≥80% doc rate + ≥5 projects → "Exceptional documentation"
                    [HIGH]
                  </li>
                  <li>
                    • ≥70% maturity rate → "Well-polished projects" [MEDIUM]
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Growth Focus */}
        <section id="growth" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-amber-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              5. Growth Focus Analysis
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg mb-6">
              <p className="text-sm text-amber-700 dark:text-amber-400 m-0">
                <strong>Privacy Note:</strong> Growth Focus recommendations are
                private and only visible in your editor. They never appear on
                your public profile.
              </p>
            </div>

            <p className="text-foreground/80 leading-relaxed mb-6">
              Growth areas are identified across 8 dimensions, prioritized by
              impact, and limited to the top 3 most actionable recommendations.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              5.1 Detection Logic
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="font-mono text-sm text-muted-foreground mb-2">
                  if consistency &lt; 40% AND streak &lt; 7:
                </div>
                <div className="text-foreground">
                  → "Build a more consistent contribution rhythm" [HIGH]
                </div>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="font-mono text-sm text-muted-foreground mb-2">
                  if documentationRate &lt; 0.3 AND projects ≥ 5:
                </div>
                <div className="text-foreground">
                  → "Add comprehensive READMEs to showcase project value" [HIGH]
                </div>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="font-mono text-sm text-muted-foreground mb-2">
                  if popularProjects = 0 AND projects ≥ 5:
                </div>
                <div className="text-foreground">
                  → "Focus on discoverability and community building" [HIGH]
                </div>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="font-mono text-sm text-muted-foreground mb-2">
                  if impactScore &lt; 20 AND projects ≥ 5:
                </div>
                <div className="text-foreground">
                  → "Focus on fewer projects with higher quality" [HIGH]
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Grade */}
        <section id="grade" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy size={20} className="text-primary" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              6. Grade Assignment
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed mb-6">
              Grades are assigned based solely on Impact Score using fixed
              thresholds:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-xl">
                <div className="text-4xl font-serif font-bold text-amber-500 mb-2">
                  S
                </div>
                <div className="text-sm font-mono text-muted-foreground">
                  Impact Score &gt; 40
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Elite tier - Top 1% of developers
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-xl">
                <div className="text-4xl font-serif font-bold text-emerald-500 mb-2">
                  A
                </div>
                <div className="text-sm font-mono text-muted-foreground">
                  Impact Score &gt; 30
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Excellent - High-impact contributor
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl">
                <div className="text-4xl font-serif font-bold text-blue-500 mb-2">
                  B
                </div>
                <div className="text-sm font-mono text-muted-foreground">
                  Impact Score &gt; 20
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Good - Solid portfolio
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-zinc-500/10 to-zinc-600/5 border border-zinc-500/30 rounded-xl">
                <div className="text-4xl font-serif font-bold text-zinc-500 mb-2">
                  C
                </div>
                <div className="text-sm font-mono text-muted-foreground">
                  Impact Score ≤ 20
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Building - Room for growth
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-16 p-8 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
          <h2 className="text-2xl font-serif font-bold mb-4">Conclusion</h2>
          <p className="text-foreground/80 leading-relaxed">
            GitProof's methodology combines quantitative metrics with
            qualitative heuristics to provide developers with actionable,
            personalized insights. All calculations are performed on real-time
            data from GitHub's API, ensuring accuracy and transparency. As our
            platform evolves, we continue to refine these algorithms based on
            community feedback and emerging best practices in software
            development analytics.
          </p>
        </section>

      </main>
      <Footer />
    </div>
  );
}
