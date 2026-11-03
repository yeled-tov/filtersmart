import AnimatedSection from "./AnimatedSection";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** `start` keeps the block left-aligned to the reading edge (RTL: right). */
  align?: "start" | "center";
  inverse?: boolean;
  className?: string;
  /**
   * The page's own heading. Index pages like /services open with this
   * component, and without it they rendered with no <h1> at all.
   */
  as?: "h1" | "h2";
}

const SectionHeading = ({
  eyebrow,
  title,
  lead,
  align = "start",
  inverse = false,
  className = "",
  as: Heading = "h2",
}: Props) => (
  <AnimatedSection
    className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
  >
    {eyebrow && (
      <span className={`eyebrow ${inverse ? "text-white/70 before:bg-white/30" : ""}`}>{eyebrow}</span>
    )}
    <Heading className={`mt-4 text-display-md ${inverse ? "text-white" : "text-ink"}`}>{title}</Heading>
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
