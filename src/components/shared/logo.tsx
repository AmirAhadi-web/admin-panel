import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Panelo brand mark — a "dashboard panels" glyph (one tall panel and two
 * stacked panels) in dark ink on the signature mint field.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#8BF0B5] via-[#6EE7A0] to-[#43C67F] shadow-[0_4px_16px_rgb(110_231_160/0.22)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-[58%]"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="4" y="4" width="6.5" height="16" rx="2" fill="#0D1512" />
        <rect
          x="13.25"
          y="4"
          width="6.75"
          height="7"
          rx="2"
          fill="#0D1512"
          fillOpacity="0.82"
        />
        <rect
          x="13.25"
          y="13.75"
          width="6.75"
          height="6.25"
          rx="2"
          fill="#0D1512"
          fillOpacity="0.55"
        />
      </svg>
    </div>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="text-[17px] font-semibold tracking-tight text-foreground">
          {APP_NAME}
        </span>
      )}
    </span>
  );
}
