import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  caption = "vs. previous period",
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  /** Percentage change vs. previous period; positive is good by convention here. */
  trend: number;
  caption?: string;
}) {
  const positive = trend >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] text-muted-foreground">{title}</p>
          <p className="mt-2 text-[26px] leading-none font-semibold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium tabular-nums",
                positive ? "text-primary" : "text-destructive",
              )}
            >
              <TrendIcon className="size-3.5" />
              {formatPercent(trend)}
            </span>
            <span className="text-muted-foreground/80">{caption}</span>
          </div>
        </div>
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}
