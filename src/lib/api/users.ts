import { localUsers } from "@/lib/api/local-store";
import type { User, UserInput } from "@/types/user";

/**
 * User data repository.
 *
 * It currently uses the browser-backed demo store. When the application's
 * primary database API is ready, replace only these repository functions;
 * pages and TanStack Query hooks can remain unchanged.
 */
export async function listUsers(): Promise<User[]> {
  return localUsers.list();
}

export async function getUser(id: string): Promise<User> {
  return localUsers.get(id);
}

export async function createUser(input: UserInput): Promise<User> {
  return localUsers.create({ ...input, createdAt: "" });
}

export async function updateUser(id: string, input: UserInput): Promise<User> {
  return localUsers.update(id, input);
}

export async function deleteUser(id: string): Promise<void> {
  return localUsers.remove(id);
}
