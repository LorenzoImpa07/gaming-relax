"use client";

type Props = {
  name?: string | null;
  color?: string | null;
};

export function ThreadStatusBadge({ name, color }: Props) {
  if (!name) return null;
  const c = color || "#a1a1aa";
  const isLight =
    c.toLowerCase() === "#ffffff" ||
    c.toLowerCase() === "#fff" ||
    c.toLowerCase() === "#facc15" ||
    c.toLowerCase() === "#fbbf24";
  return (
    <span
      className="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{
        backgroundColor: c,
        color: isLight ? "#18181b" : "#fff",
      }}
    >
      {name}
    </span>
  );
}
