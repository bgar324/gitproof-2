import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Section } from "./section";
import { Switch } from "./switch";

interface VisibilitySectionProps {
  isPublic: boolean;
  username: string;
  onPublicChange: (isPublic: boolean) => void;
}

export function VisibilitySection({
  isPublic,
  username,
  onPublicChange,
}: VisibilitySectionProps) {
  return (
    <Section title="Visibility" description="Control who can see your GitProof report card.">
      <div className="space-y-4">
        <Switch label="Public Profile" checked={isPublic} onCheckedChange={onPublicChange} />
        {isPublic && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-secondary/30 rounded-lg border border-border flex items-center justify-between text-xs"
          >
            <span className="text-muted-foreground truncate">
              gitproof.dev/u/{username || "username"}
            </span>
            <a
              href={`/u/${username}`}
              target="_blank"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Visit <ExternalLink size={10} />
            </a>
          </motion.div>
        )}
      </div>
    </Section>
  );
}
