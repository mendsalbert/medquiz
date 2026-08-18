import {
  isOnboardingComplete,
  loadProfile,
  saveProfile,
  updateProfile,
  type UserProfile,
} from "./user-profile";

export type TestAccount = {
  email: string;
  password: string;
  role: string;
  profile: Omit<UserProfile, "updatedAt">;
};

const ACCOUNTS_KEY = "medquiz.accounts.v1";

type LocalAccount = {
  email: string;
  password: string;
};

export const TEST_PASSWORD = "MedQuiz123";

export const TEST_ACCOUNTS: TestAccount[] = [
  {
    email: "ama@example.com",
    password: TEST_PASSWORD,
    role: "Clinical student",
    profile: {
      fullName: "Ama Mensah",
      preferredName: "Ama",
      email: "ama@example.com",
      school: "University of Ghana Medical School",
      studyLevel: "clinical",
      focusSpecialty: "Obstetrics & Gynaecology",
      country: "Ghana",
      avatarData: "",
      onboardingComplete: true,
    },
  },
  {
    email: "chinedu@example.com",
    password: TEST_PASSWORD,
    role: "House officer",
    profile: {
      fullName: "Chinedu Okeke",
      preferredName: "Chinedu",
      email: "chinedu@example.com",
      school: "College of Medicine, University of Lagos",
      studyLevel: "intern",
      focusSpecialty: "Infectious Disease",
      country: "Nigeria",
      avatarData: "",
      onboardingComplete: true,
    },
  },
  {
    email: "thandiwe@example.com",
    password: TEST_PASSWORD,
    role: "Resident",
    profile: {
      fullName: "Thandiwe Nkosi",
      preferredName: "Thandiwe",
      email: "thandiwe@example.com",
      school: "University of Cape Town",
      studyLevel: "resident",
      focusSpecialty: "Paediatrics",
      country: "South Africa",
      avatarData: "",
      onboardingComplete: true,
    },
  },
];

export type AuthResult =
  | { ok: true; destination: string }
  | { ok: false; error: string };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function loadLocalAccounts(): Record<string, LocalAccount> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, LocalAccount>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveLocalAccounts(accounts: Record<string, LocalAccount>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function findTestAccount(email: string) {
  const key = normalizeEmail(email);
  return TEST_ACCOUNTS.find((account) => account.email === key);
}

function activateTestAccount(account: TestAccount) {
  saveProfile({
    ...account.profile,
    email: account.email,
    onboardingComplete: true,
    updatedAt: "",
  });
}

export function loginWithCredentials(email: string, password: string): AuthResult {
  const normalized = normalizeEmail(email);
  if (!normalized || !password) {
    return { ok: false, error: "Enter an email and password." };
  }

  const test = findTestAccount(normalized);
  if (test) {
    if (test.password !== password) {
      return { ok: false, error: "Email or password is incorrect." };
    }
    activateTestAccount(test);
    return { ok: true, destination: "/dashboard" };
  }

  const local = loadLocalAccounts()[normalized];
  if (!local || local.password !== password) {
    return { ok: false, error: "Email or password is incorrect." };
  }

  updateProfile({ email: normalized });
  const profile = loadProfile();
  return {
    ok: true,
    destination: isOnboardingComplete(profile) ? "/dashboard" : "/onboarding",
  };
}

export function loginAsTestAccount(email: string): AuthResult {
  const test = findTestAccount(email);
  if (!test) {
    return { ok: false, error: "That test account is not available." };
  }
  activateTestAccount(test);
  return { ok: true, destination: "/dashboard" };
}

export function signupWithCredentials(input: {
  name: string;
  email: string;
  password: string;
  country?: string;
}): AuthResult {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;
  const country = (input.country ?? "").trim();

  if (!name || !email || password.length < 6) {
    return { ok: false, error: "Name, email, and a password of at least 6 characters are required." };
  }

  if (findTestAccount(email)) {
    return {
      ok: false,
      error: "That email is a test login. Use the Log in page instead.",
    };
  }

  const accounts = loadLocalAccounts();
  if (accounts[email]) {
    return { ok: false, error: "An account with that email already exists on this device." };
  }

  accounts[email] = { email, password };
  saveLocalAccounts(accounts);
  saveProfile({
    fullName: name,
    preferredName: name.split(/\s+/)[0] ?? name,
    email,
    school: "",
    studyLevel: "",
    focusSpecialty: "",
    country,
    avatarData: "",
    onboardingComplete: false,
    updatedAt: "",
  });

  return { ok: true, destination: "/onboarding" };
}
