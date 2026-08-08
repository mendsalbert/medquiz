"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { isOnboardingComplete, loadProfile, updateProfile } from "@/lib/user-profile";

type Mode = "login" | "signup";

const fieldClass =
  "mt-2 w-full rounded-xl border border-teal/15 bg-surface px-4 py-3.5 text-[15px] font-medium text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#8a9aa0] focus:border-teal focus:shadow-[0_0_0_3px_rgba(14,116,144,0.14)]";

export default function AuthForm({
  mode,
  nextPath,
}: {
  mode: Mode;
  nextPath?: string;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const name = String(data.get("name") ?? "").trim();

    if (mode === "signup") {
      updateProfile({
        email,
        fullName: name,
        preferredName: name.split(/\s+/)[0] ?? name,
        onboardingComplete: false,
      });
      window.setTimeout(() => {
        router.push(nextPath ?? "/onboarding");
      }, 350);
      return;
    }

    updateProfile({ email });
    const profile = loadProfile();
    const destination =
      nextPath ??
      (isOnboardingComplete(profile) ? "/dashboard" : "/onboarding");
    window.setTimeout(() => {
      router.push(destination);
    }, 350);
  }

  const isLogin = mode === "login";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <label className="block">
          <span className="text-sm font-bold text-ink">Full name</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Ama Mensah"
            className={fieldClass}
          />
        </label>
      )}

      <label className="block">
        <span className="text-sm font-bold text-ink">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@school.edu.gh"
          className={fieldClass}
        />
      </label>

      <label className="block">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-ink">Password</span>
          {isLogin && (
            <span className="text-xs font-semibold text-[#8a9099]">
              Forgot password? Soon
            </span>
          )}
        </div>
        <div className="relative mt-2">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder="At least 6 characters"
            className={`${fieldClass} mt-0 pr-12`}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#8a9099] hover:text-ink"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3.5 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright disabled:opacity-60"
      >
        {submitting
          ? "Continuing…"
          : isLogin
            ? "Log in"
            : "Create account"}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="pt-1 text-center text-sm text-muted">
        {isLogin ? (
          <>
            New to MedQuiz?{" "}
            <Link href="/signup" className="font-bold text-teal hover:text-ink">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-teal hover:text-ink">
              Log in
            </Link>
          </>
        )}
      </p>

      <p className="text-center text-sm">
        <Link
          href="/onboarding"
          className="font-semibold text-[#8a9099] underline decoration-black/15 underline-offset-4 transition-colors hover:text-ink"
        >
          Continue with profile setup
        </Link>
      </p>
    </form>
  );
}
