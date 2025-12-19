import { RefreshCw, LogOut } from "lucide-react";
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
}

export function AccountSection({ user, isSyncing, onResync }: AccountSectionProps) {
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
          <LogOut size={14} /> Sign Out All Devices
        </button>
      </div>
    </Section>
  );
}
