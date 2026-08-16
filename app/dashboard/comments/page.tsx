"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, MessageSquareText, Trash2 } from "lucide-react";
import {
  clearComments,
  commentCategoryLabel,
  deleteComment,
  exportCommentsJson,
  loadComments,
  type QuestionComment,
} from "@/lib/question-comments-store";

export default function CommentsPage() {
  const [comments, setComments] = useState<QuestionComment[]>([]);

  useEffect(() => {
    function refresh() {
      setComments(loadComments());
    }
    refresh();
    window.addEventListener("medquiz-comments", refresh);
    return () => window.removeEventListener("medquiz-comments", refresh);
  }, []);

  const bySpecialty = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of comments) {
      counts.set(item.specialty, (counts.get(item.specialty) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [comments]);

  function downloadExport() {
    const blob = new Blob([exportCommentsJson()], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `medquiz-question-comments-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
            Feedback
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Question comments
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Learner notes on unclear wording, wrong keys, and weak explanations —
            use these to revise the bank.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadExport}
            disabled={comments.length === 0}
            className="inline-flex items-center gap-2 rounded-full border border-teal/15 bg-surface px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-teal/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4 text-teal" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                comments.length > 0 &&
                window.confirm("Clear all comments saved on this device?")
              ) {
                clearComments();
              }
            }}
            disabled={comments.length === 0}
            className="inline-flex items-center gap-2 rounded-full border border-teal/15 bg-surface px-4 py-2.5 text-sm font-bold text-muted transition-colors hover:border-teal/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Clear all
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border border-teal/10 bg-surface px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-teal">
            Total
          </p>
          <p className="mt-1 font-display text-3xl font-medium text-ink">
            {comments.length}
          </p>
        </div>
        <div className="rounded-3xl border border-teal/10 bg-surface px-5 py-4 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wide text-teal">
            Top specialties
          </p>
          <p className="mt-2 text-sm font-semibold text-muted">
            {bySpecialty.length === 0
              ? "No comments yet"
              : bySpecialty
                  .slice(0, 4)
                  .map(([name, count]) => `${name} (${count})`)
                  .join(" · ")}
          </p>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="mt-10 rounded-[1.75rem] border border-teal/10 bg-surface px-6 py-12 text-center">
          <MessageSquareText className="mx-auto h-8 w-8 text-teal" />
          <p className="mt-4 font-semibold text-ink">No comments yet</p>
          <p className="mt-2 text-sm text-muted">
            After checking an answer, use “Comment on this question” to flag issues.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {comments.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.75rem] border border-teal/10 bg-surface p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-leaf-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-teal">
                      {commentCategoryLabel(item.category)}
                    </span>
                    <span className="rounded-full bg-surface-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                      {item.specialty}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">
                    {item.quizTitle}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.promptSnippet}
                    {item.promptSnippet.length >= 160 ? "…" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteComment(item.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-teal/15 px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:border-teal/30 hover:text-ink"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
              <p className="mt-4 rounded-2xl bg-teal-soft/50 px-4 py-3 text-sm leading-relaxed text-ink">
                {item.body}
              </p>
              <p className="mt-3 text-xs font-semibold text-muted">
                {item.authorName || "Anonymous"}
                {item.authorEmail ? ` · ${item.authorEmail}` : ""}
                {" · "}
                {new Date(item.createdAt).toLocaleString()}
                {" · "}
                <span className="font-mono text-[11px]">{item.questionId}</span>
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
