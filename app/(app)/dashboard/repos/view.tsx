"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, ArrowLeft, GitFork, Star, Code2, ArrowUpRight, ArrowUpDown 
} from "lucide-react";
import Link from "next/link";
import RepoModal from "@/components/repo-modal";
import { cn, getTimeAgo } from "@/lib/utils";
import { triggerSync } from "@/app/actions";
import { useRouter } from "next/navigation";

// --- REUSED CARD COMPONENT (Identical to Dashboard) ---
const RepoCard = ({ repo, onClick }: { repo: any, onClick: () => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -2 }}
    onClick={onClick}
    className="group cursor-pointer bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg transition-all flex flex-col h-full"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
          <Code2 size={20} />
        </div>
        <div>
          <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors flex items-center gap-2">
            {repo.name}
            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
            Score: <span className={cn("font-bold", repo.score >= 40 ? "text-emerald-500" : "text-yellow-500")}>{repo.score}</span>/50
          </div>
        </div>
      </div>
      {repo.isPublic ? (
         <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium">Public</span>
      ) : (
         <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground border border-border">Private</span>
      )}
    </div>
    
    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
      {repo.desc || "No description provided."}
    </p>

    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50 mt-auto">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.color }} />
          {repo.language}
        </span>
        <span className="flex items-center gap-1"><Star size={12} /> {repo.stars}</span>
        <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks}</span>
      </div>
      <div>{repo.updated}</div>
    </div>
  </motion.div>
);

export default function ReposView({
  repos,
  lastSyncedAt,
  isStale,
}: {
  repos: any[];
  lastSyncedAt: Date | null;
  isStale: boolean;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [sortMode, setSortMode] = useState<"impact" | "stars" | "recent">("impact");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeAgo, setTimeAgo] = useState(
    lastSyncedAt ? getTimeAgo(lastSyncedAt) : "never"
  );

  useEffect(() => {
    if (!lastSyncedAt) return;
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(lastSyncedAt));
    }, 60000);
    return () => clearInterval(interval);
  }, [lastSyncedAt]);

  const handleSync = async () => {
    setIsRefreshing(true);
    try {
      await triggerSync();
      router.refresh();
      setTimeAgo("just now");
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // --- SORTING & FILTERING LOGIC ---
  const filteredRepos = useMemo(() => {
    let processed = repos.filter(repo => 
      repo.name.toLowerCase().includes(search.toLowerCase()) || 
      repo.desc.toLowerCase().includes(search.toLowerCase())
    );

    if (sortMode === "impact") {
      processed.sort((a, b) => b.score - a.score);
    } else if (sortMode === "stars") {
      processed.sort((a, b) => b.stars - a.stars);
    } else if (sortMode === "recent") {
      processed.sort((a, b) => new Date(b.lastPush).getTime() - new Date(a.lastPush).getTime());
    }

    return processed;
  }, [repos, search, sortMode]);

  return (
    <main className="min-h-screen bg-background pt-8 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-6">
          <div>
            <Link 
              href="/dashboard" 
              className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3 transition-colors"
            >
              <ArrowLeft size={12} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-serif text-foreground">Repository Archive</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {repos.length} total repositories indexed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Sort Dropdown (Simple) */}
            <div className="flex bg-card border border-border rounded-lg p-1 h-10">
               <button 
                  onClick={() => setSortMode("impact")}
                  className={cn("px-3 text-xs font-medium rounded-md transition-all", sortMode === "impact" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
               >
                 Impact
               </button>
               <button 
                  onClick={() => setSortMode("recent")}
                  className={cn("px-3 text-xs font-medium rounded-md transition-all", sortMode === "recent" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
               >
                 Recent
               </button>
               <button 
                  onClick={() => setSortMode("stars")}
                  className={cn("px-3 text-xs font-medium rounded-md transition-all", sortMode === "stars" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
               >
                 Stars
               </button>
            </div>
          </div>
        </div>

        {isStale && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <p className="text-xs text-amber-700">
              {lastSyncedAt
                ? `Data is stale. Last synced ${timeAgo}.`
                : "Data hasn't been synced yet."}{" "}
              Sync to refresh repository details.
            </p>
            <button
              onClick={handleSync}
              disabled={isRefreshing}
              className="h-8 px-3 rounded-lg border border-amber-500/30 text-xs font-medium text-amber-700 hover:bg-amber-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefreshing ? "Syncing..." : "Sync now"}
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <RepoCard 
              key={repo.name} 
              repo={repo} 
              onClick={() => setSelectedRepo(repo)} 
            />
          ))}
          
          {filteredRepos.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground opacity-60">
              <Search size={40} strokeWidth={1} className="mb-4" />
              <p>No repositories found matching "{search}"</p>
            </div>
          )}
        </div>

      </div>

      <RepoModal 
        repo={selectedRepo} 
        isOpen={!!selectedRepo} 
        onClose={() => setSelectedRepo(null)} 
      />
    </main>
  );
}
