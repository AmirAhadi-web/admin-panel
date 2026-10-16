"use client";

import { Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  searchLabel = "Search",
  children,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  /** Optional filter controls rendered on the right. */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
          className="pr-9 pl-9"
        />
        {searchValue && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
            className="absolute top-1/2 right-1 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {children}
        </div>
      )}
    </div>
  );
}
