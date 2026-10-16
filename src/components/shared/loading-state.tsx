import { Loader2 } from "lucide-react";
import { LogoMark } from "@/components/shared/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-muted-foreground",
        className,
      )}
    >
      <Loader2 className="size-5 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

/** Full-screen boot splash used while the demo session is being resolved. */
export function BootScreen({ label = "Loading workspace…" }: { label?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-background">
      <div role="status" className="flex flex-col items-center gap-4">
        <LogoMark className="size-11 rounded-xl" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          {label}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-1 p-2" aria-hidden>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex items-center gap-4 px-2 py-2.5">
          {Array.from({ length: columns }).map((_, col) => (
            <Skeleton
              key={col}
              className={cn(
                "h-4",
                col === 0 ? "w-40" : col === columns - 1 ? "ml-auto w-12" : "w-20",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="size-10 rounded-lg" />
      </div>
    </div>
  );
}
