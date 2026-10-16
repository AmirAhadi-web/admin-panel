import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-primary/25 bg-primary/10 text-primary",
        muted: "border-border bg-muted/60 text-muted-foreground",
        outline: "border-border text-muted-foreground",
        warning: "border-warning/25 bg-warning/10 text-warning",
        destructive: "border-destructive/25 bg-destructive/10 text-destructive",
        steel: "border-steel/25 bg-steel/10 text-steel",
        orchid: "border-orchid/25 bg-orchid/10 text-orchid",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
