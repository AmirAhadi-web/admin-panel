"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { BootScreen } from "@/components/shared/loading-state";
import { useDemoSession } from "@/hooks/use-demo-session";

/**
 * DEMO-ONLY navigation guard.
 *
 * This performs a client-side redirect based on a localStorage flag that the
 * user can freely modify. It exists to demonstrate realistic navigation
 * flows — it is NOT an authorization boundary. Production apps must enforce
 * access control server-side (middleware, signed sessions, RLS, etc.).
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const session = useDemoSession();
  const router = useRouter();

  useEffect(() => {
    if (session === "anonymous") {
      router.replace("/login");
    }
  }, [session, router]);

  if (session !== "authenticated") {
    return <BootScreen />;
  }

  return <>{children}</>;
}
