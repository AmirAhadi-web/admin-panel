"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "@/lib/api/users";
import type { UserInput } from "@/types/user";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
};

export function useUsers() {
  return useQuery({ queryKey: userKeys.all, queryFn: listUsers });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UserInput) => createUser(input),
    onSuccess: (user) => {
      toast.success(`User "${user.name}" created.`);
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create user.",
      );
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UserInput }) =>
      updateUser(id, input),
    onSuccess: (user) => {
      toast.success(`User "${user.name}" updated.`);
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
      void queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user.",
      );
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted.");
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user.",
      );
    },
  });
}
