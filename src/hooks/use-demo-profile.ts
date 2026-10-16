"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

export interface DemoProfile {
  displayName: string;
  email: string;
  /** Optional phone number (demo preference, stored locally). */
  phone?: string;
  /** Optional avatar image — a data URL produced by the settings picker. */
  avatarUrl?: string;
}

export const DEFAULT_PROFILE: DemoProfile = {
  displayName: "Amir Mohammad Ahadi",
  email: "amirahadiweb@gmail.com",
  phone: "09393871582",
};

export const PROFILE_UPDATED_EVENT = "panelo:profile-updated";

let cached: { raw: string | null; profile: DemoProfile } = {
  raw: null,
  profile: DEFAULT_PROFILE,
};

function parseProfile(raw: string | null): DemoProfile {
  if (!raw) return DEFAULT_PROFILE;
  try {
    const parsed = JSON.parse(raw) as Partial<DemoProfile>;
    if (
      typeof parsed.displayName === "string" &&
      parsed.displayName.length > 0 &&
      typeof parsed.email === "string" &&
      parsed.email.length > 0
    ) {
      return {
        displayName: parsed.displayName,
        email: parsed.email,
        phone: typeof parsed.phone === "string" ? parsed.phone : undefined,
        avatarUrl:
          typeof parsed.avatarUrl === "string" ? parsed.avatarUrl : undefined,
      };
    }
  } catch {
    // Malformed value — keep defaults.
  }
  return DEFAULT_PROFILE;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PROFILE_UPDATED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PROFILE_UPDATED_EVENT, callback);
  };
}

function getSnapshot(): DemoProfile {
  const raw = window.localStorage.getItem(STORAGE_KEYS.profile);
  if (raw !== cached.raw) {
    cached = { raw, profile: parseProfile(raw) };
  }
  return cached.profile;
}

/**
 * Demo profile preferences stored in localStorage (non-sensitive, editable
 * from Settings). Shared by the sidebar, header menu, and Settings page.
 */
export function useDemoProfile(): DemoProfile {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_PROFILE);
}

export function saveDemoProfile(profile: DemoProfile): void {
  window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  // Notify same-tab listeners; other tabs get the native "storage" event.
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}
