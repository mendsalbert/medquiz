"use client";

import Image from "next/image";

export default function ProfileAvatar({
  src,
  initials,
  size = "md",
  className = "",
}: {
  src?: string | null;
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
    xl: "h-20 w-20 text-xl",
  } as const;

  const px = { sm: 24, md: 36, lg: 48, xl: 80 }[size];

  if (src) {
    return (
      <span
        className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-teal-soft ${sizes[size]} ${className}`}
      >
        <Image
          src={src}
          alt=""
          width={px}
          height={px}
          unoptimized
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-teal font-bold text-white ${sizes[size]} ${className}`}
    >
      {initials}
    </span>
  );
}
