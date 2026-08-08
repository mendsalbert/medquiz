import { QUIZZES as BANK } from "./quiz-bank";
import type { Quiz } from "./quiz-types";

export type { Question, Quiz } from "./quiz-types";

export const QUIZZES: Quiz[] = BANK;

export function getQuiz(id: string): Quiz | undefined {
  return QUIZZES.find((q) => q.id === id);
}

export function quizHasImages(quiz: Quiz): boolean {
  return quiz.questions.some((q) => Boolean(q.imageUrl));
}
