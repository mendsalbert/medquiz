export type FeedbackMode = "immediate" | "end";

export type PracticeSettings = {
  questionsPerSession: number;
  feedbackMode: FeedbackMode;
};

export type AttemptRecord = {
  id: string;
  quizId: string;
  quizTitle: string;
  specialty: string;
  score: number;
  total: number;
  percent: number;
  feedbackMode: FeedbackMode;
  completedAt: string;
};

const SETTINGS_KEY = "medquiz.settings.v1";
const HISTORY_KEY = "medquiz.history.v1";

export const DEFAULT_SETTINGS: PracticeSettings = {
  questionsPerSession: 10,
  feedbackMode: "immediate",
};

export function loadSettings(): PracticeSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<PracticeSettings>;
    const questionsPerSession = Number(parsed.questionsPerSession);
    return {
      questionsPerSession:
        Number.isFinite(questionsPerSession) && questionsPerSession >= 1
          ? Math.min(50, Math.round(questionsPerSession))
          : DEFAULT_SETTINGS.questionsPerSession,
      feedbackMode:
        parsed.feedbackMode === "end" || parsed.feedbackMode === "immediate"
          ? parsed.feedbackMode
          : DEFAULT_SETTINGS.feedbackMode,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: PracticeSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("medquiz-settings"));
}

export function loadHistory(): AttemptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AttemptRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: Omit<AttemptRecord, "id" | "completedAt">) {
  if (typeof window === "undefined") return;
  const record: AttemptRecord = {
    ...attempt,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    completedAt: new Date().toISOString(),
  };
  const next = [record, ...loadHistory()].slice(0, 50);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("medquiz-history"));
  return record;
}

export function readinessFromHistory(history: AttemptRecord[]) {
  if (history.length === 0) {
    return { percent: 0, label: "Not started", attempts: 0, average: 0 };
  }
  const average = Math.round(
    history.reduce((sum, item) => sum + item.percent, 0) / history.length,
  );
  const recent = history.slice(0, 5);
  const recentAvg = Math.round(
    recent.reduce((sum, item) => sum + item.percent, 0) / recent.length,
  );
  let label = "Building";
  if (recentAvg >= 80) label = "Exam-ready";
  else if (recentAvg >= 65) label = "On track";
  else if (recentAvg >= 50) label = "Needs work";
  else label = "Keep drilling";
  return { percent: recentAvg, label, attempts: history.length, average };
}
