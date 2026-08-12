import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  GraduationCap,
  Hospital,
  Sparkles,
  Stethoscope,
  Target,
  Timer,
} from "lucide-react";
import DemoTracks from "@/components/DemoTracks";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { QUIZZES } from "@/lib/quizzes";

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: "Medical students",
    body: "Reinforce lecture content with short exam-style sets you can finish between classes.",
  },
  {
    icon: Stethoscope,
    title: "House officers & interns",
    body: "Keep high-stakes specialties sharp: maternal care, ID, and paeds, before ward rounds.",
  },
  {
    icon: Hospital,
    title: "Study groups & schools",
    body: "Share a track, compare scores, and use explanations as discussion prompts.",
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Exam-style MCQs",
    body: "Single-best-answer items shaped like the papers trainees actually write.",
  },
  {
    icon: Brain,
    title: "Clinical explanations",
    body: "See rationales after each question, or review the full set when you submit.",
  },
  {
    icon: Target,
    title: "Specialty focus",
    body: "Start with OBGYN, infectious disease, and paediatrics, where local context matters most.",
  },
  {
    icon: Timer,
    title: "Fast practice loops",
    body: "Set your own session length in Settings, then get back to the ward or library.",
  },
];

const ROADMAP = [
  "Surgery & emergency medicine",
  "Internal medicine & cardiology",
  "Community health & primary care",
  "Pharmacology & therapeutics",
];

const FAQS = [
  {
    q: "Do I need an account?",
    a: "Yes. Log in or sign up to open the quiz dashboard. In this demo, submitting the form (or using Skip) takes you straight into practice.",
  },
  {
    q: "Are questions Africa-focused?",
    a: "Yes. Items emphasise malaria protocols, maternal emergencies, IMCI pathways, and other presentations common in African curricula.",
  },
  {
    q: "How long is a session?",
    a: "Set your preferred session length and feedback style in dashboard Settings. You can see explanations after every item or submit the full set and review everything at once.",
  },
  {
    q: "Can schools or cohorts use MedQuiz?",
    a: "The Cohort plan (priced in Ghana cedis) is designed for study groups and small programmes, with shared access and priority specialty requests.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-theme min-h-screen bg-canvas font-sans text-ink">
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src="/images/medquiz-hero.jpg"
          alt="Medical students practicing in a classroom"
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-[48%_28%]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-brand/72 via-brand/28 to-transparent to-65%" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand/45 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-brand/35 to-transparent" />

        <SiteNav tone="light" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col justify-end px-5 pb-16 pt-10 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24">
          <div className="max-w-xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-leaf-bright">
              MedQuiz
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Drill clinical judgment between classes.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/85">
              Short specialty MCQs with clear rationales. Practice for the wards and
              exams you actually sit.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-transparent bg-leaf px-7 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright"
              >
                Sign up to practice
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="tracks" className="landing-atmosphere scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">
                Demo tracks
              </p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                Specialty tracks. Ready now.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Preview the specialties below. Log in from this demo to jump straight into
                the quiz dashboard. No real account needed yet.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-leaf px-5 py-3 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright sm:self-center"
            >
              Log in to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <DemoTracks quizzes={QUIZZES} />
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:gap-12 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-teal">
              <Sparkles className="h-3.5 w-3.5" />
              How sessions work
            </div>
            <h2 className="mt-5 font-display text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
              Open a quiz. Answer. Learn why.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              No long onboarding. MedQuiz is a fast clinical practice loop for lectures,
              call nights, and revision weeks.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Log in or sign up, then open your practice dashboard",
                "Set session length in Settings. Many items include clinical images",
                "See feedback after each item, or submit and review all at once",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-base font-semibold text-ink">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-soft text-teal">
                    <BookOpen className="h-3.5 w-3.5" />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
            >
              Log in to practice
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative min-h-[320px] w-full overflow-hidden rounded-[2rem] lg:min-h-[520px]">
            <Image
              src="/images/how-section-img.jpg"
              alt="Medical students ready for clinical practice"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section id="who" className="landing-atmosphere scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Built for people who train under pressure
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Whether you are prepping for finals or staying sharp on call, MedQuiz keeps
              practice short and clinically relevant.
            </p>
          </div>
          <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
            {AUDIENCES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex h-full flex-col rounded-[1.75rem] border border-teal/10 bg-surface p-7 shadow-[0_12px_40px_rgba(10,22,40,0.04)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-soft">
                    <Icon className="h-5 w-5 text-teal" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-base leading-relaxed text-muted">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-teal/10 bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              What you get in every session
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Focused practice, not another bloated question bank dashboard.
            </p>
          </div>
          <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex h-full items-start gap-5 rounded-[1.75rem] bg-teal-soft/60 p-7"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-teal shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl font-semibold text-ink">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      {feature.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="landing-atmosphere py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              More specialties on the roadmap
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              The MVP starts with AfriMed-QA specialty tracks. Pro and Cohort plans unlock
              the expanding bank as new specialties ship.
            </p>
            <Link
              href="/pricing"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
            >
              Compare plans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="space-y-3">
            {ROADMAP.map((item, i) => (
              <li
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-teal/10 bg-surface px-5 py-4 shadow-[0_8px_24px_rgba(10,22,40,0.03)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-soft font-display text-sm font-bold text-teal">
                  {String(i + 4).padStart(2, "0")}
                </span>
                <span className="font-semibold text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-t border-teal/10 bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Questions, answered
            </h2>
            <div className="mt-12 space-y-4">
              {FAQS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-teal/10 bg-leaf-soft/50 px-6 py-5 open:bg-surface open:shadow-[0_12px_32px_rgba(10,22,40,0.05)]"
                >
                  <summary className="cursor-pointer list-none font-display text-xl font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item.q}
                      <span className="shrink-0 text-teal transition-transform group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-base leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-atmosphere py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-teal/10 bg-surface px-8 py-14 text-center shadow-[0_20px_60px_rgba(14,116,144,0.08)] sm:px-16">
            <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Your next practice session is waiting.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted">
              Start free on the live tracks, or see Pro when you need a bigger bank.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-leaf px-8 py-4 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal-soft px-8 py-4 text-sm font-bold text-ink transition-colors hover:border-teal/40"
              >
                See pricing in GH₵
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
