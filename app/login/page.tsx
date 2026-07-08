"use client";

import { Suspense, useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { signIn, signUp, signInWithGoogle, type AuthFormState } from "./actions";
import { inputClassName } from "@/lib/ui-classes";

const initialState: AuthFormState = {};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"sign-in" | "sign-up">(
    searchParams.get("mode") === "signup" ? "sign-up" : "sign-in"
  );
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState);
  const googleError = searchParams.get("error") === "google";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-16">
      <div className="fixed inset-0 -z-10 bg-hero-glow" aria-hidden="true" />

      <div className="fixed top-6 right-6 z-10">
        <ThemeToggle size="lg" />
      </div>
      <Link
        href="/"
        className="fixed top-7 left-7 z-10 text-sm font-semibold text-muted hover:text-text"
      >
        ‹ Back to home
      </Link>

      <div className="animate-rise w-full max-w-sm rounded-[22px] border border-border bg-card p-9">
        <div className="mb-7 flex items-center gap-2">
          <Logo />
          <span className="font-display text-lg font-bold text-text">Invoera</span>
        </div>

        {googleError && (
          <p className="mb-4 text-sm text-danger">
            Couldn&apos;t sign in with Google. Please try again.
          </p>
        )}

        {mode === "sign-in" ? (
          <>
            <h1 className="font-display text-2xl font-bold text-text">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted">Sign in to see how your business is doing.</p>

            <form action={signInWithGoogle} className="mt-6">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2.5 rounded-[var(--radius-input)] border border-border bg-card py-2.5 text-sm font-semibold text-text hover:bg-input-bg"
              >
                <GoogleIcon className="h-4.5 w-4.5" />
                Continue with Google
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted">or</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form action={signInAction} className="flex flex-col gap-3.5">
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

            <p className="mt-5 text-center text-sm text-muted">
              New here?{" "}
              <button
                type="button"
                onClick={() => setMode("sign-up")}
                className="font-semibold text-accent hover:opacity-80"
              >
                Create an account
              </button>
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold text-text">Create your account</h1>
            <p className="mt-1.5 text-sm text-muted">Start automating invoices and expenses in minutes.</p>

            <form action={signInWithGoogle} className="mt-6">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2.5 rounded-[var(--radius-input)] border border-border bg-card py-2.5 text-sm font-semibold text-text hover:bg-input-bg"
              >
                <GoogleIcon className="h-4.5 w-4.5" />
                Continue with Google
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted">or</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form action={signUpAction} className="flex flex-col gap-3.5">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-text">
                Full name
                <input name="displayName" type="text" placeholder="Jane Doe" className={inputClassName} />
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

            <p className="mt-5 text-center text-sm text-muted">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("sign-in")}
                className="font-semibold text-accent hover:opacity-80"
              >
                Sign in
              </button>
            </p>
          </>
        )}

        <p className="mt-6 text-center text-xs text-muted">
          By continuing, you agree to Invoera&apos;s{" "}
          <Link href="/terms" className="text-accent hover:underline">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
