"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Loader2, Monitor, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/shared/avatar";
import { FormField } from "@/components/shared/form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_PROFILE,
  saveDemoProfile,
  useDemoProfile,
} from "@/hooks/use-demo-profile";
import { DEFAULT_PROFILE_AVATAR } from "@/lib/constants";
import { fileToAvatarDataUrl } from "@/lib/image";
import { useNotificationPrefs } from "@/hooks/use-notification-prefs";
import {
  profileSchema,
  type NotificationPrefs,
  type ProfileFormValues,
} from "@/lib/validations/settings";
import { cn } from "@/lib/utils";

const NOTIFICATION_OPTIONS: ReadonlyArray<{
  key: keyof NotificationPrefs;
  label: string;
  description: string;
}> = [
  {
    key: "newOrders",
    label: "New orders",
    description: "Get notified when an order is placed.",
  },
  {
    key: "productUpdates",
    label: "Product updates",
    description: "Stock warnings and catalog changes.",
  },
  {
    key: "weeklyDigest",
    label: "Weekly digest",
    description: "A summary of revenue and activity every Monday.",
  },
  {
    key: "securityAlerts",
    label: "Security alerts",
    description: "Sign-in attempts and permission changes.",
  },
];

export default function SettingsPage() {
  const storedProfile = useDemoProfile();
  const {
    prefs,
    dirty: prefsDirty,
    toggle: togglePref,
    save: onSavePrefs,
    cancel: onCancelPrefs,
  } = useNotificationPrefs();

  // Avatar draft: undefined = unchanged, "" = removed, string = new data URL.
  const [avatarDraft, setAvatarDraft] = useState<string | undefined>(undefined);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: DEFAULT_PROFILE,
  });

  const effectiveAvatar =
    avatarDraft !== undefined ? avatarDraft : storedProfile.avatarUrl;
  const profileDirty = isDirty || avatarDraft !== undefined;

  // Populate the form once the stored profile resolves client-side.
  useEffect(() => {
    reset(storedProfile);
  }, [storedProfile, reset]);

  function onSaveProfile(values: ProfileFormValues) {
    // Demo-only: profile preferences are stored locally in the browser,
    // never sent to a server. This limitation is intentional and visible.
    saveDemoProfile({
      displayName: values.displayName,
      email: values.email,
      phone: values.phone ? values.phone : undefined,
      avatarUrl: effectiveAvatar || undefined,
    });
    setAvatarDraft(undefined);
    reset(values);
    toast.success("Profile preferences saved locally.");
  }

  function onCancelProfile() {
    reset(storedProfile);
    setAvatarDraft(undefined);
  }

  async function handleAvatarFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset the input so picking the same file again still fires onChange.
    event.target.value = "";
    if (!file) return;

    setAvatarBusy(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setAvatarDraft(dataUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't process that image.",
      );
    } finally {
      setAvatarBusy(false);
    }
  }

  function handleSavePrefs() {
    onSavePrefs();
    toast.success("Notification preferences saved locally.");
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Workspace preferences. Demo-only: saved to your browser, not a server."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* ── Profile ─────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>
              Shown in the sidebar and account menu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSaveProfile)}
              noValidate
              className="grid gap-4"
            >
              {/* Profile photo */}
              <div className="flex items-center gap-4">
                <Avatar
                  name={storedProfile.displayName}
                  src={effectiveAvatar}
                  defaultSrc={DEFAULT_PROFILE_AVATAR}
                  className="size-16 text-lg"
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Profile photo</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={avatarBusy}
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      {avatarBusy ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Upload className="size-3.5" />
                      )}
                      {avatarBusy ? "Processing…" : "Upload photo"}
                    </Button>
                    {effectiveAvatar && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAvatarDraft("")}
                        disabled={avatarBusy}
                      >
                        <Trash2 className="size-3.5" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PNG or JPG — cropped to a square, stored only in this browser.
                  </p>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-label="Upload profile photo"
                  onChange={handleAvatarFile}
                />
              </div>

              <FormField
                label="Display name"
                htmlFor="display-name"
                error={errors.displayName?.message}
                required
              >
                <Input
                  id="display-name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.displayName)}
                  {...register("displayName")}
                />
              </FormField>
              <FormField
                label="Email"
                htmlFor="profile-email"
                error={errors.email?.message}
                required
              >
                <Input
                  id="profile-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </FormField>
              <FormField
                label="Phone"
                htmlFor="profile-phone"
                error={errors.phone?.message}
              >
                <Input
                  id="profile-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone")}
                />
              </FormField>
              <div className="flex gap-2 pt-1">
                <Button type="submit" disabled={!profileDirty}>
                  Save changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!profileDirty}
                  onClick={onCancelProfile}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ── Notifications ───────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
            <CardDescription>
              Choose which events reach your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {NOTIFICATION_OPTIONS.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between gap-4 py-2.5"
              >
                <div>
                  <Label
                    htmlFor={`pref-${option.key}`}
                    className="text-sm font-medium"
                  >
                    {option.label}
                  </Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <Switch
                  id={`pref-${option.key}`}
                  checked={prefs[option.key]}
                  onCheckedChange={() => togglePref(option.key)}
                  aria-label={option.label}
                />
              </div>
            ))}
            <div className="flex gap-2 pt-3">
              <Button onClick={handleSavePrefs} disabled={!prefsDirty}>
                Save preferences
              </Button>
              <Button variant="outline" onClick={onCancelPrefs} disabled={!prefsDirty}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Theme ───────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Appearance</CardTitle>
            </div>
            <CardDescription>Interface theme for this workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-primary/25 bg-primary/[0.06] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-md bg-[#111315] ring-1 ring-border">
                  <div className="size-3.5 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Dark — Premium</p>
                  <p className="text-xs text-muted-foreground">
                    The Panelo design system theme.
                  </p>
                </div>
              </div>
              <Badge>Active</Badge>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground/80">
              The dashboard ships with a single, carefully tuned dark theme.
            </p>
          </CardContent>
        </Card>

      </div>

      <div
        className={cn(
          "sticky bottom-4 mt-4 hidden",
          (profileDirty || prefsDirty) && "block",
        )}
        aria-live="polite"
      >
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-popover px-4 py-2 text-xs text-muted-foreground shadow-[0_12px_32px_rgb(0_0_0/0.45)]">
          <Loader2 className="size-3.5 animate-spin text-primary" />
          You have unsaved changes
        </div>
      </div>
    </>
  );
}
