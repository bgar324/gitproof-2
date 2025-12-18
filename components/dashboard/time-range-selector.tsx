import { cn } from "@/lib/utils";

interface TimeRangeSelectorProps {
  value: "all" | "90d" | "30d";
  onChange: (value: "all" | "90d" | "30d") => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex bg-secondary/50 p-1 rounded-lg">
      {(["30d", "90d", "all"] as const).map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded-md transition-all",
            value === range
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          {range === "all" ? "All Year" : range.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
