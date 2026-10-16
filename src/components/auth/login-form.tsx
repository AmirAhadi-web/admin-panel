"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  demoSignIn,
  getRememberedUsername,
  rememberUsername,
} from "@/lib/demo-auth";
import { DEMO_USERNAME } from "@/lib/constants";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: getRememberedUsername(),
      password: "",
      remember: Boolean(getRememberedUsername()),
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await demoSignIn({
        username: values.username,
        password: values.password,
      });
      // Remember me persists ONLY the username — never the password.
      rememberUsername(values.remember ? values.username.trim() : null);
      toast.success("Welcome back.");
      router.replace("/dashboard");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Sign-in failed. Try again.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <FormField
        label="Username"
        htmlFor="username"
        error={errors.username?.message}
        required
      >
        <Input
          id="username"
          type="text"
          autoComplete="username"
          placeholder={DEMO_USERNAME}
          aria-invalid={Boolean(errors.username)}
          {...register("username")}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
        required
      >
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.password)}
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </FormField>

      <div className="flex items-center gap-2.5">
        <Controller
          control={control}
          name="remember"
          render={({ field }) => (
            <Checkbox
              id="remember"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
        <Label
          htmlFor="remember"
          className="cursor-pointer text-sm font-normal text-muted-foreground"
        >
          Remember my username on this device
        </Label>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
