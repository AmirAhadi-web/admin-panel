"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        gap={8}
        toastOptions={{
          style: {
            background: "#1B1E21",
            border: "1px solid #292D32",
            color: "#F3F4F6",
            borderRadius: "12px",
            fontSize: "13px",
          },
        }}
      />
    </QueryClientProvider>
  );
}
