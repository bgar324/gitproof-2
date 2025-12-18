import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { calculateUserStats, analyzeUserInsights, calculateTopTechnologies } from "@/lib/stats";
import { HeroSection, PortfolioSection } from "@/components/profile";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!username || Array.isArray(username)) return notFound();

  const user = await db.user.findUnique({
    where: { username: username },
    include: {
      projects: {
        where: { isHidden: false },
        orderBy: { impactScore: "desc" },
      },
    },
  });

  if (!user || user.isPublic === false) return notFound();

  const stats = calculateUserStats(user);
  const insights = analyzeUserInsights(user, stats);
  const topTech = calculateTopTechnologies(user, 6);
  const featuredProjects = user.projects.slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.4] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />
      <HeroSection user={user} stats={stats} insights={insights} topTech={topTech} />
      <PortfolioSection projects={featuredProjects} />
    </div>
  );
}
