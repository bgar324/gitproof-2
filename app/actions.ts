"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
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
        profileData: sanitizedData as unknown as Prisma.InputJsonValue,
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
    model: google("gemini-2.5-flash-lite"),
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
  const sanitizedBio = sanitizeString(bio);
  console.log("📝 Updating bio:", {
    originalLength: bio.length,
    sanitizedLength: sanitizedBio.length,
    email: session.user.email,
    username: session.user.username,
  });

  const updatedUser = await db.user.update({
    where: { email: session.user.email },
    data: { bio: sanitizedBio },
  });

  console.log("✅ Bio updated successfully:", {
    bioLength: updatedUser.bio?.length,
    username: updatedUser.username,
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
      p.topics.forEach((topic) => topicsSet.add(topic));
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
    model: google("gemini-2.5-flash-lite"),
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
9. Don't put their username in this bio. Just their name.

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
    model: google("gemini-2.5-flash-lite"),
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

  console.log(`🗑️  COMPLETE ACCOUNT OBLITERATION INITIATED:`, {
    userId: user.id,
    email: user.email,
    username: user.username,
    projectCount: user.projects.length,
    accountCount: user.accounts.length,
    sessionCount: user.sessions.length,
  });

  try {
    // STEP 0: Revoke GitHub OAuth GRANT (forces re-authorization)
    console.log("🗑️  Step 0: Revoking GitHub OAuth authorization grant...");
    const githubAccount = user.accounts.find((acc) => acc.provider === "github");

    if (githubAccount?.access_token) {
      try {
        const clientId = process.env.AUTH_GITHUB_ID;
        const clientSecret = process.env.AUTH_GITHUB_SECRET;

        if (clientId && clientSecret) {
          const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

          // First, revoke the authorization grant (removes app from authorized apps)
          console.log("🗑️  Revoking authorization grant...");
          const grantResponse = await fetch(
            `https://api.github.com/applications/${clientId}/grant`,
            {
              method: "DELETE",
              headers: {
                "Authorization": `Basic ${basicAuth}`,
                "Accept": "application/vnd.github+json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token: githubAccount.access_token,
              }),
            }
          );

          if (grantResponse.ok || grantResponse.status === 404) {
            console.log("✅ GitHub authorization grant revoked (user must re-authorize)");
          } else {
            const errorText = await grantResponse.text();
            console.warn(`⚠️  Grant revocation returned ${grantResponse.status}:`, errorText);

            // Fallback: Try revoking just the token
            console.log("🗑️  Falling back to token revocation...");
            const tokenResponse = await fetch(
              `https://api.github.com/applications/${clientId}/token`,
              {
                method: "DELETE",
                headers: {
                  "Authorization": `Basic ${basicAuth}`,
                  "Accept": "application/vnd.github+json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  access_token: githubAccount.access_token,
                }),
              }
            );

            if (tokenResponse.ok || tokenResponse.status === 404) {
              console.log("✅ GitHub token revoked (grant revocation failed)");
            } else {
              console.warn(`⚠️  Token revocation returned ${tokenResponse.status}`);
            }
          }
        }
      } catch (revokeError) {
        console.warn("⚠️  GitHub OAuth revocation failed (non-critical):", revokeError);
        // Continue with deletion even if revocation fails
      }
    }

    // STEP 1: Delete all sessions (logs user out everywhere)
    console.log("🗑️  Step 1: Deleting all sessions...");
    const deletedSessions = await db.session.deleteMany({
      where: { userId: user.id },
    });
    console.log(`✅ Obliterated ${deletedSessions.count} sessions`);

    // STEP 2: Delete all projects
    console.log("🗑️  Step 2: Deleting all projects...");
    const deletedProjects = await db.project.deleteMany({
      where: { userId: user.id },
    });
    console.log(`✅ Obliterated ${deletedProjects.count} projects`);

    // STEP 3: Delete all OAuth accounts
    console.log("🗑️  Step 3: Deleting all OAuth accounts...");
    const deletedAccounts = await db.account.deleteMany({
      where: { userId: user.id },
    });
    console.log(`✅ Obliterated ${deletedAccounts.count} OAuth accounts`);

    // STEP 4: Delete the user record
    console.log("🗑️  Step 4: Deleting user record...");
    const deleted = await db.user.delete({
      where: { id: user.id },
    });
    console.log(`✅ Obliterated user: ${deleted.id}`);

    console.log("💥💥💥 ACCOUNT COMPLETELY OBLITERATED 💥💥💥");
    console.log("User must re-authorize GitHub OAuth to sign in again");

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const errorMeta =
      typeof error === "object" && error !== null ? error : undefined;
    console.error("❌ Account obliteration failed:", error);
    if (errorMeta) {
      console.error("❌ Error details:", errorMeta);
    }
    throw new Error(`Failed to delete account: ${message}`);
  }
}
