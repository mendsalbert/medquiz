"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import TrackCards from "@/components/TrackCards";
import {
  DIFFICULTY_ORDER,
  STUDY_AREAS,
  buildCatalog,
  catalogStats,
  filterCatalog,
  getStudyArea,
  groupCatalogByArea,
  type CatalogFilters,
  type CatalogQuiz,
  type QuizDifficulty,
  type QuizFormat,
  type SortOption,
  type StudyAreaId,
} from "@/lib/quiz-catalog";
import type { Quiz } from "@/lib/quiz-types";

const DEFAULT_FILTERS: CatalogFilters = {
  query: "",
  area: "all",
  difficulty: "all",
  format: "all",
  sort: "recommended",
};

const CONTAINER = "mx-auto max-w-6xl px-5 sm:px-8";

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
        active
          ? "bg-leaf text-[#050505]"
          : "bg-surface-soft text-muted hover:bg-surface hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function toTrackCards(quizzes: CatalogQuiz[]) {
  return quizzes.map((quiz) => ({
    ...quiz,
    areaLabel: getStudyArea(quiz.studyArea).label,
  }));
}

function CatalogGrid({
  quizzes,
  variant,
}: {
  quizzes: CatalogQuiz[];
  variant: "dark" | "light";
}) {
  return <TrackCards quizzes={toTrackCards(quizzes)} variant={variant} />;
}

