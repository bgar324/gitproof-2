"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, type Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  deleteUserAccount,
  prepareGitHubReconnect,
  toggleProfilePublic,
  triggerSync,
  updateEmailNotifications,
} from "@/app/actions";
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
  requiresReconnect?: boolean;
}

export default function SettingsView({
  user,
  settings,
  requiresReconnect = false,
}: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const initialPublic = settings?.isPublic ?? false;
  const initialNotifs = settings?.emailNotifications ?? false;

  const [isPublic, setIsPublic] = useState(initialPublic);
  const [emailNotifs, setEmailNotifs] = useState(initialNotifs);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);
  const [isUpdatingNotifs, setIsUpdatingNotifs] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
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
      toast.success("GitHub data synced.");
    } catch (error) {
      console.error("Sync failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Sync failed. Please try again.",
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePublicChange = async (nextValue: boolean) => {
    setIsPublic(nextValue);
    setIsUpdatingPublic(true);
    try {
      await toggleProfilePublic(nextValue);
      toast.success(
        nextValue ? "Public profile enabled." : "Public profile hidden.",
      );
      router.refresh();
    } catch (error) {
      console.error("Visibility update failed:", error);
      setIsPublic(!nextValue);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update profile visibility.",
      );
    } finally {
      setIsUpdatingPublic(false);
    }
  };

  const handleNotificationsChange = async (nextValue: boolean) => {
    setEmailNotifs(nextValue);
    setIsUpdatingNotifs(true);
    try {
      await updateEmailNotifications(nextValue);
      toast.success(
        nextValue
          ? "Product email preference saved."
          : "Product email preference disabled.",
      );
      router.refresh();
    } catch (error) {
      console.error("Notification update failed:", error);
      setEmailNotifs(!nextValue);
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update notification settings.",
      );
    } finally {
      setIsUpdatingNotifs(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUserAccount();
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Account deletion failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete account. Please try again.",
      );
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      await prepareGitHubReconnect();
      await signOut({ redirect: false });
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("GitHub reconnect failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reconnect GitHub. Please try again.",
      );
      setIsReconnecting(false);
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
        </motion.div>

        <div className="space-y-2">
          <motion.div variants={itemMotion}>
            <AppearanceSection theme={theme} onThemeChange={setTheme} />
          </motion.div>
          <motion.div variants={itemMotion}>
            <VisibilitySection
              isPublic={isPublic}
              username={username}
              onPublicChange={handlePublicChange}
              disabled={isUpdatingPublic}
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
              requiresReconnect={requiresReconnect}
              isReconnecting={isReconnecting}
              onReconnect={handleReconnect}
            />
          </motion.div>
          <motion.div variants={itemMotion}>
            <NotificationsSection
              emailNotifs={emailNotifs}
              onEmailNotifsChange={handleNotificationsChange}
              disabled={isUpdatingNotifs}
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
