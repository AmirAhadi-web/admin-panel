export type UserRole = "admin" | "editor" | "viewer";
export type UserStatus = "active" | "invited" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; // ISO date string
  avatarUrl?: string;
}

export interface UserInput {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
