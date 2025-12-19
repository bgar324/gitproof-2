"use client";

import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { RepoHealthSidebar, getHealthChecks } from "./repo-health-sidebar";
import { RepoReadmeViewer } from "./repo-readme-viewer";
import type { GithubRepo } from "@/lib/github";

interface RepoModalProps {
  repo: GithubRepo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RepoModal({ repo, isOpen, onClose }: RepoModalProps) {
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

  if (!repo) return null;

  const checks = getHealthChecks(repo);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-zinc-950/60 backdrop-blur-md" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-7xl h-[90vh] translate-x-[-50%] translate-y-[-50%] bg-background border border-border/50 shadow-2xl rounded-xl flex flex-col overflow-hidden ring-1 ring-white/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Visually hidden title for accessibility */}
          <DialogTitle className="sr-only">
            Repository: {repo.name}
          </DialogTitle>

          {/* Header */}
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
                rel="noopener noreferrer"
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-secondary/50"
              >
                <ExternalLink size={12} /> GitHub
              </a>
              <DialogPrimitive.Close className="p-2 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground">
                <X size={16} />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            <RepoHealthSidebar checks={checks} />
            <RepoReadmeViewer readme={repo.readme} repoUrl={repo.url} />
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
