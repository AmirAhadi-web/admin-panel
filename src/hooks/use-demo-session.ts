"use client";

import { useSyncExternalStore } from "react";
import { hasDemoSession } from "@/lib/demo-auth";

export type DemoSessionState = "loading" | "authenticated" | "anonymous";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/**
 * Reads the demo session flag via useSyncExternalStore: SSR always renders
 * "loading" (no hydration mismatch), the client snapshot reflects
 * localStorage immediately after hydration.
 *
 * This is a UX convenience for demo navigation — NOT an authorization check.
 */
export function useDemoSession(): DemoSessionState {
  return useSyncExternalStore(
    subscribe,
    () => (hasDemoSession() ? "authenticated" : "anonymous"),
    () => "loading",
  );
}
