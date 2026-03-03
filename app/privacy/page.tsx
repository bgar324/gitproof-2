/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { Shield, CheckCircle2, Lock, Eye, Database, UserX } from "lucide-react";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function PrivacyPage() {
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
            <Shield size={12} />
            Privacy Policy
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
            Your Data,
            <span className="block text-primary mt-2">Your Control</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            GitProof uses your GitHub identity, public repository data, and the
            portfolio content you choose to save. We do not access private
            repositories.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
            <span>Last Updated: March 2026</span>
            <span>•</span>
            <span>Effective Date: March 2026</span>
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
                  No Private Repo Access
                </h3>
                <p className="text-sm text-muted-foreground">
                  We do not request GitHub scopes that grant access to private
                  repositories.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Lock size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Stored In Your Account
                </h3>
                <p className="text-sm text-muted-foreground">
                  We store synced portfolio data, saved edits, and encrypted
                  GitHub tokens on our server so the app can work.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <Eye size={20} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Public GitHub Content
                </h3>
                <p className="text-sm text-muted-foreground">
                  Optional AI features may read public READMEs and selected
                  public files from repositories already linked to your account.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <UserX size={20} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Delete From Settings
                </h3>
                <p className="text-sm text-muted-foreground">
                  You can delete your stored data from the Settings page at any
                  time.
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
              1.1 Account and Repository Data
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              When you sign in and sync your account, we store and process:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 my-4">
              <li>Your GitHub identity data (name, username, email, avatar)</li>
              <li>GitHub OAuth account data, including a server-side access token and granted scopes</li>
              <li>Public repository metadata, README content, and derived portfolio metrics</li>
              <li>Public contribution and activity statistics pulled from GitHub</li>
              <li>Portfolio content you save in GitProof, such as bio text, visibility, and AI-generated edits</li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              1.2 Operational Data
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              We also keep a small amount of operational data so the product can run:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 my-4">
              <li>Sync timestamps and cached analytics snapshots</li>
              <li>Session records used for authentication flows</li>
              <li>Your email notification preference</li>
              <li>Server-side error logs when actions fail</li>
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
                  <span>We do not run third-party page analytics today</span>
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
                  <span>We do not sell your personal data</span>
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
              We use this data to:
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
                  Provide AI Features You Request
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  When you choose AI actions, we send the relevant public repo
                  context or portfolio text to Google Gemini to generate bios,
                  descriptions, and README drafts.
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Store and Refresh Your Sync
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  Save synced data in our database and treat it as stale after
                  about one hour so you can refresh it when needed.
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Host Public Profiles
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  If you choose to make your profile public, we display your
                  report card at /u/[username].
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
                <strong>Account Data:</strong> Stored until you delete your
                GitProof account
              </li>
              <li>
                <strong>GitHub Tokens and Sessions:</strong> Stored while your
                account remains active so sync and sign-in continue to work
              </li>
              <li>
                <strong>Synced Metrics and Saved Content:</strong> Stored until
                you resync, edit, or delete your account
              </li>
              <li>
                <strong>Public Profiles:</strong> Stay live until you switch
                them off or delete your account
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              3.2 Security Measures
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              We currently apply the following controls:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80 my-4">
              <li>OAuth 2.0 authentication through GitHub</li>
              <li>GitHub tokens are encrypted at rest on our server and are not exposed to browser sessions</li>
              <li>Authenticated routes and per-user database checks gate private account actions</li>
              <li>We rely on our hosting and database providers for transport and infrastructure security</li>
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
              You have the following controls:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Delete Your Account
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  Delete your account from Settings to remove the data we store.
                  We also attempt to revoke GitHub access during deletion.
                </p>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Disconnect GitHub
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  Removing GitProof from{" "}
                  <a
                    href="https://github.com/settings/applications"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub Settings → Applications
                  </a>
                  {" "}stops future access, but it does not delete data already
                  stored in GitProof.
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
                  Review and Edit Saved Content
                </h4>
                <p className="text-sm text-muted-foreground m-0">
                  You can update your bio, featured projects, and saved AI copy
                  at any time from the editor and settings pages.
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
                      GitHub
                    </h4>
                    <p className="text-sm text-muted-foreground m-0">
                      For sign-in and fetching your public GitHub data
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
                      Google Gemini
                    </h4>
                    <p className="text-sm text-muted-foreground m-0">
                      For optional AI-generated bios, project descriptions, and
                      README drafts when you trigger those features
                    </p>
                  </div>
                  <a
                    href="https://policies.google.com/privacy"
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

      </main>
      <Footer />
    </div>
  );
}
