#!/usr/bin/env python3
"""Download AfriMed-QA v2 MCQs and emit MedQuiz quiz JSON + TypeScript bank."""

from __future__ import annotations

import ast
import json
import re
import urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
PARQUET_PATH = DATA_DIR / "afrimedqa_v2.parquet"
# Public mirror of gated intronhealth/afrimedqa_v2
PARQUET_URL = (
    "https://huggingface.co/datasets/OpenMed/afrimedqa_v2/resolve/main/"
    "data/train-00000-of-00001.parquet"
)
OUT_JSON = DATA_DIR / "afrimedqa-quizzes.json"
OUT_TS = ROOT / "lib" / "quiz-bank.ts"

SPECIALTY_LABELS = {
    "Obstetrics_and_Gynecology": "Obstetrics & Gynaecology",
    "Pediatrics": "Paediatrics",
    "General_Surgery": "General Surgery",
    "Pathology": "Pathology",
    "Neurology": "Neurology",
    "Infectious_Disease": "Infectious Disease",
    "Psychiatry": "Psychiatry",
    "Cardiology": "Cardiology",
    "Endocrinology": "Endocrinology",
    "Gastroenterology": "Gastroenterology",
    "Pulmonary_Medicine": "Pulmonary Medicine",
    "Ophthalmology": "Ophthalmology",
    "Hematology": "Haematology",
    "Rheumatology": "Rheumatology",
    "Nephrology": "Nephrology",
    "Internal_Medicine": "Internal Medicine",
    "Otolaryngology": "Otolaryngology",
    "Orthopedic_Surgery": "Orthopaedic Surgery",
    "Oncology": "Oncology",
    "Dermatology": "Dermatology",
    "Other": "General / mixed",
    "Neurosurgery": "Neurosurgery",
    "Urology": "Urology",
    "Emergency_Medicine": "Emergency Medicine",
    "Plastic_Surgery": "Plastic Surgery",
    "Radiology": "Radiology",
    "Anesthesiology": "Anaesthesiology",
    "Family_Medicine": "Family Medicine",
    "Allergy_and_Immunology": "Allergy & Immunology",
    "Geriatrics": "Geriatrics",
    "Medical_Genetics": "Medical Genetics",
    "Physical_Medicine_and_Rehabilitation": "Physical Medicine & Rehabilitation",
}

DIFFICULTY = {
    "Obstetrics_and_Gynecology": "Intermediate",
    "Pediatrics": "Intermediate",
    "General_Surgery": "Advanced",
    "Pathology": "Advanced",
    "Neurology": "Advanced",
    "Infectious_Disease": "Intermediate",
    "Psychiatry": "Intermediate",
    "Cardiology": "Advanced",
    "Endocrinology": "Intermediate",
    "Gastroenterology": "Intermediate",
    "Pulmonary_Medicine": "Intermediate",
    "Ophthalmology": "Intermediate",
    "Hematology": "Advanced",
    "Rheumatology": "Advanced",
    "Nephrology": "Advanced",
    "Internal_Medicine": "Intermediate",
    "Otolaryngology": "Intermediate",
    "Orthopedic_Surgery": "Advanced",
    "Oncology": "Advanced",
    "Dermatology": "Intermediate",
    "Other": "Foundation",
    "Neurosurgery": "Advanced",
    "Urology": "Intermediate",
    "Emergency_Medicine": "Intermediate",
    "Plastic_Surgery": "Advanced",
    "Radiology": "Intermediate",
    "Anesthesiology": "Advanced",
    "Family_Medicine": "Foundation",
    "Allergy_and_Immunology": "Intermediate",
    "Geriatrics": "Intermediate",
    "Medical_Genetics": "Advanced",
    "Physical_Medicine_and_Rehabilitation": "Intermediate",
}

OPTION_KEYS = [f"option{i}" for i in range(1, 6)]
SINGLE_ANSWER = re.compile(r"^option[1-5]$")
MIN_QUESTIONS = 5


def download_parquet() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if PARQUET_PATH.exists() and PARQUET_PATH.stat().st_size > 1_000_000:
        print(f"Using cached {PARQUET_PATH}")
        return
    print(f"Downloading {PARQUET_URL}")
    urllib.request.urlretrieve(PARQUET_URL, PARQUET_PATH)
    print(f"Saved {PARQUET_PATH} ({PARQUET_PATH.stat().st_size} bytes)")


def parse_options(raw) -> dict | None:
    if raw is None:
        return None
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, float):
        return None
    if isinstance(raw, str):
        text = raw.strip()
        if not text or text.lower() in {"none", "nan"}:
            return None
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            try:
                value = ast.literal_eval(text)
            except (ValueError, SyntaxError):
                return None
            return value if isinstance(value, dict) else None
    return None


def clean_text(value) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    return re.sub(r"\s+", " ", text)


