"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import {
  COUNTRIES,
  EMPTY_PROFILE,
  FOCUS_SPECIALTIES,
  STUDY_LEVELS,
  displayName,
  isOnboardingComplete,
  loadProfile,
  saveProfile,
  type StudyLevel,
  type UserProfile,
} from "@/lib/user-profile";

const fieldClass =
  "mt-2 w-full rounded-xl border border-teal/15 bg-surface px-4 py-3.5 text-[15px] font-medium text-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#8a9aa0] focus:border-teal focus:shadow-[0_0_0_3px_rgba(14,116,144,0.14)]";

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<UserProfile>({ ...EMPTY_PROFILE });

  useEffect(() => {
    const existing = loadProfile();
    if (isOnboardingComplete(existing)) {
      router.replace("/dashboard");
      return;
    }
    setForm(existing);
    setReady(true);
  }, [router]);

  function patch(partial: Partial<UserProfile>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function goNext() {
    if (step === 0) {
      if (!form.fullName.trim()) return;
      if (!form.preferredName.trim()) {
        patch({ preferredName: displayName({ ...form, preferredName: "" }) });
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!form.school.trim() || !form.studyLevel) return;
      setStep(2);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.school.trim() || !form.studyLevel) {
      setStep(form.fullName.trim() ? (form.school.trim() && form.studyLevel ? 2 : 1) : 0);
      return;
    }
    setSubmitting(true);
    const preferred =
      form.preferredName.trim() ||
      displayName({ ...form, preferredName: "" });
    saveProfile({
      ...form,
      fullName: form.fullName.trim(),
      preferredName: preferred,
      email: form.email.trim(),
      school: form.school.trim(),
      country: form.country.trim(),
      focusSpecialty: form.focusSpecialty.trim(),
      onboardingComplete: true,
    });
    window.setTimeout(() => {
      router.push("/dashboard");
    }, 280);
  }

  const steps = ["You", "School", "Focus"];

  if (!ready) {
    return (
      <div className="rounded-2xl border border-teal/10 bg-surface px-4 py-8 text-center text-sm font-semibold text-muted">
        Loading your profile…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2">
        {steps.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-teal text-white"
                    : active
                      ? "bg-brand text-white"
                      : "bg-black/6 text-[#8a9099]"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={`hidden text-xs font-bold sm:inline ${
                  active ? "text-ink" : "text-[#8a9099]"
                }`}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`h-px flex-1 ${done || active ? "bg-teal/40" : "bg-black/8"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {step === 0 && (
        <div className="space-y-4 animate-[slide-in_0.25s_ease-out]">
          <label className="block">
            <span className="text-sm font-bold text-ink">Full name</span>
            <input
              name="fullName"
              type="text"
              required
              autoComplete="name"
              value={form.fullName}
              onChange={(e) => patch({ fullName: e.target.value })}
              placeholder="Ama Mensah"
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-ink">What should we call you?</span>
            <input
              name="preferredName"
              type="text"
              autoComplete="nickname"
              value={form.preferredName}
              onChange={(e) => patch({ preferredName: e.target.value })}
              placeholder="Ama"
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-ink">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => patch({ email: e.target.value })}
              placeholder="you@school.edu.gh"
              className={fieldClass}
            />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-[slide-in_0.25s_ease-out]">
          <label className="block">
            <span className="text-sm font-bold text-ink">Medical school / institution</span>
            <input
              name="school"
              type="text"
              required
              value={form.school}
              onChange={(e) => patch({ school: e.target.value })}
              placeholder="University of Ghana Medical School"
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-ink">Country</span>
            <select
              name="country"
              autoComplete="country-name"
              value={form.country}
              onChange={(e) => patch({ country: e.target.value })}
              className={fieldClass}
            >
              <option value="" disabled>
                Select country
              </option>
              {form.country &&
                !(COUNTRIES as readonly string[]).includes(form.country) && (
                  <option value={form.country}>{form.country}</option>
                )}
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="text-sm font-bold text-ink">Where are you in training?</legend>
            <div className="mt-3 grid gap-2">
              {STUDY_LEVELS.map((level) => {
                const active = form.studyLevel === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => patch({ studyLevel: level.id as StudyLevel })}
                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                      active
                        ? "border-teal bg-teal-soft shadow-[0_8px_24px_-16px_rgba(13,110,110,0.55)]"
                        : "border-teal/15 bg-surface hover:border-teal/30"
                    }`}
                  >
                    <p className="text-sm font-bold text-ink">{level.label}</p>
                    <p className="mt-0.5 text-xs text-muted">{level.hint}</p>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-[slide-in_0.25s_ease-out]">
          <fieldset>
            <legend className="text-sm font-bold text-ink">
              Primary focus right now
            </legend>
            <p className="mt-1 text-sm text-muted">
              We&apos;ll highlight this on your dashboard. You can change it later.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FOCUS_SPECIALTIES.map((specialty) => {
                const active = form.focusSpecialty === specialty;
                return (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => patch({ focusSpecialty: specialty })}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                      active
                        ? "bg-brand text-white"
                        : "border border-teal/15 bg-surface text-ink hover:border-teal/40"
                    }`}
                  >
                    {specialty}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="rounded-2xl border border-teal/10 bg-surface-soft px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">
              Your profile
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              {displayName(form) || "Learner"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {[form.school, form.country].filter(Boolean).join(" · ") ||
                "School details coming up"}
            </p>
            {form.focusSpecialty && (
              <p className="mt-2 text-sm font-semibold text-teal">
                Focus: {form.focusSpecialty}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-1">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-teal/15 bg-surface px-5 py-3.5 text-sm font-bold text-ink hover:border-teal/30 sm:flex-none"
          >
            Back
          </button>
        )}
        {step < 2 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3.5 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright sm:flex-none sm:min-w-[160px]"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-leaf px-5 py-3.5 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright disabled:opacity-60 sm:flex-none sm:min-w-[200px]"
          >
            {submitting ? "Opening dashboard…" : "Go to dashboard"}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
