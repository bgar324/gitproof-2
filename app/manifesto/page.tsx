/* eslint-disable react/no-unescaped-entities */
import { Target, Code2, Zap } from "lucide-react";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function ManifestoPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar session={session} variant="marketing" />

      {/* Add top padding to account for fixed navbar */}
      <div className="pt-16"></div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Title Section */}
        <div className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary">
            <Target size={12} />
            The Manifesto
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
            Stop Explaining
            <span className="block text-primary mt-2">Your Code</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Why GitProof exists and what we believe about the future of
            developer credibility.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
            <span>Written: December 2025</span>
            <span>•</span>
            <span>Our Mission</span>
          </div>
        </div>

        {/* Section 1: The Problem */}
        <section className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Code2 size={20} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              The Resume Is Dead
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed text-lg">
              At least for engineers. A single sheet of paper cannot capture the
              elegance of your architecture, the consistency of your commits, or
              the complexity of the problems you solve daily.
            </p>

            <p className="text-foreground/80 leading-relaxed mt-4">
              We built GitProof because we were tired of being judged by
              keywords rather than key contributions. We believe that your
              GitHub activity is the single most potent signal of your
              capability—but only if it can be translated into a language that
              recruiters speak.
            </p>
          </div>
        </section>

        {/* Quote Section */}
        <section className="mb-16 p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-l-4 border-primary rounded-r-xl">
          <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed">
            "Code is the only truth. Everything else is just marketing."
          </blockquote>
        </section>

        {/* Section 2: Our Belief */}
        <section className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Zap size={20} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold">What We Believe</h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed text-lg">
              This isn't about gamifying contributions. It's about revealing the
              work you've already done. It's about taking the invisible labor of
              software engineering and making it undeniable.
            </p>

            <div className="mt-8 space-y-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Your Code Speaks Louder
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  Every commit, every repository, every contribution tells a
                  story about who you are as an engineer. GitProof makes that
                  story readable.
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Merit Over Marketing
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  The best engineers shouldn't need to be the best marketers.
                  Your work should stand on its own merits.
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Transparency & Truth
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  We use only public data from GitHub. No tricks, no
                  manipulation—just an honest analysis of your contributions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Statement */}
        <section className="mb-16 p-8 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
          <h2 className="text-2xl font-serif font-bold mb-4">
            The Future of Developer Credibility
          </h2>
          <p className="text-foreground/80 leading-relaxed">
            We envision a world where hiring decisions are based on demonstrable
            skill rather than resume keywords. Where your GitHub profile is your
            portfolio, your proof, and your credential. GitProof is our
            contribution to making that world a reality.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
