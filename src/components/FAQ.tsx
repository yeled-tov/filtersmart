import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import AnimatedSection from "./AnimatedSection";

const faqs = [
  {
    q: "האם הצריבה פוגעת בטלפון?",
    a: "לא. מדובר בשכבת תוכנה מקצועית שמותקנת על המכשיר. הצריבה לא פוגעת בחומרה ולא משפיעה לרעה על ביצועי הטלפון.",
  },
  {
    q: "כמה זמן לוקחת ההתקנה?",
    a: "סינון בסיסי לוקח כ-5 דקות בלבד. צריבת גרסה מלאה (הדרן, עסקן, כושר פליי) לוקחת כ-30-45 דקות.",
  },
  {
    q: "איפה אתם יושבים?",
    a: "אנחנו נמצאים באשדוד, ברחוב חטיבת גבעתי 2, רובע ג׳ (מול מסמר העיר). שירות בתיאום מראש.",
  },
  {
    q: "האם אפשר להסיר את הסינון בעצמי?",
    a: "תלוי בסוג הסינון. הדרן לא ניתן להסרה – גם איפוס לא מוריד את החסימה. עסקן, כושר פליי ובסיסי ניתנים להסרה באישור הספק.",
  },
  {
    q: "האם הסינון מוחק נתונים מהטלפון?",
    a: "צריבת גרסה (קין 25/F21) או הדרן מוחקים הכל ודורשים גיבוי מראש. כושר פליי ובסיסי לא מוחקים נתונים כלל.",
  },
];

const FAQ = () => (
  <section className="section-padding bg-muted/30">
    <div className="container-custom max-w-3xl">
      <AnimatedSection>
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">❓ שאלות נפוצות</h2>
          <p className="text-muted-foreground text-lg">תשובות לשאלות שנשאלות הכי הרבה</p>
        </div>
      </AnimatedSection>
      <AnimatedSection delay={0.15}>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl card-shadow border-0 px-6 hover:card-shadow-hover transition-shadow">
              <AccordionTrigger className="text-right font-heading font-semibold text-card-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
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
