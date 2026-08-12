"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ImageIcon,
  ListChecks,
  Settings,
  XCircle,
} from "lucide-react";
import ExpandableImage from "@/components/ExpandableImage";
import Logo from "@/components/Logo";
import SiteNav from "@/components/SiteNav";
import ThemeToggle from "@/components/ThemeToggle";
import { trackIcon } from "@/lib/track-icons";
import type { Question, Quiz } from "@/lib/quizzes";
import {
  loadSettings,
  saveAttempt,
  type FeedbackMode,
  type PracticeSettings,
} from "@/lib/practice-store";

type Phase = "ready" | "answering" | "results";

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function QuizChrome({
  backHref,
  backLabel,
  children,
}: {
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="landing-theme landing-atmosphere min-h-screen font-sans text-ink">
      <header className="border-b border-teal/10 bg-canvas/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal/15 bg-surface px-3.5 py-2 text-sm font-bold text-ink transition-colors hover:border-teal/30"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{backLabel}</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

export default function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const Icon = trackIcon(quiz.id);
  const [phase, setPhase] = useState<Phase>("ready");
  const [settings, setSettings] = useState<PracticeSettings | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>("immediate");

  useEffect(() => {
    setSettings(loadSettings());
    function refresh() {
      setSettings(loadSettings());
    }
    window.addEventListener("medquiz-settings", refresh);
    return () => window.removeEventListener("medquiz-settings", refresh);
  }, []);

  const question = sessionQuestions[index];
  const selected = answers[index] ?? null;
  const isRevealed = revealed[index] ?? false;
  const answeredCount = answers.filter((a) => a !== null).length;
  const sessionSize = settings
    ? Math.min(settings.questionsPerSession, quiz.questions.length)
    : Math.min(10, quiz.questions.length);

  const score = useMemo(() => {
    return sessionQuestions.reduce((total, q, i) => {
      return total + (answers[i] === q.correctIndex ? 1 : 0);
    }, 0);
  }, [answers, sessionQuestions]);

  function startSession() {
    const prefs = settings ?? loadSettings();
    const count = Math.min(prefs.questionsPerSession, quiz.questions.length);
    const picked = shuffle(quiz.questions).slice(0, count);
    setFeedbackMode(prefs.feedbackMode);
    setSessionQuestions(picked);
    setAnswers(picked.map(() => null));
    setRevealed(picked.map(() => false));
    setIndex(0);
    setPhase("answering");
  }

  function selectOption(optionIndex: number) {
    if (phase !== "answering") return;
    if (feedbackMode === "immediate" && isRevealed) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optionIndex;
      return next;
    });
  }

  function revealCurrent() {
    if (selected === null) return;
    setRevealed((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }

  function finishSession(finalAnswers: (number | null)[] = answers) {
    const finalScore = sessionQuestions.reduce((total, q, i) => {
      return total + (finalAnswers[i] === q.correctIndex ? 1 : 0);
    }, 0);
    const percent = Math.round((finalScore / sessionQuestions.length) * 100);
    saveAttempt({
      quizId: quiz.id,
      quizTitle: quiz.title,
      specialty: quiz.specialty,
      score: finalScore,
      total: sessionQuestions.length,
      percent,
      feedbackMode,
    });
    setPhase("results");
  }

  function goNext() {
    if (index < sessionQuestions.length - 1) {
      setIndex((i) => i + 1);
      return;
    }
    finishSession();
  }

  function goPrev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  function retry() {
    setPhase("ready");
    setSessionQuestions([]);
    setAnswers([]);
    setRevealed([]);
    setIndex(0);
  }

  if (phase === "ready") {
    return (
      <div className="landing-theme landing-atmosphere min-h-screen font-sans text-ink">
        <SiteNav tone="dark" />

        <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-teal"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tracks
          </Link>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf text-[#050505] shadow-[0_8px_28px_rgba(46,196,182,0.35)]">
                  <Icon className="h-6 w-6" strokeWidth={2.25} />
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-teal-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-teal">
                    {quiz.specialty}
                  </span>
                  <span className="rounded-full bg-surface-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                    {quiz.difficulty}
                  </span>
                </div>
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-teal">
                Specialty track
              </p>
              <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                {quiz.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                {quiz.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold text-muted">
                <span className="inline-flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-teal" />
                  {quiz.questionCount.toLocaleString()} questions in bank
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-teal" />
                  ~{quiz.estimatedMinutes} min full bank
                </span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-teal/10 bg-surface p-6 shadow-[0_12px_40px_rgba(10,22,40,0.04)] sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-medium text-ink">
                    Your session
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Length and feedback come from your practice settings.
                  </p>
                </div>
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center gap-2 rounded-full border border-teal/15 bg-surface-soft px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-teal/30"
                >
                  <Settings className="h-4 w-4 text-teal" />
                  Edit
                </Link>
              </div>

              <dl className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-2xl bg-teal-soft/60 px-4 py-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-teal">
                    Questions
                  </dt>
                  <dd className="mt-1 font-display text-3xl font-medium text-ink">
                    {sessionSize}
                  </dd>
                </div>
                <div className="rounded-2xl bg-teal-soft/60 px-4 py-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-teal">
                    Feedback
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-ink">
                    {settings?.feedbackMode === "end"
                      ? "All at once"
                      : "After each question"}
                  </dd>
                </div>
                <div className="rounded-2xl bg-teal-soft/60 px-4 py-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-teal">
                    Bank size
                  </dt>
                  <dd className="mt-1 font-display text-3xl font-medium text-ink">
                    {quiz.questionCount}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={startSession}
                disabled={!settings}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-6 py-3.5 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright disabled:opacity-50"
              >
                Start {sessionSize}-question session
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "results") {
    const percent = Math.round((score / sessionQuestions.length) * 100);
    return (
      <QuizChrome backHref="/dashboard" backLabel="Dashboard">
        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#122844] p-8 text-white shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)] dark:border-teal/10 dark:bg-surface dark:shadow-none sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-bright">
              Quiz complete
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              {quiz.title}
            </h1>
            <p className="mt-3 text-sm text-white/65">
              {sessionQuestions.length} questions ·{" "}
              {feedbackMode === "immediate" ? "Immediate feedback" : "End review"}
            </p>
            <p className="mt-8 font-display text-6xl font-medium text-leaf-bright">
              {score}/{sessionQuestions.length}
            </p>
            <p className="mt-2 text-lg text-white/70">{percent}% correct</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={retry}
                className="inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright"
              >
                New session
              </button>
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Browse tracks
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {sessionQuestions.map((q, i) => {
              const chosen = answers[i];
              const correct = chosen === q.correctIndex;
              return (
                <article
                  key={q.id}
                  className="animate-slide-in rounded-[1.75rem] border border-teal/10 bg-surface p-6 sm:p-7"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start gap-3">
                    {correct ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4f9f42]" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#9b1c1c]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted">
                        Question {i + 1}
                      </p>
                      <h2 className="mt-1 font-display text-xl font-medium text-ink sm:text-2xl">
                        {q.prompt}
                      </h2>
                      {q.imageUrl && (
                        <div className="mt-4">
                          <ExpandableImage
                            src={q.imageUrl}
                            alt={q.imageAlt ?? "Clinical diagram"}
                          />
                        </div>
                      )}
                      <p className="mt-3 text-sm text-muted">
                        Your answer:{" "}
                        <span className="font-semibold text-ink">
                          {chosen === null ? "Skipped" : q.options[chosen]}
                        </span>
                      </p>
                      {!correct && (
                        <p className="mt-1 text-sm text-muted">
                          Correct:{" "}
                          <span className="font-semibold text-teal">
                            {q.options[q.correctIndex]}
                          </span>
                        </p>
                      )}
                      <p className="mt-3 rounded-2xl bg-teal-soft/60 p-4 text-sm leading-relaxed text-muted">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </QuizChrome>
    );
  }

  const canAdvanceImmediate = isRevealed;
  const canAdvanceEnd = selected !== null;
  const isLast = index === sessionQuestions.length - 1;

  return (
    <QuizChrome backHref="/quizzes" backLabel="Exit">
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
              {quiz.specialty}
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              {quiz.title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-muted">
              {feedbackMode === "immediate"
                ? "Feedback after each question"
                : "Review answers at the end"}
              {question.imageUrl ? " · Includes clinical image" : ""}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="font-display text-3xl font-medium text-ink">
              {index + 1}
              <span className="text-muted"> / {sessionQuestions.length}</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-muted">
              {answeredCount} answered
            </p>
          </div>
        </div>

        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-surface-soft">
          <div
            className="h-full rounded-full bg-leaf transition-all duration-300"
            style={{
              width: `${((index + 1) / sessionQuestions.length) * 100}%`,
            }}
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {sessionQuestions.map((_, i) => {
            const state =
              answers[i] === null
                ? "empty"
                : feedbackMode === "immediate" && revealed[i]
                  ? answers[i] === sessionQuestions[i].correctIndex
                    ? "correct"
                    : "wrong"
                  : "answered";
            return (
              <button
                key={sessionQuestions[i].id}
                type="button"
                onClick={() => setIndex(i)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                  i === index
                    ? "bg-leaf text-[#050505]"
                    : state === "correct"
                      ? "bg-[#e8f5e8] text-[#2f7a2f] dark:bg-[#16301a] dark:text-[#86efac]"
                      : state === "wrong"
                        ? "bg-[#fde8e8] text-[#9b1c1c] dark:bg-[#2a1414] dark:text-[#f87171]"
                        : state === "answered"
                          ? "bg-teal-soft text-teal"
                          : "bg-surface-soft text-muted"
                }`}
                aria-label={`Go to question ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <article className="rounded-[1.75rem] bg-surface p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-teal-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-teal">
              Question {index + 1}
            </span>
            {question.imageUrl ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-leaf-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-teal">
                <ImageIcon className="h-3 w-3" />
                Image
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-2xl font-medium leading-snug tracking-tight text-ink sm:text-[1.85rem]">
            {question.prompt}
          </h1>

          {question.imageUrl && (
            <div className="mt-6 max-w-3xl">
              <ExpandableImage
                src={question.imageUrl}
                alt={question.imageAlt ?? "Clinical diagram for this question"}
              />
            </div>
          )}

          <div className="mt-8 grid gap-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const showFeedback = feedbackMode === "immediate" && isRevealed;
              const isCorrect = optionIndex === question.correctIndex;
              const letter = String.fromCharCode(65 + optionIndex);

              let optionClass =
                "bg-surface-soft hover:bg-teal-soft/50";
              let letterClass = "bg-surface text-muted";
              if (showFeedback && isCorrect) {
                optionClass =
                  "bg-[#e8f5e8] dark:bg-[#16301a]";
                letterClass = "bg-[#4f9f42] text-white";
              } else if (showFeedback && isSelected && !isCorrect) {
                optionClass =
                  "bg-[#fde8e8] dark:bg-[#2a1414]";
                letterClass = "bg-[#9b1c1c] text-white";
              } else if (isSelected) {
                optionClass = "bg-teal-soft ring-1 ring-teal/40";
                letterClass = "bg-leaf text-[#050505]";
              }

              return (
                <button
                  key={`${question.id}-${optionIndex}`}
                  type="button"
                  onClick={() => selectOption(optionIndex)}
                  disabled={feedbackMode === "immediate" && isRevealed}
                  className={`flex w-full items-start gap-4 rounded-[1.25rem] px-4 py-4 text-left transition-colors disabled:cursor-default sm:px-5 ${optionClass}`}
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${letterClass}`}
                  >
                    {letter}
                  </span>
                  <span className="min-w-0 flex-1 pt-1 text-base font-semibold leading-relaxed text-ink">
                    {option}
                  </span>
                  {showFeedback && isCorrect ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#4f9f42]" />
                  ) : showFeedback && isSelected ? (
                    <XCircle className="mt-1 h-5 w-5 shrink-0 text-[#9b1c1c]" />
                  ) : isSelected ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {feedbackMode === "immediate" && isRevealed && (
            <div
              className={`mt-6 rounded-[1.25rem] p-5 text-sm leading-relaxed ${
                selected === question.correctIndex
                  ? "bg-[#e8f5e8] text-[#2f5f2f] dark:bg-[#16301a] dark:text-[#bbf7d0]"
                  : "bg-surface-soft text-muted"
              }`}
            >
              <p className="font-bold text-ink">
                {selected === question.correctIndex ? "Correct" : "Not quite"}
              </p>
              <p className="mt-1">{question.explanation}</p>
            </div>
          )}
        </article>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="inline-flex items-center gap-2 rounded-full bg-surface-soft px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex flex-wrap gap-2">
            {feedbackMode === "immediate" && !isRevealed && (
              <button
                type="button"
                onClick={revealCurrent}
                disabled={selected === null}
                className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright disabled:cursor-not-allowed disabled:opacity-40"
              >
                Check answer
              </button>
            )}
            {feedbackMode === "immediate" && isRevealed && (
              <button
                type="button"
                onClick={goNext}
                disabled={!canAdvanceImmediate}
                className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright"
              >
                {isLast ? "See results" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {feedbackMode === "end" && (
              <button
                type="button"
                onClick={goNext}
                disabled={!canAdvanceEnd}
                className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLast ? "Submit & review" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </QuizChrome>
  );
}
