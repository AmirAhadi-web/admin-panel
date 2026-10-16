"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/shared/logo";
import { BootScreen } from "@/components/shared/loading-state";
import { DEMO_PASSWORD, DEMO_USERNAME } from "@/lib/constants";
import { useDemoSession } from "@/hooks/use-demo-session";

export default function LoginPage() {
  const session = useDemoSession();
  const router = useRouter();

  // Already signed in (demo) → go straight to the dashboard.
  useEffect(() => {
    if (session === "authenticated") {
      router.replace("/dashboard");
    }
  }, [session, router]);

  if (session !== "anonymous") {
    return <BootScreen label="Checking session…" />;
  }

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-4 py-10">
      {/* Subtle backdrop: grid + restrained accent glow */}
      <div aria-hidden className="bg-grid absolute inset-0" />
      <div
        aria-hidden
        className="absolute top-[-320px] left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[120px]"
      />

      <div className="relative w-full max-w-100">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo />
          <div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to access your dashboard.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_24px_64px_rgb(0_0_0/0.35)] sm:p-8">
          <LoginForm />
        </div>

        <div className="mt-5 rounded-xl border border-border bg-surface px-4 py-3.5 text-center">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Demo credentials
          </p>
          <p className="mt-1.5 font-mono text-[13px] text-foreground">
            {DEMO_USERNAME} <span className="text-muted-foreground">/</span> {DEMO_PASSWORD}
          </p>
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground/80">
          Demo-only sign-in: credentials are checked in the browser and no real
          session is created. Don&apos;t reuse real passwords here.
        </p>
      </div>
    </div>
  );
}
