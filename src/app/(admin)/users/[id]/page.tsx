"use client";

import { ArrowLeft, CalendarDays, Mail, Pencil, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { UserFormDialog } from "@/components/forms/user-form-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/shared/avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteUser, useUser } from "@/hooks/use-users";
import { formatDateTime } from "@/lib/format";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userQuery = useUser(params.id);
  const deleteMutation = useDeleteUser();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const user = userQuery.data;

  function confirmDelete() {
    if (!user) return;
    deleteMutation.mutate(user.id, {
      onSuccess: () => router.replace("/users"),
      onSettled: () => setDeleteOpen(false),
    });
  }

  if (userQuery.isLoading) {
    return (
      <>
        <div className="mb-6 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-7 w-56" />
        </div>
        <Card>
          <TableSkeleton rows={5} columns={2} />
        </Card>
      </>
    );
  }

  if (userQuery.isError || !user) {
    return (
      <Card>
        <ErrorState
          title="Couldn't load this user"
          description={
            userQuery.error instanceof Error
              ? userQuery.error.message
              : "The user may have been deleted."
          }
          onRetry={() => void userQuery.refetch()}
        />
        <div className="flex justify-center pb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/users">
              <ArrowLeft className="size-4" /> Back to users
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <PageHeader
        title={user.name}
        description={`Member since ${formatDateTime(user.createdAt)}`}
      >
        <Button variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" /> Edit
        </Button>
        <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4" /> Delete
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Avatar name={user.name} seed={user.id} className="size-16 text-lg" />
            <div>
              <p className="text-base font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={user.role} label={`Role: ${user.role}`} />
              <StatusBadge status={user.status} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Account details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <dl className="divide-y divide-border">
              <div className="flex items-center gap-3 py-3">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <dt className="w-32 text-sm text-muted-foreground">Email</dt>
                <dd className="truncate text-sm font-medium">{user.email}</dd>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Shield className="size-4 shrink-0 text-muted-foreground" />
                <dt className="w-32 text-sm text-muted-foreground">Role</dt>
                <dd className="text-sm font-medium capitalize">{user.role}</dd>
              </div>
              <div className="flex items-center gap-3 py-3">
                <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                <dt className="w-32 text-sm text-muted-foreground">Created</dt>
                <dd className="text-sm font-medium">
                  {formatDateTime(user.createdAt)}
                </dd>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Shield className="size-4 shrink-0 text-muted-foreground" />
                <dt className="w-32 text-sm text-muted-foreground">User ID</dt>
                <dd className="font-mono text-xs text-muted-foreground">
                  {user.id}
                </dd>
              </div>
            </dl>
            <Separator className="my-4" />
            <p className="text-xs leading-relaxed text-muted-foreground/80">
              No credentials or authentication secrets are attached to user
              records.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/users">
            <ArrowLeft className="size-4" /> Back to users
          </Link>
        </Button>
      </div>

      <UserFormDialog open={editOpen} onOpenChange={setEditOpen} user={user} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${user.name}?`}
        description="This permanently removes the user and returns you to the user list. This action cannot be undone."
        confirmLabel="Delete user"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
