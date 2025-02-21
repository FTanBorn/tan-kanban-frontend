// src/components/board/column-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ColumnSkeleton() {
  return (
    <div className="flex-shrink-0 w-[300px] rounded-lg bg-muted/30 p-3">
      {/* Column Header Skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" /> {/* Title */}
          <Skeleton className="h-5 w-10 rounded-full" /> {/* Count badge */}
        </div>
        <Skeleton className="h-8 w-8 rounded-md" /> {/* Actions button */}
      </div>

      {/* Tasks Skeleton */}
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-md" />
        ))}
      </div>

      {/* Add Task Button Skeleton */}
      <div className="mt-3">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}
