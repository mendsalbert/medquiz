"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Lightbulb, Layers3, UserRound } from "lucide-react";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type FeedbackMode,
  type PracticeSettings,
} from "@/lib/practice-store";
import {
  COUNTRIES,
  FOCUS_SPECIALTIES,
  STUDY_LEVELS,
  displayName,
  loadProfile,
  saveProfile,
  type StudyLevel,
  type UserProfile,
} from "@/lib/user-profile";

const SESSION_PRESETS = [5, 10, 15, 20, 25, 30];

const fieldClass =
  "mt-2 w-full rounded-xl border border-teal/15 bg-surface-soft px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-teal";

export default function SettingsPage() {
  const [settings, setSettings] = useState<PracticeSettings>(DEFAULT_SETTINGS);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState<"settings" | "profile" | null>(null);
  const [customCount, setCustomCount] = useState("");

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    setProfile(loadProfile());
    if (!SESSION_PRESETS.includes(loaded.questionsPerSession)) {
      setCustomCount(String(loaded.questionsPerSession));
    }
  }, []);

  function update(partial: Partial<PracticeSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
    setSaved("settings");
    window.setTimeout(() => setSaved(null), 1600);
  }

  function applyCustomCount() {
    const n = Number(customCount);
    if (!Number.isFinite(n) || n < 1) return;
    update({ questionsPerSession: Math.min(50, Math.round(n)) });
  }

  function saveProfileForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;
    const preferred =
      profile.preferredName.trim() ||
      displayName({ ...profile, preferredName: "" });
    const next: UserProfile = {
      ...profile,
      fullName: profile.fullName.trim(),
      preferredName: preferred,
      email: profile.email.trim(),
      school: profile.school.trim(),
      country: profile.country.trim(),
      onboardingComplete: true,
    };
    saveProfile(next);
    setProfile(next);
    setSaved("profile");
    window.setTimeout(() => setSaved(null), 1600);
  }

  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
        Settings
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        Profile & preferences
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        Update your name and school, then choose how many questions you want per session
        and when you see explanations.
      </p>

      {saved && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#e8f5e8] px-3 py-1.5 text-sm font-bold text-[#2f7a2f]">
          <Check className="h-4 w-4" />
          {saved === "profile" ? "Profile saved" : "Preferences saved"}
        </p>
      )}

      {profile && (
        <form
          onSubmit={saveProfileForm}
          className="mt-8 rounded-3xl border border-teal/10 bg-surface p-6 sm:p-7"
        >
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-teal" />
            <h2 className="font-display text-xl font-semibold text-ink">Your profile</h2>
          </div>
          <p className="mt-2 text-sm text-muted">
            This is what personalizes your dashboard greeting and sidebar.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-ink">Full name</span>
              <input
                type="text"
                required
                value={profile.fullName}
                onChange={(e) =>
                  setProfile((prev) =>
                    prev ? { ...prev, fullName: e.target.value } : prev,
                  )
                }
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-ink">Preferred name</span>
              <input
                type="text"
                value={profile.preferredName}
                onChange={(e) =>
                  setProfile((prev) =>
                    prev ? { ...prev, preferredName: e.target.value } : prev,
                  )
                }
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-ink">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) =>
                    prev ? { ...prev, email: e.target.value } : prev,
                  )
                }
                className={fieldClass}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-ink">School / institution</span>
              <input
                type="text"
                required
                value={profile.school}
                onChange={(e) =>
                  setProfile((prev) =>
                    prev ? { ...prev, school: e.target.value } : prev,
                  )
                }
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-ink">Country</span>
              <select
                value={profile.country}
                onChange={(e) =>
                  setProfile((prev) =>
                    prev ? { ...prev, country: e.target.value } : prev,
                  )
                }
                className={fieldClass}
              >
                <option value="" disabled>
                  Select country
                </option>
                {profile.country &&
                  !(COUNTRIES as readonly string[]).includes(profile.country) && (
                    <option value={profile.country}>{profile.country}</option>
                  )}
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-ink">Training stage</span>
              <select
                required
                value={profile.studyLevel}
                onChange={(e) =>
                  setProfile((prev) =>
                    prev
                      ? { ...prev, studyLevel: e.target.value as StudyLevel }
                      : prev,
                  )
                }
                className={fieldClass}
              >
                <option value="" disabled>
                  Select stage
                </option>
                {STUDY_LEVELS.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-bold text-ink">Focus specialty</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {FOCUS_SPECIALTIES.map((specialty) => {
                const active = profile.focusSpecialty === specialty;
                return (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() =>
                      setProfile((prev) =>
                        prev ? { ...prev, focusSpecialty: specialty } : prev,
                      )
                    }
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                      active
                        ? "bg-brand text-white"
                        : "border border-teal/15 bg-surface-soft text-ink hover:border-teal/40"
                    }`}
                  >
                    {specialty}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <button
            type="submit"
            className="mt-6 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-hover"
          >
            Save profile
          </button>
        </form>
      )}

      <section className="mt-5 rounded-3xl border border-teal/10 bg-surface p-6 sm:p-7">
        <div className="flex items-center gap-2">
          <Layers3 className="h-5 w-5 text-teal" />
          <h2 className="font-display text-xl font-semibold text-ink">
            Questions per session
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted">
          Pick a preset or enter your own count (1–50). Quizzes with fewer items will use
          the full bank.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {SESSION_PRESETS.map((n) => {
            const active = settings.questionsPerSession === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setCustomCount("");
                  update({ questionsPerSession: n });
                }}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  active
                    ? "bg-brand text-white"
                    : "border border-teal/15 bg-surface-soft text-ink hover:border-teal/40"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="text-sm font-bold text-ink">Custom count</span>
            <input
              type="number"
              min={1}
              max={50}
              value={customCount}
              onChange={(e) => setCustomCount(e.target.value)}
              placeholder="e.g. 12"
              className="mt-2 w-36 rounded-xl border border-teal/15 bg-surface-soft px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-teal"
            />
          </label>
          <button
            type="button"
            onClick={applyCustomCount}
            className="rounded-full border border-teal/15 bg-surface px-5 py-3 text-sm font-bold text-ink hover:border-teal/30"
          >
            Apply custom
          </button>
        </div>
        <p className="mt-4 text-sm font-semibold text-teal">
          Current: {settings.questionsPerSession} questions per session
        </p>
      </section>

      <section className="mt-5 rounded-3xl border border-teal/10 bg-surface p-6 sm:p-7">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-teal" />
          <h2 className="font-display text-xl font-semibold text-ink">
            Feedback style
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted">
          Learn live after each item, or sit the set like an exam and review everything
          at the end.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(
            [
              {
                id: "immediate" as FeedbackMode,
                title: "After each question",
                body: "Check the answer and explanation before moving on.",
              },
              {
                id: "end" as FeedbackMode,
                title: "All at once",
                body: "Answer the full set, then submit for score and rationales.",
              },
            ] as const
          ).map((mode) => {
            const active = settings.feedbackMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => update({ feedbackMode: mode.id })}
                className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                  active
                    ? "border-teal bg-teal-soft shadow-[0_8px_24px_-16px_rgba(13,110,110,0.55)]"
                    : "border-teal/15 bg-surface-soft hover:border-teal/30"
                }`}
              >
                <p className="font-semibold text-ink">{mode.title}</p>
                <p className="mt-1 text-sm text-muted">{mode.body}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
