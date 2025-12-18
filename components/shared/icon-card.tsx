import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconCardProps {
  icon: LucideIcon;
  label?: string;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: {
    container: "w-8 h-8",
    icon: 16,
  },
  md: {
    container: "w-10 h-10",
    icon: 20,
  },
  lg: {
    container: "w-12 h-12",
    icon: 24,
  },
};

export function IconCard({
  icon: Icon,
  label,
  color = "text-primary",
  bgColor = "bg-primary/10",
  borderColor,
  size = "md",
  className,
}: IconCardProps) {
  const sizeConfig = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "rounded-lg flex items-center justify-center shrink-0",
          sizeConfig.container,
          bgColor,
          borderColor && `border ${borderColor}`
        )}
      >
        <Icon size={sizeConfig.icon} className={color} />
      </div>
      {label && (
        <span className="font-semibold text-foreground">{label}</span>
      )}
    </div>
  );
}
