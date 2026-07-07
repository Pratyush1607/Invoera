"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Receipt, Sparkles, PieChart, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BackgroundVideo } from "@/components/shared/BackgroundVideo";
import { cn } from "@/lib/utils";
import { signIn, signUp, type AuthFormState } from "./actions";

const FEATURES = [
  { icon: UploadCloud, text: "Upload invoices and receipts in seconds" },
  { icon: Sparkles, text: "AI extracts, validates, and categorizes for you" },
  { icon: PieChart, text: "See spending broken down by category and month" },
];

const initialState: AuthFormState = {};

const inputClassName =
  "rounded-[var(--radius-input)] border border-border px-4 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 bg-surface";

// The right-side form sits directly on the sign-in video (no card behind it), so
// its muted text needs a theme-specific boost to stay legible over a busy clip —
// darker + a light halo in light mode, the normal muted color in dark mode.
const subtitleOnVideoClassName =
  "mt-1 text-sm text-text/80 [text-shadow:0_1px_2px_rgba(255,255,255,0.6)] dark:text-muted dark:[text-shadow:none]";
const footerOnVideoClassName =
  "mt-6 text-center text-xs text-text/80 [text-shadow:0_1px_2px_rgba(255,255,255,0.6)] dark:text-muted dark:[text-shadow:none]";
const footerLinkClassName =
  "text-text underline dark:text-accent dark:no-underline dark:hover:underline [text-shadow:0_1px_2px_rgba(255,255,255,0.6)] dark:[text-shadow:none]";

export default function LoginPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState);

  return (
    <div className="relative flex min-h-screen w-full flex-wrap overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <BackgroundVideo src="/video/signin-bg.mp4" loopStart={4} loopEnd={15} />
        <div className="absolute inset-0 bg-panel-bg opacity-50" />
      </div>

      <div className="fixed top-6 right-6 z-10">
        <ThemeToggle size="lg" />
      </div>

      <div className="relative hidden min-h-screen flex-1 flex-col justify-between px-12 py-14 text-panel-text lg:flex">
        <div className="relative z-10 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-panel-chip">
            <Receipt className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">Invoera</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight">
            Invoicing and expenses, handled by AI.
          </h1>
          <p className="mt-4 text-panel-muted">
            Upload a receipt or invoice and a multi-agent pipeline extracts, validates, and
            categorizes it — so your dashboard is always up to date.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.text} className="flex items-center gap-3 text-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel-chip">
                    <Icon className="h-4 w-4" />
                  </span>
                  {feature.text}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-panel-muted">
          © 2026 Invoera. All rights reserved. ·{" "}
          <Link href="/privacy" className="underline hover:opacity-80">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="underline hover:opacity-80">
            Terms
          </Link>
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-text">
              <Receipt className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold text-text">Invoera</span>
          </div>

          <div className="mb-6 flex gap-1 rounded-full bg-surface-inset p-1">
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                mode === "sign-in" ? "bg-surface text-text shadow-sm" : "text-muted"
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                mode === "sign-up" ? "bg-surface text-text shadow-sm" : "text-muted"
              )}
            >
              Create account
            </button>
          </div>

          {mode === "sign-in" ? (
            <>
              <h2 className="font-display text-2xl font-bold text-text">Welcome back</h2>
              <p className={subtitleOnVideoClassName}>Sign in to see your latest invoices and expenses.</p>

              <form action={signInAction} className="mt-8 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={inputClassName}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                  Password
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className={inputClassName}
                  />
                </label>

                {signInState.error && <p className="text-sm text-danger">{signInState.error}</p>}

                <Button type="submit" disabled={signInPending} className="mt-2 w-full">
                  {signInPending ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold text-text">Create your account</h2>
              <p className={subtitleOnVideoClassName}>Start tracking invoices and expenses in seconds.</p>

              <form action={signUpAction} className="mt-8 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                  Full name
                  <input
                    name="displayName"
                    type="text"
                    placeholder="Jane Doe"
                    className={inputClassName}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={inputClassName}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                  Password
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className={inputClassName}
                  />
                </label>

                {signUpState.error && <p className="text-sm text-danger">{signUpState.error}</p>}
                {signUpState.message && !signUpState.error && (
                  <p className="text-sm text-accent">{signUpState.message}</p>
                )}

                <Button type="submit" disabled={signUpPending} className="mt-2 w-full">
                  {signUpPending ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </>
          )}

          <p className={footerOnVideoClassName}>
            By continuing, you agree to Invoera&apos;s{" "}
            <Link href="/terms" className={footerLinkClassName}>
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className={footerLinkClassName}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
