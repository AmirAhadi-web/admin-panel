import {
  CreditCard,
  Package,
  ShoppingCart,
  TriangleAlert,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { ActivityEntry } from "@/lib/api/demo-data";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<
  ActivityEntry["type"],
  { icon: LucideIcon; className: string }
> = {
  order: { icon: ShoppingCart, className: "bg-steel/10 text-steel" },
  user: { icon: UserPlus, className: "bg-primary/10 text-primary" },
  product: { icon: Package, className: "bg-orchid/10 text-orchid" },
  payment: { icon: CreditCard, className: "bg-warning/10 text-warning" },
  alert: { icon: TriangleAlert, className: "bg-destructive/10 text-destructive" },
};

export function ActivityList({ entries }: { entries: ActivityEntry[] }) {
  return (
    <ul className="divide-y divide-border">
      {entries.map((entry) => {
        const style = TYPE_STYLES[entry.type];
        const Icon = style.icon;
        return (
          <li key={entry.id} className="flex gap-3 px-5 py-3.5">
            <div
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-full",
                style.className,
              )}
            >
              <Icon className="size-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] leading-snug font-medium text-foreground">
                {entry.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {entry.description}
              </p>
            </div>
            <time
              dateTime={entry.timestamp}
              className="ml-auto shrink-0 text-[11px] whitespace-nowrap text-muted-foreground/70"
            >
              {formatRelativeTime(entry.timestamp)}
            </time>
          </li>
        );
      })}
    </ul>
  );
}
