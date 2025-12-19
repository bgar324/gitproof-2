import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArchetypeBadge } from "./archetype-badge";
import type { LucideIcon } from "lucide-react";

interface GradeInfo {
  letter: string;
  bg: string;
  shadow: string;
}

export function getGrade(impactScore: number): GradeInfo {
  if (impactScore > 40)
    return { letter: "S", bg: "bg-amber-500", shadow: "shadow-amber-500/20" };
  if (impactScore > 30)
    return {
      letter: "A",
      bg: "bg-emerald-500",
      shadow: "shadow-emerald-500/20",
    };
  if (impactScore > 20)
    return { letter: "B", bg: "bg-blue-500", shadow: "shadow-blue-500/20" };
  return { letter: "C", bg: "bg-zinc-500", shadow: "shadow-zinc-500/20" };
}

interface ReportHeaderProps {
  name: string | null;
  username: string | null;
  image: string | null;
  archetypeTitle: string;
  archetypeIcon: LucideIcon;
  archetypeColor: string;
  grade: GradeInfo;
}

export function ReportHeader({
  name,
  username,
  image,
  archetypeTitle,
  archetypeIcon,
  archetypeColor,
  grade,
}: ReportHeaderProps) {
  return (
    <div className="relative p-6 pb-8 border-b border-border bg-muted/5">
      <div className="relative flex justify-between items-start z-10">
        <div className="flex gap-5 items-center">
          {/* Avatar (Clean, no overlap) */}
          <div className="w-20 h-20 rounded-full border-2 border-background shadow-lg overflow-hidden bg-secondary">
            {image ? (
              <Image
                src={image}
                alt={name || "Dev"}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary" />
            )}
          </div>

          {/* Identity */}
          <div>
            <h2 className="text-2xl font-serif font-bold tracking-tight text-foreground mb-1">
              {name}
            </h2>
            <p className="text-sm text-muted-foreground font-mono mb-3">
              @{username || "user"}
            </p>

            {/* Archetype Chip */}
            <ArchetypeBadge
              title={archetypeTitle}
              icon={archetypeIcon}
              color={archetypeColor}
            />
          </div>
        </div>

        {/* Grade Badge */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "w-16 h-16 flex items-center justify-center text-white font-serif text-4xl font-bold rounded-xl shadow-lg relative overflow-hidden transition-colors",
              grade.bg,
              grade.shadow
            )}
          >
            {grade.letter}
            {/* Shine effect */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-12 h-12 bg-white/20 blur-xl rounded-full" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground mt-2 uppercase tracking-widest">
            Grade
          </span>
        </div>
      </div>
    </div>
  );
}
