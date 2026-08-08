import { notFound } from "next/navigation";
import QuizPlayer from "@/components/QuizPlayer";
import { getQuiz, QUIZZES } from "@/lib/quizzes";

export function generateStaticParams() {
  return QUIZZES.map((quiz) => ({ id: quiz.id }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quiz = getQuiz(id);
  if (!quiz) notFound();
  return <QuizPlayer quiz={quiz} />;
}
