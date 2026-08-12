import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TrackCards from "@/components/TrackCards";
import type { Quiz } from "@/lib/quiz-types";

const PREVIEW_COUNT = 6;

export default function DemoTracks({ quizzes }: { quizzes: Quiz[] }) {
  const preview = quizzes.slice(0, PREVIEW_COUNT);
  const hasMore = quizzes.length > PREVIEW_COUNT;

  return (
    <>
      <div className="mt-12">
        <TrackCards quizzes={preview} />
      </div>

      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-bold text-ink transition-colors hover:border-teal hover:text-teal"
          >
            View more tracks
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </>
  );
}
