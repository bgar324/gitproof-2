import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl" | "full";
  className?: string;
  padding?: boolean;
}

const maxWidthMap = {
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

export function PageWrapper({
  children,
  maxWidth = "7xl",
  className,
  padding = true,
}: PageWrapperProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthMap[maxWidth],
        padding && "px-6 py-8",
        className
      )}
    >
      {children}
    </div>
  );
}
