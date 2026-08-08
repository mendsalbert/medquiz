"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ImageIcon,
  ListChecks,
  Settings,
  XCircle,
} from "lucide-react";
import ExpandableImage from "@/components/ExpandableImage";
import Logo from "@/components/Logo";
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

export default function QuizPlayer({ quiz }: { quiz: Quiz }) {
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
      <div className="landing-atmosphere min-h-screen font-sans text-ink">
        <header className="border-b border-teal/10 bg-canvas/95 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:px-8">
            <Logo />
            <Link
              href="/dashboard/quizzes"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Quizzes
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
            {quiz.specialty}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">
            {quiz.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            {quiz.description}
          </p>

          <div className="mt-8 rounded-3xl border border-teal/10 bg-surface p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">
                  Session from your settings
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Change length and feedback anytime in dashboard settings.
                </p>
              </div>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-full border border-teal/15 bg-surface-soft px-4 py-2 text-sm font-bold text-ink hover:border-teal/30"
              >
                <Settings className="h-4 w-4 text-teal" />
                Edit settings
              </Link>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-surface-soft px-4 py-4">
                <dt className="text-xs font-bold uppercase tracking-wide text-[#8a9099]">
                  Questions
                </dt>
                <dd className="mt-1 font-display text-3xl font-semibold text-ink">
                  {sessionSize}
                </dd>
              </div>
              <div className="rounded-2xl bg-surface-soft px-4 py-4">
                <dt className="text-xs font-bold uppercase tracking-wide text-[#8a9099]">
                  Feedback
                </dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {settings?.feedbackMode === "end"
                    ? "All at once"
                    : "After each question"}
                </dd>
              </div>
              <div className="rounded-2xl bg-surface-soft px-4 py-4">
                <dt className="text-xs font-bold uppercase tracking-wide text-[#8a9099]">
                  Bank size
                </dt>
                <dd className="mt-1 font-display text-3xl font-semibold text-ink">
                  {quiz.questionCount}
                </dd>
              </div>
            </dl>
          </div>

          <button
            type="button"
            onClick={startSession}
            disabled={!settings}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-50 sm:w-auto"
          >
            Start {sessionSize}-question session
            <ArrowRight className="h-4 w-4" />
          </button>
        </main>
      </div>
    );
  }

  if (phase === "results") {
    const percent = Math.round((score / sessionQuestions.length) * 100);
    return (
      <div className="landing-atmosphere min-h-screen font-sans text-ink">
        <header className="border-b border-teal/10 bg-canvas/95 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:px-8">
            <Logo />
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-muted hover:text-ink"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="afri-dark overflow-hidden rounded-4xl p-8 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-bright">
              Quiz complete
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
              {quiz.title}
            </h1>
            <p className="mt-2 text-sm text-white/60">
              {sessionQuestions.length} questions ·{" "}
              {feedbackMode === "immediate" ? "Immediate feedback" : "End review"}
            </p>
            <p className="mt-6 font-display text-6xl font-medium text-leaf-bright">
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
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {sessionQuestions.map((q, i) => {
              const chosen = answers[i];
              const correct = chosen === q.correctIndex;
              return (
                <article
                  key={q.id}
                  className="animate-slide-in rounded-3xl border border-teal/10 bg-surface p-6"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start gap-3">
                    {correct ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4f9f42]" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#9b1c1c]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#8a9099]">
                        Question {i + 1}
                      </p>
                      <h2 className="mt-1 font-display text-xl font-semibold text-ink">
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
                      <p className="mt-3 rounded-2xl bg-surface-soft p-4 text-sm leading-relaxed text-muted">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  const canAdvanceImmediate = isRevealed;
  const canAdvanceEnd = selected !== null;
  const isLast = index === sessionQuestions.length - 1;

  return (
    <div className="landing-atmosphere min-h-screen font-sans text-ink">
      <header className="border-b border-teal/10 bg-canvas/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <Link
            href="/dashboard/quizzes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 text-sm font-semibold text-muted">
            <span className="inline-flex items-center gap-2">
              {quiz.specialty}
              {question.imageUrl && (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-soft px-2 py-0.5 text-xs font-bold text-teal">
                  <ImageIcon className="h-3 w-3" />
                  Image
                </span>
              )}
            </span>
            <span>
              {index + 1} / {sessionQuestions.length}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-soft">
            <div
              className="h-full rounded-full bg-teal transition-all duration-300"
              style={{
                width: `${((index + 1) / sessionQuestions.length) * 100}%`,
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[#8a9099]">
            <span>{answeredCount} answered</span>
            <span className="inline-flex items-center gap-1">
              <ListChecks className="h-3.5 w-3.5" />
              {feedbackMode === "immediate" ? "Feedback each Q" : "Review at end"}
            </span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
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
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i === index
                    ? "bg-brand text-white"
                    : state === "correct"
                      ? "bg-[#e8f5e8] text-[#2f7a2f]"
                      : state === "wrong"
                        ? "bg-[#fde8e8] text-[#9b1c1c]"
                        : state === "answered"
                          ? "bg-teal-soft text-teal"
                          : "bg-surface text-[#8a9099] ring-1 ring-black/8"
                }`}
                aria-label={`Go to question ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <article className="rounded-4xl border border-teal/10 bg-surface p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
            {quiz.title}
          </p>
          <h1 className="mt-3 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
            {question.prompt}
          </h1>

          {question.imageUrl && (
            <div className="mt-6">
              <ExpandableImage
                src={question.imageUrl}
                alt={question.imageAlt ?? "Clinical diagram for this question"}
              />
            </div>
          )}

          <div className="mt-8 space-y-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const showFeedback = feedbackMode === "immediate" && isRevealed;
              const isCorrect = optionIndex === question.correctIndex;
              let optionClass =
                "border-teal/15 bg-surface-soft hover:border-teal/30";
              if (showFeedback && isCorrect) {
                optionClass = "border-[#4f9f42] bg-[#e8f5e8]";
              } else if (showFeedback && isSelected && !isCorrect) {
                optionClass = "border-[#9b1c1c] bg-[#fde8e8]";
              } else if (isSelected) {
                optionClass =
                  "border-teal bg-teal-soft shadow-[0_8px_24px_-16px_rgba(13,110,110,0.55)]";
              }

              return (
                <button
                  key={`${question.id}-${optionIndex}`}
                  type="button"
                  onClick={() => selectOption(optionIndex)}
                  disabled={feedbackMode === "immediate" && isRevealed}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition-all disabled:cursor-default ${optionClass}`}
                >
                  {showFeedback && isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4f9f42]" />
                  ) : showFeedback && isSelected ? (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#9b1c1c]" />
                  ) : isSelected ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-[#c9c4b8]" />
                  )}
                  <span className="text-base font-semibold text-ink">{option}</span>
                </button>
              );
            })}
          </div>

          {feedbackMode === "immediate" && isRevealed && (
            <div
              className={`mt-6 rounded-2xl p-4 text-sm leading-relaxed ${
                selected === question.correctIndex
                  ? "bg-[#e8f5e8] text-[#2f5f2f]"
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
            className="inline-flex items-center gap-2 rounded-full border border-teal/15 bg-surface px-5 py-3 text-sm font-bold text-ink transition-colors hover:border-teal/30 disabled:cursor-not-allowed disabled:opacity-40"
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
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Check answer
              </button>
            )}
            {feedbackMode === "immediate" && isRevealed && (
              <button
                type="button"
                onClick={goNext}
                disabled={!canAdvanceImmediate}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
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
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLast ? "Submit & review" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
