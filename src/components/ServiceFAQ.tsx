import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface FAQ {
  q: string;
  a: string;
}

const serviceFAQs: Record<string, FAQ[]> = {
  hadran: [
    { q: "כמה עולה התקנת הדרן?", a: "התקנת הדרן עולה ₪300 כולל הכל." },
    { q: "כמה זמן לוקחת ההתקנה?", a: "כ-45-90 דקות." },
    { q: "על אילו מכשירים עובד הדרן?", a: "על מגוון מכשירי אנדרואיד." },
    { q: "האם צריך לאפס את הטלפון?", a: "לא, אין צורך באיפוס מפעל." },
  ],
  askan: [
    { q: "מה ההבדל בין הדרן לעסקן?", a: "עסקן מיועד לאנשי עסקים ומפוקח על ידי קרלין." },
    { q: "כמה עולה עסקן?", a: "₪300 כולל התקנה מלאה." },
    { q: "האם עסקן מתאים לסמארטפון רגיל?", a: "כן, לדגמי אנדרואיד נבחרים." },
    { q: "איך מזמינים?", a: "שלחו הודעה בווצאפ ונתאם זמן." },
  ],
  "kosher-play": [
    { q: "מה זה כושר פליי?", a: "חנות אפליקציות כשרה מאושרת." },
    { q: "כמה עולה?", a: "₪70 בלבד." },
    { q: "על אילו מכשירים?", a: "מכשירי אנדרואיד נבחרים." },
    { q: "כמה זמן לוקח?", a: "כ-30 דקות." },
  ],
  "qin-f21-pro": [
    { q: "מה זה צריבת גרסה?", a: "התקנת מערכת הפעלה מיוחדת וכשרה על המכשיר." },
    { q: "כמה עולה?", a: "₪70." },
    { q: "האם זה מוחק את הנתונים?", a: "כן, צריכים לגבות קודם." },
    { q: "כמה זמן לוקח?", a: "כ-30-60 דקות." },
  ],
  "qin-f25": [
    { q: "מה זה צריבת גרסה?", a: "התקנת מערכת הפעלה מיוחדת וכשרה על המכשיר." },
    { q: "כמה עולה?", a: "₪70." },
    { q: "האם זה מוחק את הנתונים?", a: "כן, צריכים לגבות קודם." },
    { q: "כמה זמן לוקח?", a: "כ-30-60 דקות." },
  ],
  "basic-filtering": [
    { q: "מה כולל סינון בסיסי?", a: "חסימת אתרים ואפליקציות לא רצויים." },
    { q: "כמה עולה?", a: "₪20 בלבד." },
    { q: "האם צריך לאפס את הטלפון?", a: "לא, ללא איפוס." },
    { q: "כמה זמן לוקח?", a: "כ-5 דקות." },
  ],
};

const ServiceFAQ = ({ slug }: { slug: string }) => {
  const faqs = serviceFAQs[slug];
  if (!faqs) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="mt-8">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">❓ שאלות נפוצות</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card rounded-xl card-shadow border-0 px-6"
            >
              <AccordionTrigger className="text-right font-heading font-semibold text-card-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default ServiceFAQ;
