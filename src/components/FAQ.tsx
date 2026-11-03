import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import { SERVICE_FAQS, faqJsonLd, type FaqItem } from "@/lib/faq";

interface Props {
  items?: FaqItem[];
  eyebrow?: string;
  title?: string;
  lead?: string;
  ariaLabel?: string;
  id?: string;
  className?: string;
  /**
   * Off when the page declares its own FAQPage covering these questions —
   * a page that renders two of these must not carry two FAQPage blocks.
   */
  emitSchema?: boolean;
}

const FAQ = ({
  items = SERVICE_FAQS,
  eyebrow = "שאלות נפוצות",
  title = "מה שואלים אותנו הכי הרבה",
  lead = "ואם השאלה שלכם לא כאן – פשוט תרימו טלפון, נענה בכנות.",
  ariaLabel = "שאלות נפוצות על סינון טלפונים",
  id,
  className = "bg-surface-sunken",
  emitSchema = true,
}: Props) => (
  <section id={id} className={`section-padding ${className}`} aria-label={ariaLabel}>
    {emitSchema && (
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd(items))}</script>
      </Helmet>
    )}

    <div className="container-custom grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
        <AnimatedSection delay={0.1} className="mt-6">
          <Link to="/contact" className="text-[0.9375rem] font-semibold text-primary link-underline">
            לשאלה שלא מופיעה כאן ←
          </Link>
        </AnimatedSection>
      </div>

      <div className="lg:col-span-8">
        <AnimatedSection delay={0.08}>
          <Accordion type="single" collapsible className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {items.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`} className="border-0 px-5 md:px-6">
                <AccordionTrigger className="py-5 text-right text-[0.9375rem] font-bold text-ink hover:no-underline md:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default FAQ;
