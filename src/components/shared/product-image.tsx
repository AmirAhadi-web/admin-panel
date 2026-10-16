"use client";

import { Package } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Product image with a graceful fallback. Any broken/missing URL renders a
 * neutral placeholder instead of a broken image icon.
 */
export function ProductImage({
  src,
  alt,
  className,
  iconClassName,
}: {
  src?: string;
  alt: string;
  className?: string;
  iconClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-muted/50",
        className,
      )}
    >
      {showPlaceholder ? (
        <>
          <Package
            aria-hidden
            className={cn("size-5 text-muted-foreground/50", iconClassName)}
          />
          <span className="sr-only">{alt} (no image)</span>
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-provided image URLs
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
