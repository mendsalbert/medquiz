export type Question = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type Quiz = {
  id: string;
  title: string;
  specialty: string;
  difficulty: "Foundation" | "Intermediate" | "Advanced";
  description: string;
  questionCount: number;
  estimatedMinutes: number;
  questions: Question[];
};
