import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, Database, Download, Globe, ListChecks, MessageCircle,
  Scan, ScanSearch, Server, ShieldAlert, ShieldCheck, Smartphone, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import PhoneFrame from "@/components/PhoneFrame";
import { SITE, waLink } from "@/lib/site";
import { faqJsonLd, type FaqItem } from "@/lib/faq";
import { BLOCK_CATEGORIES, FILTERPHONE, FILTER_LEVELS, IMAGE_EXTRAS } from "@/lib/filterphoneApp";

/**
 * The image-filtering deep-dive. The homepage sells FilterPhone as a whole; this
 * page answers the one question people search for separately — how the image
 * filter decides — and carries what the homepage has no room for: the order of
 * checks, the forty-five toggles, and the onboarding screens.
 */

const WA = waLink("שלום, אשמח לפרטים על סינון התמונות של FilterPhone");

/** What happens to one image, in the order the engine does it. */
const PIPELINE = [
  {
    icon: Database,
    title: "כבר נבדקה? עוברת מיד",
    desc: "כל תמונה נזכרת לפי טביעה. תמונה שכבר נבדקה פעם אחת לא נבדקת שוב — היא עוברת מהזיכרון.",
  },
  {
    icon: ScanSearch,
    title: "סיווג",
    desc: "המנוע מזהה מה יש בתמונה: נוף, מוצר, אנשים — ומי מהם.",
  },
  {
    icon: ShieldAlert,
    title: "זיהוי תוכן בוטה",
    desc: "תוכן בוטה ומפורש נחסם בכל רמה, בלי יוצא מן הכלל.",
  },
  {
    icon: Scan,
    title: "צביעה לפי הצורה",
    desc: "ברמה הבינונית המנוע מזהה את הצורה בתוך התמונה וצובע באפור רק את מה שצריך — כל אדם בנפרד.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "מה ההבדל בין שלוש רמות סינון התמונות?",
    a: "מחמיר — הרמה השמורה ביותר: נופים, מוצרים ותמונות של גברים עוברים, וכל השאר נחסם. זו ברירת המחדל ללקוח חדש. בינוני — תמונות צנועות עוברות, חשיפה מוסתרת אוטומטית ונצבעת באפור לפי הצורה, ותמונה חשופה ברובה נחסמת כולה. בסיסי — רק תוכן בוטה ומפורש נחסם.",
  },
  {
    q: "מה זה ״נצבע באפור לפי הצורה״?",
    a: "במקום לחסום או לטשטש תמונה שלמה, המנוע מזהה את הצורה בתוך התמונה וצובע באפור רק את מה שצריך להסתיר. כל אדם בתמונה מסווג בנפרד, כך שהצביעה חלה רק על מי שצריך. האתר נשאר שמיש, ולא הופך לקיר של ריבועים.",
  },
  {
    q: "איפה סינון התמונות פועל?",
    a: "בכל אתר בכרום, ובאפליקציות שאפשר לסנן. באפליקציות שאי אפשר לסנן, ברמות מחמיר ובינוני התמונות פשוט לא נטענות. תמונות פרופיל בוואטסאפ מכוסות בנפרד, גם אלה שכבר שמורות בטלפון.",
  },
  {
    q: "מה קורה אם המנוע לא מצליח לבדוק תמונה?",
    a: "ברמות מחמיר ובינוני — התמונה נחסמת. המערכת לא מציגה תמונה שלא נבדקה.",
  },
  {
    q: "זה מאט את הגלישה?",
    a: "תמונה שכבר נבדקה פעם אחת עוברת מיד מהזיכרון, בלי בדיקה חוזרת — ורוב התמונות באתרים שחוזרים אליהם כבר נבדקו.",
  },
  {
    q: "אפשר לחסום את כל התמונות?",
    a: "כן. מעבר לרמה אפשר לבחור ״בלי תמונות בכלל״ — כל תמונה מוחלפת במלבן אפור — וגם ״בלי וידאו בדפדפן״.",
  },
  {
    q: "מי קובע את הרמה?",
    a: "אנחנו, לפי מה שביקשתם. באפליקציה אין מסך שמשנה רמה; שולחים בקשת שינוי, היא מגיעה אלינו, ומקבלים עדכון כשאושרה. אם הוגדר קוד הורים — השינוי רק איתו.",
  },
];

/* ------------------------------------------------------------------ */

const Eyebrow = ({ children }: { children: React.ReactNode }) => <span className="eyebrow">{children}</span>;

