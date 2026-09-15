import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface QA {
  q: string;
  a: string;
}

/**
 * Per-service FAQ. This is the only FAQPage block on a service page.
 * Prices and install times are kept in step with `src/lib/advisor.ts`
 * and with the site-wide FAQ, so the same number never appears twice differently.
 */
const serviceFAQs: Record<string, QA[]> = {
  hadran: [
    { q: "כמה עולה התקנת הדרן?", a: "300₪, מחיר שכולל את הצריבה וההתקנה המלאה." },
    { q: "כמה זמן לוקחת ההתקנה?", a: "בין 45 ל-90 דקות, בתיאום מראש. ברוב המקרים אפשר לקבוע ליום הפנייה." },
    { q: "על אילו מכשירים הדרן עובד?", a: "על מגוון רחב של מכשירי אנדרואיד. שלחו לנו את הדגם המדויק ונאשר לכם מראש שהוא נתמך." },
    { q: "צריך לגבות את המכשיר לפני ההתקנה?", a: "כן. הדרן הוא צריבה של גרסת מערכת שלמה, ולכן הוא נעשה על מכשיר מאופס או חדש. חשוב לגבות תמונות, אנשי קשר והודעות לפני שמגיעים." },
    { q: "אפשר להסיר את הדרן?", a: "לא. זו בדיוק הנקודה – גם איפוס להגדרות יצרן לא מוריד את החסימה. זו הסיבה שהורים בוחרים בו." },
  ],
  askan: [
    { q: "מה ההבדל בין הדרן לעסקן?", a: "שניהם צריבה עמוקה במחיר 300₪. הדרן הוא ההרמטי מביניהם, ועסקן נבנה כדי שהמכשיר ימשיך לתפקד לשימוש עבודה, עם סינון תמונות חכם מבוסס AI." },
    { q: "כמה עולה עסקן?", a: "300₪ כולל התקנה מלאה." },
    { q: "עסקן מתאים לסמארטפון רגיל?", a: "כן, לדגמי אנדרואיד נבחרים. שלחו לנו את הדגם ונוודא התאמה מראש." },
    { q: "צריך מכשיר מאופס?", a: "כן. הצריבה מתבצעת על מכשיר מאופס או חדש בלבד, ולכן נדרש גיבוי מלא מראש." },
    { q: "איך מזמינים?", a: "שולחים הודעה בוואטסאפ או מתקשרים ל-052-718-6881, ואנחנו קובעים זמן במעבדה באשדוד." },
  ],
  "kosher-play": [
    { q: "מה זה כושר פליי?", a: "מערכת סינון שכוללת חנות אפליקציות כשרה מאושרת, וואטסאפ מסונן ללא תמונות פרופיל וסטטוסים, וסינון תמונות באמצעות VPN מקומי שאינו מאט את הגלישה." },
    { q: "כמה זה עולה?", a: "70₪ – אחד הפתרונות המשתלמים שלנו." },
    { q: "על אילו מכשירים?", a: "מכשירי אנדרואיד נבחרים. שלחו לנו את הדגם ונאשר התאמה." },
    { q: "ההתקנה מוחקת נתונים?", a: "לא. כושר פליי מותקן בלי למחוק את תוכן המכשיר." },
    { q: "כמה זמן ההתקנה לוקחת?", a: "כ-30 דקות." },
    { q: "אפשר להסיר את ההגנה?", a: "המערכת כוללת צריבת MDM שמונעת איפוס להגדרות יצרן והסרת ההגנה." },
  ],
  "qin-f21-pro": [
    { q: "מה זו צריבת גרסה?", a: "התקנה של גרסת מערכת כשרה ומותאמת על המכשיר, עם סינון מובנה מהרגע הראשון." },
    { q: "כמה עולה צריבה ל-Qin F21 Pro?", a: "70₪." },
    { q: "הצריבה מוחקת את הנתונים?", a: "כן. הצריבה מתבצעת על מכשיר מאופס, ולכן צריך לגבות הכול מראש." },
    { q: "כמה זמן זה לוקח?", a: "בין 30 ל-60 דקות." },
  ],
  "qin-f25": [
    { q: "מה זו צריבת גרסה?", a: "התקנה של גרסת מערכת כשרה ומותאמת על המכשיר, עם סינון מובנה מהרגע הראשון." },
    { q: "כמה עולה צריבה ל-Qin F25?", a: "70₪." },
    { q: "הצריבה מוחקת את הנתונים?", a: "כן. הצריבה מתבצעת על מכשיר מאופס, ולכן צריך לגבות הכול מראש." },
    { q: "כמה זמן זה לוקח?", a: "בין 30 ל-60 דקות." },
  ],
  "basic-filtering": [
    { q: "מה כולל סינון בסיסי?", a: "חסימה של אתרים ותכנים לא רצויים ברמה שבוחרים – מחסימת תכנים פוגעניים ופרסומות ועד חסימה מלאה של רשתות חברתיות. באייפון אפשר גם לחסום את ה-App Store לחלוטין." },
    { q: "כמה עולה סינון בסיסי?", a: "100₪ כולל התקנה." },
    { q: "צריך לאפס את הטלפון?", a: "לא. הסינון מותקן בלי למחוק שום דבר מהמכשיר." },
    { q: "כמה זמן ההתקנה לוקחת?", a: "כחמש דקות בלבד." },
    { q: "זה מאט את הטלפון?", a: "לא. הפתרון תוכנן כך שלא יפגע במהירות הגלישה או בביצועי המכשיר." },
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
      <section className="mt-12" aria-label="שאלות נפוצות על השירות">
        <h2 className="text-display-sm">שאלות נפוצות על השירות הזה</h2>
        <Accordion type="single" collapsible className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`faq-${i}`} className="border-0 px-5 md:px-6">
              <AccordionTrigger className="py-[1.125rem] text-right text-[0.9375rem] font-bold text-ink hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[0.9375rem] leading-relaxed text-ink-soft">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
};

export default ServiceFAQ;
