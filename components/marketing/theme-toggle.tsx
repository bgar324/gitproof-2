"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isClient) return <div className="w-24 h-8" />;

  const buttons = [
    { theme: "light", icon: Sun, label: "Light Mode" },
    { theme: "system", icon: Laptop, label: "System Mode" },
    { theme: "dark", icon: Moon, label: "Dark Mode" },
  ] as const;

  return (
    <div className="flex items-center p-1 rounded-full border border-border bg-background shadow-sm">
      {buttons.map(({ theme: btnTheme, icon: Icon, label }) => (
        <button
          key={btnTheme}
          onClick={() => setTheme(btnTheme)}
          className={cn(
            "p-1.5 rounded-full transition-all",
            theme === btnTheme
              ? "bg-secondary text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={label}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
