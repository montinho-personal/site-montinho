interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  accent?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  accent = false,
}: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const eyebrowColor = accent
    ? ""
    : light
    ? "text-gray-400"
    : "";
  const titleColor = "text-white";
  const subtitleColor = light ? "text-gray-300" : "text-gray-400";

  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${eyebrowColor}`}
          style={{ color: "#BA9E50" }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${titleColor}`}
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg leading-relaxed font-light ${subtitleColor}`}>{subtitle}</p>
      )}
    </div>
  );
}
