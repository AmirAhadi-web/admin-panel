"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  products: "Products",
  orders: "Orders",
  analytics: "Analytics",
  settings: "Settings",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isIdSegment = index > 0 && !SEGMENT_LABELS[segment];
    const label = SEGMENT_LABELS[segment] ?? (isIdSegment ? "Details" : segment);
    return { href, label, isLast: index === segments.length - 1 };
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm">
        {crumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <li>
              {crumb.isLast ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
            {!crumb.isLast && (
              <li aria-hidden className="text-muted-foreground/50">
                <ChevronRight className="size-3.5" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
