"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { AdminHeader } from "@/components/layout/admin-header";
import { SocialLinks } from "@/components/layout/social-links";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { STORAGE_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SIDEBAR_TOGGLED_EVENT = "panelo:sidebar-toggled";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SIDEBAR_TOGGLED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SIDEBAR_TOGGLED_EVENT, callback);
  };
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop sidebar preference, persisted in localStorage. SSR snapshot is
  // always "expanded", so no hydration mismatch occurs.
  const collapsed = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === "1",
    () => false,
  );

  function toggleCollapsed() {
    window.localStorage.setItem(
      STORAGE_KEYS.sidebarCollapsed,
      collapsed ? "0" : "1",
    );
    window.dispatchEvent(new Event(SIDEBAR_TOGGLED_EVENT));
  }

  return (
    <div className="min-h-dvh">
      <AdminSidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

      <div
        className={cn(
          "flex min-h-dvh flex-col transition-[padding] duration-200 ease-out",
          collapsed ? "lg:pl-[68px]" : "lg:pl-60",
        )}
      >
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
        <footer className="border-t border-border py-5">
          <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-1.5 px-4 sm:px-6 lg:px-8">
            <SocialLinks />
          </div>
        </footer>
      </div>
    </div>
  );
}
