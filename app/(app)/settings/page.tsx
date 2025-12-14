import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SettingsView from "./view"; // <--- Now this import will work!

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Mock settings for now
  const mockSettings = {
    isPublic: true,
    emailNotifications: false,
    theme: "dark"
  };

  return (
    <SettingsView user={session.user} settings={mockSettings} />
  );
}