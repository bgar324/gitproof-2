import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: React.ReactNode;
  color?: string;
}

export function StatCard({ label, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-secondary/50 rounded-lg text-foreground/80">
          <Icon size={20} />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium flex items-center gap-1 bg-secondary px-2 py-1 rounded ${color}`}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-3xl font-serif font-medium tracking-tight text-foreground">
          {value}
        </h4>
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}
