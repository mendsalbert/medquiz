import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import Logo from "@/components/Logo";

const POINTS = [
  "Create once, then open the practice workspace",
  "Choose session length and feedback style",
  "AfriMed-QA specialty tracks",
];

export default function SignupPage() {
  return (
    <div className="landing-theme min-h-screen font-sans text-ink lg:grid lg:grid-cols-2">
      <aside className="relative hidden min-h-screen overflow-hidden lg:block">
        <Image
          src="/images/medquiz-hero.jpg"
          alt="Students practicing clinical skills"
          fill
          priority
          sizes="50vw"
          className="object-cover object-[48%_28%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand/92 via-brand/55 to-brand/25" />
        <div className="absolute inset-0 bg-linear-to-r from-brand/40 to-transparent" />

        <div className="relative z-10 flex h-full min-h-screen flex-col justify-between p-10 xl:p-14">
          <Logo tone="light" />

          <div className="max-w-lg">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-leaf-bright">
              MedQuiz
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.08] tracking-tight text-white xl:text-6xl">
              Start drilling specialty MCQs today.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
              Sign up once, then open the dashboard to pick a track and practice for the
              wards and exams you actually sit.
            </p>
            <ul className="mt-8 space-y-3">
              {POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-sm font-semibold text-white/85"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf/20">
                    <Check className="h-3.5 w-3.5 text-leaf-bright" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-white/45">
            Demo mode. Creating an account continues to a short profile setup.
          </p>
        </div>
      </aside>

      <main className="landing-atmosphere relative flex min-h-screen flex-col">
        <div className="relative z-10 flex flex-1 flex-col px-5 py-8 sm:px-10 lg:px-14 xl:px-20">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <Logo />
            </div>
            <Link
              href="/"
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal lg:hidden">
              Create account
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-[2.75rem]">
              Sign up
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Create your account to unlock the practice workspace.
            </p>

            <div className="mt-8">
              <AuthForm mode="signup" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
