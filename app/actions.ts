"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { syncUserData } from "@/lib/sync";
import { sanitizeString, sanitizeForPostgres } from "@/lib/sanitize";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function triggerSync() {
  const session = await auth();

  if (!session?.user?.username || !session?.user?.email)
    throw new Error("Not authenticated");

  // 1. Sync repos to database
  await syncUserData(
    session.user.username,
    session.user.email,
    session.user.image || ""
  );

  // 2. Also fetch and cache fresh stats from GitHub
  const { getGitProofData } = await import("@/lib/github");
  const freshData = await getGitProofData();

  if (freshData) {
    // Sanitize data to remove null bytes that PostgreSQL can't handle
    const sanitizedData = sanitizeForPostgres(freshData);

    await db.user.update({
      where: { email: session.user.email },
      data: {
        profileData: sanitizedData as any,
        lastSyncedAt: new Date(),
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/recruiter");
  return { success: true };
}

export async function generateRecruiterDescription(
  repoName: string,
  rawDesc: string,
  tags: string[],
  readme: string
) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  // FIXED: Find Project by Name manually (since userId_repoName constraint is gone)
  const project = await db.project.findFirst({
    where: {
      userId: user.id,
      name: repoName,
    },
  });

  if (!project) throw new Error("Project not found");

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
      Act as a Senior Technical Recruiter at a FAANG company.
      Rewrite this project description to be impactful, result-oriented, and quantitative.
      Project: ${repoName}
      Raw Description: "${rawDesc}"
      Tech Stack: ${tags.join(", ")}
      Context: ${readme ? readme.slice(0, 500) : "No readme"}
      Constraints: Max 2 sentences. Use active verbs.
      Output ONLY the new description.
    `,
  });

  // FIXED: Update using the unique 'id' we found above
  // CRITICAL FIX: Sanitize AI-generated text before database write
  await db.project.update({
    where: { id: project.id },
    data: { aiDescription: sanitizeString(text) },
  });

  revalidatePath("/recruiter");
  return text;
}

export async function toggleProfilePublic(isPublic: boolean) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await db.user.update({
    where: { email: session.user.email },
    data: { isPublic: isPublic },
  });

  revalidatePath("/editor");
  // Also revalidate the public profile page
  if (user.username) {
    revalidatePath(`/u/${user.username}`);
  }
  return { success: true, isPublic: isPublic };
}

export async function revertRecruiterDescription(repoName: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return;

  const project = await db.project.findFirst({
    where: { userId: user.id, name: repoName },
  });

  if (project) {
    await db.project.update({
      where: { id: project.id },
      data: { aiDescription: null },
    });
  }
  revalidatePath("/editor");
  return { success: true };
}

export async function updateUserBio(bio: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  // CRITICAL FIX: Sanitize user-provided bio before database write
  await db.user.update({
    where: { email: session.user.email },
    data: { bio: sanitizeString(bio) },
  });

  revalidatePath("/editor");
  if (session.user.username) {
    revalidatePath(`/u/${session.user.username}`);
  }
  return { success: true };
}

export async function generateUserBio() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        orderBy: { impactScore: "desc" },
        take: 10,
      },
    },
  });

  if (!user) throw new Error("User not found");

  // Build context from top projects
  const topProjects = user.projects.slice(0, 5);
  const languageMap = new Map<string, number>();
  const topicsSet = new Set<string>();

  topProjects.forEach((p) => {
    if (p.language) {
      languageMap.set(p.language, (languageMap.get(p.language) || 0) + 1);
    }
    if (p.topics && Array.isArray(p.topics)) {
      p.topics.forEach((topic: any) => topicsSet.add(topic));
    }
  });

  const topLanguages = Array.from(languageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);

  const projectSummaries = topProjects
    .map(
      (p) =>
        `- ${p.name}: ${p.desc || "No description"} (${
          p.stars
        } stars, Impact: ${p.impactScore}/50)`
    )
    .join("\n");

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `You are a senior technical recruiter writing a professional bio for a developer's portfolio.

Developer Context:
- Name: ${user.name}
- Username: @${user.username}
- Top Languages: ${topLanguages.join(", ")}
- Key Topics: ${Array.from(topicsSet).slice(0, 5).join(", ")}

Top Projects:
${projectSummaries}

Instructions:
1. Write a compelling 2-3 sentence professional bio
2. Focus on their technical expertise and what they build
3. Use active, confident language
4. Mention their primary tech stack naturally
5. Keep it under 150 words
6. Make it sound human and authentic, not robotic
7. Don't use clichés like "passionate about" or "dedicated to"
8. Focus on what they DO and BUILD, not abstract qualities

Output ONLY the bio text, nothing else.`,
  });

  return { success: true, bio: text.trim() };
}

export async function updateProjectVisibility(
  projectId: string,
  isHidden: boolean
) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  // Verify the project belongs to the user
  const project = await db.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) throw new Error("Project not found");

  await db.project.update({
    where: { id: projectId },
    data: { isHidden },
  });

  revalidatePath("/editor");
  if (user.username) {
    revalidatePath(`/u/${user.username}`);
  }
  return { success: true };
}

export async function batchUpdateProjectVisibility(
  hiddenProjectIds: string[],
  visibleProjectIds: string[]
) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  // Hide projects
  if (hiddenProjectIds.length > 0) {
    await db.project.updateMany({
      where: {
        id: { in: hiddenProjectIds },
        userId: user.id,
      },
      data: { isHidden: true },
    });
  }

  // Show projects (unhide)
  if (visibleProjectIds.length > 0) {
    await db.project.updateMany({
      where: {
        id: { in: visibleProjectIds },
        userId: user.id,
      },
      data: { isHidden: false },
    });
  }

  revalidatePath("/editor");
  if (user.username) {
    revalidatePath(`/u/${user.username}`);
  }
  return { success: true };
}

export async function updateProjectDescription(
  projectId: string,
  description: string
) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  // Verify the project belongs to the user
  const project = await db.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) throw new Error("Project not found");

  // CRITICAL FIX: Sanitize user-provided description before database write
  await db.project.update({
    where: { id: projectId },
    data: { aiDescription: sanitizeString(description) },
  });

  revalidatePath("/editor");
  if (user.username) {
    revalidatePath(`/u/${user.username}`);
  }
  return { success: true };
}

export async function generateAIDescription(projectId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const project = await db.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) throw new Error("Project not found");

  // Build context for AI
  const context = {
    name: project.name,
    description: project.desc || "No description",
    language: project.language || "Unknown",
    topics: project.topics || [],
    stars: project.stars,
    forks: project.forks,
    readme: project.readme ? project.readme.slice(0, 1000) : null, // First 1000 chars
    impactScore: project.impactScore,
  };

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `You are a senior technical recruiter at a top tech company. Your job is to rewrite project descriptions to be compelling, quantitative, and results-oriented.

Project Context:
- Name: ${context.name}
- Current Description: "${context.description}"
- Language: ${context.language}
- Topics: ${context.topics.join(", ")}
- Stars: ${context.stars} | Forks: ${context.forks}
- Impact Score: ${context.impactScore}/50
${
  context.readme
    ? `- README Preview: ${context.readme.substring(0, 500)}...`
    : ""
}

Instructions:
1. Write a compelling 1-2 sentence description that would impress recruiters
2. Focus on IMPACT and RESULTS, not just features
3. Use active verbs (Built, Developed, Engineered, Created, etc.)
4. Include metrics where possible (users, performance gains, scale, etc.)
5. Make it sound professional but not overly sales-y
6. If the project has significant traction (stars/forks), highlight it
7. Keep it under 150 characters if possible, max 200

Output ONLY the rewritten description, nothing else.`,
  });

  // Save the AI-generated description
  // CRITICAL FIX: Sanitize AI-generated text before database write
  await db.project.update({
    where: { id: project.id },
    data: { aiDescription: sanitizeString(text.trim()) },
  });

  revalidatePath("/editor");
  if (user.username) {
    revalidatePath(`/u/${user.username}`);
  }

  return { success: true, description: text.trim() };
}

export async function deleteUserAccount() {
  const session = await auth();
  if (!session?.user?.email) {
    console.error("Delete failed: No authenticated session");
    throw new Error("Not authenticated");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: true,
      accounts: true,
      sessions: true,
    },
  });

  if (!user) {
    console.error("Delete failed: User not found for email:", session.user.email);
    throw new Error("User not found");
  }

  console.log(`🗑️  Deleting user account:`, {
    userId: user.id,
    email: user.email,
    username: user.username,
    projectCount: user.projects.length,
    accountCount: user.accounts.length,
    sessionCount: user.sessions.length,
  });

  try {
    // Delete in explicit order to avoid any foreign key issues
    console.log("🗑️  Step 1: Deleting sessions...");
    const deletedSessions = await db.session.deleteMany({
      where: { userId: user.id },
    });
    console.log(`✅ Deleted ${deletedSessions.count} sessions`);

    console.log("🗑️  Step 2: Deleting projects...");
    const deletedProjects = await db.project.deleteMany({
      where: { userId: user.id },
    });
    console.log(`✅ Deleted ${deletedProjects.count} projects`);

    console.log("🗑️  Step 3: Deleting accounts...");
    const deletedAccounts = await db.account.deleteMany({
      where: { userId: user.id },
    });
    console.log(`✅ Deleted ${deletedAccounts.count} accounts`);

    console.log("🗑️  Step 4: Deleting user...");
    const deleted = await db.user.delete({
      where: { id: user.id },
    });
    console.log("✅ User deleted:", deleted.id);

    console.log("✅✅✅ ACCOUNT DELETION COMPLETE ✅✅✅");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Delete user failed:", error);
    console.error("❌ Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    throw new Error(`Failed to delete account: ${error.message}`);
  }
}
