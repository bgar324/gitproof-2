import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Eye,
  FileCode,
  GitCommit,
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RepoReadmeViewerProps {
  readme: string | null;
  repoUrl: string;
}

export function RepoReadmeViewer({ readme, repoUrl }: RepoReadmeViewerProps) {
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (readme) {
      navigator.clipboard.writeText(readme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#191919] text-zinc-300">
      {/* Editor Tabs */}
      <div className="flex items-center justify-between px-4 bg-[#010409] border-b border-[#30363d] h-10 shrink-0">
        <div className="flex h-full">
          <button
            onClick={() => setViewMode("preview")}
            className={cn(
              "h-full px-4 text-xs font-medium border-t-2 border-b-2 border-transparent flex items-center gap-2 transition-colors hover:cursor-pointer",
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
              "h-full px-4 text-xs font-medium border-t-2 border-b-2 border-transparent flex items-center gap-2 transition-colors hover:cursor-pointer",
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
            href={`${repoUrl}/blame/HEAD/README.md`}
            target="_blank"
            className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors hover:cursor-pointer"
            rel="noopener noreferrer"
          >
            <GitCommit size={12} /> Blame
          </a>
          {readme && (
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
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {readme ? (
          viewMode === "preview" ? (
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
            <textarea
              readOnly
              className="w-full h-full bg-[#191819] text-zinc-300 font-mono text-xs p-8 resize-none focus:outline-none leading-relaxed"
              value={readme}
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
  );
}
