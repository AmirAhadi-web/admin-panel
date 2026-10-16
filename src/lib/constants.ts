export const APP_NAME = "Panelo";
export const APP_DESCRIPTION = "Premium admin panel";

/**
 * Demo-only credentials. This is NOT real authentication — see
 * src/lib/demo-auth.ts for the documented limitations of the demo flow.
 */
export const DEMO_USERNAME = "amirahadi";
export const DEMO_PASSWORD = "Admin123!";

/** Generated default profile photo; shown until the user uploads their own. */
export const DEFAULT_PROFILE_AVATAR = "/avatars/profile-default.png";

/** localStorage keys — only non-sensitive demo state is ever stored. */
export const STORAGE_KEYS = {
  demoSession: "panelo.demo.session",
  rememberedUsername: "panelo.demo.remembered-username",
  demoData: "panelo.demo.data.v1",
  profile: "panelo.demo.profile",
  notifications: "panelo.demo.notification-prefs",
  sidebarCollapsed: "panelo.ui.sidebar-collapsed",
} as const;

export const PAGE_SIZE = 8;
