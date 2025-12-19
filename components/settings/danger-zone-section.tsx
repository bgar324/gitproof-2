import { motion } from "framer-motion";
import { Trash2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "./section";

interface DangerZoneSectionProps {
  showDeleteConfirm: boolean;
  isDeleting: boolean;
  confirmUsername: string;
  confirmPhrase: string;
  canDelete: boolean;
  username: string;
  onShowDeleteConfirm: (show: boolean) => void;
  onConfirmUsernameChange: (username: string) => void;
  onConfirmPhraseChange: (phrase: string) => void;
  onDeleteAccount: () => void;
}

export function DangerZoneSection({
  showDeleteConfirm,
  isDeleting,
  confirmUsername,
  confirmPhrase,
  canDelete,
  username,
  onShowDeleteConfirm,
  onConfirmUsernameChange,
  onConfirmPhraseChange,
  onDeleteAccount,
}: DangerZoneSectionProps) {
  return (
    <Section title="Danger Zone" description="Irreversible actions." danger>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-medium text-red-500">
              Delete Account & Revoke OAuth
            </h4>
            <p className="text-xs text-red-500/60 mt-1">
              Permanently deletes all data, revokes GitHub OAuth, and clears all
              sessions. You&apos;ll start from scratch if you return.
            </p>
          </div>
          <button
            onClick={() => onShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>

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
                This will permanently delete all your data AND revoke GitHub OAuth
                authorization. You&apos;ll need to re-authorize if you sign up again. Type
                your username and confirmation phrase to proceed.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-red-500">
                  Type your username
                </label>
                <input
                  value={confirmUsername}
                  onChange={(e) => onConfirmUsernameChange(e.target.value)}
                  placeholder={username}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-red-500">
                  Type <span className="font-mono">Confirm</span> to continue
                </label>
                <input
                  value={confirmPhrase}
                  onChange={(e) => onConfirmPhraseChange(e.target.value)}
                  placeholder="Confirm"
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/40"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onDeleteAccount}
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
                  onShowDeleteConfirm(false);
                  onConfirmUsernameChange("");
                  onConfirmPhraseChange("");
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
  );
}
