// app/recruiter/page.tsx
import { getGitProofData } from "@/lib/github";
import RecruiterView from "./view";
import { redirect } from "next/navigation";

export default async function RecruiterPage() {
  // 1. Fetch real data
  const data = await getGitProofData();

  if (!data) {
    redirect("/");
  }

  // 2. Transform the data for the UI
  const projects = data.topRepos.map((repo, index) => ({
    id: index,
    repo: repo.name,
    url: repo.url,
    isPublic: repo.isPublic,
    // GitHub 'description' becomes our 'raw_desc'
    raw_desc: repo.desc === "No description provided." ? "" : repo.desc,
    
    // NEW: Pass the real readme and language list
    readme: repo.readme,
    tags: repo.languages, 
    
    recruiter_desc: "", // Initially empty, AI will fill this
    impact_score: repo.score,
  }));

  // 3. Render the client view
  return <RecruiterView projects={projects} username={data.username} />;
}