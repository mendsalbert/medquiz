"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  Clock3,
} from "lucide-react";
import ProfileAvatar from "@/components/ProfileAvatar";
import {
  loadHistory,
  readinessFromHistory,
  type AttemptRecord,
} from "@/lib/practice-store";
import { QUIZZES } from "@/lib/quizzes";
import {
  displayName,
  loadProfile,
  studyLevelLabel,
  type UserProfile,
} from "@/lib/user-profile";

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [history, setHistory] = useState<AttemptRecord[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    function refreshHistory() {
      setHistory(loadHistory());
    }
    function refreshProfile() {
      setProfile(loadProfile());
    }
    refreshHistory();
    refreshProfile();
    function onStorage() {
      refreshHistory();
      refreshProfile();
    }
    window.addEventListener("medquiz-history", refreshHistory);
    window.addEventListener("medquiz-profile", refreshProfile);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("medquiz-history", refreshHistory);
      window.removeEventListener("medquiz-profile", refreshProfile);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const readiness = readinessFromHistory(history);
  const recent = history.slice(0, 6);
  const totalQuestions = QUIZZES.reduce((n, q) => n + q.questionCount, 0);
  const name = profile ? displayName(profile) : "";
  const initials = name
    ? name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "MQ";
  const hour = new Date().getHours();
  const greeting = greetingForHour(hour);
  const focusQuiz = profile?.focusSpecialty
    ? QUIZZES.find(
        (q) =>
          q.specialty === profile.focusSpecialty ||
          q.title === profile.focusSpecialty,
      )
    : undefined;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          {profile && (
            <ProfileAvatar
              src={profile.avatarData}
              initials={initials}
              size="lg"
              className="mt-1 hidden sm:inline-flex"
            />
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
              Overview
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              {name ? `${greeting}, ${name}` : "Your practice hub"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
              {profile?.school ? (
                <>
                  Practicing from{" "}
                  <span className="font-semibold text-ink">{profile.school}</span>
                  {profile.studyLevel
                    ? ` · ${studyLevelLabel(profile.studyLevel)}`
                    : ""}
                  {profile.focusSpecialty
                    ? ` · focused on ${profile.focusSpecialty}`
                    : ""}
                  .
                </>
              ) : (
                <>
                  Track readiness, revisit past sessions, and jump into specialty quizzes
                  sourced from AfriMedEval.
                </>
              )}
            </p>
          </div>
        </div>
        <Link
          href={focusQuiz ? `/quiz/${focusQuiz.id}` : "/dashboard/quizzes"}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-hover"
        >
          {focusQuiz ? `Practice ${focusQuiz.specialty}` : "Browse quizzes"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {(profile?.school || profile?.focusSpecialty) && (
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-teal/10 bg-surface px-5 py-4">
          <ProfileAvatar
            src={profile?.avatarData}
            initials={initials}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">
              {profile?.fullName || name}
            </p>
            <p className="truncate text-sm text-muted">
              {[profile?.school, profile?.country, profile?.email]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <Link
            href="/dashboard/settings"
            className="text-sm font-bold text-teal hover:underline"
          >
            Edit profile
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Target}
          label="Readiness"
          value={`${readiness.percent}%`}
          detail={readiness.label}
        />
        <StatCard
          icon={TrendingUp}
          label="Average score"
          value={history.length ? `${readiness.average}%` : "—"}
          detail={`${readiness.attempts} sessions logged`}
        />
        <StatCard
          icon={BookOpen}
          label="Question bank"
          value={String(totalQuestions)}
          detail={`${QUIZZES.length} specialty tracks`}
        />
        <StatCard
          icon={Clock3}
          label="Last practice"
          value={
            recent[0]
              ? new Date(recent[0].completedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : "—"
          }
          detail={recent[0] ? recent[0].quizTitle : "No sessions yet"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-teal/10 bg-surface p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Recent sessions
            </h2>
            <Link
              href="/dashboard/history"
              className="text-sm font-bold text-teal hover:underline"
            >
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-surface-soft px-5 py-8 text-center">
              <p className="font-semibold text-ink">
                {name ? `${name}, ready when you are` : "No quizzes taken yet"}
              </p>
              <p className="mt-2 text-sm text-muted">
                Start a specialty track. Your scores and readiness will show up here.
              </p>
              <Link
                href="/dashboard/quizzes"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white"
              >
                Start practicing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-black/6">
              {recent.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{item.quizTitle}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {item.specialty} · {item.score}/{item.total} ·{" "}
                      {new Date(item.completedAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      item.percent >= 70
                        ? "bg-[#e8f5e8] text-[#2f7a2f]"
                        : item.percent >= 50
                          ? "bg-[#fff4e5] text-[#9a5b00]"
                          : "bg-[#fde8e8] text-[#9b1c1c]"
                    }`}
                  >
                    {item.percent}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-teal/10 bg-brand p-6 text-white sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-bright">
            Readiness pulse
          </p>
          <p className="mt-4 font-display text-6xl font-medium text-leaf-bright">
            {readiness.percent}%
          </p>
          <p className="mt-2 text-lg text-white/75">{readiness.label}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            {name
              ? `Based on ${name}'s last ${Math.min(5, Math.max(1, history.length))} sessions. `
              : `Based on your last ${Math.min(5, Math.max(1, history.length))} sessions. `}
            Set your preferred session length in Settings, then keep a steady practice
            rhythm.
          </p>
          <Link
            href="/dashboard/settings"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-bold text-[#050505] hover:bg-leaf-bright"
          >
            Adjust settings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-teal/10 bg-surface p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-soft">
          <Icon className="h-4 w-4 text-teal" />
        </span>
        {label}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}
