"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function generateRecruiterDescription(
  repoName: string, 
  rawDesc: string, 
  languages: string[],
  readme: string // <--- NEW PARAMETER
) {
  // Use 2.5 Flash for best speed/quality balance
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Safety truncate to avoid massive payload issues (though 2.5 can handle 1M tokens)
  const safeReadme = readme ? readme.substring(0, 5000) : "No README available.";

  const prompt = `
    You are an expert technical recruiter and senior software engineering manager at a FAANG company.
    
    Task: Rewrite the following GitHub repository description into a SINGLE, high-impact resume bullet point.
    
    Project Context:
    - Name: ${repoName}
    - Technologies: ${languages.join(", ")}
    - Description: "${rawDesc || "No description provided."}"
    - README Content (Excerpt): 
    """
    ${safeReadme}
    """
    
    Guidelines:
    - Start with a strong action verb (e.g., Architected, Engineered, Optimized, Deployed).
    - Focus on technical constraints, performance metrics, and business value.
    - EXTRACT SPECIFIC DETAILS from the README (e.g., if it mentions "Redis" or "AWS Lambda", include that).
    - Do NOT mention "University project" or "Homework". Treat it as professional software.
    - Do NOT use pronouns (I, we, my).
    - Keep it under 30 words.
    - Output ONLY the bullet point text. No quotes.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    console.error("AI Generation failed:", error);
    return "Failed to generate description. Please try again.";
  }
}