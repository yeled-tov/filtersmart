import { Helmet } from "react-helmet-async";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import AnimatedSection from "./AnimatedSection";

const faqs = [
  {
    q: "כמה עולה סינון טלפון באשדוד?",
    a: "סינון בסיסי לאייפון, גלקסי ואנדרואיד עולה 100₪ בלבד. מערכת כושר פליי עולה 70₪. מערכות הדרן ועסקן עולות 300₪. צריבת גרסה לשיאומי Qin עולה 70₪.",
  },
  {
    q: "האם אפשר לסנן כל סוג טלפון – אייפון, גלקסי, שיאומי?",
    a: "כן! אנחנו מסננים את כל סוגי המכשירים: אייפון (iPhone) כל הדגמים, סמסונג גלקסי (Galaxy S, A, Note), שיאומי (Xiaomi) כולל Qin, וואווי (Huawei), אופו, ואן פלוס, וכל מכשיר אנדרואיד. גם טאבלטים (אייפד, גלקסי טאב) וסינון למחשבים.",
  },
  {
    q: "מה ההבדל בין הדרן, עסקן וכושר פליי?",
    a: "הדרן (300₪) – ההגנה ההרמטית ביותר, צריבה שלמה שלא ניתנת להסרה בשום צורה. עסקן (300₪) – סינון AI חכם עם צריבה עמוקה, מיועד לאנשי עסקים. כושר פליי (70₪) – חנות אפליקציות כשרה עם MDM, וואטסאפ מסונן ללא תמונות פרופיל. סינון בסיסי (100₪) – חסימת אתרים פשוטה ומהירה.",
  },
  {
    q: "האם הצריבה פוגעת בטלפון?",
    a: "לא. מדובר בשכבת תוכנה מקצועית שמותקנת על המכשיר. הצריבה לא פוגעת בחומרה ולא משפיעה לרעה על ביצועי הטלפון.",
  },
  {
    q: "כמה זמן לוקחת ההתקנה?",
    a: "סינון בסיסי לוקח כ-5 דקות בלבד. התקנת כושר פליי לוקחת כ-30 דקות. צריבת הדרן או עסקן לוקחת כ-45-90 דקות. השירות בדרך כלל ניתן ביום הפנייה.",
  },
  {
    q: "איפה נמצא FilterPhone באשדוד?",
    a: "אנחנו נמצאים באשדוד, ברחוב חטיבת גבעתי 2, כניסה ו׳, רובע ג׳ (מול מסמר העיר). שירות בתיאום מראש בטלפון 052-718-6881 או WhatsApp.",
  },
  {
    q: "האם אפשר להסיר את הסינון בעצמי?",
    a: "תלוי בסוג הסינון. הדרן לא ניתן להסרה – גם איפוס יצרן לא מוריד את החסימה (מושלם להורים). עסקן, כושר פליי ובסיסי ניתנים להסרה באישור הספק.",
  },
  {
    q: "האם הסינון מוחק נתונים מהטלפון?",
    a: "צריבת גרסה (Qin F25/F21 Pro) או הדרן מוחקים הכל ודורשים גיבוי מראש. כושר פליי ובסיסי לא מוחקים נתונים כלל.",
  },
  {
    q: "האם יש סינון מתאים לילדים?",
    a: "בהחלט! הדרן הוא הפתרון המומלץ ביותר לילדים ונוער – הגנה הרמטית שלא ניתנת להסרה. גם כושר פליי מתאים מצוין עם חנות אפליקציות כשרה ובקרת הורים.",
  },
  {
    q: "איזה חברות סינון אתם עובדים איתן?",
    a: "אנחנו משווקים מורשים של כל חברות הסינון המובילות בישראל: הדרן (Hadran), עסקן (Askan), כושר פליי (Kosher Play). בנוסף, אנו מספקים סינון בסיסי עצמאי וצריבת גרסאות כשרות.",
  },
  {
    q: "האם אתם גם מסננים סמסונג גלקסי?",
    a: "כן! אנחנו מתמחים בסינון כל מכשירי סמסונג גלקסי: Galaxy S24, S23, S22, Galaxy A54, A34, A14, Galaxy Note ועוד. כל רמות הסינון זמינות – מסינון בסיסי ב-100₪ ועד הדרן ב-300₪.",
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
          <p className="text-muted-foreground text-lg">תשובות לשאלות הנפוצות ביותר על שירותי הסינון שלנו – אייפון, גלקסי, אנדרואיד ועוד</p>
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
