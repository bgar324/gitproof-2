import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ReportCard } from "@/components/report-card";
import { EditorWorkbench } from "./view";

export default async function EditorPage() {
  const session = await auth();
  if (!session?.user?.email) return redirect("/");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        orderBy: { impactScore: "desc" },
      },
    },
  });

  if (!user) return redirect("/");

  const stats = {
    impactScore: 42,
    totalContributions: user.projects.reduce(
      (acc, p) => acc + p.stars + p.forks * 2,
      100
    ),
    consistency: 88,
    repoCount: user.projects.length,
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background flex flex-col md:flex-row overflow-hidden">
      {/* LEFT: Fixed Report Card */}
      <section className="w-full md:w-[400px] lg:w-[450px] shrink-0 border-r border-border bg-secondary/10 md:h-[calc(100vh-64px)] md:sticky md:top-16 p-6 overflow-y-auto hidden md:block">
        <div className="h-full flex flex-col">
          <div className="mb-6">
            <h2 className="font-serif text-xl mb-1">Your Report Card</h2>
            <p className="text-xs text-muted-foreground">
              This is what recruiters see first.
            </p>
          </div>
          <ReportCard user={user} stats={stats} className="flex-1 shadow-sm" />
        </div>
      </section>

      {/* RIGHT: Workbench */}
      <section className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-background">
        {/* REDUCED SPACING: space-y-12 -> space-y-8 */}
        <div className="w-full h-full p-6 md:p-10 pb-32 space-y-8">
          {/* Identity Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-border pb-4">
              <div>
                <h2 className="font-serif text-2xl">Identity</h2>
                <p className="text-sm text-muted-foreground">
                  Define your stack and professional summary.
                </p>
              </div>
            </div>
            <EditorWorkbench section="identity" user={user} />
          </div>

          {/* Portfolio Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-border pb-4">
              <div>
                <h2 className="font-serif text-2xl">Portfolio</h2>
                <p className="text-sm text-muted-foreground">
                  Curate your best work.
                </p>
              </div>
              {/* FIXED: Just show total available here, detailed counts are in the Workbench */}
              <span className="text-xs font-mono text-muted-foreground">
                {user.projects.length} Repositories Found
              </span>
            </div>
            <EditorWorkbench section="portfolio" projects={user.projects} />
          </div>
        </div>
      </section>
    </main>
  );
}
