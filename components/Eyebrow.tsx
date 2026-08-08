export default function Eyebrow({
  children,
  tone = "teal",
}: {
  children: React.ReactNode;
  tone?: "teal" | "light";
}) {
  return (
    <p
      className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] ${
        tone === "light" ? "text-leaf-bright" : "text-teal"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          tone === "light" ? "bg-leaf-bright" : "bg-teal"
        }`}
      />
      {children}
    </p>
  );
}
