import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface TopReposHeaderProps {
  repoCount: number;
  onInfoClick: () => void;
}

export function TopReposHeader({ repoCount, onInfoClick }: TopReposHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h3 className="font-serif text-xl mb-1">Top Repositories</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Ranked by Impact Score</span>
          <span className="text-border">•</span>
          <button
            onClick={onInfoClick}
            className="hover:text-primary transition-colors hover:underline decoration-dotted underline-offset-2 flex items-center gap-1"
          >
            How is this calculated?
          </button>
        </div>
      </div>

      <Link
        href="/dashboard/repos"
        className="group flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors pb-1"
      >
        View Archive
        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md ml-1 text-[10px] group-hover:bg-primary/20 transition-colors">
          {repoCount}
        </span>
        <ArrowUpRight
          size={12}
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}
