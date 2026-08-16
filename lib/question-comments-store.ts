export type CommentCategory =
  | "wrong_answer"
  | "unclear_question"
  | "weak_explanation"
  | "outdated"
  | "image_issue"
  | "other";

export type QuestionComment = {
  id: string;
  questionId: string;
  quizId: string;
  quizTitle: string;
  specialty: string;
  promptSnippet: string;
  category: CommentCategory;
  body: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
};

export const COMMENT_CATEGORIES: {
  id: CommentCategory;
  label: string;
  hint: string;
}[] = [
  {
    id: "wrong_answer",
    label: "Wrong answer",
    hint: "Marked option or key looks incorrect",
  },
  {
    id: "unclear_question",
    label: "Unclear question",
    hint: "Wording is ambiguous or incomplete",
  },
  {
    id: "weak_explanation",
    label: "Weak explanation",
    hint: "Rationale needs fixing or more detail",
  },
  {
    id: "outdated",
    label: "Outdated",
    hint: "Guidance no longer matches current practice",
  },
  {
    id: "image_issue",
    label: "Image issue",
    hint: "Missing, wrong, or hard to read image",
  },
  {
    id: "other",
    label: "Other",
    hint: "Anything else that would improve the item",
  },
];

const COMMENTS_KEY = "medquiz.question-comments.v1";
const MAX_COMMENTS = 500;

export function commentCategoryLabel(category: CommentCategory) {
  return COMMENT_CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

export function loadComments(): QuestionComment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COMMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuestionComment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadCommentsForQuestion(questionId: string) {
  return loadComments().filter((item) => item.questionId === questionId);
}

export function saveComment(
  input: Omit<QuestionComment, "id" | "createdAt">,
): QuestionComment | null {
  if (typeof window === "undefined") return null;
  const body = input.body.trim();
  if (!body) return null;

  const record: QuestionComment = {
    ...input,
    body,
    authorName: input.authorName.trim(),
    authorEmail: input.authorEmail.trim(),
    promptSnippet: input.promptSnippet.trim().slice(0, 160),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const next = [record, ...loadComments()].slice(0, MAX_COMMENTS);
  window.localStorage.setItem(COMMENTS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("medquiz-comments"));
  return record;
}

export function deleteComment(id: string) {
  if (typeof window === "undefined") return;
  const next = loadComments().filter((item) => item.id !== id);
  window.localStorage.setItem(COMMENTS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("medquiz-comments"));
}

export function clearComments() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(COMMENTS_KEY);
  window.dispatchEvent(new Event("medquiz-comments"));
}

export function exportCommentsJson() {
  return JSON.stringify(loadComments(), null, 2);
}
