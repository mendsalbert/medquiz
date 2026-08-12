import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Baby,
  Brain,
  Scan,
  Scissors,
  Stethoscope,
} from "lucide-react";
import type { Quiz } from "./quiz-types";
import { quizHasImages } from "./quizzes";

export type StudyAreaId =
  | "internal-medicine"
  | "surgery"
  | "womens-child-health"
  | "neuro-psychiatry"
  | "diagnostics-imaging"
  | "emergency-primary";

export type QuizFormat = "mcq" | "clinical-images";
export type QuizDifficulty = Quiz["difficulty"];
export type SortOption = "recommended" | "name" | "questions";

export type StudyArea = {
  id: StudyAreaId;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type CatalogQuiz = Quiz & {
  studyArea: StudyAreaId;
  format: QuizFormat;
  hasImages: boolean;
};

export const STUDY_AREAS: StudyArea[] = [
  {
    id: "internal-medicine",
    label: "Internal Medicine",
    description: "Core medical subspecialties, ID, oncology, and organ systems.",
    icon: Stethoscope,
  },
  {
    id: "surgery",
    label: "Surgery & Anaesthesia",
    description: "Operative specialties, trauma contexts, and perioperative care.",
    icon: Scissors,
  },
  {
    id: "womens-child-health",
    label: "Women's & Child Health",
    description: "Obstetrics, gynaecology, and paediatric clinical practice.",
    icon: Baby,
  },
  {
    id: "neuro-psychiatry",
    label: "Neurosciences & Psychiatry",
    description: "Neurology, mental health, and behavioural medicine.",
    icon: Brain,
  },
  {
    id: "diagnostics-imaging",
    label: "Diagnostics & Imaging",
    description: "Pathology, radiology, dermatology, and visual diagnosis.",
    icon: Scan,
  },
  {
    id: "emergency-primary",
    label: "Emergency & Primary Care",
    description: "Acute care, family medicine, and mixed general practice.",
    icon: Activity,
  },
];

const SPECIALTY_TO_AREA: Record<string, StudyAreaId> = {
  "Internal Medicine": "internal-medicine",
  Cardiology: "internal-medicine",
  Endocrinology: "internal-medicine",
  Gastroenterology: "internal-medicine",
  "Pulmonary Medicine": "internal-medicine",
  Rheumatology: "internal-medicine",
  Nephrology: "internal-medicine",
  Haematology: "internal-medicine",
  "Infectious Disease": "internal-medicine",
  Oncology: "internal-medicine",
  "Allergy & Immunology": "internal-medicine",
  "General Surgery": "surgery",
  "Orthopaedic Surgery": "surgery",
  Neurosurgery: "surgery",
  "Plastic Surgery": "surgery",
  Urology: "surgery",
  Otolaryngology: "surgery",
  Anaesthesiology: "surgery",
  "Obstetrics & Gynaecology": "womens-child-health",
  Paediatrics: "womens-child-health",
  Neurology: "neuro-psychiatry",
  Psychiatry: "neuro-psychiatry",
  Pathology: "diagnostics-imaging",
  Radiology: "diagnostics-imaging",
  Dermatology: "diagnostics-imaging",
  Ophthalmology: "diagnostics-imaging",
  "Emergency Medicine": "emergency-primary",
  "Family Medicine": "emergency-primary",
  "General / mixed": "emergency-primary",
};

export const DIFFICULTY_ORDER: Record<QuizDifficulty, number> = {
  Foundation: 0,
  Intermediate: 1,
  Advanced: 2,
};

export function getStudyAreaForSpecialty(specialty: string): StudyAreaId {
  return SPECIALTY_TO_AREA[specialty] ?? "emergency-primary";
}

export function getStudyArea(studyAreaId: StudyAreaId): StudyArea {
  return STUDY_AREAS.find((area) => area.id === studyAreaId) ?? STUDY_AREAS[0];
}

export function toCatalogQuiz(quiz: Quiz): CatalogQuiz {
  const hasImages = quizHasImages(quiz);
  const format: QuizFormat =
    hasImages || quiz.id.endsWith("-images") ? "clinical-images" : "mcq";
  return {
    ...quiz,
    studyArea: getStudyAreaForSpecialty(quiz.specialty),
    format,
    hasImages,
  };
}

export function buildCatalog(quizzes: Quiz[]): CatalogQuiz[] {
  return quizzes.map(toCatalogQuiz);
}

export function catalogStats(catalog: CatalogQuiz[]) {
  const totalQuestions = catalog.reduce((n, quiz) => n + quiz.questionCount, 0);
  const imageTracks = catalog.filter((quiz) => quiz.format === "clinical-images").length;
  const mcqTracks = catalog.length - imageTracks;
  const byArea = STUDY_AREAS.map((area) => ({
    ...area,
    count: catalog.filter((quiz) => quiz.studyArea === area.id).length,
    questions: catalog
      .filter((quiz) => quiz.studyArea === area.id)
      .reduce((n, quiz) => n + quiz.questionCount, 0),
  }));

  return { totalQuestions, imageTracks, mcqTracks, byArea };
}

export type CatalogFilters = {
  query: string;
  area: StudyAreaId | "all";
  difficulty: QuizDifficulty | "all";
  format: QuizFormat | "all";
  sort: SortOption;
};

export function filterCatalog(
  catalog: CatalogQuiz[],
  filters: CatalogFilters,
): CatalogQuiz[] {
  const query = filters.query.trim().toLowerCase();

  let results = catalog.filter((quiz) => {
    if (filters.area !== "all" && quiz.studyArea !== filters.area) return false;
    if (filters.difficulty !== "all" && quiz.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.format !== "all" && quiz.format !== filters.format) return false;
    if (!query) return true;

    const haystack = [
      quiz.title,
      quiz.specialty,
      quiz.description,
      getStudyArea(quiz.studyArea).label,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  results = [...results].sort((a, b) => {
    if (filters.sort === "name") {
      return a.title.localeCompare(b.title);
    }
    if (filters.sort === "questions") {
      return b.questionCount - a.questionCount;
    }

    const areaDiff =
      STUDY_AREAS.findIndex((area) => area.id === a.studyArea) -
      STUDY_AREAS.findIndex((area) => area.id === b.studyArea);
    if (areaDiff !== 0) return areaDiff;
    return b.questionCount - a.questionCount;
  });

  return results;
}

export function groupCatalogByArea(catalog: CatalogQuiz[]) {
  return STUDY_AREAS.map((area) => ({
    area,
    quizzes: catalog.filter((quiz) => quiz.studyArea === area.id),
  })).filter((group) => group.quizzes.length > 0);
}

export const difficultyTone = {
  Foundation: "bg-teal-soft text-teal",
  Intermediate: "bg-[#fff4e5] text-[#9a5b00] dark:bg-[#2a2210] dark:text-[#fbbf24]",
  Advanced: "bg-[#fde8e8] text-[#9b1c1c] dark:bg-[#2a1414] dark:text-[#f87171]",
} as const;
