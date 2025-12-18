"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  allowOverflow?: boolean;
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  allowOverflow = false,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "bg-card border border-border rounded-xl p-6 relative",
        allowOverflow ? "overflow-visible" : "overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
