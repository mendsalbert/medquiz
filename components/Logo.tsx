import Link from "next/link";

export default function Logo({
  tone = "dark",
  href = "/",
}: {
  tone?: "dark" | "light";
  href?: string;
}) {
  const isLight = tone === "light";
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-leaf text-sm font-black text-brand">
        M
      </span>
      <span
        className={`font-display text-xl font-semibold tracking-tight ${
          isLight ? "text-white" : "text-ink"
        }`}
      >
        Med<span className={isLight ? "text-leaf-bright" : "text-teal"}>Quiz</span>
      </span>
    </Link>
  );
}
