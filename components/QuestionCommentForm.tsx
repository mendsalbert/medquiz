"use client";

import { useEffect, useState } from "react";
import { Check, MessageSquarePlus } from "lucide-react";
import {
  COMMENT_CATEGORIES,
  loadCommentsForQuestion,
  saveComment,
  type CommentCategory,
} from "@/lib/question-comments-store";
import { displayName, loadProfile } from "@/lib/user-profile";

type Props = {
  questionId: string;
  quizId: string;
  quizTitle: string;
  specialty: string;
  prompt: string;
  compact?: boolean;
};

export default function QuestionCommentForm({
  questionId,
  quizId,
  quizTitle,
  specialty,
  prompt,
  compact = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<CommentCategory>("wrong_answer");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);
  const [existingCount, setExistingCount] = useState(0);

  useEffect(() => {
    function refresh() {
      setExistingCount(loadCommentsForQuestion(questionId).length);
    }
    refresh();
    window.addEventListener("medquiz-comments", refresh);
    return () => window.removeEventListener("medquiz-comments", refresh);
  }, [questionId]);

  useEffect(() => {
    setOpen(false);
    setBody("");
    setSaved(false);
    setCategory("wrong_answer");
  }, [questionId]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const profile = loadProfile();
    const record = saveComment({
      questionId,
      quizId,
      quizTitle,
      specialty,
      promptSnippet: prompt,
      category,
      body,
      authorName: displayName(profile) || profile.fullName,
      authorEmail: profile.email,
    });
    if (!record) return;
    setBody("");
    setSaved(true);
    setOpen(false);
  }

  if (saved && !open) {
    return (
      <div
        className={`flex items-center gap-2 rounded-2xl bg-teal-soft/70 px-4 py-3 text-sm font-semibold text-teal ${
          compact ? "mt-4" : "mt-5"
        }`}
      >
        <Check className="h-4 w-4 shrink-0" />
        Thanks — your comment will help improve this question.
        <button
          type="button"
          onClick={() => {
            setSaved(false);
            setOpen(true);
          }}
          className="ml-auto text-xs font-bold uppercase tracking-wide text-ink underline-offset-2 hover:underline"
        >
          Add another
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className={compact ? "mt-4" : "mt-5"}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-teal/15 bg-surface-soft px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-teal/30 hover:bg-surface"
        >
          <MessageSquarePlus className="h-4 w-4 text-teal" />
          Comment on this question
          {existingCount > 0 ? (
            <span className="rounded-full bg-teal-soft px-2 py-0.5 text-[11px] font-bold text-teal">
              {existingCount}
            </span>
          ) : null}
        </button>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Flag errors or unclear wording so we can improve the bank.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-[1.25rem] border border-teal/15 bg-surface-soft/80 p-4 sm:p-5 ${
        compact ? "mt-4" : "mt-5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">Improve this question</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Comments stay on this device for now and help us revise answers and explanations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-bold uppercase tracking-wide text-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>

      <fieldset className="mt-4">
        <legend className="text-xs font-bold uppercase tracking-wide text-muted">
          What needs work?
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {COMMENT_CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={item.hint}
                onClick={() => setCategory(item.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  active
                    ? "bg-leaf text-[#050505]"
                    : "bg-surface text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-4 block">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">
          Your comment
        </span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={compact ? 3 : 4}
          required
          maxLength={2000}
          placeholder="Describe the issue or suggested fix…"
          className="mt-2 w-full resize-y rounded-2xl border border-teal/15 bg-surface px-4 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/70 focus:border-teal/40"
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">{body.length}/2000</p>
        <button
          type="submit"
          disabled={!body.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-2.5 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit comment
        </button>
      </div>
    </form>
  );
}
