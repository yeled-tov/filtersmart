import { Helmet } from "react-helmet-async";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import AnimatedSection from "./AnimatedSection";

const faqs = [
  {
    q: "כמה עולה סינון טלפון באשדוד?",
    a: "סינון בסיסי לאייפון ואנדרואיד עולה 20₪ בלבד. מערכת כושר פליי עולה 70₪. מערכות הדרן ועסקן עולות 300₪. צריבת גרסה לשיאומי Qin עולה 70₪.",
  },
  {
    q: "האם הצריבה פוגעת בטלפון?",
    a: "לא. מדובר בשכבת תוכנה מקצועית שמותקנת על המכשיר. הצריבה לא פוגעת בחומרה ולא משפיעה לרעה על ביצועי הטלפון.",
  },
  {
    q: "כמה זמן לוקחת ההתקנה?",
    a: "סינון בסיסי לוקח כ-5 דקות בלבד. צריבת גרסה מלאה (הדרן, עסקן, כושר פליי) לוקחת כ-30-90 דקות.",
  },
  {
    q: "איפה נמצא FilterPhone באשדוד?",
    a: "אנחנו נמצאים באשדוד, ברחוב חטיבת גבעתי 2, כניסה ו׳, רובע ג׳ (מול מסמר העיר). שירות בתיאום מראש בטלפון 052-718-6881.",
  },
  {
    q: "האם אפשר להסיר את הסינון בעצמי?",
    a: "תלוי בסוג הסינון. הדרן לא ניתן להסרה – גם איפוס לא מוריד את החסימה. עסקן, כושר פליי ובסיסי ניתנים להסרה באישור הספק.",
  },
  {
    q: "האם הסינון מוחק נתונים מהטלפון?",
    a: "צריבת גרסה (קין 25/F21) או הדרן מוחקים הכל ודורשים גיבוי מראש. כושר פליי ובסיסי לא מוחקים נתונים כלל.",
  },
  {
    q: "מה ההבדל בין הדרן לעסקן?",
    a: "הדרן הוא גרסת מערכת שלמה שלא ניתנת להסרה בשום צורה – ההגנה ההרמטית ביותר. עסקן כולל סינון AI חכם ומיועד בעיקר לאנשי עסקים. שני השירותים עולים 300₪.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  })),
};

const FAQ = () => (
  <section className="section-padding bg-muted/20" aria-label="שאלות נפוצות על סינון טלפונים">
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
    </Helmet>
    <div className="container-custom max-w-3xl">
      <AnimatedSection>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            שאלות נפוצות
          </div>
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4 text-balance">שאלות נפוצות על סינון טלפונים</h2>
          <p className="text-muted-foreground text-lg">תשובות לשאלות הנפוצות ביותר על שירותי הסינון שלנו</p>
        </div>
      </AnimatedSection>
      <AnimatedSection delay={0.12}>
        <Accordion type="single" collapsible className="space-y-2.5">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card rounded-xl card-shadow border border-border/50 px-6 hover:card-shadow-hover transition-all duration-200 data-[state=open]:border-primary/20"
            >
              <AccordionTrigger className="text-right font-heading font-semibold text-card-foreground hover:no-underline text-[15px]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>
    </div>
  </section>
);

export default FAQ;
