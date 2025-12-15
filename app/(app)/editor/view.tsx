"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Code2,
  Star,
  GitFork,
  Plus,
  X,
  Save,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
  Calendar,
  Lock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- HELPERS ---
const formatDate = (dateString: any) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getScoreColor = (score: number) => {
  if (score >= 40) return "text-emerald-500";
  if (score >= 20) return "text-yellow-500";
  return "text-red-500";
};

// --- 1. REUSABLE REPO CARD (Dashboard Style) ---
const EditorRepoCard = ({ repo, isSelected, onToggle, onUpdateDesc }: any) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative bg-card border rounded-xl transition-all duration-200 overflow-hidden flex flex-col h-full",
        isSelected
          ? "border-primary/40 shadow-md ring-1 ring-primary/10" // Featured: Pop out
          : "border-border hover:border-primary/30 opacity-90 hover:opacity-100" // Library: Subtle
      )}
    >
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* --- HEADER (Common) --- */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {/* Icon Box */}
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0",
                isSelected
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/50 text-muted-foreground group-hover:bg-secondary"
              )}
            >
              <Code2 size={20} />
            </div>

            {/* Title & Score */}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm text-foreground line-clamp-1">
                  {repo.name}
                </h4>
                <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border shrink-0">
                  <span
                    className={cn("font-bold", getScoreColor(repo.impactScore))}
                  >
                    {repo.impactScore}
                  </span>
                  /50
                </div>
              </div>

              {/* Library Mode: Show simple language tag immediately */}
              {!isSelected && (
                <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {repo.language || "Plain Text"}
                </div>
              )}
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => onToggle(repo)}
            className={cn(
              "p-1.5 rounded-md transition-all shrink-0",
              isSelected
                ? "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                : "text-primary hover:bg-primary/10"
            )}
            title={isSelected ? "Remove from Portfolio" : "Add to Portfolio"}
          >
            {isSelected ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>

        {/* --- LIBRARY MODE (Minimalist) --- */}
        {!isSelected && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {repo.desc || "No description provided."}
          </p>
        )}

        {/* --- FEATURED MODE (Verbose + Dashboard Stats + Editor) --- */}
        {isSelected && (
          <div className="space-y-4 mt-1">
            {/* 1. Dashboard Metadata Row */}
            <div className="flex justify-between items-center pb-3 border-b border-border/50">
              {/* Badges */}
              <div className="flex items-center gap-2">
                {repo.isPublic !== false ? (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20 font-medium flex items-center gap-1">
                    <Globe size={10} /> Public
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground border border-border flex items-center gap-1">
                    <Lock size={10} /> Private
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {repo.language || "Text"}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={12} /> {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={12} /> {repo.forks}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(repo.lastPush)}
                </span>
              </div>
            </div>

            {/* 2. AI Editor */}
            <div className="relative">
              <textarea
                className="w-full bg-secondary/30 hover:bg-secondary/50 focus:bg-background border border-transparent focus:border-primary/30 rounded-lg p-3 text-xs leading-relaxed resize-none outline-none transition-all placeholder:text-muted-foreground/50 font-mono"
                rows={4}
                placeholder="Describe your impact..."
                defaultValue={repo.aiDescription || repo.desc || ""}
                onChange={(e) => onUpdateDesc(repo.id, e.target.value)}
              />
              <div className="absolute bottom-2 right-2 flex gap-1">
                <button className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/80 shadow-sm border border-border text-[10px] font-medium text-primary hover:text-primary/80 transition-colors backdrop-blur-sm">
                  <Sparkles size={10} /> Rewrite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- 2. MAIN WORKBENCH ---

export function EditorWorkbench({ section, user, projects = [] }: any) {
  const [isSaving, setIsSaving] = useState(false);

  // -- Portfolio State --
  const [featuredIds, setFeaturedIds] = useState<string[]>(
    projects
      .filter((p: any) => !p.isHidden)
      .slice(0, 6)
      .map((p: any) => p.id)
  );

  // Library State
  const [searchTerm, setSearchTerm] = useState("");
  const [libraryPage, setLibraryPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // -- Bio State --
  const [bio, setBio] = useState(user?.bio || "");

  // --- Handlers ---
  const handleToggleRepo = (repo: any) => {
    if (featuredIds.includes(repo.id)) {
      setFeaturedIds((prev) => prev.filter((id) => id !== repo.id));
    } else {
      if (featuredIds.length >= 6) return;
      setFeaturedIds((prev) => [...prev, repo.id]);
    }
  };

  const handleUpdateDesc = (id: string, newDesc: string) => {
    console.log("Updated", id, newDesc);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  };

  // --- RENDER: IDENTITY TAB ---
  if (section === "identity") {
    return (
      <div className="grid gap-8 relative pb-20 max-w-4xl">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">
              Professional Summary
            </label>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Visible on Profile
            </span>
          </div>
          <div className="relative group">
            <textarea
              className="w-full h-32 bg-card border border-border rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
              placeholder="e.g. Senior Backend Engineer with a focus on high-throughput systems..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button className="text-xs bg-primary/5 text-primary border border-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-primary/10 transition-colors">
                <Sparkles size={12} /> Auto-Generate
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 md:right-10 z-50">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="shadow-2xl shadow-primary/20 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: PORTFOLIO TAB ---
  if (section === "portfolio") {
    const featuredRepos = projects.filter((p: any) =>
      featuredIds.includes(p.id)
    );

    const availableRepos = projects
      .filter((p: any) => !featuredIds.includes(p.id))
      .filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const totalPages = Math.ceil(availableRepos.length / ITEMS_PER_PAGE);
    const paginatedRepos = availableRepos.slice(
      (libraryPage - 1) * ITEMS_PER_PAGE,
      libraryPage * ITEMS_PER_PAGE
    );

    return (
      <div className="space-y-12 relative pb-24">
        {/* 1. FEATURED SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end px-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Star size={12} className="text-amber-500" /> Featured
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                {featuredIds.length} / 6
              </span>
            </div>

            {/* Disclaimer */}
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/10 rounded-lg text-xs text-blue-600/80">
              <Info size={14} className="shrink-0" />
              <span>
                Rewriting descriptions here updates your{" "}
                <strong>GitProof Profile</strong> only. Your GitHub READMEs
                remain untouched.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {featuredRepos.length === 0 && (
                <div className="col-span-full p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground">
                    No repositories selected yet.
                  </p>
                  <p className="text-xs text-muted-foreground/50 mt-1">
                    Select from your library below.
                  </p>
                </div>
              )}
              {featuredRepos.map((repo: any) => (
                <EditorRepoCard
                  key={repo.id}
                  repo={repo}
                  isSelected={true}
                  onToggle={handleToggleRepo}
                  onUpdateDesc={handleUpdateDesc}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 2. LIBRARY SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border pt-8">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Repository Library
              </h3>
              {/* NEW: Live Counter */}
              <span className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                {availableRepos.length} / {projects.length} Remaining
              </span>
            </div>
            {/* Search Bar */}
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setLibraryPage(1);
                }}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-90 hover:opacity-100 transition-opacity">
            {paginatedRepos.map((repo: any) => (
              <EditorRepoCard
                key={repo.id}
                repo={repo}
                isSelected={false}
                onToggle={handleToggleRepo}
                onUpdateDesc={handleUpdateDesc}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4">
              <button
                onClick={() => setLibraryPage((p) => Math.max(1, p - 1))}
                disabled={libraryPage === 1}
                className="p-2 rounded-lg hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-mono text-muted-foreground">
                {libraryPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setLibraryPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={libraryPage === totalPages}
                className="p-2 rounded-lg hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Sticky Save Bar */}
        <div className="fixed bottom-6 right-6 md:right-10 z-50">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="shadow-2xl shadow-primary/20 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return null;
}
