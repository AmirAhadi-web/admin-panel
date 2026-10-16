"use client";

import { Plus, Users as UsersIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { UserFormDialog } from "@/components/forms/user-form-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/shared/avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/loading-state";
import { Pagination } from "@/components/tables/pagination";
import { RowActions } from "@/components/tables/row-actions";
import { TableToolbar } from "@/components/tables/table-toolbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteUser, useUsers } from "@/hooks/use-users";
import { PAGE_SIZE } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { User } from "@/types/user";

export default function UsersPage() {
  const usersQuery = useUsers();
  const deleteMutation = useDeleteUser();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (usersQuery.data ?? []).filter((user) => {
      const matchesSearch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersQuery.data, search, roleFilter, statusFilter]);

  // Reset to the first page whenever the filter inputs change.
  function updateFilters(update: () => void) {
    update();
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function openCreate() {
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deletingUser) return;
    deleteMutation.mutate(deletingUser.id, {
      onSettled: () => setDeletingUser(null),
    });
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage team members, roles, and access."
      >
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Create user
        </Button>
      </PageHeader>

      <Card>
        <div className="border-b border-border p-4">
          <TableToolbar
            searchValue={search}
            onSearchChange={(value) => updateFilters(() => setSearch(value))}
            searchPlaceholder="Search by name or email…"
            searchLabel="Search users"
          >
            <Select
              value={roleFilter}
              onValueChange={(value) => updateFilters(() => setRoleFilter(value))}
            >
              <SelectTrigger className="w-32" aria-label="Filter by role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => updateFilters(() => setStatusFilter(value))}
            >
              <SelectTrigger className="w-36" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </TableToolbar>
        </div>

        {usersQuery.isLoading ? (
          <TableSkeleton rows={7} columns={5} />
        ) : usersQuery.isError ? (
          <ErrorState
            title="Couldn't load users"
            description={
              usersQuery.error instanceof Error
                ? usersQuery.error.message
                : "An unexpected error occurred."
            }
            onRetry={() => void usersQuery.refetch()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title={search || roleFilter !== "all" || statusFilter !== "all" ? "No users match your filters" : "No users yet"}
            description={
              search || roleFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting the search or clearing the filters."
                : "Create the first user to get started."
            }
            action={
              !(search || roleFilter !== "all" || statusFilter !== "all") ? (
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create user
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="w-14">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link
                        href={`/users/${user.id}`}
                        className="group flex items-center gap-3 outline-none"
                      >
                        <Avatar name={user.name} seed={user.id} className="size-8 text-[11px]" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground transition-colors group-hover:text-primary">
                            {user.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.role} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        detailHref={`/users/${user.id}`}
                        onEdit={() => openEdit(user)}
                        onDelete={() => setDeletingUser(user)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="border-t border-border">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </Card>

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editingUser}
      />

      <ConfirmDialog
        open={Boolean(deletingUser)}
        onOpenChange={(next) => !next && setDeletingUser(null)}
        title={`Delete ${deletingUser?.name ?? "this user"}?`}
        description="This permanently removes the user. This action cannot be undone."
        confirmLabel="Delete user"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
