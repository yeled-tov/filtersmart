import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, Ban, Check, Download, Eye, Globe, Image as ImageIcon,
  Layers, Lock, MessageCircle, Scan, Server, Settings2, Shield, ShieldCheck,
  Smartphone, Sparkles, ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import { SITE, waLink } from "@/lib/site";
import { FILTERPHONE } from "@/lib/filterphoneApp";

/* Screens from the app itself, bundled so they work on any host. */
const SHOTS = {
  welcome: "/filterphone/welcome.jpg",
  details: "/filterphone/details.jpg",
  levels: "/filterphone/levels.jpg",
  blocks: "/filterphone/blocks.jpg",
  blocks2: "/filterphone/blocks2.jpg",
};

const WA = waLink("שלום, אשמח לפרטים על אפליקציית הסינון של FilterPhone");

/* ------------------------------------------------------------------ */

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="eyebrow">{children}</span>
);

/**
 * A device frame that stands straight, with no drawn-on notch — the status bar
 * is already cropped out of the screenshots, and anything painted over the top
 * just hides the app's own header.
 */
const Phone = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
  <div className={`aspect-[640/880] w-full max-w-[15rem] overflow-hidden rounded-[1.75rem] border-[6px] border-ink bg-ink shadow-float ${className}`}>
    <img
      src={src}
      alt={alt}
      width={240}
      height={330}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  </div>
);

/**
 * An abstract stand-in for a filtered photo. Three grey blocks on a card, with
 * the level's treatment applied on top — enough to show what each level does
 * without putting a real photograph on the page.
 */
const LevelPreview = ({ level }: { level: 1 | 2 | 3 }) => (
  <div
    className="relative h-28 w-full overflow-hidden rounded-md border border-border bg-muted"
    role="img"
    aria-label={
      level === 1
        ? "המחשה: ברמה מחמיר התמונה כולה נחסמת"
        : level === 2
          ? "המחשה: ברמה בינוני אזורי החשיפה נצבעים בשחור לפי צורת הגוף"
          : "המחשה: ברמה בסיסי התמונה עוברת, ורק עירום מפורש נחסם"
    }
  >
    {/* the "photo": a horizon and a figure, as flat shapes */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(205_22%_82%)] to-[hsl(205_18%_72%)]" />
    <span className="absolute bottom-0 left-0 right-0 h-9 bg-[hsl(205_14%_62%)]" />
    <span className="absolute bottom-3 left-1/2 h-16 w-7 -translate-x-1/2 rounded-t-full bg-[hsl(205_12%_52%)]" />
    <span className="absolute bottom-[4.25rem] left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[hsl(205_12%_52%)]" />

    {level === 1 && (
      <span className="absolute inset-0 flex items-center justify-center bg-ink/92 text-[0.8125rem] font-bold text-white">
        <Ban className="ml-1.5 h-4 w-4" aria-hidden="true" />
        נחסם
      </span>
    )}
    {level === 2 && (
      <>
        {/* black only over the body shape, never the face */}
        <span className="absolute bottom-3 left-1/2 h-11 w-7 -translate-x-1/2 rounded-t-full bg-ink" />
        <span className="absolute bottom-2 left-1/2 ml-[0.9rem] h-5 w-2.5 rounded-full bg-ink" />
        <span className="absolute bottom-2 left-1/2 -ml-[1.4rem] h-5 w-2.5 rounded-full bg-ink" />
      </>
    )}
    {level === 3 && (
      <span className="absolute bottom-1.5 right-1.5 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-bold text-ink">
        עובר
      </span>
    )}
  </div>
);

/* ------------------------------------------------------------------ */