const FilterPhoneApp = () => {
  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/#filterphone-app`,
    name: "FilterPhone",
    alternateName: ["פילטר פון", "סינון תמונות FilterPhone"],
    operatingSystem: "Android 8.0+",
    applicationCategory: "SecurityApplication",
    inLanguage: "he",
    url: `${SITE.url}/`,
    downloadUrl: FILTERPHONE.apk,
    installUrl: FILTERPHONE.apk,
    softwareHelp: `${SITE.url}/install`,
    publisher: { "@id": `${SITE.url}/#business` },
    screenshot: [`${SITE.url}/filterphone/levels.jpg`, `${SITE.url}/filterphone/blocks.jpg`],
    offers: {
      "@type": "Offer",
      price: String(FILTERPHONE.price.amount),
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
    description:
      "סינון תמונות לטלפון אנדרואיד בשלוש רמות: כל תמונה נבדקת בשרת לפני שהיא מוצגת, וברמה הבינונית חשיפה נצבעת באפור לפי הצורה.",
  };

  return (
    <>
      <SEOHead
        title="סינון תמונות לטלפון – שלוש רמות | FilterPhone פילטר פון"
        description="איך סינון התמונות של FilterPhone עובד: כל תמונה נבדקת בשרת לפני שהיא מוצגת, בשלוש רמות — מחמיר, בינוני ובסיסי. חשיפה נצבעת באפור לפי הצורה, בכרום ובאפליקציות."
        path="/filterphone"
        keywords="סינון תמונות, סינון תמונות לטלפון, סינון תמונות אנדרואיד, מסנן תמונות, חסימת תמונות, אפליקציה לסינון תמונות, סינון תמונות בכרום, סינון תמונות וואטסאפ, FilterPhone, פילטר פון"
        image={`${SITE.url}/filterphone-og.jpg`}
        imageAlt="FilterPhone – סינון תמונות בשלוש רמות"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(softwareLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd(FAQS))}</script>
      </Helmet>

      <Breadcrumbs items={[{ label: "סינון תמונות" }]} />

      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden" aria-label="סינון תמונות לטלפון">
        <div className="pointer-events-none absolute inset-0 texture-traces opacity-40" aria-hidden="true" />
        <div className="container-custom relative grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 rounded-sm bg-accent-tint px-3 py-1.5 text-[0.8125rem] font-bold text-accent">
              <Sparkles className="h-4 w-4" />
              חלק מ-FilterPhone
            </span>

            <h1 className="mt-6 text-display-xl text-ink">
              סינון תמונות לטלפון
              <span className="mt-1 block text-primary">שבודק כל תמונה.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
              ב-FilterPhone כל תמונה נבדקת בשרת <strong className="font-semibold text-ink">לפני</strong> שהיא
              מגיעה למסך — בכל אתר בכרום ובאפליקציות שאפשר לסנן. שלוש רמות לבחירה, וברמה הבינונית לא
              חוסמים תמונה שלמה: מסתירים רק את מה שצריך.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={FILTERPHONE.apk} rel="noopener">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  <Download className="h-4 w-4" />
                  הורדת האפליקציה
                </Button>
              </a>
              <Link to="/">
                <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                  כל מה שיש ב-FilterPhone
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-[0.8125rem] text-muted-foreground">
              האפליקציה מותקנת מחוץ לחנות — זה תקין.{" "}
              <Link to="/install" className="font-semibold text-primary link-underline">מדריך התקנה צעד-צעד</Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:col-span-5"
          >
            <PhoneFrame shot="levels" alt="בחירת רמת סינון התמונות באפליקציית FilterPhone" className="max-w-[14rem]" priority sizes="224px" />
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------------- The levels */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="שלוש רמות סינון תמונות">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>שלוש רמות</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">אותה תמונה, שלוש תשובות אפשריות</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              הפער בין ״הכול חסום״ ל״כלום לא חסום״ גדול מדי, אז יש שלוש רמות — וכל אחת מתנהגת אחרת מול
              אותה תמונה בדיוק. את הרמה קובעים אנחנו, לפי מה שביקשתם.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {FILTER_LEVELS.map((lvl, i) => (
              <AnimatedSection key={lvl.level} delay={i * 0.07}>
                <div className="panel h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-tint text-primary">
                      <lvl.icon className="h-[1.125rem] w-[1.125rem]" />
                    </span>
                    {lvl.isDefault ? (
                      <span className="rounded-sm bg-accent-tint px-2 py-0.5 text-[0.6875rem] font-bold text-accent">ברירת מחדל</span>
                    ) : (
                      <span className="num text-[0.75rem] font-bold text-muted-foreground">רמה {lvl.level}</span>
                    )}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-ink">{lvl.name}</h3>
                  <p className="mt-1 text-[0.875rem] font-semibold text-primary">{lvl.short}</p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{lvl.desc}</p>
                  {lvl.detail && (
                    <p className="mt-3 border-t border-border pt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {lvl.detail}
                    </p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2} className="mt-4">
            <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {IMAGE_EXTRAS.map((x) => (
                <div key={x.title} className="flex items-start gap-3.5 bg-surface p-5">
                  <x.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>
                    <span className="block text-[0.9375rem] font-bold text-ink">{x.title}</span>
                    <span className="block text-[0.875rem] text-ink-soft">{x.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------------ How it checks */}
      <section className="section-padding" aria-label="איך תמונה נבדקת">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>מאחורי הקלעים</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">מה קורה לתמונה בדרך למסך</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              התמונה לא מגיעה לטלפון ישר מהאתר. היא עוברת קודם דרך השרת שלנו, ושם נבדקת בסדר הזה.
            </p>
          </AnimatedSection>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PIPELINE.map((p, i) => (
              <li key={p.title}>
                <AnimatedSection delay={i * 0.06} className="h-full">
                  <div className="panel h-full p-6">
                    <div className="flex items-center gap-3">
                      <span className="num text-[0.8125rem] font-bold tracking-widest text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-tint text-primary">
                        <p.icon className="h-[1.0625rem] w-[1.0625rem]" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-[0.9375rem] font-bold text-ink">{p.title}</h3>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-soft">{p.desc}</p>
                  </div>
                </AnimatedSection>
              </li>
            ))}
          </ol>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AnimatedSection delay={0.2}>
              <div className="flex h-full items-start gap-4 rounded-lg bg-primary-tint p-6">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-[0.9375rem] leading-relaxed text-ink">
                  <strong className="font-bold">תמונה שלא נבדקה — לא מוצגת.</strong> ברמות מחמיר ובינוני, אם
                  המנוע לא הצליח לבדוק תמונה מכל סיבה שהיא, היא נחסמת.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.25}>
              <div className="flex h-full items-start gap-4 rounded-lg border border-border bg-surface p-6">
                <Server className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                  <strong className="font-semibold text-ink">השרת שלנו, בישראל.</strong> התעבורה מוצפנת
                  מהטלפון אל השרת, והסינון לא עובר דרך שירות חיצוני בחו״ל.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Where it applies */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="איפה סינון התמונות פועל">
        <div className="container-custom grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <AnimatedSection className="lg:col-span-7">
            <Eyebrow>איפה זה פועל</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">בכרום, באפליקציות ובוואטסאפ</h2>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Globe, t: "כל אתר בכרום", d: "כל תמונה בכל אתר נבדקת לפני שהיא מוצגת. כרום הוא הדפדפן היחיד, ושאר הדפדפנים חסומים — כדי שאי אפשר לעקוף." },
                { icon: Smartphone, t: "אפליקציות שאפשר לסנן", d: "התמונות נבדקות כמו בכרום. באפליקציות שאי אפשר לסנן, ברמות מחמיר ובינוני התמונות פשוט לא נטענות." },
                { icon: MessageCircle, t: "תמונות פרופיל בוואטסאפ", d: "מכוסות בכיסוי לבן על המסך — גם אלה שכבר שמורות בטלפון." },
              ].map((r) => (
                <li key={r.t} className="flex gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface text-primary shadow-sm">
                    <r.icon className="h-[1.0625rem] w-[1.0625rem]" />
                  </span>
                  <span>
                    <span className="block text-[0.9375rem] font-bold text-ink">{r.t}</span>
                    <span className="mt-1 block text-[0.9375rem] leading-relaxed text-ink-soft">{r.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="lg:col-span-5">
            <div className="flex justify-center gap-4">
              <PhoneFrame shot="welcome" alt="מסך הפתיחה של FilterPhone" className="max-w-[11rem]" sizes="176px" />
              <PhoneFrame shot="blocks" alt="בחירת חסימות באפליקציית FilterPhone" className="hidden max-w-[11rem] translate-y-6 sm:block" sizes="176px" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* -------------------------------------------------- Block catalogue */}
      <section className="section-padding" aria-label="חסימות בלחיצה">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>מעבר לתמונות</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">
              <span className="num">{FILTERPHONE.optionCount}</span> חסימות, ב-12 נושאים
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              מלבד רמת התמונות, כל מכשיר מקבל רשימת מתגים. בוחרים מה לחסום כבר בהצטרפות, והשינוי חל תוך
              שניות — בלי להתקין שום דבר מחדש.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {BLOCK_CATEGORIES.map((c, i) => (
              <AnimatedSection key={c.title} delay={(i % 3) * 0.05}>
                <div className="h-full bg-surface p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[0.9375rem] font-bold text-ink">{c.title}</h3>
                    <span className="num shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[0.6875rem] font-bold text-muted-foreground">
                      {c.count}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-soft">{c.desc}</p>
                  {c.examples && <p className="mt-2.5 text-[0.8125rem] leading-snug text-muted-foreground">{c.examples}</p>}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ FAQ */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="שאלות נפוצות על סינון תמונות">
        <div className="container-custom grid gap-10 lg:grid-cols-12 lg:gap-12">
          <AnimatedSection className="lg:col-span-4">
            <Eyebrow>שאלות נפוצות</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">על סינון התמונות</h2>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-primary link-underline">
              לשאלה שלא מופיעה כאן
              <ArrowLeft className="h-4 w-4" />
            </a>
          </AnimatedSection>
          <AnimatedSection delay={0.08} className="lg:col-span-8">
            <Accordion type="single" collapsible className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
              {FAQS.map((faq, i) => (
                <AccordionItem key={faq.q} value={`img-faq-${i}`} className="border-0 px-5 md:px-6">
                  <AccordionTrigger className="py-[1.125rem] text-right text-[0.9375rem] font-bold text-ink hover:no-underline md:text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[0.9375rem] leading-relaxed text-ink-soft">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* --------------------------------------------------- Long-form copy */}
      <section className="section-padding" aria-label="סינון תמונות – המדריך הקצר">
        <div className="container-custom max-w-3xl">
          <h2 className="text-display-sm text-ink">סינון תמונות לטלפון – המדריך הקצר</h2>
          <div className="prose-fp mt-6">
            <p>
              <strong>סינון תמונות</strong> הוא החלק הקשה בסינון טלפון. לחסום אתרים זה פתיר: יש רשימות, יש
              שמות מתחם. אבל תמונה שמגיעה מאתר שהוא עצמו בסדר גמור, בתוך אפליקציה לגיטימית, היא בעיה
              אחרת לגמרי — ובשבילה בנינו את מנוע התמונות של <strong>FilterPhone</strong>.
            </p>
            <h3>למה שלוש רמות</h3>
            <p>
              רוב מערכות הסינון מציעות מתג אחד: סינון תמונות דולק או כבוי. בפועל, בית אחד רוצה את הרמה
              השמורה ביותר, ובית אחר רוצה רק שלא ייחשף תוכן בוטה. ברמה <strong>מחמיר</strong> עוברים רק
              נופים, מוצרים ותמונות של גברים. ברמה <strong>בינוני</strong> תמונות צנועות עוברות, וחשיפה
              מוסתרת אוטומטית. ברמה <strong>בסיסי</strong> רק תוכן בוטה ומפורש נחסם.
            </p>
            <h3>הסתרה לפי הצורה במקום חסימה של תמונה שלמה</h3>
            <p>
              ההבדל הטכני המרכזי הוא שהמנוע מזהה את הצורה בתוך התמונה, במקום להתייחס לתמונה כאל יחידה
              אחת. כך אפשר להשאיר את התמונה במקומה ולצבוע באפור רק את מה שצריך, וכל אדם בתמונה מסווג
              בנפרד. בפועל זה אומר שאפשר להמשיך לגלוש, לקנות ולקרוא בלי שהאינטרנט ייראה כמו קיר של
              ריבועים — ותמונה חשופה ברובה עדיין נחסמת כולה.
            </p>
            <p>
              סינון התמונות הוא חלק אחד מ-FilterPhone, לצד ארבע רמות גלישה, וואטסאפ מסונן, Google Play
              מנוהל וניהול מכשיר מלא. את התמונה המלאה אפשר לראות ב<Link to="/">עמוד הראשי</Link>, ואת
              ההתקנה צעד-צעד ב<Link to="/install">מדריך ההתקנה</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="border-t border-border bg-surface-sunken py-12" aria-label="להמשיך">
        <div className="container-custom">
          <AnimatedSection>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
                  <BadgeCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-ink">מוכנים להתחיל?</h2>
                  <p className="mt-1.5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
                    מורידים, מתקינים מהטלפון עצמו ובוחרים רמה — ואנחנו מאשרים ומפעילים.
                  </p>
                </div>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row">
                <a href={FILTERPHONE.apk} rel="noopener">
                  <Button className="w-full gap-2 sm:w-auto">
                    <Download className="h-4 w-4" />
                    הורדת האפליקציה
                  </Button>
                </a>
                <Link to="/install">
                  <Button variant="outline" className="w-full gap-2 sm:w-auto">
                    <ListChecks className="h-4 w-4" />
                    מדריך התקנה
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default FilterPhoneApp;
