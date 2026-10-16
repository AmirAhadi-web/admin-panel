"use client";

import { CircleAlert, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center"
    >
      <div className="grid size-11 place-items-center rounded-full bg-destructive/10 text-destructive">
        <CircleAlert className="size-5" />
      </div>
      <p className="mt-1 text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
          <RotateCcw className="size-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
