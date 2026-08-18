import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Bone,
  Brain,
  Eye,
  FlaskConical,
  HeartPulse,
  Microscope,
  Pill,
  Scan,
  Scissors,
  Stethoscope,
  Syringe,
} from "lucide-react";

export const TRACK_ICONS: Record<string, LucideIcon> = {
  "afrimedqa-obstetrics-and-gynaecology": HeartPulse,
  "afrimedqa-paediatrics": Baby,
  "afrimedqa-general-surgery": Scissors,
  "afrimedqa-pathology": FlaskConical,
  "afrimedqa-neurology": Brain,
  "afrimedqa-infectious-disease": Microscope,
  "afrimedqa-psychiatry": Brain,
  "afrimedqa-cardiology": HeartPulse,
  "afrimedqa-endocrinology": Pill,
  "afrimedqa-gastroenterology": Stethoscope,
  "afrimedqa-ophthalmology": Eye,
  "afrimedqa-dermatology": Scan,
  "afrimedqa-orthopaedic-surgery": Bone,
  "afrimedqa-emergency-medicine": Syringe,
};

export function trackIcon(quizId: string): LucideIcon {
  return TRACK_ICONS[quizId] ?? Stethoscope;
}
