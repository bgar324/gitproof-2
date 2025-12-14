"use client";

import { cn } from "@/lib/utils";

// 1. Reusable Shimmer Component (Matches your other skeletons)
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-muted/50", className)} />
);

export default function ReposLoading() {
  return (
    <main className="min-h-screen bg-background pt-8 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- HEADER SKELETON --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-6">
          <div className="w-full md:w-auto">
            {/* Back Link */}
            <Skeleton className="h-4 w-32 mb-3" />

            {/* Title */}
            <Skeleton className="h-10 w-64 mb-2" />

            {/* Subtitle */}
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <Skeleton className="h-10 w-full sm:w-64 rounded-lg" />

            {/* Sort Buttons */}
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>
        </div>

        {/* --- GRID SKELETON --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-5 h-[180px] flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {/* Icon Box */}
                  <Skeleton className="w-10 h-10 rounded-lg shrink-0" />

                  <div className="space-y-2">
                    {/* Repo Name */}
                    <Skeleton className="h-4 w-32" />
                    {/* Score Badge */}
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                {/* Public/Private Badge */}
                <Skeleton className="h-5 w-12 rounded" />
              </div>

              {/* Description Lines */}
              <div className="space-y-2 mt-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>

              {/* Card Footer (Stats) */}
              <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50">
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
