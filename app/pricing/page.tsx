import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

const PLANS = [
  {
    name: "Free",
    price: "GH₵0",
    period: "forever",
    description: "Try MedQuiz with AfriMed-QA specialty tracks.",
    cta: "Start practicing",
    href: "/signup",
    featured: false,
    features: [
      "Paeds, OBGYN, ID, derm & pathology quizzes",
      "Instant scoring + explanations",
      "Custom session length in Settings",
      "Mobile-friendly practice",
    ],
  },
  {
    name: "Pro",
    price: "GH₵99",
    period: "/ month",
    description: "For serious revision: larger banks and saved progress.",
    cta: "Get Pro",
    href: "/signup",
    featured: true,
    features: [
      "Everything in Free",
      "Expanding specialty question bank",
      "Progress history & weak-topic flags",
      "Retry analytics per quiz",
      "Early access to new tracks",
    ],
  },
  {
    name: "Cohort",
    price: "GH₵499",
    period: "/ month",
    description: "For study groups, tutors, and small programmes.",
    cta: "Talk to us",
    href: "/signup",
    featured: false,
    features: [
      "Everything in Pro",
      "Up to 25 shared seats",
      "Shared track links for cohorts",
      "Priority specialty requests",
      "Simple admin overview",
    ],
  },
];

const INCLUDED = [
  "Africa-focused clinical scenarios",
  "Exam-style single-best-answer format",
  "Rationales written for teaching, not trivia",
  "Cancel anytime on paid plans",
];

export default function PricingPage() {
  return (
    <div className="landing-theme landing-atmosphere min-h-screen font-sans text-ink">
      <SiteNav tone="dark" />

      <main>
        <section className="px-5 pt-14 pb-8 sm:px-8 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">
              Pricing
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
              Simple plans for serious practice
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Start free on the live tracks. Upgrade when you want a bigger bank,
              progress history, or shared cohort access.
            </p>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-8 sm:py-14">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`flex flex-col rounded-[2rem] p-8 ${plan.featured
                    ? "bg-brand text-white shadow-[0_24px_60px_-28px_rgba(11,31,58,0.55)]"
                    : "border border-teal/10 bg-surface"
                  }`}
              >
                {plan.featured && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-leaf px-3 py-1 text-xs font-bold text-[#050505]">
                    Most popular
                  </span>
                )}
                <h2
                  className={`font-display text-2xl font-semibold ${plan.featured ? "text-white" : "text-ink"
                    }`}
                >
                  {plan.name}
                </h2>
                <p
                  className={`mt-2 text-sm leading-relaxed ${plan.featured ? "text-white/65" : "text-muted"
                    }`}
                >
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-medium tracking-tight">
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm font-semibold ${plan.featured ? "text-white/55" : "text-[#8a9099]"
                      }`}
                  >
                    {plan.period}
                  </span>
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm font-semibold">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? "text-leaf-bright" : "text-teal"
                          }`}
                      />
                      <span className={plan.featured ? "text-white/85" : "text-muted"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-colors ${plan.featured
                      ? "bg-leaf text-[#050505] hover:bg-leaf-bright"
                      : "bg-brand text-white hover:bg-brand-hover"
                    }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-teal/10 bg-surface px-8 py-10 sm:px-12">
            <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
              Every plan includes
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm font-semibold text-muted"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-[#8a9099]">
              Prices shown in Ghana cedis (GH₵). Payments are not wired up in this MVP.
              CTAs open signup so you can try the practice workspace now.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
