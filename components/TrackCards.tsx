import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackIcon } from "@/lib/track-icons";
import type { Quiz } from "@/lib/quiz-types";

export default function TrackCards({
  quizzes,
  startIndex = 0,
}: {
  quizzes: Quiz[];
  startIndex?: number;
}) {
  return (
    <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz, i) => {
        const Icon = trackIcon(quiz.id);
        const n = String(startIndex + i + 1).padStart(2, "0");
        return (
          <div
            key={quiz.id}
            className="group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#122844] p-6 text-white shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)] dark:border-border dark:bg-surface dark:shadow-none sm:aspect-square sm:min-h-0 sm:p-7"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-leaf/15 blur-2xl transition-opacity group-hover:opacity-100" />
            <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-teal/20 blur-2xl" />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-leaf text-[#050505] shadow-[0_8px_28px_rgba(46,196,182,0.35)]">
                <Icon className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <span className="font-display text-3xl font-medium leading-none text-white/20">
                {n}
              </span>
            </div>
            <span className="relative mt-4 inline-flex w-fit rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-leaf-bright">
              {quiz.specialty.split(" ")[0]}
            </span>
            <h3 className="relative mt-3 font-display text-2xl font-medium leading-tight tracking-tight sm:text-[1.65rem]">
              {quiz.title}
            </h3>
            <p className="relative mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-white/65">
              {quiz.description}
            </p>
            <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs font-semibold text-white/60 sm:text-sm">
              <span className="min-w-0">
                Up to {quiz.questionCount} Qs · ~{quiz.estimatedMinutes} min
              </span>
              <Link
                href={`/quiz/${quiz.id}`}
                className="inline-flex shrink-0 items-center gap-1 text-leaf-bright transition-transform hover:translate-x-1"
              >
                Start quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
