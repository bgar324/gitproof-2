import { cn } from "@/lib/utils";

interface InsightRowProps {
  type: "strength" | "weakness";
  text: string;
}

export function InsightRow({ type, text }: InsightRowProps) {
  const isStrength = type === "strength";

  return (
    <div className="flex gap-3 items-start group">
      <div
        className={cn(
          "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 shadow-sm",
          isStrength
            ? "bg-emerald-400 shadow-emerald-500/50"
            : "bg-amber-400 shadow-amber-500/50"
        )}
      />
      <span
        className={cn(
          "text-sm leading-relaxed transition-colors",
          isStrength
            ? "text-foreground/90"
            : "text-muted-foreground group-hover:text-foreground/80"
        )}
      >
        {text}
      </span>
    </div>
  );
}
