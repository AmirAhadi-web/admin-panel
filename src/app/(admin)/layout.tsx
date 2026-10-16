import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AdminShell } from "@/components/layout/admin-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
