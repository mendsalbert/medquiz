"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { TEST_ACCOUNTS, TEST_PASSWORD, loginAsTestAccount } from "@/lib/auth";

export default function TestLogins() {
  const router = useRouter();
  const [busyEmail, setBusyEmail] = useState<string | null>(null);
  const [error, setError] = useState("");

  function useAccount(email: string) {
    setError("");
    setBusyEmail(email);
    const result = loginAsTestAccount(email);
    if (!result.ok) {
      setError(result.error);
      setBusyEmail(null);
      return;
    }
    window.setTimeout(() => {
      router.push(result.destination);
    }, 200);
  }

  return (
    <div className="mt-8 rounded-2xl border border-teal/15 bg-surface-soft p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">
        Test logins
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        Shared demo password for all three accounts:{" "}
        <span className="font-bold text-ink">{TEST_PASSWORD}</span>
      </p>

      <ul className="mt-4 space-y-2">
        {TEST_ACCOUNTS.map((account) => (
          <li key={account.email}>
            <button
              type="button"
              onClick={() => useAccount(account.email)}
              disabled={busyEmail !== null}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-teal/10 bg-surface px-3.5 py-3 text-left transition-colors hover:border-teal/30 disabled:opacity-60"
            >
              <span>
                <span className="block text-sm font-bold text-ink">
                  {account.profile.preferredName} · {account.role}
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-muted">
                  {account.email}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-teal">
                {busyEmail === account.email ? "Opening…" : "Use"}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {error ? (
        <p className="mt-3 text-sm font-semibold text-[#9b1c1c]">{error}</p>
      ) : null}
    </div>
  );
}
