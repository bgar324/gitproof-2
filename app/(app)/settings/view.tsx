"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { RefreshCw, Save } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { triggerSync, deleteUserAccount } from "@/app/actions";
import type { Session } from "next-auth";
import {
  AppearanceSection,
  VisibilitySection,
  AccountSection,
  NotificationsSection,
  DangerZoneSection,
} from "@/components/settings";

interface SettingsViewProps {
  user: Session["user"];
  settings?: {
    isPublic?: boolean;
    emailNotifications?: boolean;
    theme?: string;
  };
}

export default function SettingsView({ user, settings }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const initialPublic = settings?.isPublic ?? false;
  const initialNotifs = settings?.emailNotifications ?? false;

  const [isPublic, setIsPublic] = useState(initialPublic);
  const [emailNotifs, setEmailNotifs] = useState(initialNotifs);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmUsername, setConfirmUsername] = useState("");
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const username = user?.username || "";
  const canDelete = confirmUsername === username && confirmPhrase === "Confirm";

  useEffect(() => setMounted(true), []);

  const handleResync = async () => {
    setIsSyncing(true);
    try {
      await triggerSync();
      router.refresh();
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Sync failed. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Connect to backend API to persist settings
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleDeleteAccount = async () => {
    console.log("🔴 DELETE INITIATED - handleDeleteAccount called");
    setIsDeleting(true);
    try {
      console.log("🔴 Calling deleteUserAccount server action...");
      const result = await deleteUserAccount();
      console.log("🔴 deleteUserAccount returned:", result);

      console.log("🔴 Signing out...");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("🔴 Delete failed in handleDeleteAccount:", error);
      alert(
        `Failed to delete account: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!mounted || !user) return null;

  const containerMotion: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08,
      },
    },
  };
  const itemMotion: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <main className="pt-8 pb-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerMotion}
      >
        <motion.div
          className="flex items-center justify-between mb-10"
          variants={itemMotion}
        >
          <div>
            <h1 className="text-3xl font-serif text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your profile and preferences.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 px-6 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2 shadow-lg"
          >
            {isSaving ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>

        <div className="space-y-2">
          <motion.div variants={itemMotion}>
            <AppearanceSection theme={theme} onThemeChange={setTheme} />
          </motion.div>
          <motion.div variants={itemMotion}>
            <VisibilitySection
              isPublic={isPublic}
              username={username}
              onPublicChange={setIsPublic}
            />
          </motion.div>
          <motion.div variants={itemMotion}>
            <AccountSection
              user={{
                name: user.name || undefined,
                email: user.email || undefined,
                image: user.image || undefined,
              }}
              isSyncing={isSyncing}
              onResync={handleResync}
            />
          </motion.div>
          <motion.div variants={itemMotion}>
            <NotificationsSection
              emailNotifs={emailNotifs}
              onEmailNotifsChange={setEmailNotifs}
            />
          </motion.div>
          <motion.div variants={itemMotion}>
            <DangerZoneSection
              showDeleteConfirm={showDeleteConfirm}
              isDeleting={isDeleting}
              confirmUsername={confirmUsername}
              confirmPhrase={confirmPhrase}
              canDelete={canDelete}
              username={username}
              onShowDeleteConfirm={setShowDeleteConfirm}
              onConfirmUsernameChange={setConfirmUsername}
              onConfirmPhraseChange={setConfirmPhrase}
              onDeleteAccount={handleDeleteAccount}
            />
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
