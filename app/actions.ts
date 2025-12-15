"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { syncUserData } from "@/lib/sync";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function triggerSync() {
  const session = await auth();

  if (!session?.user?.username || !session?.user?.email)
    throw new Error("Not authenticated");

  // FIXED: Use 'image' (not avatarUrl) to match schema
  await syncUserData(
    session.user.username,
    session.user.email,
    session.user.image || ""
  );

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
  await db.project.update({
    where: { id: project.id },
    data: { aiDescription: text },
  });

  revalidatePath("/recruiter");
  return text;
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
  revalidatePath("/recruiter");
  return { success: true };
}
