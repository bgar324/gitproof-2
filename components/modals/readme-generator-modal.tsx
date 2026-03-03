"use client";

import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Loader2,
  Eye,
  FileCode,
  Copy,
  Check,
  Download,
  RotateCcw,
  FileText,
  GitCompare,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateReadme, revertReadme, getProjectReadme } from "@/app/actions";
import { toast } from "sonner";

interface ReadmeGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  hasExistingReadme: boolean;
}

type ViewMode = "preview" | "raw" | "diff";

export function ReadmeGeneratorModal({
  open,
  onOpenChange,
  projectId,
  projectName,
  hasExistingReadme,
}: ReadmeGeneratorModalProps) {
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [copied, setCopied] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState<string | null>(null);
  const [originalReadme, setOriginalReadme] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null);
    startTransition(async () => {
      try {
        // First fetch existing READMEs for diff view
        const existing = await getProjectReadme(projectId);
        setOriginalReadme(existing.original);

        // If there's already a generated README, use it
        if (existing.generated) {
          setGeneratedReadme(existing.generated);
          setConfidenceScore(null); // We don't have the score from cache
          return;
        }

        // Generate new README
        const result = await generateReadme(projectId);
        setGeneratedReadme(result.readme);
        setConfidenceScore(result.confidenceScore);
        toast.success("README generated successfully");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        setError(message);
        toast.error(message);
      }
    });
  };

  const handleRevert = () => {
    startTransition(async () => {
      try {
        await revertReadme(projectId);
        setGeneratedReadme(null);
        setConfidenceScore(null);
        toast.success("README reverted");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to revert README";
        toast.error(message);
      }
    });
  };

  const handleCopy = () => {
    if (generatedReadme) {
      navigator.clipboard.writeText(generatedReadme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (generatedReadme) {
      const blob = new Blob([generatedReadme], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "README.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Downloaded README.md");
    }
  };

  const displayReadme = generatedReadme || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText size={18} />
                README Generator
              </DialogTitle>
              <DialogDescription className="mt-1">
                Generate a professional README for{" "}
                <span className="font-mono text-foreground">{projectName}</span>
              </DialogDescription>
            </div>

            {confidenceScore !== null && (
              <div
                className={cn(
                  "text-xs px-2 py-1 rounded-md border",
                  confidenceScore >= 2
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}
              >
                Confidence: {confidenceScore}/3
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 bg-secondary/30 border-b h-10 shrink-0">
          <div className="flex h-full">
            <button
              onClick={() => setViewMode("preview")}
              disabled={!generatedReadme}
              className={cn(
                "h-full px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors",
                viewMode === "preview" && generatedReadme
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground",
                !generatedReadme && "opacity-50 cursor-not-allowed"
              )}
            >
              <Eye size={12} /> Preview
            </button>
            <button
              onClick={() => setViewMode("raw")}
              disabled={!generatedReadme}
              className={cn(
                "h-full px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors",
                viewMode === "raw" && generatedReadme
                  ? "text-foreground border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground",
                !generatedReadme && "opacity-50 cursor-not-allowed"
              )}
            >
              <FileCode size={12} /> Raw
            </button>
            {originalReadme && (
              <button
                onClick={() => setViewMode("diff")}
                disabled={!generatedReadme}
                className={cn(
                  "h-full px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors",
                  viewMode === "diff" && generatedReadme
                    ? "text-foreground border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground",
                  !generatedReadme && "opacity-50 cursor-not-allowed"
                )}
              >
                <GitCompare size={12} /> Compare
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {generatedReadme && (
              <>
                <button
                  onClick={handleCopy}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-1 rounded hover:bg-secondary transition-colors"
                >
                  {copied ? (
                    <Check size={12} className="text-emerald-500" />
                  ) : (
                    <Copy size={12} />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-1 rounded hover:bg-secondary transition-colors"
                >
                  <Download size={12} />
                  Download
                </button>
                <button
                  onClick={handleRevert}
                  disabled={isPending}
                  className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                >
                  <RotateCcw size={12} />
                  Revert
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {!generatedReadme && !isPending && !error && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Generate a Professional README
              </h3>
              <p className="text-sm text-center max-w-md mb-6">
                We&apos;ll analyze your repository structure, dependencies, and code
                to create a comprehensive README tailored to your project.
              </p>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Sparkles size={16} />
                Generate README
              </button>
              {hasExistingReadme && (
                <p className="text-xs text-muted-foreground mt-4">
                  Your existing README will be used as reference
                </p>
              )}
            </div>
          )}

          {isPending && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 size={32} className="animate-spin text-primary mb-4" />
              <p className="text-sm">Analyzing repository and generating README...</p>
              <p className="text-xs text-muted-foreground mt-2">
                This may take a few moments
              </p>
            </div>
          )}

          {error && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                <AlertCircle size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Generation Failed
              </h3>
              <p className="text-sm text-center max-w-md mb-6 text-red-500">
                {error}
              </p>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <RotateCcw size={16} />
                Try Again
              </button>
            </div>
          )}

          {generatedReadme && !isPending && (
            <div className="h-full overflow-y-auto">
              {viewMode === "preview" && (
                <article
                  className="prose prose-neutral dark:prose-invert max-w-none p-8
                    prose-headings:font-semibold prose-headings:tracking-tight
                    prose-h1:text-2xl prose-h1:border-b prose-h1:border-border prose-h1:pb-2
                    prose-h2:text-xl prose-h2:mt-8
                    prose-p:leading-7 prose-p:text-sm
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[12px] prose-code:font-mono
                    prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-md
                    prose-ul:text-sm prose-li:marker:text-muted-foreground
                    prose-hr:border-border
                  "
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {displayReadme}
                  </ReactMarkdown>
                </article>
              )}

              {viewMode === "raw" && (
                <textarea
                  readOnly
                  className="w-full h-full bg-secondary/30 text-foreground font-mono text-xs p-8 resize-none focus:outline-none leading-relaxed"
                  value={displayReadme}
                />
              )}

              {viewMode === "diff" && originalReadme && (
                <div className="h-full grid grid-cols-2 divide-x divide-border">
                  <div className="overflow-y-auto">
                    <div className="sticky top-0 bg-secondary/80 backdrop-blur px-4 py-2 border-b text-xs font-medium text-muted-foreground">
                      Original README
                    </div>
                    <article className="prose prose-neutral dark:prose-invert max-w-none p-6 prose-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {originalReadme}
                      </ReactMarkdown>
                    </article>
                  </div>
                  <div className="overflow-y-auto">
                    <div className="sticky top-0 bg-primary/10 backdrop-blur px-4 py-2 border-b text-xs font-medium text-primary">
                      Generated README
                    </div>
                    <article className="prose prose-neutral dark:prose-invert max-w-none p-6 prose-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {displayReadme}
                      </ReactMarkdown>
                    </article>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {generatedReadme && (
          <div className="px-6 py-3 border-t bg-secondary/30 shrink-0">
            <p className="text-xs text-muted-foreground">
              Review the generated README carefully. You can copy or download it to
              add to your repository manually.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
