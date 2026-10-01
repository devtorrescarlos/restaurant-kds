import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className,
      )}
    />
  );
}

export default function ManagersLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm lg:p-5"
          >
            <Skeleton className="size-11 shrink-0 rounded-lg" />
            <div className="grid min-w-0 gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-12" />
            </div>
          </div>
        ))}
      </section>

      <div className="rounded-xl border bg-card p-4 shadow-sm lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="grid gap-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-10 w-full max-w-xs" />
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-24" />
            ))}
          </div>
        </div>

        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b border-border/60 py-3 last:border-b-0"
          >
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="grid min-w-0 flex-1 gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="hidden h-8 w-20 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
