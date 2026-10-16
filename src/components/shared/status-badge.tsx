import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";
import type { ProductStatus } from "@/types/product";
import type { UserRole, UserStatus } from "@/types/user";

type Tone = NonNullable<BadgeProps["variant"]>;

const STATUS_VARIANTS: Record<string, Tone> = {
  // shared
  active: "default",
  // users
  invited: "warning",
  suspended: "destructive",
  // products
  draft: "steel",
  archived: "muted",
  // orders
  pending: "warning",
  processing: "steel",
  shipped: "orchid",
  delivered: "default",
  cancelled: "destructive",
  // roles
  admin: "default",
  editor: "steel",
  viewer: "muted",
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function StatusBadge({
  status,
  className,
  label,
}: {
  status: UserStatus | ProductStatus | OrderStatus | UserRole | string;
  label?: string;
  className?: string;
}) {
  const variant = STATUS_VARIANTS[status] ?? "muted";
  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label ?? capitalize(status)}
    </Badge>
  );
}
