import { AlertTriangle, RefreshCw, RotateCcw, LogOut } from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Section } from "./section";

interface AccountSectionProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
  isSyncing: boolean;
  onResync: () => void;
  requiresReconnect?: boolean;
  isReconnecting?: boolean;
  onReconnect?: () => void;
}

export function AccountSection({
  user,
  isSyncing,
  onResync,
  requiresReconnect = false,
  isReconnecting = false,
  onReconnect,
}: AccountSectionProps) {
  return (
    <Section title="Account" description="Your personal information linked from GitHub.">
      <div className="flex items-center gap-4 pb-4 border-b border-border/40 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-secondary">
          {user.image ? (
            <Image
              src={user.image}
              alt="Avatar"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              ?
            </div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      </div>
      {requiresReconnect && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="mt-0.5 text-amber-600 shrink-0" />
            <div className="space-y-2">
              <p className="text-xs text-amber-700 leading-relaxed">
                Legacy GitHub permissions were detected. Reconnect GitHub to
                continue syncing and using repository-based AI features.
              </p>
              {onReconnect && (
                <button
                  onClick={onReconnect}
                  disabled={isReconnecting}
                  className="inline-flex items-center gap-2 h-8 px-3 rounded border border-amber-500/30 text-xs font-medium text-amber-700 hover:bg-amber-500/10 transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                  <RotateCcw
                    size={12}
                    className={isReconnecting ? "animate-spin" : ""}
                  />
                  {isReconnecting ? "Reconnecting..." : "Reconnect GitHub"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onResync}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 h-9 rounded border border-border text-xs font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-wait hover:cursor-pointer"
        >
          <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Syncing..." : "Re-sync GitHub Data"}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center justify-center gap-2 h-9 rounded border border-border text-xs font-medium hover:bg-secondary transition-colors hover:cursor-pointer"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </Section>
  );
}
