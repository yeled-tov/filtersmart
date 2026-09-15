import AnimatedSection from "./AnimatedSection";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** `start` keeps the block left-aligned to the reading edge (RTL: right). */
  align?: "start" | "center";
  inverse?: boolean;
  className?: string;
}

const SectionHeading = ({
  eyebrow,
  title,
  lead,
  align = "start",
  inverse = false,
  className = "",
}: Props) => (
  <AnimatedSection
    className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
  >
    {eyebrow && (
      <span className={`eyebrow ${inverse ? "text-white/70 before:bg-white/30" : ""}`}>{eyebrow}</span>
    )}
    <h2
      className={`mt-4 text-display-md ${inverse ? "text-white" : "text-ink"}`}
    >
      {title}
    </h2>
    {lead && (
      <p
        className={`mt-4 text-[1.0625rem] leading-relaxed ${
          inverse ? "text-white/65" : "text-ink-soft"
        } ${align === "center" ? "mx-auto" : ""}`}
      >
        {lead}
      </p>
    )}
  </AnimatedSection>
);

export default SectionHeading;
