import { Globe2, Lock, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

interface IdentitySectionProps {
  username: string;
  isPublic: boolean;
  bio: string;
  isBioGenerating: boolean;
  onPublicToggle: (checked: boolean) => void;
  onBioChange: (bio: string) => void;
  onGenerateBio: () => void;
}

export function IdentitySection({
  username,
  isPublic,
  bio,
  isBioGenerating,
  onPublicToggle,
  onBioChange,
  onGenerateBio,
}: IdentitySectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div>
          <h2 className="font-serif text-2xl">Identity</h2>
          <p className="text-sm text-muted-foreground">
            Define your stack and professional summary.
          </p>
        </div>
      </div>

      <div className="grid gap-8 relative">
        <div className="flex justify-between items-center p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="space-y-1">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              {isPublic ? (
                <>
                  <Globe2 size={16} className="text-emerald-500" /> Profile is LIVE
                </>
              ) : (
                <>
                  <Lock size={16} className="text-amber-500" /> Profile is Private
                </>
              )}
            </h4>
            <p className="text-xs text-muted-foreground">
              Toggle to make your GitProof profile viewable at
              <Link
                href={`/u/${username}`}
                target="_blank"
                className="text-primary hover:underline ml-1"
              >
                {`/u/${username}`}
              </Link>
            </p>
          </div>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => onPublicToggle(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            title="Toggle Public Profile"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">
              Professional Summary
            </label>
            <button
              onClick={onGenerateBio}
              disabled={isBioGenerating}
              className="text-xs bg-primary/5 text-primary border border-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-primary/10 transition-colors disabled:opacity-70 disabled:cursor-wait"
            >
              {isBioGenerating ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Sparkles size={12} />
              )}
              Auto-Generate
            </button>
          </div>
          <textarea
            className="w-full h-32 bg-card border border-border rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-sm disabled:opacity-70"
            placeholder="e.g. Senior Backend Engineer with a focus on high-throughput systems..."
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            disabled={isBioGenerating}
          />
        </div>
      </div>
    </div>
  );
}
