"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  RefreshCw,
  Trash2,
  ExternalLink,
  Save,
  LogOut,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { triggerSync, deleteUserAccount } from "@/app/actions";

// --- REUSABLE COMPONENTS ---

const Section = ({ title, description, children, danger = false }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b border-border/50 last:border-0">
    <div className="md:col-span-1 space-y-1">
      <h3
        className={cn(
          "font-serif text-lg font-medium",
          danger ? "text-red-500" : "text-foreground"
        )}
      >
        {title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
    <div className="md:col-span-2">
      <div
        className={cn(
          "rounded-xl p-6 space-y-6",
          danger
            ? "bg-red-500/5 border border-red-500/20"
            : "bg-card border border-border"
        )}
      >
        {children}
      </div>
    </div>
  </div>
);

const Switch = ({ checked, onCheckedChange, label }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <button
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20",
        checked ? "bg-primary" : "bg-secondary"
      )}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={cn(
          "w-4 h-4 rounded-full shadow-md",
          checked ? "bg-primary-foreground" : "bg-muted-foreground/50"
        )}
        style={{ x: checked ? 24 : 0 }}
      />
    </button>
  </div>
);

// --- MAIN VIEW ---

export default function SettingsView({ user, settings }: any) {
  if (!user) return null;

  // 1. Theme Hook & Router
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // 2. State Management
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
  const canDelete =
    confirmUsername === user.username && confirmPhrase === "Confirm";

  // Prevent hydration mismatch for themes
  useEffect(() => setMounted(true), []);

  // 3. Logic Handlers

  // Re-syncs data by calling the server action
  const handleResync = async () => {
    setIsSyncing(true);
    try {
      await triggerSync(); // Actually syncs from GitHub API
      router.refresh(); // Then refresh the UI
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
    // await fetch('/api/user/settings', { ... });
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleDeleteAccount = async () => {
    console.log("🔴 DELETE INITIATED - handleDeleteAccount called");
    setIsDeleting(true);
    try {
      console.log("🔴 Calling deleteUserAccount server action...");
      const result = await deleteUserAccount();
      console.log("🔴 deleteUserAccount returned:", result);

      // Sign out and redirect to home after successful deletion
      console.log("🔴 Signing out...");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("🔴 Delete failed in handleDeleteAccount:", error);
      alert(`Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="pt-8 pb-20 px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
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
      </div>

      <div className="space-y-2">
        {/* --- APPEARANCE SECTION --- */}
        <Section
          title="Appearance"
          description="Customize how GitProof looks on your device."
        >
          <div className="grid grid-cols-3 gap-3">
            {["light", "dark", "system"].map((mode) => (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all",
                  theme === mode
                    ? "bg-primary/5 border-primary text-primary ring-1 ring-primary/20"
                    : "bg-secondary/30 border-transparent hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {mode === "light" && <Sun size={18} />}
                {mode === "dark" && <Moon size={18} />}
                {mode === "system" && <Monitor size={18} />}
                <span className="capitalize">{mode}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* --- VISIBILITY SECTION --- */}
        <Section
          title="Visibility"
          description="Control who can see your GitProof report card."
        >
          <div className="space-y-4">
            <Switch
              label="Public Profile"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            {isPublic && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-secondary/30 rounded-lg border border-border flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground truncate">
                  gitproof.com/u/{user.username || "username"}
                </span>
                <a
                  href={`/u/${user.username}`}
                  target="_blank"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  Visit <ExternalLink size={10} />
                </a>
              </motion.div>
            )}
          </div>
        </Section>

        {/* --- ACCOUNT SECTION --- */}
        <Section
          title="Account"
          description="Your personal information linked from GitHub."
        >
          <div className="flex items-center gap-4 pb-4 border-b border-border/40 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-secondary">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  ?
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">
                {user.name}
              </div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleResync}
              disabled={isSyncing}
              className="flex items-center justify-center gap-2 h-9 rounded border border-border text-xs font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              <RefreshCw
                size={14}
                className={isSyncing ? "animate-spin" : ""}
              />
              {isSyncing ? "Syncing..." : "Re-sync GitHub Data"}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 h-9 rounded border border-border text-xs font-medium hover:bg-secondary transition-colors"
            >
              <LogOut size={14} /> Sign Out All Devices
            </button>
          </div>
        </Section>

        {/* --- NOTIFICATIONS SECTION --- */}
        <Section title="Notifications" description="We promise not to spam.">
          <Switch
            label="Product Updates"
            checked={emailNotifs}
            onCheckedChange={setEmailNotifs}
          />
        </Section>

        {/* --- DANGER ZONE --- */}
        <Section title="Danger Zone" description="Irreversible actions." danger>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-red-500">
                  Delete Account & Revoke OAuth
                </h4>
                <p className="text-xs text-red-500/60 mt-1">
                  Permanently deletes all data, revokes GitHub OAuth, and clears
                  all sessions. You'll start from scratch if you return.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>

            {/* Confirmation Dialog */}
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg space-y-4"
              >
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-red-500">
                    Confirm complete account deletion
                  </h5>
                  <p className="text-xs text-red-500/80 leading-relaxed">
                    This will permanently delete all your data AND revoke GitHub
                    OAuth authorization. You'll need to re-authorize if you sign
                    up again. Type your username and confirmation phrase to proceed.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-red-500">
                      Type your username
                    </label>
                    <input
                      value={confirmUsername}
                      onChange={(e) => setConfirmUsername(e.target.value)}
                      placeholder={user.username}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-red-500">
                      Type <span className="font-mono">Confirm</span> to
                      continue
                    </label>
                    <input
                      value={confirmPhrase}
                      onChange={(e) => setConfirmPhrase(e.target.value)}
                      placeholder="Confirm"
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/40"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={!canDelete || isDeleting}
                    className={cn(
                      "px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition-colors",
                      canDelete
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-red-600/40 text-white/60 cursor-not-allowed"
                    )}
                  >
                    {isDeleting ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={12} />
                        Permanently delete account
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setConfirmUsername("");
                      setConfirmPhrase("");
                    }}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-secondary text-foreground text-xs font-medium rounded hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </Section>
      </div>
    </main>
  );
}
