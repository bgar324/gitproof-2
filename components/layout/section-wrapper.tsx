import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  variant?: "default" | "bordered" | "highlighted";
  className?: string;
}

const variantStyles = {
  default: "",
  bordered: "border-y border-border bg-secondary/30",
  highlighted: "bg-secondary/50 border border-border rounded-3xl",
};

export function SectionWrapper({
  children,
  variant = "default",
  className,
}: SectionWrapperProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-24 px-6",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </section>
  );
}
