"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Logo, LogoMark } from "@/components/shared/logo";
import { NavLinks } from "@/components/layout/nav-links";
import { UserFooter } from "@/components/layout/user-footer";
import { cn } from "@/lib/utils";

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-surface transition-[width] duration-200 ease-out lg:flex",
        collapsed ? "w-[68px]" : "w-60",
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-2 border-b border-border px-4",
          collapsed && "justify-center px-0",
        )}
      >
        {collapsed ? <LogoMark /> : <Logo />}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks collapsed={collapsed} />
      </div>

      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "mx-3 mb-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
          collapsed && "justify-center px-0",
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-[18px]" />
        ) : (
          <>
            <PanelLeftClose className="size-[18px]" />
            <span>Collapse</span>
          </>
        )}
      </button>

      <UserFooter collapsed={collapsed} />
    </aside>
  );
}
