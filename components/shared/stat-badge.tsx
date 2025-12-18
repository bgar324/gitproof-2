import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatBadgeProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  trend?: "up" | "down" | number;
  color?: string;
  iconBg?: string;
  className?: string;
}

export function StatBadge({
  icon: Icon,
  label,
  value,
  trend,
  color = "text-primary",
  iconBg = "bg-primary/10",
  className,
}: StatBadgeProps) {
  const getTrendColor = () => {
    if (typeof trend === "number") {
      return trend >= 0 ? "text-emerald-500" : "text-red-500";
    }
    return trend === "up" ? "text-emerald-500" : "text-red-500";
  };

  const getTrendValue = () => {
    if (typeof trend === "number") {
      return `${trend >= 0 ? "+" : ""}${trend}%`;
    }
    return null;
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {Icon && (
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon size={20} className={color} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {trend !== undefined && (
            <span className={cn("text-sm font-medium flex items-center gap-1", getTrendColor())}>
              {typeof trend === "number" ? (
                <>
                  {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {getTrendValue()}
                </>
              ) : (
                <>
                  {trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                </>
              )}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{label}</p>
      </div>
    </div>
  );
}
