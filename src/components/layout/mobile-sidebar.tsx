"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/shared/logo";
import { NavLinks } from "@/components/layout/nav-links";
import { UserFooter } from "@/components/layout/user-footer";

/** Mobile navigation drawer (Radix Dialog with focus trapping). */
export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/65 backdrop-blur-[2px] data-[state=open]:animate-fade-in lg:hidden" />
        <DialogPrimitive.Content
          aria-label="Navigation"
          className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface outline-none data-[state=open]:animate-slide-in-left lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
            <Logo />
            <DialogPrimitive.Close className="grid size-8 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none">
              <X className="size-4" />
              <span className="sr-only">Close menu</span>
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <NavLinks onNavigate={() => onOpenChange(false)} />
          </div>
          <UserFooter />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
