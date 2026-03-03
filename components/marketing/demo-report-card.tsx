"use client";

import Image from "next/image";
import { Cpu, ShieldCheck } from "lucide-react";
import { DEMO_INSIGHTS, DEMO_STATS, DEMO_USER } from "@/lib/data";

export function DemoReportCard() {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-background shadow-sm">
      <div className="border-b border-border/70 px-6 py-5">
        <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Sample profile</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2.5 py-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            Public repos
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-2xl border border-border bg-secondary">
              <Image
                src={DEMO_USER.image}
                alt={DEMO_USER.name}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate font-serif text-xl text-foreground">
                {DEMO_USER.name}
              </div>
              <div className="truncate font-mono text-xs text-muted-foreground">
                @{DEMO_USER.username}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <Cpu size={11} className="text-primary" />
                {DEMO_STATS.archetype}
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-serif text-3xl text-foreground">{DEMO_STATS.grade}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Grade
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-b border-border/70">
        <div className="px-4 py-4 text-center">
          <div className="font-serif text-2xl text-foreground">{DEMO_STATS.impactScore}</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Impact
          </div>
        </div>
        <div className="border-x border-border/70 px-4 py-4 text-center">
          <div className="font-serif text-2xl text-foreground">
            {DEMO_STATS.totalContributions}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Commits
          </div>
        </div>
        <div className="px-4 py-4 text-center">
          <div className="font-serif text-2xl text-foreground">
            {DEMO_STATS.consistency}%
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Consistency
          </div>
        </div>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div>
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Summary
          </div>
          <div className="space-y-3">
            {DEMO_INSIGHTS.map((insight) => (
              <div key={insight} className="flex gap-3 text-sm leading-6 text-foreground/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/50" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-secondary/35 px-4 py-3 text-sm leading-6 text-foreground/80">
          You can edit the bio and choose which repositories to feature before
          sharing the public link.
        </div>
      </div>
    </div>
  );
}
