"use client";

import { ChevronDown, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar } from "@/components/shared/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDemoProfile } from "@/hooks/use-demo-profile";
import { DEFAULT_PROFILE_AVATAR } from "@/lib/constants";
import { demoSignOut } from "@/lib/demo-auth";

export function UserMenu() {
  const router = useRouter();
  const profile = useDemoProfile();

  function handleLogout() {
    demoSignOut();
    toast.success("Signed out of the demo session.");
    router.replace("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="flex cursor-pointer items-center gap-2 rounded-md p-1 pr-2 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <Avatar
            name={profile.displayName}
            src={profile.avatarUrl}
            defaultSrc={DEFAULT_PROFILE_AVATAR}
            className="size-8 text-[11px]"
          />
          <span className="hidden text-left lg:block">
            <span className="block max-w-32 truncate text-[13px] leading-tight font-medium text-foreground">
              {profile.displayName}
            </span>
            <span className="block text-[11px] leading-tight text-muted-foreground">
              Administrator
            </span>
          </span>
          <ChevronDown className="hidden size-3.5 text-muted-foreground lg:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block text-sm font-medium text-foreground">
            {profile.displayName}
          </span>
          <span className="block truncate text-xs">{profile.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings /> Profile &amp; settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
