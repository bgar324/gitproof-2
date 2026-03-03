import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getGitHubConnectionStatus } from "@/lib/github-connection";
import { redirect } from "next/navigation";
import SettingsView from "./view";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  if (!session.user.email) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      isPublic: true,
      emailNotifications: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  const { requiresReconnect } = await getGitHubConnectionStatus(
    session.user.email,
  );

  return (
    <SettingsView
      user={session.user}
      settings={user}
      requiresReconnect={requiresReconnect}
    />
  );
}
