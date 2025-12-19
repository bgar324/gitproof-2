import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { EditorRepoCard } from "./editor-repo-card";
import type { ProjectWithPublic } from "./types";

interface LibrarySectionProps {
  availableRepos: ProjectWithPublic[];
  paginatedRepos: ProjectWithPublic[];
  totalProjects: number;
  searchTerm: string;
  libraryPage: number;
  totalPages: number;
  onSearchChange: (term: string) => void;
  onPageChange: (page: number) => void;
  onToggle: (repo: ProjectWithPublic) => void;
}

export function LibrarySection({
  availableRepos,
  paginatedRepos,
  totalProjects,
  searchTerm,
  libraryPage,
  totalPages,
  onSearchChange,
  onPageChange,
  onToggle,
}: LibrarySectionProps) {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border pt-8">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Repository Library
          </h3>
          <span className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground">
            {availableRepos.length} / {totalProjects} Remaining
          </span>
        </div>
        <div className="relative w-full md:w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 bg-secondary/30 border border-transparent focus:border-border rounded-lg pl-9 pr-3 text-xs outline-none transition-all"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-90 hover:opacity-100 transition-opacity">
        {paginatedRepos.map((repo) => (
          <EditorRepoCard
            key={repo.id}
            repo={repo}
            isSelected={false}
            onToggle={onToggle}
            onUpdateDesc={() => {}}
            onRewrite={() => {}}
            isRewriting={false}
            currentDescription=""
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            onClick={() => onPageChange(Math.max(1, libraryPage - 1))}
            disabled={libraryPage === 1}
            className="p-2 rounded-lg hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-mono text-muted-foreground">
            {libraryPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, libraryPage + 1))}
            disabled={libraryPage === totalPages}
            className="p-2 rounded-lg hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
