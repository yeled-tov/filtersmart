import serviceFaqs from "@/data/serviceFaqs.json";

/**
 * FAQ data and markup shared by the FAQ component and any page that renders
 * more than one FAQ block and has to declare a single FAQPage for all of them.
 */
export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Questions about the services we install, shown on /services. They live in
 * JSON so the prerenderer can put the same questions in the static page.
 */
export const SERVICE_FAQS: FaqItem[] = serviceFaqs;

export const faqJsonLd = (items: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
