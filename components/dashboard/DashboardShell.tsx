"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  History,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import ProfileAvatar from "@/components/ProfileAvatar";
import ThemeToggle from "@/components/ThemeToggle";
import {
  clearProfile,
  displayName,
  isOnboardingComplete,
  loadProfile,
  type UserProfile,
} from "@/lib/user-profile";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/quizzes", label: "Quizzes", icon: BookOpen },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    function refresh() {
      const next = loadProfile();
      if (!isOnboardingComplete(next)) {
        router.replace("/onboarding");
        return;
      }
      setProfile(next);
    }
    refresh();
    window.addEventListener("medquiz-profile", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("medquiz-profile", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [router]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function logout() {
    clearProfile();
    setOpen(false);
    router.push("/login");
  }

  const name = profile ? displayName(profile) : "";
  const initials = name
    ? name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "MQ";

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-teal-soft text-teal"
                : "text-muted hover:bg-leaf-soft hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
      <div className="mt-auto space-y-3 border-t border-teal/10 pt-4">
        {profile && (
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="block rounded-2xl bg-leaf-soft px-3 py-3 transition-colors hover:bg-teal-soft"
          >
            <div className="flex items-center gap-3">
              <ProfileAvatar
                src={profile.avatarData}
                initials={initials}
                size="md"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{name}</p>
                <p className="truncate text-xs text-muted">
                  {profile.school || "Medical learner"}
                </p>
              </div>
            </div>
          </Link>
        )}
        <button
          type="button"
          onClick={logout}
          className="inline-flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-leaf-soft hover:text-ink"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </nav>
  );

  if (!profile) {
    return (
      <div className="landing-atmosphere flex min-h-screen items-center justify-center font-sans text-ink">
        <p className="text-sm font-semibold text-muted">Opening your workspace…</p>
      </div>
    );
  }

  return (
    <div className="landing-theme landing-atmosphere min-h-screen font-sans text-ink lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-teal/10 bg-surface/90 backdrop-blur-sm lg:flex">
        <div className="flex h-16 items-center border-b border-teal/10 px-5">
          <Logo href="/dashboard" />
        </div>
        {nav}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-teal/10 bg-canvas/90 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal/15 bg-surface text-ink lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <Logo href="/dashboard" />
          </div>
          <p className="hidden min-w-0 flex-1 truncate text-sm font-semibold text-muted lg:block">
            {name ? `${name}'s practice workspace` : "Practice workspace"}
          </p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 rounded-full border border-teal/15 bg-surface px-2.5 py-1.5 text-xs font-bold text-ink hover:border-teal/30 sm:px-3 sm:py-2"
            >
              <ProfileAvatar
                src={profile.avatarData}
                initials={initials}
                size="sm"
              />
              <span className="hidden sm:inline">{name || "Settings"}</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              aria-label="Log out"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-teal/15 bg-surface px-3 text-xs font-bold text-ink transition-colors hover:border-teal/30 sm:px-4"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-brand/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-surface shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-teal/10 px-5">
              <Logo href="/dashboard" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-teal/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </div>
  );
}
