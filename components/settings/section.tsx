import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}

export function Section({ title, description, children, danger = false }: SectionProps) {
  return (
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
}
