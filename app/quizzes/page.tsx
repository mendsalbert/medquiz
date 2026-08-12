import type { Metadata } from "next";
import QuizCatalog from "@/components/QuizCatalog";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { QUIZZES } from "@/lib/quizzes";

export const metadata: Metadata = {
  title: "Specialty tracks | MedQuiz",
  description:
    "Browse AfriMed-QA specialty quiz tracks by area of study, difficulty, and format.",
};

export default function QuizzesPage() {
  return (
    <div className="landing-theme landing-atmosphere min-h-screen font-sans text-ink">
      <SiteNav tone="dark" />

      <main>
        <QuizCatalog quizzes={QUIZZES} variant="marketing" />
      </main>

      <SiteFooter />
    </div>
  );
}
