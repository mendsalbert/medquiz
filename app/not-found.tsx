import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="landing-atmosphere flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo />
      <h1 className="mt-8 font-display text-4xl font-medium text-ink">
        Quiz not found
      </h1>
      <p className="mt-3 text-muted">That specialty track is not in the MVP yet.</p>
      <Link
        href="/quizzes"
        className="mt-8 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white"
      >
        Back to quizzes
      </Link>
    </div>
  );
}
