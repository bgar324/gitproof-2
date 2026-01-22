import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Eye,
  FileCode,
  GitCommit,
  Copy,
  Check,
  Terminal,
  Sparkles,
  Loader2,
  Download,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateReadmeByGithubId, getReadmeByGithubId } from "@/app/actions";
import { toast } from "sonner";

interface RepoReadmeViewerProps {
  readme: string | null;
  repoUrl: string;
  githubId: number;
  repoName: string;
}

export function RepoReadmeViewer({ readme, repoUrl, githubId, repoName }: RepoReadmeViewerProps) {
  const [viewMode, setViewMode] = useState<"original" | "generated" | "raw">("original");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [generatedReadme, setGeneratedReadme] = useState<string | null>(null);
  const [hasCheckedGenerated, setHasCheckedGenerated] = useState(false);

  // Check if there's already a generated README when switching to that tab
  const handleViewModeChange = (mode: "original" | "generated" | "raw") => {
    setViewMode(mode);

    if (mode === "generated" && !hasCheckedGenerated && !generatedReadme) {
      startTransition(async () => {
        try {
          const result = await getReadmeByGithubId(githubId);
          if (result.generated) {
            setGeneratedReadme(result.generated);
          }
          setHasCheckedGenerated(true);
        } catch {
          setHasCheckedGenerated(true);
        }
      });
    }
  };

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        const result = await generateReadmeByGithubId(githubId);
        setGeneratedReadme(result.readme);
        toast.success("README generated successfully");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        toast.error(message);
      }
    });
  };

  const handleCopy = () => {
    const content = viewMode === "generated" ? generatedReadme : readme;
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    }
  };

  const handleDownload = () => {
    const content = viewMode === "generated" ? generatedReadme : readme;
    if (content) {
      const blob = new Blob([content], { type: "text/markdown" });
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

  const displayContent = viewMode === "generated" ? generatedReadme : readme;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#191919] text-zinc-300">
      {/* Editor Tabs */}
      <div className="flex items-center justify-between px-4 bg-[#010409] border-b border-[#30363d] h-10 shrink-0">
        <div className="flex h-full">
          <button
            onClick={() => handleViewModeChange("original")}
            className={cn(
              "h-full px-4 text-xs font-medium border-t-2 border-b-2 border-transparent flex items-center gap-2 transition-colors hover:cursor-pointer",
              viewMode === "original"
                ? "bg-[#0d1117] text-zinc-100 border-t-[#f78166] border-b-[#0d1117]"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-[#0d1117]/50"
            )}
          >
            <Eye size={12} /> Original
          </button>
          <button
            onClick={() => handleViewModeChange("generated")}
            className={cn(
              "h-full px-4 text-xs font-medium border-t-2 border-b-2 border-transparent flex items-center gap-2 transition-colors hover:cursor-pointer",
              viewMode === "generated"
                ? "bg-[#0d1117] text-zinc-100 border-t-[#58a6ff] border-b-[#0d1117]"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-[#0d1117]/50"
            )}
          >
            <Sparkles size={12} /> AI Generated
          </button>
          <button
            onClick={() => handleViewModeChange("raw")}
            className={cn(
              "h-full px-4 text-xs font-medium border-t-2 border-b-2 border-transparent flex items-center gap-2 transition-colors hover:cursor-pointer",
              viewMode === "raw"
                ? "bg-[#0d1117] text-zinc-100 border-t-[#f78166] border-b-[#0d1117]"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-[#0d1117]/50"
            )}
          >
            <FileCode size={12} /> Raw
          </button>
        </div>

        <div className="flex items-center gap-3">
          {viewMode !== "generated" && (
            <a
              href={`${repoUrl}/blame/HEAD/README.md`}
              target="_blank"
              className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors hover:cursor-pointer"
              rel="noopener noreferrer"
            >
              <GitCommit size={12} /> Blame
            </a>
          )}
          {viewMode === "generated" && generatedReadme && !isPending && (
            <button
              onClick={handleGenerate}
              className="text-[10px] text-[#58a6ff] hover:text-[#79b8ff] flex items-center gap-1.5 transition-colors hover:cursor-pointer"
            >
              <RotateCcw size={12} /> Regenerate
            </button>
          )}
          {displayContent && (
            <>
              <button
                onClick={handleCopy}
                className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors hover:cursor-pointer"
              >
                {copied ? (
                  <Check size={12} className="text-emerald-500" />
                ) : (
                  <Copy size={12} />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
              {viewMode === "generated" && generatedReadme && (
                <button
                  onClick={handleDownload}
                  className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors hover:cursor-pointer"
                >
                  <Download size={12} /> Download
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {/* Original README View */}
        {viewMode === "original" && (
          <>
            {readme ? (
              <article
                className="prose prose-invert max-w-none p-8
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
                "
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {readme}
                </ReactMarkdown>
              </article>
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
          </>
        )}

        {/* AI Generated README View */}
        {viewMode === "generated" && (
          <>
            {isPending ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <Loader2 size={32} className="animate-spin text-[#58a6ff] mb-4" />
                <p className="text-sm">
                  {hasCheckedGenerated ? "Generating README..." : "Checking for existing README..."}
                </p>
                <p className="text-xs text-zinc-600 mt-2">
                  Analyzing repository structure and code
                </p>
              </div>
            ) : generatedReadme ? (
              <article
                className="prose prose-invert max-w-none p-8
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
                "
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {generatedReadme}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <div className="w-16 h-16 rounded-2xl bg-[#58a6ff]/10 flex items-center justify-center mb-4">
                  <Sparkles size={28} className="text-[#58a6ff]" />
                </div>
                <h3 className="text-lg font-medium text-zinc-100 mb-2">
                  Generate a Professional README
                </h3>
                <p className="text-sm text-center max-w-md mb-6 text-zinc-400">
                  Analyze your repository&apos;s structure, dependencies, and code
                  to create a comprehensive README for <span className="font-mono text-zinc-300">{repoName}</span>.
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-[#58a6ff] text-white rounded-lg font-medium hover:bg-[#58a6ff]/90 transition-colors disabled:opacity-50"
                >
                  <Sparkles size={16} />
                  Generate README
                </button>
                {readme && (
                  <p className="text-xs text-zinc-600 mt-4">
                    Your existing README will be used as reference
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Raw View */}
        {viewMode === "raw" && (
          <textarea
            readOnly
            className="w-full h-full bg-[#191819] text-zinc-300 font-mono text-xs p-8 resize-none focus:outline-none leading-relaxed"
            value={displayContent || "No README content available"}
          />
        )}
      </div>
    </div>
  );
}
