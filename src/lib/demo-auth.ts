import { DEMO_PASSWORD, DEMO_USERNAME, STORAGE_KEYS } from "@/lib/constants";

/**
 * ──────────────────────────────────────────────────────────────────────────
 * DEMO AUTHENTICATION — NOT A SECURITY MECHANISM
 * ──────────────────────────────────────────────────────────────────────────
 * This module implements a *presentation-only* demo login flow. The session
 * is a simple flag in localStorage that any visitor can create, modify, or
 * delete from their browser dev tools. It exists purely so the demo can show
 * a realistic login → dashboard → logout navigation flow.
 *
 * It MUST NOT be used to protect sensitive data or admin operations:
 *  - No credentials ever leave the browser (they are compared locally).
 *  - The "session" is a client-side boolean, not a signed token.
 *  - Route guards built on top of this are UX redirects, not authorization.
 *
 * BEFORE PRODUCTION USE, replace this module with a real auth provider
 * (e.g. Auth.js/NextAuth, Clerk, Supabase Auth) backed by server-side
 * session validation, HTTP-only cookies, and middleware-based protection.
 * ──────────────────────────────────────────────────────────────────────────
 */

export interface DemoCredentials {
  username: string;
  password: string;
}

/** Simulates network latency for the demo sign-in request. */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Validates credentials against the public demo credentials and, on success,
 * sets the demo session flag. Throws an Error on invalid credentials.
 */
export async function demoSignIn(credentials: DemoCredentials): Promise<void> {
  await delay(900); // simulated network round-trip

  const usernameOk =
    credentials.username.trim().toLowerCase() === DEMO_USERNAME.toLowerCase();
  const passwordOk = credentials.password === DEMO_PASSWORD;

  if (!usernameOk || !passwordOk) {
    throw new Error(
      "Invalid username or password. Use the demo credentials shown below.",
    );
  }

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEYS.demoSession, "1");
  }
}

/** Clears the demo session flag. */
export function demoSignOut(): void {
  if (isBrowser()) {
    window.localStorage.removeItem(STORAGE_KEYS.demoSession);
  }
}

/** Returns whether a demo session flag exists. Client-side only. */
export function hasDemoSession(): boolean {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(STORAGE_KEYS.demoSession) === "1";
}

/** "Remember me" — persists ONLY the username, never the password. */
export function rememberUsername(username: string | null): void {
  if (!isBrowser()) return;
  if (username) {
    window.localStorage.setItem(STORAGE_KEYS.rememberedUsername, username);
  } else {
    window.localStorage.removeItem(STORAGE_KEYS.rememberedUsername);
  }
}

export function getRememberedUsername(): string {
  if (!isBrowser()) return "";
  return window.localStorage.getItem(STORAGE_KEYS.rememberedUsername) ?? "";
}
