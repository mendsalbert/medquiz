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

/** Sentence-case an option without changing the rest of the wording. */
export function formatOption(text: string): string {
  const match = /^(\s*)(.*)$/.exec(text);
  if (!match) return text;
  const [, leading, rest] = match;
  if (!rest) return text;
  return leading + rest.charAt(0).toUpperCase() + rest.slice(1);
}
