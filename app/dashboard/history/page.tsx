"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { loadHistory, type AttemptRecord } from "@/lib/practice-store";

export default function HistoryPage() {
  const [history, setHistory] = useState<AttemptRecord[]>([]);

  useEffect(() => {
    function refresh() {
      setHistory(loadHistory());
    }
    refresh();
    window.addEventListener("medquiz-history", refresh);
    return () => window.removeEventListener("medquiz-history", refresh);
  }, []);

  return (
    <div>
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
          History
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Previous tests
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Scores from completed sessions on this device. Clear browser storage to reset.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-teal/10 bg-surface px-6 py-12 text-center">
          <p className="font-semibold text-ink">No completed quizzes yet</p>
          <p className="mt-2 text-sm text-muted">
            Finish a session and it will appear here with your percentage score.
          </p>
          <Link
            href="/dashboard/quizzes"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white"
          >
            Browse quizzes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-3xl border border-teal/10 bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-teal/10 bg-surface-soft text-xs font-bold uppercase tracking-wide text-[#8a9099]">
              <tr>
                <th className="px-5 py-3 font-bold">Quiz</th>
                <th className="hidden px-5 py-3 font-bold sm:table-cell">Score</th>
                <th className="px-5 py-3 font-bold">%</th>
                <th className="hidden px-5 py-3 font-bold md:table-cell">When</th>
                <th className="px-5 py-3 font-bold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {history.map((item) => (
                <tr key={item.id} className="align-middle">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{item.quizTitle}</p>
                    <p className="text-muted">{item.specialty}</p>
                  </td>
                  <td className="hidden px-5 py-4 font-semibold text-muted sm:table-cell">
                    {item.score}/{item.total}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        item.percent >= 70
                          ? "bg-[#e8f5e8] text-[#2f7a2f]"
                          : item.percent >= 50
                            ? "bg-[#fff4e5] text-[#9a5b00]"
                            : "bg-[#fde8e8] text-[#9b1c1c]"
                      }`}
                    >
                      {item.percent}%
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-muted md:table-cell">
                    {new Date(item.completedAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/quiz/${item.quizId}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-teal hover:underline"
                    >
                      Retry
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
