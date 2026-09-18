import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

/**
 * The site's single FAQPage. Other pages link here rather than declaring their
 * own FAQ markup, so no page ever carries two FAQPage blocks.
 */
const faqs = [
  {
    q: "כמה עולה סינון טלפון באשדוד?",
    a: "סינון בסיסי לאייפון, לגלקסי ולכל אנדרואיד עולה 100₪. מערכת כושר פליי עולה 70₪. מערכות הדרן ועסקן עולות 300₪ כל אחת. צריבת גרסה כשרה למכשירי שיאומי Qin F21 Pro או Qin F25 עולה 70₪. כל המחירים כוללים את ההתקנה עצמה.",
  },
  {
    q: "איזה סוגי מכשירים אתם מסננים?",
    a: "אייפון (iPhone) בכל הדגמים, סמסונג גלקסי (Galaxy S, Galaxy A, Note), שיאומי כולל מכשירי Qin, וואווי, אופו, ואן פלוס וכל מכשיר אנדרואיד. מעבר לטלפונים אנחנו מסננים גם טאבלטים – אייפד וטאבלטים אנדרואיד – ומחשבים נייחים וניידים.",
  },
  {
    q: "מה ההבדל בין הדרן, עסקן וכושר פליי?",
    a: "הדרן (300₪) היא ההגנה ההרמטית ביותר: גרסת מערכת שלמה שלא ניתנת להסרה, גם לא באיפוס יצרן. עסקן (300₪) היא סינון AI חכם עם צריבה עמוקה, שנבנתה כדי שהמכשיר ימשיך לתפקד לעבודה. כושר פליי (70₪) מספקת חנות אפליקציות כשרה, וואטסאפ מסונן וצריבת MDM שמונעת איפוס. סינון בסיסי (100₪) הוא חסימת אתרים פשוטה ומהירה ברמה שבוחרים.",
  },
  {
    q: "כמה זמן לוקחת ההתקנה?",
    a: "סינון בסיסי מוכן תוך כחמש דקות. התקנת כושר פליי לוקחת כ-30 דקות. צריבת הדרן או עסקן לוקחת בין 45 ל-90 דקות. צריבת גרסה למכשיר Qin לוקחת בין 30 ל-60 דקות. רוב ההתקנות מבוצעות ביום הפנייה, בתיאום מראש.",
  },
  {
    q: "האם הסינון מוחק לי את התוכן מהטלפון?",
    a: "תלוי בפתרון. סינון בסיסי וכושר פליי מותקנים בלי למחוק דבר. הדרן, עסקן וצריבת גרסה ל-Qin נעשים על מכשיר מאופס או חדש, ולכן דורשים גיבוי מלא מראש של תמונות, אנשי קשר והודעות. אנחנו תמיד מיידעים על כך לפני שמתחילים.",
  },
  {
    q: "האם אפשר להסיר את הסינון?",
    a: "הדרן לא ניתן להסרה – גם איפוס להגדרות יצרן לא מוריד את החסימה, וזו בדיוק הסיבה שהורים בוחרים בו. כושר פליי כולל צריבת MDM שמונעת איפוס והסרה. סינון בסיסי ניתן לשינוי ולהסרה. בכל מקרה, שינוי או הסרה נעשים מולנו או מול חברת הסינון.",
  },
  {
    q: "האם הצריבה פוגעת בטלפון?",
    a: "לא. מדובר בשכבת תוכנה מקצועית שמותקנת על המכשיר. הצריבה אינה פוגעת בחומרה ואינה משפיעה לרעה על ביצועי הטלפון או על חיי הסוללה.",
  },
  {
    q: "איזה סינון הכי מתאים לילדים?",
    a: "לילדים ולנוער אנחנו ממליצים על פתרון שלא ניתן להסרה, כדי שהסינון לא ייעלם באיפוס. ההמלצה שלנו כיום היא עסקן – הגנה חזקה יחד עם מכשיר שממשיך לתפקד. מי שרוצה את האטימות המרבית יבחר בהדרן, וכושר פליי מתאים למי שרוצה מכשיר שמיש עם חנות אפליקציות כשרה. אפשר גם להשתמש ביועץ הסינון באתר כדי לקבל התאמה לפי הגיל והשימוש.",
  },
  {
    q: "האם אתם מסננים גם אייפון?",
    a: "כן. אנחנו מתקינים סינון על כל דגמי האייפון. בסינון הבסיסי אפשר גם לחסום את ה-App Store לחלוטין, כך שלא ניתן להתקין אפליקציות חדשות.",
  },
  {
    q: "האם אתם מסננים סמסונג גלקסי?",
    a: "כן. אנחנו מסננים את כל מכשירי סמסונג גלקסי – Galaxy S, Galaxy A ו-Galaxy Note – וכן כל מכשיר אנדרואיד אחר. כל רמות הסינון זמינות, מסינון בסיסי ב-100₪ ועד הדרן ב-300₪.",
  },
  {
    q: "עם אילו חברות סינון אתם עובדים?",
    a: "אנחנו משווקים מורשים של הדרן (Hadran), עסקן (Askan) וכושר פליי (Kosher Play). בנוסף אנחנו מספקים סינון בסיסי עצמאי וצריבת גרסאות כשרות למכשירי שיאומי Qin.",
  },
  {
    q: "צריך לקבוע תור מראש?",
    a: "כן, עדיף. אנחנו נמצאים בחטיבת גבעתי 2, כניסה ו׳, רובע ג׳ באשדוד, ועובדים בתיאום מראש בטלפון 052-718-6881 או בוואטסאפ. כך אנחנו מוודאים שהמכשיר שלכם מטופל מיד בהגעה.",
  },
  {
    q: "יש לכם פתרון ליוטיוב?",
    a: "כן. פיתחנו את FilterTube – אפליקציית אנדרואיד אחת ובה גם יוטיוב מסונן וגם יוטיוב מיוזיק מסונן (FilterMusic), עם שלוש רמות סינון, מנעול הורים, מצב ״הכל כאודיו״, מיקסים, נגינה ברקע וללא פרסומות. כל ערוץ מאושר ידנית על ידי אדם. אפשר להוריד אותה בחינם מעמוד FilterTube באתר.",
  },
  {
    q: "אתם נותנים שירות גם מחוץ לאשדוד?",
    a: "המעבדה שלנו נמצאת באשדוד, ואלינו מגיעים לקוחות גם מאשקלון, יבנה, גדרה, קרית מלאכי והסביבה. חלק מהפתרונות, כמו סינון בסיסי, ניתנים לביצוע גם מרחוק – שווה להתקשר ולבדוק.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const FAQ = () => (
  <section className="section-padding bg-surface-sunken" aria-label="שאלות נפוצות על סינון טלפונים">
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
    </Helmet>

    <div className="container-custom grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <SectionHeading
          eyebrow="שאלות נפוצות"
          title="מה שואלים אותנו הכי הרבה"
          lead="ואם השאלה שלכם לא כאן – פשוט תרימו טלפון, נענה בכנות."
        />
        <AnimatedSection delay={0.1} className="mt-6">
          <Link to="/contact" className="text-[0.9375rem] font-semibold text-primary link-underline">
            לשאלה שלא מופיעה כאן ←
          </Link>
        </AnimatedSection>
      </div>

      <div className="lg:col-span-8">
        <AnimatedSection delay={0.08}>
          <Accordion type="single" collapsible className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {faqs.map((faq, i) => (
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
