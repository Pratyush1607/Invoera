"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Receipt, Sparkles, PieChart, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { signIn, signUp, type AuthFormState } from "./actions";

const FEATURES = [
  { icon: UploadCloud, text: "Upload invoices and receipts in seconds" },
  { icon: Sparkles, text: "AI extracts, validates, and categorizes for you" },
  { icon: PieChart, text: "See spending broken down by category and month" },
];

const initialState: AuthFormState = {};

const inputClassName =
  "rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-teal-500/20";

export default function LoginPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-teal-700 px-12 py-16 text-white lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <Receipt className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold">Invoera</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Invoicing and expenses, handled by AI.
          </h1>
          <p className="mt-4 text-teal-100">
            Upload a receipt or invoice and a multi-agent pipeline extracts, validates, and
            categorizes it — so your dashboard is always up to date.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.text} className="flex items-center gap-3 text-sm text-teal-50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Icon className="h-4 w-4" />
                  </span>
                  {feature.text}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-xs text-teal-200">
          © 2026 Invoera. All rights reserved. ·{" "}
          <Link href="/privacy" className="underline hover:text-white">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="underline hover:text-white">
            Terms
          </Link>
        </p>

        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-600/40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-teal-800/50"
        />
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-16 dark:bg-gray-950">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
              <Receipt className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Invoera</span>
          </div>

          <div className="mb-6 flex gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-900">
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                mode === "sign-in"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                mode === "sign-up"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              Create account
            </button>
          </div>

          {mode === "sign-in" ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Sign in to see your latest invoices and expenses.
              </p>

              <form action={signInAction} className="mt-8 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={inputClassName}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className={inputClassName}
                  />
                </label>

                {signInState.error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{signInState.error}</p>
                )}

                <Button type="submit" disabled={signInPending} className="mt-2 w-full">
                  {signInPending ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Create your account
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Start tracking invoices and expenses in seconds.
              </p>

              <form action={signUpAction} className="mt-8 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full name
                  <input
                    name="displayName"
                    type="text"
                    placeholder="Jane Doe"
                    className={inputClassName}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={inputClassName}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
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

                {signUpState.error && (
                  <p className="text-sm text-red-600 dark:text-red-400">{signUpState.error}</p>
                )}
                {signUpState.message && (
                  <p className="text-sm text-teal-600 dark:text-teal-400">
                    {signUpState.message}
                  </p>
                )}

                <Button type="submit" disabled={signUpPending} className="mt-2 w-full">
                  {signUpPending ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
            By continuing, you agree to Invoera&apos;s{" "}
            <Link href="/terms" className="text-teal-600 hover:underline dark:text-teal-400">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-teal-600 hover:underline dark:text-teal-400">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
