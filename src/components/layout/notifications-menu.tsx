"use client";

import { Bell, Check, CircleAlert, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { seedNotifications, type NotificationEntry } from "@/lib/api/demo-data";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Notifications popover backed by static demo entries. "Mark all read" is
 * fully functional (local state); entries are presentation content.
 */
export function NotificationsMenu() {
  const [notifications, setNotifications] =
    useState<NotificationEntry[]>(seedNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((current) =>
      current.map((n) => ({ ...n, read: true })),
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          className="relative grid size-9 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <Bell className="size-[18px]" />
          {unreadCount > 0 && (
            <span
              aria-hidden
              className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground"
            >
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-88 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="h-7 px-2 text-xs"
          >
            <Check className="size-3.5" />
            Mark all read
          </Button>
        </div>
        <Separator />
        <ul className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={cn(
                "flex gap-3 px-4 py-3 transition-colors",
                !notification.read && "bg-primary/[0.04]",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full",
                  notification.read
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                {notification.title.toLowerCase().includes("alert") ||
                notification.title.toLowerCase().includes("stock") ? (
                  <CircleAlert className="size-3.5" />
                ) : (
                  <Info className="size-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] leading-snug font-medium text-foreground">
                  {notification.title}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  {notification.description}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground/70">
                  {formatRelativeTime(notification.timestamp)}
                </p>
              </div>
              {!notification.read && (
                <span className="mt-1.5 ml-auto size-2 shrink-0 rounded-full bg-primary" />
              )}
            </li>
          ))}
        </ul>
        <Separator />
        <p className="px-4 py-2.5 text-[11px] text-muted-foreground/70">
          Demo feed — entries are static presentation content.
        </p>
      </PopoverContent>
    </Popover>
  );
}
