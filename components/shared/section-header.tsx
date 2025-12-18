import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  badge?: string;
  number?: number;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export function SectionHeader({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  badge,
  number,
  actions,
  className,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                iconBg
              )}
            >
              <Icon size={20} className={iconColor} />
            </div>
          )}
          <h2 className={cn("text-3xl font-serif font-bold", titleClassName)}>
            {number && `${number}. `}
            {title}
          </h2>
          {badge && (
            <Badge className="ml-2">
              {badge}
            </Badge>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {description && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
