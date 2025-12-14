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

// --- 1. SYNC ACTION ---
export async function triggerSync() {
  const session = await auth();
  if (!session?.user?.username || !session?.user?.email) throw new Error("Not authenticated");

  await syncUserData(
    session.user.username, 
    session.user.email, 
    session.user.image || ""
  );
  
  revalidatePath("/recruiter");
  revalidatePath("/");
  return { success: true };
}

// --- 2. GENERATE ACTION (Updated) ---
export async function generateRecruiterDescription(
  repoName: string,
  rawDesc: string,
  tags: string[],
  readme: string
) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  // A. Generate Text
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
      Act as a Senior Technical Recruiter at a FAANG company.
      Rewrite this project description to be impactful, result-oriented, and quantitative.
      
      Project: ${repoName}
      Raw Description: "${rawDesc}"
      Tech Stack: ${tags.join(", ")}
      Context: ${readme ? readme.slice(0, 500) : "No readme"}
      
      Constraints:
      - Max 2 sentences.
      - Use active verbs (Architected, Deployed, Optimized).
      - Include metrics if possible (e.g., "Reduced latency by 40%").
      
      Output ONLY the new description.
    `,
  });

  // B. Save ONLY the text (Do NOT touch the score)
  const user = await db.user.findUnique({ where: { email: session.user.email } });

  if (user) {
    await db.project.update({
      where: {
        userId_repoName: {
          userId: user.id,
          repoName: repoName
        }
      },
      data: {
        aiDescription: text
        // impactScore is NOT updated here anymore!
      }
    });
  }

  return text;
}

// --- 3. REVERT ACTION (New) ---
export async function revertRecruiterDescription(repoName: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await db.user.findUnique({ where: { email: session.user.email } });

  if (user) {
    await db.project.update({
      where: {
        userId_repoName: {
          userId: user.id,
          repoName: repoName
        }
      },
      data: {
        aiDescription: null // Delete the AI text
      }
    });
  }
  return { success: true };
}