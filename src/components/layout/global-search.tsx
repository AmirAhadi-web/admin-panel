"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Package,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { searchAll, type GlobalSearchResults } from "@/lib/api/search";
import { cn } from "@/lib/utils";

function useDebouncedValue(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function isEmpty(results: GlobalSearchResults | undefined): boolean {
  if (!results) return true;
  return (
    results.users.length === 0 &&
    results.products.length === 0 &&
    results.orders.length === 0
  );
}

/** Debounced global search across users, products, and orders. */
export function GlobalSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebouncedValue(query, 250);

  const { data, isFetching } = useQuery({
    queryKey: ["global-search", debounced],
    queryFn: () => searchAll(debounced),
    enabled: debounced.trim().length >= 2,
    staleTime: 15_000,
  });

  // Close on outside click / Escape.
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const showResults = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative hidden w-full max-w-xs md:block">
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search users, products, orders…"
        aria-label="Global search"
        role="combobox"
        aria-expanded={showResults}
        className="h-9 pl-9"
      />
      {showResults && (
        <div
          role="listbox"
          aria-label="Search results"
          className="absolute top-11 left-0 z-50 w-full min-w-80 overflow-hidden rounded-xl border border-border bg-popover shadow-[0_16px_40px_rgb(0_0_0/0.5)] animate-zoom-in"
        >
          {isFetching && !data ? (
            <div className="flex items-center gap-2 px-4 py-5 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Searching…
            </div>
          ) : isEmpty(data) ? (
            <p className="px-4 py-5 text-sm text-muted-foreground">
              No results for “{query.trim()}”.
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1.5">
              {data && data.users.length > 0 && (
                <div>
                  <p className="px-3.5 pt-1.5 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Users
                  </p>
                  {data.users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => navigate(`/users/${user.id}`)}
                      className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors hover:bg-muted/70"
                    >
                      <Users className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-foreground">{user.name}</span>
                      <span className="ml-auto truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {data && data.products.length > 0 && (
                <div>
                  <p className="px-3.5 pt-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Products
                  </p>
                  {data.products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors hover:bg-muted/70"
                    >
                      <Package className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-foreground">{product.name}</span>
                      <span className="ml-auto truncate text-xs text-muted-foreground">
                        {product.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {data && data.orders.length > 0 && (
                <div>
                  <p className="px-3.5 pt-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Orders
                  </p>
                  {data.orders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors hover:bg-muted/70"
                    >
                      <ShoppingCart className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate font-mono text-xs text-foreground">
                        {order.orderNumber}
                      </span>
                      <span className="ml-auto truncate text-xs text-muted-foreground">
                        {order.customer}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SearchFallbackMessage({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      Search is available on larger screens.
    </p>
  );
}
