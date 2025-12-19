import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "./section";

interface AppearanceSectionProps {
  theme: string | undefined;
  onThemeChange: (theme: string) => void;
}

export function AppearanceSection({ theme, onThemeChange }: AppearanceSectionProps) {
  return (
    <Section title="Appearance" description="Customize how GitProof looks on your device.">
      <div className="grid grid-cols-3 gap-3">
        {["light", "dark", "system"].map((mode) => (
          <button
            key={mode}
            onClick={() => onThemeChange(mode)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all hover:cursor-pointer",
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
  );
}
