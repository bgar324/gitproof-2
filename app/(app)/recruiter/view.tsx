"use client";

import React, { useState, useTransition, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Wand2,
  RefreshCw,
  Loader2,
  Sparkles,
  ExternalLink,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateRecruiterDescription,
  revertRecruiterDescription,
} from "@/app/actions";

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.4 },
  }),
};

// --- SUB-COMPONENT: Project Card ---
const ProjectCard = ({ project, onUpdateDescription, index }: any) => {
  const [isPending, startTransition] = useTransition();

  // 1. CALCULATE DISPLAY SCORE
  const baseScore = project.impact_score || 0;
  const hasAi = !!project.recruiter_desc;
  const displayScore = hasAi ? Math.min(baseScore + 15, 50) : baseScore;

  const handleTranslate = () => {
    startTransition(async () => {
      try {
        const result = await generateRecruiterDescription(
          project.repo,
          project.raw_desc,
          project.tags,
          project.readme
        );
        onUpdateDescription(project.id, result);
      } catch (error) {
        console.error("Translation failed", error);
      }
    });
  };

  const handleRevert = () => {
    startTransition(async () => {
      try {
        await revertRecruiterDescription(project.repo);
        onUpdateDescription(project.id, null);
      } catch (error) {
        console.error("Revert failed", error);
      }
    });
  };

  return (
    <motion.div
      custom={0.1 + index * 0.1}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      // REMOVED: "h-full" from here so the card shrinks to fit content
      className={cn(
        "group relative bg-card border rounded-xl p-6 transition-all hover:shadow-lg flex flex-col",
        hasAi
          ? "border-primary/40 shadow-sm"
          : "border-border hover:border-primary/20"
      )}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium font-serif flex items-center gap-2">
            {project.repo}
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink size={12} />
            </a>
            {project.isPublic && (
              <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] text-muted-foreground uppercase tracking-wide font-sans">
                Public
              </span>
            )}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors duration-500",
              displayScore > 40
                ? "bg-green-500/10 text-green-500"
                : displayScore > 20
                ? "bg-yellow-500/10 text-yellow-500"
                : "bg-blue-500/10 text-blue-500"
            )}
          >
            Impact: {displayScore}/50
            {hasAi && <Sparkles size={10} className="animate-pulse" />}
          </div>
        </div>
      </div>

      {/* BODY CONTENT - CHANGED: Removed absolute positioning */}
      <div className="relative mb-4">
        <AnimatePresence mode="wait">
          {!hasAi ? (
            <motion.div
              key="raw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // CHANGED: Removed "absolute inset-0", Added "relative"
              className="relative flex flex-col"
            >
              <p className="text-sm text-muted-foreground font-mono bg-secondary/30 p-3 rounded-lg border border-dashed border-border flex-1">
                "{project.raw_desc || "No description provided."}"
              </p>

              <button
                onClick={handleTranslate}
                disabled={isPending}
                className="mt-2 text-xs font-medium text-primary flex items-center gap-1.5 hover:underline disabled:opacity-50 disabled:cursor-not-allowed w-fit"
              >
                {isPending ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 size={12} /> AI Translate
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="translated"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              // CHANGED: Removed "absolute inset-0", Added "relative"
              className="relative flex flex-col"
            >
              <div className="relative">
                {/* CHANGED: Removed "h-full" from p tag */}
                <p className="text-sm text-foreground leading-relaxed p-3 bg-primary/5 rounded-lg border border-primary/10">
                  {project.recruiter_desc}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/40 gap-4">
        {/* Left: Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, project.tags.length).map((tag: string) => (
            <span
              key={tag}
              className="text-[10px] text-muted-foreground border border-border px-2 py-0.5 rounded bg-secondary/20 cursor-default"
            >
              {tag}
            </span>
          ))}
          {/* {project.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground px-1 py-0.5">
              +{project.tags.length - 3}
            </span>
          )} */}
        </div>

        {/* Right: Actions */}
        {hasAi && (
          <button
            onClick={handleRevert}
            disabled={isPending}
            className="shrink-0 text-[10px] font-medium text-muted-foreground hover:text-red-500 flex items-center gap-1.5 transition-colors bg-secondary/50 hover:bg-red-500/10 px-2 py-1 rounded"
          >
            {isPending ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <RefreshCw size={10} />
            )}
            Revert
          </button>
        )}
      </div>
    </motion.div>
  );
};

// --- MAIN VIEW ---
export default function RecruiterView({
  projects: initialProjects,
  username,
}: {
  projects: any[];
  username: string;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${username}_GitProof_Resume`,
  });

  const updateProjectDescription = (id: number, newDesc: string | null) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, recruiter_desc: newDesc } : p))
    );
  };

  return (
    <main className="min-h-screen bg-background pt-8 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeInUp}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-border pb-8"
        >
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Briefcase size={16} />
              <span className="text-xs font-mono uppercase tracking-widest">
                Recruiter Mode
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
              Curate your <br className="hidden md:block" /> evidence.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-lg font-light leading-relaxed">
              Recruiters don't read code; they scan for impact. Use our AI to
              translate your raw commits into business-ready bullet points.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handlePrint()}
              className="h-10 px-6 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-foreground/20"
            >
              <Download size={16} /> Generate PDF
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Project List */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mb-2"
            >
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Top Projects
              </h3>
              <span className="text-xs text-muted-foreground">
                Synced from GitHub
              </span>
            </motion.div>

            {projects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                index={idx}
                project={project}
                onUpdateDescription={updateProjectDescription}
              />
            ))}
          </div>

          {/* Right: Resume Preview */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={fadeInUp}
            className="lg:col-span-1 hidden lg:block"
          >
            <div className="sticky top-24">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Live Resume Preview
              </h3>
              <div
                ref={resumeRef}
                className="bg-white text-black p-8 rounded shadow-2xl min-h-[500px] text-xs font-serif leading-relaxed border border-zinc-200 print:shadow-none print:border-none print:w-full print:h-full"
              >
                <div className="border-b border-black/10 pb-4 mb-4">
                  <div className="font-bold text-xl">
                    {username || "Your Name"}
                  </div>
                  <div className="text-black/60">Software Engineer</div>
                  <div className="text-blue-600 mt-1 text-[10px]">
                    gitproof.com/{username}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="font-bold border-b border-black mb-2 uppercase tracking-wide text-[10px] pb-1">
                    Technical Skills
                  </div>
                  <div className="text-black/80">
                    {Array.from(new Set(projects.flatMap((p) => p.tags)))
                      .slice(0, 10)
                      .join(", ")}
                  </div>
                </div>
                <div>
                  <div className="font-bold border-b border-black mb-3 uppercase tracking-wide text-[10px] pb-1">
                    Key Projects
                  </div>
                  {projects.map((p) => (
                    <div key={p.id} className="mb-4">
                      <div className="flex justify-between font-bold items-baseline">
                        <span>{p.repo}</span>
                        <span className="font-normal text-black/50 text-[10px]">
                          {new Date().getFullYear()}
                        </span>
                      </div>
                      <ul className="list-disc pl-3 text-black/80 mt-1 space-y-1">
                        <li>
                          {p.recruiter_desc || p.raw_desc || "No description."}
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
