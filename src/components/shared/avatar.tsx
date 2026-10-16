"use client";

import { useState } from "react";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Avatar rendering order:
 *  1. `src` (e.g. an uploaded profile photo)
 *  2. `defaultSrc` (e.g. the generated default profile photo)
 *  3. A deterministic colored default avatar based on `seed`/`name`
 *  4. Initials — only if an image fails to load (resilience fallback)
 */

const USER_AVATARS = [
  "/avatars/user-1.png",
  "/avatars/user-2.png",
  "/avatars/user-3.png",
  "/avatars/user-4.png",
  "/avatars/user-5.png",
  "/avatars/user-6.png",
  "/avatars/user-7.png",
  "/avatars/user-8.png",
] as const;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Stable, differently-colored default avatar per user (seed = user id). */
export function defaultUserAvatar(seed: string): string {
  return USER_AVATARS[hashString(seed) % USER_AVATARS.length];
}

export function Avatar({
  name,
  src,
  seed,
  defaultSrc,
  className,
}: {
  name: string;
  src?: string;
  /** Stable identifier used to pick a colored default (e.g. user id). */
  seed?: string;
  /** Explicit default image (used for the signed-in admin profile). */
  defaultSrc?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = src || defaultSrc || defaultUserAvatar(seed ?? name);

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- local/generated assets and data URLs don't need the optimizer
      <img
        src={resolvedSrc}
        alt={`${name}'s photo`}
        onError={() => setFailed(true)}
        className={cn(
          "size-9 shrink-0 rounded-full border border-border bg-muted object-cover",
          className,
        )}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full border border-border bg-muted text-xs font-semibold text-foreground",
        className,
      )}
    >
      {getInitials(name) || "?"}
    </div>
  );
}
