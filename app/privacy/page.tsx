import Link from "next/link";
import { Shield, CheckCircle2, Lock, Eye, Database, UserX } from "lucide-react";
import { auth } from "@/auth";
import { MethodologyNavbar } from "@/components/methodology-navbar";

export default async function PrivacyPage() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <MethodologyNavbar isAuthenticated={isAuthenticated} />

      {/* Add top padding to account for fixed navbar */}
      <div className="pt-16"></div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Title Section */}
        <div className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary">
            <Shield size={12} />
            Privacy Policy
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
            Your Data,
            <span className="block text-primary mt-2">Your Control</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            GitProof is built with privacy at its core. We only access public
            GitHub data and never store sensitive information.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
            <span>Last Updated: December 2025</span>
            <span>•</span>
            <span>Effective Date: December 2025</span>
          </div>
        </div>

        {/* Key Principles */}
        <section className="mb-16 p-8 bg-secondary/30 border border-border rounded-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
            Our Privacy Principles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Read-Only Access
                </h3>
                <p className="text-sm text-muted-foreground">
                  We only request read-only permissions to your public GitHub data.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Lock size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Minimal Storage
                </h3>
                <p className="text-sm text-muted-foreground">
                  We cache data temporarily to improve performance, not to track you.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <Eye size={20} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Public Data Only
                </h3>
                <p className="text-sm text-muted-foreground">
                  We never access private repositories or sensitive information.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <UserX size={20} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Full Control
                </h3>
                <p className="text-sm text-muted-foreground">
                  Delete your data anytime by revoking GitHub OAuth access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Information We Collect */}
        <section className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database size={20} className="text-primary" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              1. Information We Collect
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mt-8 mb-4">
              1.1 GitHub Public Data
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              When you sign in with GitHub, we access the following public
              information through GitHub's API:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 my-4">
              <li>Your public profile information (name, username, avatar)</li>
              <li>Public repository metadata (names, descriptions, languages)</li>
              <li>Commit history and contribution statistics</li>
              <li>Stars, forks, and repository topics</li>
              <li>Public contribution graph data</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              1.2 Usage Information
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              We collect minimal usage data to improve our service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 my-4">
              <li>Authentication timestamps (when you sign in/out)</li>
              <li>Feature usage (which pages you visit within GitProof)</li>
              <li>Error logs (to fix bugs and improve stability)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              1.3 What We DON'T Collect
            </h3>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg my-6">
              <ul className="list-none space-y-2 text-foreground/90 m-0">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 mt-1 shrink-0"
                  />
                  <span>We never access private repositories</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 mt-1 shrink-0"
                  />
                  <span>We never read repository code or file contents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 mt-1 shrink-0"
                  />
                  <span>We never collect financial information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 mt-1 shrink-0"
                  />
                  <span>We never sell or share your data with third parties</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: How We Use Your Information */}
        <section className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Eye size={20} className="text-blue-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              2. How We Use Your Information
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed mb-6">
              We use the collected data exclusively to:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Generate Your Report Card
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  Analyze your GitHub activity to calculate impact scores,
                  consistency metrics, and developer archetypes.
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Provide Personalized Insights
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  Detect your technical strengths and growth opportunities using
                  heuristic analysis.
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Cache for Performance
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  Store calculated metrics temporarily (up to 1 hour) to reduce
                  API calls and improve load times.
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Host Public Profiles
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  If you choose to make your profile public, we display your
                  report card at gitproof.com/u/[username].
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Data Storage and Security */}
        <section className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Lock size={20} className="text-purple-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              3. Data Storage & Security
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold mt-8 mb-4">
              3.1 How Long We Keep Your Data
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 my-4">
              <li>
                <strong>Account Data:</strong> Stored while you have an active
                account
              </li>
              <li>
                <strong>Cached Metrics:</strong> Automatically refreshed every 1
                hour
              </li>
              <li>
                <strong>Public Profiles:</strong> Remain live until you disable
                them
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              3.2 Security Measures
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              We implement industry-standard security practices:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 my-4">
              <li>OAuth 2.0 authentication through GitHub</li>
              <li>Encrypted database connections</li>
              <li>Regular security audits and updates</li>
              <li>No plaintext storage of sensitive tokens</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Your Rights */}
        <section className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <UserX size={20} className="text-amber-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              4. Your Rights & Controls
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed mb-6">
              You have complete control over your data:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Delete Your Account
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  Revoke GitProof's access in your{" "}
                  <a
                    href="https://github.com/settings/applications"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub Settings → Applications
                  </a>
                  . This immediately removes all your data from our system.
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Control Public Visibility
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  Toggle your profile between public and private at any time in
                  your Settings page.
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Export Your Data
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  All displayed metrics are derived from public GitHub data you
                  already have access to.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Third-Party Services */}
        <section className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Shield size={20} className="text-cyan-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold">
              5. Third-Party Services
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed mb-6">
              GitProof integrates with the following third-party services:
            </p>

            <div className="space-y-3">
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      GitHub OAuth
                    </h4>
                    <p className="text-sm text-muted-foreground m-0">
                      For authentication and accessing public repository data
                    </p>
                  </div>
                  <a
                    href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline whitespace-nowrap"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Vercel (Hosting)
                    </h4>
                    <p className="text-sm text-muted-foreground m-0">
                      Infrastructure and deployment platform
                    </p>
                  </div>
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline whitespace-nowrap"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Changes to This Policy */}
        <section className="mb-16 scroll-mt-20">
          <h2 className="text-3xl font-serif font-bold mb-6">
            6. Changes to This Policy
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed">
              We may update this privacy policy occasionally to reflect changes
              in our practices or legal requirements. We'll notify users of
              significant changes by updating the "Last Updated" date at the top
              of this page. Continued use of GitProof after changes constitutes
              acceptance of the updated policy.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-16 p-8 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
          <h2 className="text-2xl font-serif font-bold mb-4">
            Questions or Concerns?
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            If you have any questions about this privacy policy or how we handle
            your data, we're here to help.
          </p>
          <Link
            href="https://www.bentgarcia.com"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Get in Touch
          </Link>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            By using GitProof, you agree to this privacy policy.{" "}
            <Link href="/methodology" className="text-primary hover:underline">
              Learn how we calculate metrics
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
