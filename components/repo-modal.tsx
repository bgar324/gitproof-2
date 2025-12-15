"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  X,
  CheckCircle2,
  Circle,
  AlertCircle,
  ExternalLink,
  Eye,
  FileCode,
  GitCommit,
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function RepoModal({
  repo,
  isOpen,
  onClose,
}: {
  repo: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCopy = () => {
    if (repo?.readme) {
      navigator.clipboard.writeText(repo.readme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted || !repo) return null;

  // --- DYNAMIC JUDGE LOGIC ---
  const checks = [
    {
      label: "Meaningful Description",
      passed: repo.desc && repo.desc.length > 15,
      tip: "Descriptions under 15 chars look lazy. Explain *what* it does.",
      value: repo.desc ? `${repo.desc.length} chars` : "Missing",
    },
    {
      label: "Comprehensive ReadMe",
      passed: repo.readme && repo.readme.length > 300,
      tip: "Your ReadMe is too short (<300 chars). Add 'Setup' and 'Features'.",
      value: repo.readme ? `${repo.readme.length} chars` : "Missing",
    },
    {
      label: "Discoverable Tags",
      passed: repo.topics && repo.topics.length >= 3,
      tip: "Add at least 3 tags (e.g., 'react', 'database') on GitHub.",
      value: repo.topics ? `${repo.topics.length} tags` : "0 tags",
    },
    {
      label: "Live Demo / Homepage",
      passed: !!repo.homepage,
      tip: "Recruiters want to click things. Add a URL to the repo 'About' section.",
      value: repo.homepage ? "Linked" : "Missing",
    },
  ];

  const score = checks.filter((c) => c.passed).length;
  const healthPercent = Math.round((score / checks.length) * 100);

  // --- DETERMINE HEALTH COLOR ---
  let healthColor = "bg-red-500";
  let healthText = "Needs Work";
  if (healthPercent === 100) {
    healthColor = "bg-emerald-500";
    healthText = "Perfect";
  } else if (healthPercent >= 50) {
    healthColor = "bg-yellow-500";
    healthText = "Decent";
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: "spring", damping: 25, stiffness: 300 },
              }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="w-full max-w-7xl h-[90vh] bg-background border border-border/50 shadow-2xl rounded-xl flex flex-col overflow-hidden pointer-events-auto ring-1 ring-white/10"
            >
              {/* --- HEADER --- */}
              <div className="h-14 border-b border-border/60 bg-muted/20 backdrop-blur flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="w-px h-4 bg-border/50" />
                  <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    {repo.name}
                    {repo.isPublic === false && (
                      <span className="text-[9px] bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded border border-yellow-500/20">
                        Private
                      </span>
                    )}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={repo.url}
                    target="_blank"
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-secondary/50"
                  >
                    <ExternalLink size={12} /> GitHub
                  </a>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* --- BODY --- */}
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                
                {/* LEFT: Audit Sidebar */}
                <div className="w-full md:w-80 border-r border-border/60 bg-muted/5 flex flex-col shrink-0 overflow-y-auto">
                  <div className="p-6 border-b border-border/40">
                    <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4">
                      Repository Health
                    </h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span
                        className={cn(
                          "text-4xl font-black tracking-tighter",
                          healthPercent === 100
                            ? "text-emerald-500"
                            : healthPercent >= 50
                            ? "text-yellow-500"
                            : "text-red-500"
                        )}
                      >
                        {healthPercent}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${healthPercent}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className={cn(
                          "h-full",
                          healthPercent === 100
                            ? "bg-emerald-500"
                            : healthPercent >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        )}
                      />
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {checks.map((check, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full ring-2 ring-offset-1 ring-offset-background",
                                check.passed
                                  ? "bg-emerald-500 ring-emerald-500/20"
                                  : "bg-muted-foreground/30 ring-muted-foreground/10"
                              )}
                            />
                            <span
                              className={cn(
                                "text-xs font-medium",
                                check.passed
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              )}
                            >
                              {check.label}
                            </span>
                          </div>
                        </div>
                        {!check.passed && (
                          <div className="ml-3.5 pl-3 border-l border-border mt-2">
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                              {check.tip}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: The Editor (Hardcoded Dark Mode) */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#191919] text-zinc-300">
                  
                  {/* Editor Tabs */}
                  <div className="flex items-center justify-between px-4 bg-[#010409] border-b border-[#30363d] h-10 shrink-0">
                    <div className="flex h-full">
                      <button
                        onClick={() => setViewMode("preview")}
                        className={cn(
                          "h-full px-4 text-xs font-medium border-t-2 border-b-2 border-transparent flex items-center gap-2 transition-colors",
                          viewMode === "preview"
                            ? "bg-[#0d1117] text-zinc-100 border-t-[#f78166] border-b-[#0d1117]"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-[#0d1117]/50"
                        )}
                      >
                        <Eye size={12} /> Preview
                      </button>
                      <button
                        onClick={() => setViewMode("raw")}
                        className={cn(
                          "h-full px-4 text-xs font-medium border-t-2 border-b-2 border-transparent flex items-center gap-2 transition-colors",
                          viewMode === "raw"
                            ? "bg-[#0d1117] text-zinc-100 border-t-[#f78166] border-b-[#0d1117]"
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-[#0d1117]/50"
                        )}
                      >
                        <FileCode size={12} /> Code
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <a 
                            href={`${repo.url}/blame/HEAD/README.md`}
                            target="_blank"
                            className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
                        >
                            <GitCommit size={12}/> Blame
                        </a>
                        {repo.readme && (
                        <button
                            onClick={handleCopy}
                            className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                        >
                            {copied ? (
                            <Check size={12} className="text-emerald-500" />
                            ) : (
                            <Copy size={12} />
                            )}
                            {copied ? "Copied" : "Copy"}
                        </button>
                        )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {repo.readme ? (
                      viewMode === "preview" ? (
                        <article className="prose prose-invert max-w-none p-8
                            prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-zinc-100
                            prose-h1:text-2xl prose-h1:border-b prose-h1:border-zinc-800 prose-h1:pb-2
                            prose-h2:text-xl prose-h2:mt-8
                            prose-p:text-zinc-300 prose-p:leading-7 prose-p:text-sm
                            prose-a:text-[#4493f8] prose-a:no-underline hover:prose-a:underline
                            prose-code:text-zinc-300 prose-code:bg-[#252a31] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[12px] prose-code:font-mono
                            prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-md
                            prose-strong:text-zinc-100
                            prose-ul:text-zinc-300 prose-li:marker:text-zinc-600
                            prose-hr:border-zinc-800
                            prose-img:rounded-lg prose-img:border prose-img:border-zinc-800
                        ">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {repo.readme}
                          </ReactMarkdown>
                        </article>
                      ) : (
                        <textarea
                          readOnly
                          className="w-full h-full bg-[#191819] text-zinc-300 font-mono text-xs p-8 resize-none focus:outline-none leading-relaxed"
                          value={repo.readme}
                        />
                      )
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60">
                        <Terminal size={40} strokeWidth={1} className="mb-4" />
                        <h3 className="text-sm font-medium text-zinc-300 mb-1">
                          No README.md
                        </h3>
                        <p className="text-xs text-center max-w-[200px]">
                          Add documentation to your repository root to see it here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}