export default function QuizCatalog({
  quizzes,
  variant = "marketing",
}: {
  quizzes: Quiz[];
  variant?: "marketing" | "dashboard";
}) {
  const isMarketing = variant === "marketing";
  const cardVariant = "dark";
  const catalog = useMemo(() => buildCatalog(quizzes), [quizzes]);
  const stats = useMemo(() => catalogStats(catalog), [catalog]);
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(
    () => filterCatalog(catalog, filters),
    [catalog, filters],
  );

  const grouped = useMemo(() => groupCatalogByArea(filtered), [filtered]);
  const showGrouped =
    filters.area === "all" &&
    !filters.query &&
    filters.difficulty === "all" &&
    filters.format === "all" &&
    filters.sort === "recommended";

  const activeFilterCount = [
    filters.area !== "all",
    filters.difficulty !== "all",
    filters.format !== "all",
    filters.query.length > 0,
    filters.sort !== "recommended",
  ].filter(Boolean).length;

  function patchFilters(partial: Partial<CatalogFilters>) {
    setFilters((current) => ({ ...current, ...partial }));
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div>
      {isMarketing ? (
        <section className="scroll-mt-24 py-16 sm:py-20">
          <div className={CONTAINER}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <div className="max-w-xl">
                <Link
                  href="/#tracks"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-teal"
                >
                  ← Back to home
                </Link>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-teal">
                  All specialty tracks
                </p>
                <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                  Browse by area of study.
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  {catalog.length} specialty tracks across {STUDY_AREAS.length}{" "}
                  clinical areas, with {stats.totalQuestions.toLocaleString()}{" "}
                  AfriMed-QA questions.
                </p>
              </div>
              <Link
                href="/signup"
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-leaf px-5 py-3 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright sm:self-center"
              >
                Sign up to practice
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stats.byArea
                .filter((area) => area.count > 0)
                .map((area) => {
                  const AreaIcon = area.icon;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => patchFilters({ area: area.id, query: "" })}
                      className={`group flex h-full flex-col rounded-[1.75rem] border p-7 text-left transition-colors ${
                        filters.area === area.id
                          ? "border-teal/40 bg-teal-soft"
                          : "border-teal/10 bg-surface shadow-[0_12px_40px_rgba(10,22,40,0.04)] hover:border-teal/25"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-soft text-teal">
                          <AreaIcon className="h-5 w-5" />
                        </span>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">
                          {area.label}
                        </p>
                      </div>
                      <p className="mt-5 font-display text-3xl font-medium text-ink">
                        {area.count}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-muted">
                        {area.questions.toLocaleString()} questions
                      </p>
                    </button>
                  );
                })}
            </div>
          </div>
        </section>
      ) : (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">
            Question banks
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Specialty quizzes
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            Filter by area of study, difficulty, and format. Session length is controlled
            in Settings.
          </p>
        </div>
      )}

      <section className={isMarketing ? "pb-20 sm:pb-24" : "mt-10"}>
        <div className={isMarketing ? CONTAINER : "w-full"}>
          {/* Toolbar: search + sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="quiz-search"
                type="search"
                value={filters.query}
                onChange={(event) => patchFilters({ query: event.target.value })}
                placeholder="Search specialty, topic, or track name"
                className="w-full rounded-full bg-surface-soft py-3 pl-11 pr-4 text-sm font-semibold text-ink outline-none transition-shadow placeholder:font-medium placeholder:text-muted focus:bg-surface focus:ring-2 focus:ring-teal/25"
              />
            </div>
            <select
              id="quiz-sort"
              aria-label="Sort by"
              value={filters.sort}
              onChange={(event) =>
                patchFilters({ sort: event.target.value as SortOption })
              }
              className="shrink-0 rounded-full bg-surface-soft px-4 py-3 text-sm font-semibold text-ink outline-none transition-shadow focus:bg-surface focus:ring-2 focus:ring-teal/25 sm:min-w-[11rem]"
            >
              <option value="recommended">Recommended</option>
              <option value="name">Track name (A–Z)</option>
              <option value="questions">Most questions</option>
            </select>
          </div>

          {/* Filter rows */}
          <div className="mt-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-bold uppercase tracking-[0.14em] text-teal">
                Area
              </span>
              <FilterChip
                active={filters.area === "all"}
                onClick={() => patchFilters({ area: "all" })}
              >
                All
              </FilterChip>
              {STUDY_AREAS.map((area) => {
                const count =
                  stats.byArea.find((item) => item.id === area.id)?.count ?? 0;
                if (count === 0) return null;
                return (
                  <FilterChip
                    key={area.id}
                    active={filters.area === area.id}
                    onClick={() =>
                      patchFilters({ area: area.id as StudyAreaId })
                    }
                  >
                    {area.label}
                  </FilterChip>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-bold uppercase tracking-[0.14em] text-teal">
                Level
              </span>
              <FilterChip
                active={filters.difficulty === "all"}
                onClick={() => patchFilters({ difficulty: "all" })}
              >
                Any
              </FilterChip>
              {(Object.keys(DIFFICULTY_ORDER) as QuizDifficulty[]).map(
                (level) => (
                  <FilterChip
                    key={level}
                    active={filters.difficulty === level}
                    onClick={() => patchFilters({ difficulty: level })}
                  >
                    {level}
                  </FilterChip>
                ),
              )}
              <span className="mx-1 hidden h-4 w-px bg-teal/15 sm:block" />
              <span className="mr-1 text-xs font-bold uppercase tracking-[0.14em] text-teal sm:ml-1">
                Format
              </span>
              {(
                [
                  ["all", "All"],
                  ["mcq", "MCQ"],
                ] as const
              ).map(([value, label]) => (
                <FilterChip
                  key={value}
                  active={filters.format === value}
                  onClick={() =>
                    patchFilters({ format: value as QuizFormat | "all" })
                  }
                >
                  {label}
                </FilterChip>
              ))}
              {activeFilterCount > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-1 inline-flex items-center gap-1.5 text-sm font-bold text-teal transition-colors hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          {/* Results meta */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-teal/10 pt-6">
            <p className="text-sm font-semibold text-muted">
              Showing {filtered.length} of {catalog.length} tracks
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-bold text-teal">
              <span className="rounded-full bg-teal-soft px-3 py-1">
                {stats.mcqTracks} MCQ banks
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-8">
            {filtered.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-teal/20 bg-surface px-6 py-16 text-center">
                <p className="font-display text-2xl font-medium text-ink">
                  No tracks match these filters
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Try clearing filters or searching with a broader specialty term.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-bold text-[#050505] transition-colors hover:bg-leaf-bright"
                >
                  Clear filters
                </button>
              </div>
            ) : showGrouped ? (
              <div className="space-y-14">
                {grouped.map(({ area, quizzes: areaQuizzes }) => {
                  const AreaIcon = area.icon;
                  const areaStats = stats.byArea.find(
                    (item) => item.id === area.id,
                  );
                  return (
                    <section key={area.id} id={area.id}>
                      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                        <div className="max-w-2xl">
                          <div className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-teal">
                            <AreaIcon className="h-3.5 w-3.5" />
                            Area of study
                          </div>
                          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                            {area.label}
                          </h2>
                          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                            {area.description}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-muted">
                          {areaStats?.count ?? areaQuizzes.length} tracks ·{" "}
                          {(areaStats?.questions ?? 0).toLocaleString()} questions
                        </p>
                      </div>
                      <CatalogGrid
                        quizzes={areaQuizzes}
                        variant={cardVariant}
                      />
                    </section>
                  );
                })}
              </div>
            ) : (
              <CatalogGrid quizzes={filtered} variant={cardVariant} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
