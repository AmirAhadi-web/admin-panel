"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Switch = forwardRef<
  ComponentRef<typeof SwitchPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-muted transition-colors",
      "focus-visible:ring-[3px] focus-visible:ring-primary/15 focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary/80",
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block size-4 rounded-full bg-muted-foreground shadow transition-transform data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-[2px] data-[state=checked]:bg-primary-foreground",
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";
