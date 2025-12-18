"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Shield, Star, Zap, Code2, X } from "lucide-react";

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScoreModal({ isOpen, onClose }: ScoreModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll Lock
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

  if (!mounted) return null;

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
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: "spring", damping: 25, stiffness: 300 },
              }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-background border border-border/50 shadow-2xl rounded-xl flex flex-col overflow-hidden pointer-events-auto ring-1 ring-white/10"
            >
              {/* Header */}
              <div className="p-6 border-b border-border/50 bg-muted/20 backdrop-blur flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="text-emerald-500" size={18} />
                    Impact Algorithm
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    How we calculate the 0-50 score.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 bg-card/50">
                <div className="space-y-4">
                  {/* Metric 1 */}
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      <Star size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground flex items-center gap-2">
                        1. Popularity (Logarithmic)
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          ~40%
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        We use a log scale so viral repos don't break the chart.
                        <br />
                        <span className="opacity-70">
                          Formula: Forks (2x) + Stars (1x).
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground flex items-center gap-2">
                        2. Recency Decay
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          ~30%
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Code rots. We penalize inactivity.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[9px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded">
                          &lt;7d: +15pts
                        </span>
                        <span className="text-[9px] border border-yellow-500/30 bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded">
                          &lt;30d: +10pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                      <Code2 size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground flex items-center gap-2">
                        3. Project Maturity
                        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                          ~30%
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        We parse your <code>README.md</code> size and language
                        complexity to distinguish "Hello World" apps from real
                        engineering.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border/50 bg-muted/20 text-center">
                <p className="text-[10px] text-muted-foreground">
                  This algorithm runs locally. It updates every time you sync.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
