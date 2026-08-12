import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import TrackCards from "@/components/TrackCards";
import { QUIZZES } from "@/lib/quizzes";

export const metadata: Metadata = {
  title: "Specialty tracks | MedQuiz",
  description:
    "Browse all AfriMed-QA specialty quiz tracks and image-based clinical cases on MedQuiz.",
};

export default function QuizzesPage() {
  const totalQuestions = QUIZZES.reduce((n, quiz) => n + quiz.questionCount, 0);

  return (
    <div className="min-h-svh bg-canvas text-ink">
      <SiteNav tone="dark" />

      <main>
        <section className="landing-atmosphere border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            <Link
              href="/#tracks"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-teal"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-teal">
              All specialty tracks
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Every MedQuiz track in one place.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
              {QUIZZES.length} specialty banks · {totalQuestions.toLocaleString()}{" "}
              questions from AfriMed-QA v2, plus clinical image cases. Pick a track and
              start practicing.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
              >
                Sign up free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/quizzes"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-5 py-3 text-sm font-bold text-ink transition-colors hover:border-teal hover:text-teal"
              >
                Open dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-atmosphere py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <TrackCards quizzes={QUIZZES} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
