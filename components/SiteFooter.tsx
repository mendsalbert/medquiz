import Link from "next/link";
import Logo from "@/components/Logo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-teal/10 bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Clinical MCQ practice for trainees and clinicians. Specialty drills with
            clear rationales.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-ink">Product</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link href="/login" className="transition-colors hover:text-teal">
              Log in
            </Link>
            <Link href="/signup" className="transition-colors hover:text-teal">
              Sign up
            </Link>
            <Link href="/#tracks" className="transition-colors hover:text-teal">
              Demo tracks
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-teal">
              Pricing
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-ink">Learn more</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link href="/#how-it-works" className="transition-colors hover:text-teal">
              How it works
            </Link>
            <Link href="/#who" className="transition-colors hover:text-teal">
              Who it&apos;s for
            </Link>
            <Link href="/#faq" className="transition-colors hover:text-teal">
              FAQ
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-teal/10 bg-teal-soft/40">
        <div className="mx-auto max-w-6xl px-5 py-5 text-sm text-muted sm:px-8">
          © {new Date().getFullYear()} MedQuiz · Clinical practice
        </div>
      </div>
    </footer>
  );
}