const FilterPhoneApp = () => {
  const { levels, categories, price, apk, apkUniversal, android } = FILTERPHONE;

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FilterPhone – אפליקציית סינון תמונות ואינטרנט",
    alternateName: ["פילטר פון", "FilterPhone APK", "סינון תמונות", "אפליקציית סינון"],
    operatingSystem: android,
    applicationCategory: "SecurityApplication",
    inLanguage: "he",
    url: `${SITE.url}/filterphone`,
    downloadUrl: apk,
    installUrl: apk,
    softwareHelp: `${SITE.url}/filterphone`,
    featureList: [
      "שלוש רמות סינון תמונות",
      "סגמנטציה — צביעת אזורי חשיפה לפי צורת הגוף",
      "סינון כלל-מכשירי דרך VPN, בכל האפליקציות והדפדפנים",
      "חסימת אתרים ואפליקציות בלחיצה",
      "מגן FilterPhone – אכיפה בתוך הטלפון",
      "ניהול מרחוק על ידי המנהל, בלי גישה של המשתמש",
    ],
    offers: {
      "@type": "Offer",
      price: String(price.amount),
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/filterphone`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(price.amount),
        priceCurrency: "ILS",
        unitCode: "ANN",
        billingDuration: 1,
        billingIncrement: 1,
      },
    },
    publisher: { "@id": `${SITE.url}/#business` },
    screenshot: [
      `${SITE.url}${SHOTS.levels}`,
      `${SITE.url}${SHOTS.blocks}`,
      `${SITE.url}${SHOTS.welcome}`,
    ],
    description:
      "אפליקציית סינון מבית FilterPhone: סינון תמונות בשלוש רמות, כולל סגמנטציה שצובעת אזורי חשיפה לפי צורת הגוף, סינון אתרים ואפליקציות בלחיצה, והגנה מפני עקיפה. פועלת על כל הטלפון, לא רק בדפדפן.",
  };

  const faqs = [
    {
      q: "מה ההבדל בין שלוש רמות הסינון?",
      a: "מחמיר – כל תמונה של אישה או ילדה נחסמת, גם בלבוש צנוע; תמונות של גברים, נופים ומוצרים עוברות. בינוני – תמונות בלבוש צנוע עוברות, ואזורי עור חשוף נצבעים בשחור לפי צורת הגוף; בלבוש חשוף מאוד נצבע כל הגוף חוץ מהפנים, ועירום נחסם לגמרי. בסיסי – רק עירום מפורש נחסם. את הרמה קובע המנהל, ורק הוא יכול לשנות אותה.",
    },
    {
      q: "מה זה בעצם סגמנטציה, ובמה זה שונה מטשטוש?",
      a: "רוב המסננים מטשטשים או חוסמים תמונה שלמה. כאן המערכת מזהה את צורת הגוף בתוך התמונה וצובעת בשחור רק את אזורי החשיפה – ידיים, כתפיים, רגליים – ומשאירה את שאר התמונה קריאה. כל אדם בתמונה מסווג בנפרד, כך שגבר באותה תמונה לא נצבע. התוצאה: אפשר להמשיך להשתמש באתר בלי שהוא ייראה כמו קיר חסימות.",
    },
    {
      q: "זה עובד בכל האפליקציות או רק בדפדפן?",
      a: "חסימת האתרים והאפליקציות עובדת בכל הטלפון – כל אפליקציה וכל דפדפן. סינון התמונות עצמו חל על Chrome ודפדפנים דומים, כי אפליקציות אחרות באנדרואיד 7 ומעלה לא סומכות על תעודת סינון שהמשתמש התקין. באפליקציות האלה, ברמות מחמיר ובינוני התמונות פשוט לא נטענות, וברמה בסיסי הן עוברות. אפשר לקבוע את ההתנהגות הזו לכל מכשיר בנפרד.",
    },
    {
      q: "המשתמש יכול לעקוף או לכבות את הסינון?",
      a: "רמת הסינון והחסימות נקבעות אצלנו ולא במכשיר – למשתמש אין מסך שבו הוא משנה אותן. הוא יכול לשלוח בקשת שינוי מהאפליקציה, והיא מגיעה אלינו לאישור. יש גם חסימה ייעודית של אפליקציות VPN ואתרי הורדת APK. ״מגן FilterPhone״ שבטלפון דורש הפעלה חד-פעמית של המשתמש בהגדרות הנגישות, והוא יכול לכבות אותו – אבל אנחנו רואים את זה מיד בממשק.",
    },
    {
      q: "כמה זה עולה?",
      a: `${price.label} למכשיר. זהו מנוי שנתי שכולל את השרת, העדכונים, שינויי רמה וחסימות לפי בקשה, ותמיכה. אין עלות התקנה נפרדת ואין צורך לאפס את המכשיר.`,
    },
    {
      q: "צריך לאפס את הטלפון כדי להתקין?",
      a: "לא. ההתקנה היא אפליקציה רגילה – לא צריך מכשיר חדש או מאופס, ולא נמחקים נתונים. זה ההבדל הגדול מול צריבות כמו הדרן או עסקן, שדורשות מכשיר מאופס.",
    },
    {
      q: "יש גרסה לאייפון?",
      a: "בשלב זה האפליקציה היא לאנדרואיד בלבד. גרסה לאייפון בפיתוח. בינתיים לאייפון יש לנו פתרונות אחרים – אפשר לראות אותם בעמוד השירותים או לדבר איתנו.",
    },
    {
      q: "איך מתחילים?",
      a: "מורידים את האפליקציה, ממלאים בתוכה בקשת הצטרפות – שם, טלפון, רמת הסינון ומה עוד לחסום – ושולחים. אנחנו מאשרים, והטלפון מתחבר לבד. מרגע האישור זה עניין של דקות.",
    },
  ];

  const faqLd = {
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
      <SEOHead
        title="סינון תמונות לטלפון – אפליקציית הסינון של FilterPhone | 150₪ לשנה"
        description="אפליקציית סינון תמונות ואינטרנט לאנדרואיד מבית FilterPhone. שלוש רמות סינון תמונות, כולל סגמנטציה שצובעת אזורי חשיפה לפי צורת הגוף, חסימת אתרים ואפליקציות בלחיצה והגנה מפני עקיפה. בלי לאפס את המכשיר. 150₪ לשנה."
        path="/filterphone"
        keywords="סינון תמונות, סינון תמונות לטלפון, אפליקציית סינון, סינון אינטרנט, סינון טלפון, סינון תמונות אנדרואיד, חסימת תמונות, סינון תמונות נשים, אפליקציה לסינון תמונות, FilterPhone, פילטר פון, סינון חכם, סינון בלי איפוס, חלופה לנטפרי, סינון אשדוד"
        image={`${SITE.url}/filterphone-og.jpg`}
        imageAlt="FilterPhone – אפליקציית סינון תמונות ואינטרנט לאנדרואיד"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(softwareLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <Breadcrumbs items={[{ label: "אפליקציית הסינון שלנו" }]} />

      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden" aria-label="אפליקציית הסינון של FilterPhone">
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
              פיתוח עצמי · חדש אצלנו
            </span>

            <h1 className="mt-6 text-display-xl text-ink">
              סינון תמונות שלא
              <span className="mt-1 block text-primary">מכבה לכם את האינטרנט.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
              פיתחנו אפליקציית סינון משלנו. במקום לחסום תמונה שלמה או לטשטש את כל המסך, היא
              מזהה מה יש בתמונה וצובעת <strong className="font-semibold text-ink">רק את אזורי החשיפה,
              לפי צורת הגוף</strong>. שלוש רמות סינון לבחירתכם, חסימת אתרים ואפליקציות בלחיצה –
              והכול בלי לאפס את המכשיר.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-baseline gap-2">
                <span className="num text-display-sm font-extrabold text-primary">{price.label}</span>
                <span className="text-[0.9375rem] text-muted-foreground">לשנה, למכשיר</span>
              </div>
              <span className="hidden h-8 w-px bg-border sm:block" aria-hidden="true" />
              <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[0.875rem] text-ink-soft">
                {["בלי לאפס את המכשיר", "בלי חשבון גוגל", android].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-success" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={apk} rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <Download className="h-4 w-4" />
                  הורדת האפליקציה (APK)
                </Button>
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  לשאול אותנו קודם
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="flex justify-center lg:hidden">
              <Phone src={SHOTS.welcome} alt="מסך הפתיחה של אפליקציית FilterPhone" className="mb-8 max-w-[13rem]" />
            </div>
            <div className="panel p-7 md:p-8">
              <div className="flex items-center gap-4">
                <img
                  src="/filterphone-app-icon.png"
                  alt="סמל אפליקציית FilterPhone"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl"
                />
                <div>
                  <h2 className="text-lg font-bold text-ink">FilterPhone</h2>
                  <p className="text-[0.875rem] text-muted-foreground">אפליקציית הסינון שלנו</p>
                </div>
              </div>

              <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-border pt-6">
                {[
                  { t: "רמות סינון תמונות", v: "3" },
                  { t: "חסימות בלחיצה", v: `${FILTERPHONE.optionCount}` },
                  { t: "מערכת", v: "אנדרואיד" },
                  { t: "השרת", v: "בישראל" },
                ].map((f) => (
                  <div key={f.t}>
                    <dt className="text-[0.75rem] text-muted-foreground">{f.t}</dt>
                    <dd className="num mt-1 text-[1.0625rem] font-bold text-ink">{f.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 rounded-md bg-surface-sunken p-4 text-[0.8125rem] leading-relaxed text-ink-soft">
                הסינון פועל על כל התעבורה של הטלפון, לא רק בדפדפן. רמת הסינון נקבעת אצלנו –
                למשתמש אין מסך שבו הוא משנה אותה.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------- The levels */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="רמות הסינון">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>הלב של המערכת</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">שלוש רמות – ואת הרמה בוחרים אתם</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              לא כל בית צריך את אותו דבר, והפער בין ״הכול חסום״ ל״כלום לא חסום״ גדול מדי.
              לכן יש שלוש רמות, וכל אחת מהן מתנהגת אחרת מול אותה תמונה בדיוק.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {levels.map((lvl, i) => (
              <AnimatedSection key={lvl.name} delay={i * 0.07}>
                <div className="panel h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-tint text-primary">
                      <lvl.icon className="h-[1.125rem] w-[1.125rem]" />
                    </span>
                    <span className="num text-[0.75rem] font-bold text-muted-foreground">
                      רמה {lvl.level}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-ink">{lvl.name}</h3>
                  <p className="mt-1 text-[0.875rem] font-semibold text-primary">{lvl.short}</p>

                  <div className="mt-5">
                    <LevelPreview level={lvl.level} />
                  </div>

                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">{lvl.desc}</p>

                  {lvl.note && (
                    <p className="mt-3 border-t border-border pt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {lvl.note}
                    </p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2} className="mt-4">
            <div className="flex items-start gap-4 rounded-lg bg-primary-tint p-6">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-[0.9375rem] leading-relaxed text-ink">
                <strong className="font-bold">את הרמה קובעים אנחנו, לא המשתמש.</strong> באפליקציה אין
                מסך שמשנה רמת סינון. אפשר לשלוח בקשת שינוי, והיא מגיעה אלינו לאישור – כך שהסינון
                נשאר יציב גם אחרי רגע של חולשה.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* -------------------------------------------------- Segmentation */}
      <section className="section-padding" aria-label="סגמנטציה – איך זה עובד">
        <div className="container-custom grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <AnimatedSection className="lg:col-span-6">
            <Eyebrow>מה שונה כאן</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">
              צביעה לפי צורת הגוף, לא ריבוע על חצי מסך
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft">
              ברמה הבינונית המערכת לא מחליטה רק ״תמונה בעייתית או לא״. היא מזהה את צורת הגוף בתוך
              התמונה וצובעת בשחור בדיוק את אזורי החשיפה, ומשאירה את שאר התמונה כפי שהיא.
            </p>
            <ul className="mt-7 space-y-3.5">
              {[
                ["כל אדם בתמונה מסווג בנפרד", "גבר שעומד באותה תמונה לא נצבע."],
                ["הפנים נשארות", "גם בלבוש חשוף מאוד, שבו נצבע כל הגוף, הפנים לא נצבעות."],
                ["האתר נשאר שמיש", "לא מקבלים עמוד שנראה כמו קיר של ריבועים אפורים."],
                ["עירום – חסימה מלאה", "שם אין צביעה חלקית; התמונה פשוט לא מוצגת."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <BadgeCheck className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-success" />
                  <span>
                    <span className="block text-[0.9375rem] font-semibold text-ink">{t}</span>
                    <span className="block text-[0.875rem] leading-snug text-muted-foreground">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="lg:col-span-6">
            <div className="panel p-7">
              <p className="eyebrow">אותה תמונה, שלוש רמות</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                {levels.map((lvl) => (
                  <div key={lvl.level}>
                    <LevelPreview level={lvl.level} />
                    <p className="mt-2.5 text-[0.8125rem] font-bold text-ink">{lvl.name}</p>
                    <p className="text-[0.75rem] leading-snug text-muted-foreground">{lvl.short}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 border-t border-border pt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
                ההמחשה סכמטית בלבד, ונועדה להסביר את ההבדל בין הרמות.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------------ How it works */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="איך המערכת בנויה">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>איך זה בנוי</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">שלוש שכבות שעובדות יחד</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              סינון שמסתמך על שכבה אחת תמיד אפשר לעקוף. כאן כל חסימה נאכפת בכל השכבות
              שרלוונטיות לה.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Globe,
                title: "סינון אתרים",
                body: "חסימה ברמת שם המתחם, לכל מכשיר בנפרד. עובדת בכל אפליקציה ובכל דפדפן, כולל חיפוש בטוח כפוי.",
              },
              {
                icon: Scan,
                title: "מנוע התמונות",
                body: "כל תמונה נבדקת בשרת לפני שהיא מגיעה למסך: סיווג, זיהוי עירום וסגמנטציה. תוצאות נשמרות בזיכרון מטמון, כך שתמונה שכבר נבדקה עוברת מיד.",
              },
              {
                icon: Smartphone,
                title: "מגן FilterPhone",
                body: "אכיפה בתוך הטלפון עצמו: אפליקציה חסומה נסגרת, ומסכים מסוימים – כמו צפייה בסטטוסים – לא נפתחים.",
              },
            ].map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.06}>
                <div className="panel h-full p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-tint text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2} className="mt-4">
            <div className="flex items-start gap-4 rounded-lg border border-border bg-surface p-6">
              <Server className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                <strong className="font-semibold text-ink">השרת שלנו, בישראל.</strong> הסינון לא
                עובר דרך שירות חיצוני בחו״ל. התעבורה מוצפנת מהטלפון אל השרת, והחסימות מסונכרנות
                לכל מכשיר בנפרד תוך שניות.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* -------------------------------------------------- Block catalogue */}
      <section className="section-padding" aria-label="חסימות בלחיצה">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>שליטה מלאה</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">
              <span className="num">{FILTERPHONE.optionCount}</span> חסימות, בלחיצה אחת
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              מעבר לרמת התמונות, כל מכשיר מקבל רשימת מתגים. אומרים לנו מה לחסום, והשינוי חל
              תוך שניות – בלי להתקין שום דבר מחדש.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <AnimatedSection key={c.title} delay={(i % 3) * 0.05}>
                <div className="h-full bg-surface p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[0.9375rem] font-bold text-ink">{c.title}</h3>
                    <span className="num shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[0.6875rem] font-bold text-muted-foreground">
                      {c.count}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-soft">{c.desc}</p>
                  {c.examples && (
                    <p className="mt-2.5 text-[0.8125rem] leading-snug text-muted-foreground">{c.examples}</p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.2} className="mt-4">
            <div className="flex items-start gap-4 rounded-lg border border-border bg-surface p-6">
              <ToggleRight className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                בנוסף אפשר לחסום <strong className="font-semibold text-ink">כל אפליקציה</strong> שמותקנת
                בטלפון, ולנהל רשימת אתרים אישית – לחסימה או דווקא להתרה.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* --------------------------------------------------------- Screens */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="מסכים מתוך האפליקציה">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>מתוך האפליקציה</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">כך זה נראה בפועל</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              ההצטרפות כולה קורית בתוך האפליקציה: פרטים, רמת סינון, מה עוד לחסום – ושליחה.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { src: SHOTS.details, alt: "מסך הפרטים בהצטרפות ל-FilterPhone", t: "פרטים", d: "שם וטלפון, וזהו. מייל ושם מכשיר לא חובה." },
              { src: SHOTS.levels, alt: "בחירת רמת הסינון באפליקציית FilterPhone", t: "רמת סינון", d: "שלוש הרמות, עם ההסבר המלא של כל אחת." },
              { src: SHOTS.blocks, alt: "מסך בחירת החסימות – הכי מבוקשים", t: "הכי מבוקשים", d: "החסימות הנפוצות למעלה, בלחיצה אחת." },
              { src: SHOTS.blocks2, alt: "קטגוריות החסימות באפליקציית FilterPhone", t: "כל השאר לפי נושא", d: "12 נושאים, 45 אפשרויות. אפשר גם לדלג." },
            ].map((shot, i) => (
              <AnimatedSection key={shot.t} delay={i * 0.06}>
                <div className="flex flex-col items-center text-center">
                  <Phone src={shot.src} alt={shot.alt} className="max-w-[12.5rem]" />
                  <h3 className="mt-5 text-[0.9375rem] font-bold text-ink">{shot.t}</h3>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-soft">{shot.d}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Honest limits */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="מה חשוב לדעת">
        <div className="container-custom max-w-3xl">
          <AnimatedSection>
            <Eyebrow>בלי הפתעות</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">מה שחשוב לדעת לפני שמתחילים</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              אנחנו מעדיפים שתדעו את זה מאיתנו ומראש, ולא תגלו אחרי שבוע. אלה המגבלות
              האמיתיות של המערכת היום.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-10">
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
              {[
                {
                  t: "סינון התמונות חל בעיקר על הדפדפן",
                  d: "באנדרואיד 7 ומעלה, רוב האפליקציות לא סומכות על תעודת סינון שהותקנה במכשיר. לכן בדיקת התמונות עצמה עובדת ב-Chrome ובדפדפנים דומים. באפליקציות אחרות ברמות מחמיר ובינוני התמונות פשוט לא נטענות, וברמה בסיסי הן עוברות – ואת ההתנהגות הזו אפשר לקבוע לכל מכשיר.",
                },
                {
                  t: "המגן דורש הפעלה של המשתמש",
                  d: "״מגן FilterPhone״ פועל דרך שירות נגישות, ולכן המשתמש מפעיל אותו פעם אחת בהגדרות. הוא גם יכול לכבות אותו – אבל אנחנו רואים את זה מיד ויוצרים קשר.",
                },
                {
                  t: "תמונות ממוזערות של סטטוסים בוואטסאפ",
                  d: "המגן חוסם את מסך הצפייה בסטטוסים, אבל התמונות הקטנות ברשימת העדכונים מוצפנות ואי אפשר לסנן אותן. מי שרוצה להעלים גם אותן בוחר חסימת מדיה בוואטסאפ.",
                },
                {
                  t: "אייפון – עדיין לא",
                  d: "האפליקציה היום לאנדרואיד בלבד. גרסה לאייפון בפיתוח. בינתיים לאייפון יש לנו פתרונות אחרים.",
                },
              ].map((item) => (
                <div key={item.t} className="p-6">
                  <h3 className="flex items-start gap-2.5 text-[0.9375rem] font-bold text-ink">
                    <Eye className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item.t}
                  </h3>
                  <p className="mt-2 pr-[1.625rem] text-[0.9375rem] leading-relaxed text-ink-soft">{item.d}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* --------------------------------------------------------- Getting started */}
      <section className="section-padding" aria-label="איך מתחילים">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>איך מתחילים</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">ארבעה שלבים, בלי להגיע אלינו</h2>
          </AnimatedSection>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            {[
              { t: "מורידים", d: "מתקינים את האפליקציה מקובץ ההתקנה. לא צריך חשבון גוגל ולא צריך לאפס." },
              { t: "ממלאים בקשה", d: "שם, טלפון, רמת הסינון ומה עוד לחסום – הכול בתוך האפליקציה." },
              { t: "אנחנו מאשרים", d: "הבקשה מגיעה אלינו. אנחנו מגדירים את הרמה והחסימות ומאשרים." },
              { t: "הטלפון מתחבר", d: "האפליקציה מתחברת לבד תוך שניות. מאשרים את החיבור ומתקינים את התעודה." },
            ].map((s, i) => (
              <li key={s.t} className="bg-surface p-7">
                <AnimatedSection delay={i * 0.06}>
                  <span className="num block text-[0.8125rem] font-bold tracking-widest text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-ink">{s.t}</h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">{s.d}</p>
                </AnimatedSection>
              </li>
            ))}
          </ol>

          <AnimatedSection delay={0.25} className="mt-10">
            <div className="panel flex flex-col items-start justify-between gap-6 p-7 md:flex-row md:items-center">
              <div>
                <h3 className="text-lg font-bold text-ink">
                  <span className="num">{price.label}</span> לשנה, למכשיר
                </h3>
                <p className="mt-1.5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
                  כולל את השרת, העדכונים, שינויי רמה וחסימות לפי בקשה ותמיכה. בלי עלות התקנה
                  נפרדת ובלי לאפס את המכשיר.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2.5">
                <a href={apk} rel="noopener noreferrer">
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    להורדה
                  </Button>
                </a>
                <a href={WA} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">לדבר איתנו</Button>
                </a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3} className="mt-4">
            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              טלפון ישן שהאפליקציה לא נפתחת בו?{" "}
              <a href={apkUniversal} rel="noopener noreferrer" className="link-underline font-semibold text-primary">
                גרסה לכל סוגי המעבדים
              </a>
              . כבר מותקנת גרסה קודמת? מתקינים מעליה וההגדרות נשמרות.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------------------ FAQ */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="שאלות נפוצות">
        <div className="container-custom grid gap-10 lg:grid-cols-12 lg:gap-12">
          <AnimatedSection className="lg:col-span-4">
            <Eyebrow>שאלות נפוצות</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">מה שואלים אותנו</h2>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-primary link-underline"
            >
              לשאלה שלא מופיעה כאן
              <ArrowLeft className="h-4 w-4" />
            </a>
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="lg:col-span-8">
            <Accordion type="single" collapsible className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`fp-faq-${i}`} className="border-0 px-5 md:px-6">
                  <AccordionTrigger className="py-[1.125rem] text-right text-[0.9375rem] font-bold text-ink hover:no-underline md:text-base">
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
      </section>

      {/* --------------------------------------------------- Long-form copy */}
      <section className="section-padding border-t border-border" aria-label="על אפליקציית הסינון">
        <div className="container-custom max-w-3xl">
          <h2 className="text-display-sm text-ink">סינון תמונות לטלפון – המדריך הקצר</h2>
          <div className="prose-fp mt-6">
            <p>
              <strong>סינון תמונות</strong> הוא החלק הקשה בסינון טלפון. לחסום אתרים זה פתיר – יש
              רשימות, יש שמות מתחם, ואפשר לחסום. אבל תמונה שמגיעה מאתר שהוא עצמו בסדר גמור, בתוך
              אפליקציה לגיטימית, היא בעיה אחרת לגמרי. בדיוק בשביל זה בנינו את{" "}
              <strong>אפליקציית הסינון של FilterPhone</strong>.
            </p>

            <h3>שלוש רמות, ולמה זה משנה</h3>
            <p>
              רוב מערכות הסינון מציעות מתג אחד: סינון תמונות דולק או כבוי. בפועל, בית אחד רוצה
              שלא תופיע שום תמונה של אישה – גם בלבוש צנוע – ובית אחר רוצה רק שלא ייחשף תוכן
              בעייתי. ברמה <strong>מחמיר</strong> כל תמונה של אישה או ילדה נחסמת, וזו התנהגות
              דומה למה שמכירים ממערכות כמו נטפרי. ברמה <strong>בינוני</strong> לבוש צנוע עובר,
              ואזורי החשיפה נצבעים בשחור. ברמה <strong>בסיסי</strong> רק עירום מפורש נחסם.
            </p>

            <h3>סגמנטציה: למה זה לא סתם טשטוש</h3>
            <p>
              ההבדל הטכני המרכזי הוא ש<strong>הסגמנטציה</strong> מזהה את צורת הגוף בתוך התמונה
              במקום להתייחס לתמונה כאל יחידה אחת. התוצאה היא שאפשר להשאיר את התמונה במקומה
              ולצבוע רק את מה שצריך. כשכל אדם בתמונה מסווג בנפרד, גבר שעומד ליד לא נצבע, והפנים
              נשארות גם כשכל הגוף נצבע. בפועל זה אומר שאפשר להמשיך לגלוש, לקנות ולקרוא בלי
              שהאינטרנט ייראה כמו קיר של ריבועים.
            </p>

            <h3>סינון בלי לאפס את המכשיר</h3>
            <p>
              מערכות כמו <Link to="/services/hadran">הדרן</Link> ו
              <Link to="/services/askan">עסקן</Link> נצרבות עמוק ודורשות מכשיר חדש או מאופס – מה
              שאומר גיבוי, זמן, ולעיתים ויתור על נתונים. האפליקציה שלנו מותקנת על המכשיר כמו שהוא.
              מצד שני, צריבה עמוקה שורדת איפוס יצרן והאפליקציה לא – ולכן למי שצריך נעילה
              הרמטית, הצריבה עדיין הפתרון הנכון. אפשר לראות את ההבדלים ב
              <Link to="/compare">עמוד ההשוואה</Link>.
            </p>

            <h3>למי זה מתאים</h3>
            <p>
              למי שרוצה <strong>סינון תמונות חזק</strong> בלי לאפס את הטלפון; למי שמערכת סינון
              קיימת חוסמת לו יותר מדי ולכן הוא מתפתה לכבות אותה; למשפחות שרוצות רמה אחרת לכל
              מכשיר; ולמי שמחפש <strong>חלופה לנטפרי</strong> עם שליטה מדויקת יותר במה שנחסם.
              המחיר הוא {price.label} לשנה למכשיר, והשירות כולל את השרת, העדכונים והתמיכה.
            </p>

            <p>
              מסננים גם את יוטיוב? יש לנו גם את{" "}
              <Link to="/filtertube">FilterTube – יוטיוב ויוטיוב מיוזיק מסוננים</Link>. ואפשר
              לראות את כל <Link to="/services">שירותי הסינון שלנו</Link> ואת{" "}
              <Link to="/pricing">המחירון המלא</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Cross-links */}
      <section className="border-t border-border bg-surface-sunken py-12" aria-label="שירותים נוספים">
        <div className="container-custom">
          <AnimatedSection>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent-tint text-accent">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-ink">צריכים נעילה שלא ניתנת להסרה?</h2>
                  <p className="mt-1.5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
                    אנחנו גם משווק מורשה של הדרן, עסקן וכושר פליי, וצורבים גרסאות כשרות למכשירי
                    שיאומי Qin. אפשר גם לשלב – צריבה למכשיר, והאפליקציה שלנו לסינון התמונות.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2.5">
                <Link to="/compare">
                  <Button variant="outline">להשוואת מערכות</Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline">לכל השירותים</Button>
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
