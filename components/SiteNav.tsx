"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { href: "/quizzes", label: "Tracks" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#who", label: "Who it's for" },
  { href: "/#faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
];

export default function SiteNav({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const isLight = tone === "light";

  return (
    <header
      className={`relative z-50 ${
        open && isLight
          ? "bg-brand/95 backdrop-blur-md"
          : isLight
            ? ""
            : "border-b border-teal/10 bg-canvas/95 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="shrink-0">
          <Logo tone={isLight ? "light" : "dark"} />
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex xl:gap-7">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-sm font-semibold transition-colors ${
                isLight
                  ? "text-white/75 hover:text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle
            className={
              isLight
                ? "border-white/25 bg-white/10 text-white hover:border-white/40"
                : ""
            }
          />
          <Link
            href="/login"
            className={`hidden h-10 items-center text-sm font-bold transition-colors sm:inline-flex ${
              isLight ? "text-white/80 hover:text-white" : "text-muted hover:text-ink"
            }`}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={`hidden h-10 items-center gap-1.5 rounded-full px-5 text-sm font-bold transition-colors sm:inline-flex ${
              isLight
                ? "bg-leaf text-[#050505] hover:bg-leaf-bright"
                : "bg-brand text-white hover:bg-brand-hover"
            }`}
          >
            Sign up
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${
              isLight
                ? "border border-white/25 bg-white/10 text-white"
                : "border border-teal/15 bg-surface text-ink"
            }`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className={`lg:hidden ${
            isLight
              ? "bg-brand/95 backdrop-blur-md"
              : "border-t border-teal/10 bg-surface"
          }`}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold ${
                  isLight ? "text-white/85 hover:bg-white/10" : "text-ink hover:bg-leaf-soft"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={`mt-2 rounded-xl px-3 py-3 text-sm font-semibold ${
                isLight ? "text-white/85 hover:bg-white/10" : "text-ink hover:bg-leaf-soft"
              }`}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-leaf px-5 py-3 text-sm font-bold text-[#050505]"
            >
              Sign up
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
