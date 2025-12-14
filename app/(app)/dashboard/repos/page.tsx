import { getGitProofData } from "@/lib/github";
import ReposView from "./view";
import { redirect } from "next/navigation";

export default async function AllReposPage() {
  const data = await getGitProofData();
  if (!data) return redirect("/");

  return <ReposView repos={data.topRepos} />;
}