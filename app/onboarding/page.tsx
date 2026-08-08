import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import Logo from "@/components/Logo";

export default function OnboardingPage() {
  return (
    <div className="landing-theme min-h-screen font-sans text-ink lg:grid lg:grid-cols-2">
      <aside className="relative hidden min-h-screen overflow-hidden lg:block">
        <Image
          src="/images/contributors.jpg"
          alt="Medical trainees collaborating"
          fill
          priority
          sizes="50vw"
          className="object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand/92 via-brand/55 to-brand/25" />
        <div className="absolute inset-0 bg-linear-to-r from-brand/40 to-transparent" />

        <div className="relative z-10 flex h-full min-h-screen flex-col justify-between p-10 xl:p-14">
          <Logo tone="light" />

          <div className="max-w-lg">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-leaf-bright">
              Almost there
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.08] tracking-tight text-white xl:text-6xl">
              Tell us who you are so practice feels like yours.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
              Name, school, and training stage help personalize your dashboard, and keep
              your focus aligned with the wards and exams ahead.
            </p>
          </div>

          <p className="text-sm text-white/45">Takes about a minute · Saved on this device</p>
        </div>
      </aside>

      <main className="landing-atmosphere relative flex min-h-screen flex-col">
        <div className="relative z-10 flex flex-1 flex-col px-5 py-8 sm:px-10 lg:px-14 xl:px-20">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <Logo />
            </div>
            <Link
              href="/signup"
              className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center py-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
              Set up your profile
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-[2.75rem]">
              Welcome to MedQuiz
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              A few details so your practice hub greets you by name and reflects where you
              train.
            </p>

            <div className="mt-8">
              <OnboardingForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
