import QuizCatalog from "@/components/QuizCatalog";
import { QUIZZES } from "@/lib/quizzes";

export default function DashboardQuizzesPage() {
  return <QuizCatalog quizzes={QUIZZES} variant="dashboard" />;
}
