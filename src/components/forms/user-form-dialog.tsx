"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import { userSchema, type UserFormValues } from "@/lib/validations/user";
import type { User } from "@/types/user";

export function UserFormDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits this user; otherwise it creates one. */
  user?: User | null;
}) {
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isEdit = Boolean(user);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", role: "viewer", status: "active" },
  });

  // Sync form state whenever the dialog target changes.
  useEffect(() => {
    if (open) {
      reset(
        user
          ? {
              name: user.name,
              email: user.email,
              role: user.role,
              status: user.status,
            }
          : { name: "", email: "", role: "viewer", status: "active" },
      );
    }
  }, [open, user, reset]);

  const submitting = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: UserFormValues) {
    try {
      if (isEdit && user) {
        await updateMutation.mutateAsync({ id: user.id, input: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      onOpenChange(false);
    } catch {
      // Mutation hooks surface an error toast; keep the dialog open.
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "Create user"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details for this account."
              : "Add a new team member to the workspace."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="user-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4"
        >
          <FormField label="Name" htmlFor="user-name" error={errors.name?.message} required>
            <Input
              id="user-name"
              placeholder="Jane Doe"
              autoComplete="off"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Email"
            htmlFor="user-email"
            error={errors.email?.message}
            required
          >
            <Input
              id="user-email"
              type="email"
              placeholder="jane@company.com"
              autoComplete="off"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Role" htmlFor="user-role" error={errors.role?.message} required>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="user-role" aria-invalid={Boolean(errors.role)}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Status"
              htmlFor="user-status"
              error={errors.status?.message}
              required
            >
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="user-status" aria-invalid={Boolean(errors.status)}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="invited">Invited</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="user-form" disabled={submitting}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
