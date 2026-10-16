"use client";

import { Menu } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { GlobalSearch } from "@/components/layout/global-search";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { UserMenu } from "@/components/layout/user-menu";
import { Separator } from "@/components/ui/separator";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="grid size-9 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <Breadcrumb />

      <div className="flex-1" />

      <GlobalSearch />

      <Separator orientation="vertical" className="hidden h-6 md:block" />

      <NotificationsMenu />
      <UserMenu />
    </header>
  );
}
