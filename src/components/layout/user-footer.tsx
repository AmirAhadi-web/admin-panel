"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/shared/avatar";
import { Separator } from "@/components/ui/separator";
import { useDemoProfile } from "@/hooks/use-demo-profile";
import { DEFAULT_PROFILE_AVATAR } from "@/lib/constants";
import { demoSignOut } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

/** Bottom sidebar profile section with a working logout action. */
export function UserFooter({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter();
  const profile = useDemoProfile();

  function handleLogout() {
    demoSignOut();
    toast.success("Signed out of the demo session.");
    router.replace("/login");
  }

  return (
    <div className="px-3 pb-4">
      <Separator className="mb-3" />
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg p-2",
          collapsed && "justify-center p-0",
        )}
      >
        <Avatar
          name={profile.displayName}
          src={profile.avatarUrl}
          defaultSrc={DEFAULT_PROFILE_AVATAR}
          className="size-8 text-[11px]"
        />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {profile.displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {profile.email}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  );
}
