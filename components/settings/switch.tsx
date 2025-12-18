import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

export function Switch({ checked, onCheckedChange, label }: SwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <button
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20",
          checked ? "bg-primary" : "bg-secondary"
        )}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={cn(
            "w-4 h-4 rounded-full shadow-md",
            checked ? "bg-primary-foreground" : "bg-muted-foreground/50"
          )}
          style={{ x: checked ? 24 : 0 }}
        />
      </button>
    </div>
  );
}
