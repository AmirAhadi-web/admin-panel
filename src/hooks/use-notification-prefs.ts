"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  DEFAULT_NOTIFICATION_PREFS,
  type NotificationPrefs,
} from "@/lib/validations/settings";

const PREFS_UPDATED_EVENT = "panelo:notification-prefs-updated";

let cached: { raw: string | null; prefs: NotificationPrefs } = {
  raw: null,
  prefs: DEFAULT_NOTIFICATION_PREFS,
};

function parsePrefs(raw: string | null): NotificationPrefs {
  if (!raw) return DEFAULT_NOTIFICATION_PREFS;
  try {
    return {
      ...DEFAULT_NOTIFICATION_PREFS,
      ...(JSON.parse(raw) as Partial<NotificationPrefs>),
    };
  } catch {
    return DEFAULT_NOTIFICATION_PREFS;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PREFS_UPDATED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PREFS_UPDATED_EVENT, callback);
  };
}

function getSnapshot(): NotificationPrefs {
  const raw = window.localStorage.getItem(STORAGE_KEYS.notifications);
  if (raw !== cached.raw) {
    cached = { raw, prefs: parsePrefs(raw) };
  }
  return cached.prefs;
}

/**
 * Notification preferences (demo-only, localStorage).
 *
 * `prefs` reflects unsaved local edits when present (`dirty`), otherwise the
 * persisted values. `save()` writes them back and broadcasts to listeners.
 */
export function useNotificationPrefs() {
  const saved = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => DEFAULT_NOTIFICATION_PREFS,
  );
  const [draft, setDraft] = useState<NotificationPrefs | null>(null);

  const prefs = draft ?? saved;
  const dirty = draft !== null;

  const toggle = useCallback(
    (key: keyof NotificationPrefs) => {
      setDraft((current) => {
        const base = current ?? saved;
        return { ...base, [key]: !base[key] };
      });
    },
    [saved],
  );

  const save = useCallback(() => {
    setDraft((current) => {
      if (current !== null) {
        window.localStorage.setItem(
          STORAGE_KEYS.notifications,
          JSON.stringify(current),
        );
        window.dispatchEvent(new Event(PREFS_UPDATED_EVENT));
      }
      return null;
    });
  }, []);

  const cancel = useCallback(() => setDraft(null), []);

  return { prefs, dirty, toggle, save, cancel };
}
