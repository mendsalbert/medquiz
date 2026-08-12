import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  ImageIcon,
  Layers3,
} from "lucide-react";
import { QUIZZES, quizHasImages } from "@/lib/quizzes";

const difficultyTone = {
  Foundation: "bg-teal-soft text-teal",
  Intermediate: "bg-[#fff4e5] text-[#9a5b00]",
  Advanced: "bg-[#fde8e8] text-[#9b1c1c]",
} as const;

export default function DashboardQuizzesPage() {
  return (
    <div>
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
          Question banks
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Specialty quizzes
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          MCQs from AfriMed-QA v2, plus image-based AfriMedEval clinical cases.
          Session length is controlled in Settings.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {QUIZZES.map((quiz) => {
          const hasImages = quizHasImages(quiz);
          return (
            <article
              key={quiz.id}
              className="flex flex-col rounded-3xl border border-teal/10 bg-surface p-7 shadow-[0_16px_40px_-32px_rgba(11,31,58,0.35)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-bold text-teal">
                  {quiz.specialty}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${difficultyTone[quiz.difficulty]}`}
                >
                  {quiz.difficulty}
                </span>
                {hasImages && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-soft px-3 py-1 text-xs font-bold text-teal">
                    <ImageIcon className="h-3 w-3" />
                    Images
                  </span>
                )}
              </div>

              <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
                {quiz.title}
              </h2>
              <p className="mt-2 flex-1 text-base leading-relaxed text-muted">
                {quiz.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Layers3 className="h-4 w-4 text-teal" />
                  {quiz.questionCount} in bank
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-teal" />
                  ~{quiz.estimatedMinutes} min full set
                </span>
              </div>

              <Link
                href={`/quiz/${quiz.id}`}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
              >
                Start quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