def slugify(label: str) -> str:
    slug = label.lower().replace("&", "and")
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def convert_row(row) -> dict | None:
    options_raw = parse_options(row.get("answer_options"))
    answer = clean_text(row.get("correct_answer")).lower()
    if not options_raw or not SINGLE_ANSWER.match(answer):
        return None

    options: list[str] = []
    key_to_index: dict[str, int] = {}
    for key in OPTION_KEYS:
        text = clean_text(options_raw.get(key))
        if not text or text.upper() == "N/A":
            continue
        key_to_index[key] = len(options)
        options.append(text)

    if len(options) < 2 or answer not in key_to_index:
        return None

    prompt = clean_text(row.get("question_clean") or row.get("question"))
    if len(prompt) < 12:
        return None

    explanation = clean_text(row.get("answer_rationale"))
    if not explanation:
        explanation = "See the correct option selected above."

    sample_id = clean_text(row.get("sample_id")) or f"row-{row.name}"
    return {
        "id": f"aq-{sample_id[:16]}",
        "prompt": prompt,
        "options": options,
        "correctIndex": key_to_index[answer],
        "explanation": explanation,
    }


def build_quizzes(df) -> list[dict]:
    mcq = df[df["question_type"].astype(str).str.lower() == "mcq"].copy()
    tier_rank = {"expert": 0, "crowdsourced": 1}
    mcq["_tier_rank"] = mcq["tier"].map(lambda t: tier_rank.get(str(t).lower(), 9))
    mcq = mcq.sort_values(["specialty", "_tier_rank", "sample_id"])

    by_specialty: dict[str, list[dict]] = defaultdict(list)
    seen_prompts: set[str] = set()

    for _, row in mcq.iterrows():
        question = convert_row(row)
        if not question:
            continue
        prompt_key = question["prompt"].lower()
        if prompt_key in seen_prompts:
            continue
        seen_prompts.add(prompt_key)
        specialty = row.get("specialty") or "Other"
        by_specialty[str(specialty)].append(question)

    grouped: dict[str, dict] = {}
    leftovers: list[dict] = []

    for specialty, questions in sorted(
        by_specialty.items(), key=lambda item: (-len(item[1]), item[0])
    ):
        label = SPECIALTY_LABELS.get(specialty, specialty.replace("_", " "))
        if label == "General / mixed" or len(questions) < MIN_QUESTIONS:
            leftovers.extend(questions)
            continue

        difficulty = DIFFICULTY.get(specialty, "Intermediate")
        if label not in grouped:
            grouped[label] = {
                "id": f"afrimedqa-{slugify(label)}",
                "title": label,
                "specialty": label,
                "difficulty": difficulty,
                "questions": [],
            }
        grouped[label]["questions"].extend(questions)

    quizzes: list[dict] = []
    for label, quiz in sorted(
        grouped.items(), key=lambda item: (-len(item[1]["questions"]), item[0])
    ):
        questions = quiz["questions"]
        count = len(questions)
        quizzes.append(
            {
                **quiz,
                "description": (
                    f"Single-best-answer MCQs from AfriMed-QA v2 "
                    f"({count} items; expert + crowdsourced)."
                ),
                "questionCount": count,
                "estimatedMinutes": max(10, round(count * 1.1)),
                "questions": questions,
            }
        )

    if leftovers:
        quizzes.append(
            {
                "id": "afrimedqa-general-mixed",
                "title": "General / mixed",
                "specialty": "General / mixed",
                "difficulty": "Foundation",
                "description": (
                    "Smaller AfriMed-QA v2 specialty pools combined into one "
                    f"mixed track ({len(leftovers)} items)."
                ),
                "questionCount": len(leftovers),
                "estimatedMinutes": max(10, round(len(leftovers) * 1.1)),
                "questions": leftovers,
            }
        )

    return quizzes


def write_outputs(afrimed_quizzes: list[dict]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(afrimed_quizzes, ensure_ascii=False, indent=2) + "\n")

    OUT_TS.write_text(
        """/* Auto-generated by scripts/build-afrimedqa-bank.py — do not edit by hand */
import type { Quiz } from "./quiz-types";
import afrimedQuizzes from \"../data/afrimedqa-quizzes.json\";

export const QUIZZES: Quiz[] = afrimedQuizzes as Quiz[];
"""
    )

    total_q = sum(q["questionCount"] for q in afrimed_quizzes)
    print(f"Wrote {OUT_JSON} ({len(afrimed_quizzes)} AfriMed-QA quizzes)")
    print(f"Wrote {OUT_TS}")
    print(f"Total quizzes: {len(afrimed_quizzes)}, questions: {total_q}")


def main() -> None:
    import pandas as pd

    download_parquet()
    df = pd.read_parquet(PARQUET_PATH)
    quizzes = build_quizzes(df)
    write_outputs(quizzes)


if __name__ == "__main__":
    main()
