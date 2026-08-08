export type StudyLevel =
  | "preclinical"
  | "clinical"
  | "intern"
  | "resident"
  | "clinician"
  | "other";

export type UserProfile = {
  fullName: string;
  preferredName: string;
  email: string;
  school: string;
  studyLevel: StudyLevel | "";
  focusSpecialty: string;
  country: string;
  /** Data URL for profile photo (stored locally in this demo). */
  avatarData: string;
  onboardingComplete: boolean;
  updatedAt: string;
};

const PROFILE_KEY = "medquiz.profile.v1";

export const STUDY_LEVELS: { id: StudyLevel; label: string; hint: string }[] = [
  { id: "preclinical", label: "Pre-clinical student", hint: "Years 1–3 / basic sciences" },
  { id: "clinical", label: "Clinical student", hint: "Wards & clerkships" },
  { id: "intern", label: "House officer / intern", hint: "First years of practice" },
  { id: "resident", label: "Resident / registrar", hint: "Specialty training" },
  { id: "clinician", label: "Practicing clinician", hint: "Refreshing or exam prep" },
  { id: "other", label: "Other", hint: "Educator, reviser, curious learner" },
];

export const FOCUS_SPECIALTIES = [
  "Obstetrics & Gynaecology",
  "Infectious Disease",
  "Paediatrics",
  "Dermatology",
  "Pathology",
  "General / mixed",
] as const;

/** African countries first (product focus), then common diaspora options. */
export const COUNTRIES = [
  "Ghana",
  "Nigeria",
  "Kenya",
  "South Africa",
  "Egypt",
  "Ethiopia",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Senegal",
  "Côte d'Ivoire",
  "Cameroon",
  "Zimbabwe",
  "Zambia",
  "Botswana",
  "Namibia",
  "Malawi",
  "Mozambique",
  "Angola",
  "Democratic Republic of the Congo",
  "Sudan",
  "South Sudan",
  "Morocco",
  "Tunisia",
  "Algeria",
  "Libya",
  "Mali",
  "Burkina Faso",
  "Benin",
  "Togo",
  "Sierra Leone",
  "Liberia",
  "Gambia",
  "Guinea",
  "Somalia",
  "Eritrea",
  "Djibouti",
  "Madagascar",
  "Mauritius",
  "Seychelles",
  "Lesotho",
  "Eswatini",
  "United Kingdom",
  "United States",
  "Canada",
  "Other",
] as const;

export const EMPTY_PROFILE: UserProfile = {
  fullName: "",
  preferredName: "",
  email: "",
  school: "",
  studyLevel: "",
  focusSpecialty: "",
  country: "",
  avatarData: "",
  onboardingComplete: false,
  updatedAt: "",
};

const MAX_AVATAR_BYTES = 450_000;

export async function fileToAvatarData(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  const dataUrl = await readFileAsDataUrl(file);
  if (dataUrl.length <= MAX_AVATAR_BYTES) return dataUrl;
  return resizeImageDataUrl(dataUrl, 320, 0.82);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}

function resizeImageDataUrl(dataUrl: string, maxSize: number, quality: number) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not process that image."));
        return;
      }
      ctx.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => reject(new Error("Could not process that image."));
    image.src = dataUrl;
  });
}

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return { ...EMPTY_PROFILE };
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...EMPTY_PROFILE };
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      fullName: typeof parsed.fullName === "string" ? parsed.fullName : "",
      preferredName:
        typeof parsed.preferredName === "string" ? parsed.preferredName : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      school: typeof parsed.school === "string" ? parsed.school : "",
      studyLevel: isStudyLevel(parsed.studyLevel) ? parsed.studyLevel : "",
      focusSpecialty:
        typeof parsed.focusSpecialty === "string" ? parsed.focusSpecialty : "",
      country: typeof parsed.country === "string" ? parsed.country : "",
      avatarData:
        typeof parsed.avatarData === "string" &&
        parsed.avatarData.startsWith("data:image/")
          ? parsed.avatarData
          : "",
      onboardingComplete: Boolean(parsed.onboardingComplete),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export function saveProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  const next: UserProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("medquiz-profile"));
}

export function updateProfile(partial: Partial<UserProfile>) {
  const next = { ...loadProfile(), ...partial };
  saveProfile(next);
  return next;
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
  window.dispatchEvent(new Event("medquiz-profile"));
}

export function isOnboardingComplete(profile: UserProfile = loadProfile()) {
  return (
    profile.onboardingComplete &&
    profile.fullName.trim().length > 0 &&
    profile.school.trim().length > 0 &&
    Boolean(profile.studyLevel)
  );
}

export function displayName(profile: UserProfile) {
  const preferred = profile.preferredName.trim();
  if (preferred) return preferred;
  const full = profile.fullName.trim();
  if (!full) return "";
  return full.split(/\s+/)[0] ?? full;
}

export function studyLevelLabel(level: StudyLevel | "") {
  if (!level) return "";
  return STUDY_LEVELS.find((item) => item.id === level)?.label ?? level;
}

function isStudyLevel(value: unknown): value is StudyLevel {
  return (
    value === "preclinical" ||
    value === "clinical" ||
    value === "intern" ||
    value === "resident" ||
    value === "clinician" ||
    value === "other"
  );
}
