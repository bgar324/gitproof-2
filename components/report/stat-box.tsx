import { cn } from "@/lib/utils";

interface StatBoxProps {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
}

export function StatBox({
  label,
  value,
  sub,
  subColor = "text-muted-foreground",
}: StatBoxProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 hover:bg-white/[0.02] transition-colors group">
      <span className="font-serif text-2xl text-foreground font-medium tracking-tight group-hover:scale-105 transition-transform">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mt-1">
        {label}
      </span>
      {sub && (
        <span className={cn("text-[10px] font-mono mt-0.5", subColor)}>
          {sub}
        </span>
      )}
    </div>
  );
}
