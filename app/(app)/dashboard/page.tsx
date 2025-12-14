// app/dashboard/page.tsx
import { getGitProofData } from "@/lib/github";
import DashboardView from "./view";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Fetch the real data on the server
  const data = await getGitProofData();

  // 2. If fetch fails (or user not logged in), send them back to login
  if (!data) {
    redirect("/");
  }

  // 3. Render the client view with the data
  return <DashboardView data={data} />;
}