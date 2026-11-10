"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-xl bg-zinc-800/80 ${className}`}
      aria-hidden
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <Skeleton className="mb-4 h-5 w-20" />
      <Skeleton className="mb-2 h-7 w-3/4" />
      <Skeleton className="mb-6 h-12 w-full" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-5/6" />
      <Skeleton className="mb-6 h-4 w-2/3" />
      <Skeleton className="h-10 w-full rounded-full" />
    </div>
  );
}

export function ForumRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-800/80 px-5 py-4">
      <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-64 max-w-full" />
      </div>
      <div className="hidden space-y-1 sm:block">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  );
}

export function ThreadPostSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80">
      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center border-b border-zinc-800 px-4 py-5 sm:border-b-0 sm:border-r">
          <Skeleton className="mb-3 h-20 w-20 rounded-2xl" />
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="p-5">
          <Skeleton className="mb-4 h-3 w-32" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
