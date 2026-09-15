import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Check, ChevronDown, Download, Headphones, Layers, Lock,
  MessageCircle, Minus, Music, Radio, Settings2, Shield, ShieldCheck,
  Smartphone, Sparkles, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import ApkDownloadButton from "@/components/ApkDownloadButton";
import { SITE, waLink } from "@/lib/site";

/* App screenshots, bundled in /public/filtertube so they work on any host. */
const SHOTS = {
  login: "/filtertube/142557.jpg",
  password: "/filtertube/142641.jpg",
  levels: "/filtertube/142652.jpg",
  music: "/filtertube/142658.jpg",
  success: "/filtertube/142705.jpg",
  feed: "/filtertube/142716.jpg",
  player: "/filtertube/142911.jpg",
  overlay: "/filtertube/143005.jpg",
  quality: "/filtertube/143022.jpg",
  shorts: "/filtertube/143258.jpg",
};

const APK_URL = SITE.filterTubeApk;
const WA_FILTERTUBE = waLink("שלום, אשמח לפרטים על FilterTube – יוטיוב מסונן");

/* ------------------------------------------------------------------ */

/**
 * A device frame that stands straight. No perspective, no tilt, no glare —
 * the screenshot is the point, the frame just holds it.
 */
const Phone = ({
  src, alt, className = "", priority = false,
}: { src: string; alt: string; className?: string; priority?: boolean }) => (
  <div className={`relative aspect-[9/19.5] w-full max-w-[15rem] overflow-hidden rounded-[1.75rem] border-[6px] border-[hsl(208_30%_7%)] bg-black shadow-float ${className}`}>
    <img
      src={src}
      alt={alt}
      width={240}
      height={520}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-cover"
    />
    {/* Notch */}
    <span className="pointer-events-none absolute left-1/2 top-1.5 h-4 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
  </div>
);

const filterLevels = [
  {
    name: "מחמיר",
    icon: Headphones,
    summary: "שמע בלבד, בלי וידאו",
    detail: "האפליקציה מנגנת את הפסקול בלבד. מתאים למי שרוצה את התוכן בלי מסך כלל.",
  },
  {
    name: "רגיל",
    icon: Video,
    summary: "וידאו מסונן",
    detail: "צפייה רגילה, אבל רק בתוכן שעבר סינון. זו הרמה שרוב המשתמשים בוחרים.",
  },
  {
    name: "קל־דתי",
    icon: ShieldCheck,
    summary: "וידאו, ותכני קודש כשמע",
    detail: "רוב התוכן מוצג כווידאו, ותכני קודש עוברים אוטומטית למצב שמע מתוך כבוד.",
  },
];

const features = [
  { icon: Shield, title: "שלוש רמות סינון", desc: "מחמיר, רגיל וקל־דתי – התאמה מדויקת לכל בית." },
  { icon: Radio, title: "מצב שמע", desc: "להאזין לסרטון כמו לפודקאסט, וגם לחסוך בנתונים ובסוללה." },
  { icon: Layers, title: "חלון צף ונגן ברקע", desc: "הניגון ממשיך תוך כדי גלישה, כתיבה או מסך נעול." },
  { icon: Download, title: "הורדות לצפייה אופליין", desc: "להוריד מראש ולצפות גם בלי אינטרנט – נוח לנסיעות." },
  { icon: Lock, title: "קוד הורים בן 4 ספרות", desc: "נועל את ההגדרות ואת רמת הסינון. רק ההורה משנה." },
  { icon: Music, title: "מוזיקה יהודית מובנית", desc: "בוחרים אמנים, ומקבלים פיד אישי של תוכן שמע." },
  { icon: Settings2, title: "שליטה באיכות ובמהירות", desc: "מ-144p ועד 1080p, מהירות ניגון וטעינה חסכונית." },
  { icon: Sparkles, title: "בלי פרסומות ובלי תגובות", desc: "אין פרסומות, אין תגובות, ואין אלגוריתם שמושך הלאה." },
];

const comparison: { label: string; ours: boolean; theirs: boolean }[] = [
  { label: "ללא פרסומות", ours: true, theirs: true },
  { label: "נגן ברקע", ours: true, theirs: true },
  { label: "הורדות לצפייה אופליין", ours: true, theirs: true },
  { label: "חלון צף", ours: true, theirs: true },
  { label: "אפליקציה חוקית, לא APK פרוץ", ours: true, theirs: false },
  { label: "סינון תוכן לפני הצגה", ours: true, theirs: false },
  { label: "שלוש רמות סינון להורים", ours: true, theirs: false },
  { label: "קוד הורים לנעילת הגדרות", ours: true, theirs: false },
  { label: "ממשק מלא בעברית", ours: true, theirs: false },
  { label: "מוזיקה יהודית מובנית", ours: true, theirs: false },
];

const faqs = [
  {
    q: "מה זה FilterTube ובמה זה שונה מיוטיוב רגיל?",
    a: "FilterTube היא אפליקציית וידאו כשרה לאנדרואיד שמציגה תוכן יוטיוב אחרי סינון. יש בה שלוש רמות סינון, קוד הורים, ותכונות שביוטיוב שמורות למנוי בתשלום – נגן ברקע, חלון צף והורדות – בלי פרסומות ובלי תגובות.",
  },
  {
    q: "זו חלופה חוקית ליוטיוב פרוץ?",
    a: "כן. FilterTube נותנת את מה שאנשים מחפשים באפליקציות פרוצות – הורדות, ניגון ברקע וללא פרסומות – בסביבה חוקית, בטוחה ומסוננת, בלי להתקין APK ממקור לא מוכר.",
  },
  {
    q: "מה ההבדל בין שלוש רמות הסינון?",
    a: "מחמיר – שמע בלבד, בלי וידאו כלל. רגיל – צפייה בווידאו מסונן, וזו הרמה שרוב המשתמשים בוחרים. קל־דתי – רוב התוכן מוצג כווידאו, ותכני קודש עוברים אוטומטית למצב שמע.",
  },
  {
    q: "איך מורידים ומתקינים?",
    a: "לוחצים על כפתור ההורדה בעמוד ומקבלים את קובץ ה-APK הרשמי. ההתקנה חינמית, לא דורשת חשבון גוגל ולא דורשת רוט. מתאים לאנדרואיד 7.0 ומעלה.",
  },
  {
    q: "הפרימיום באמת חינם ל-30 יום?",
    a: "כן, שלושים ימי ניסיון מלאים – כולל הורדות, נגן ברקע וחלון צף. לא נדרש אמצעי תשלום כדי להתחיל.",
  },
  {
    q: "ילדים יכולים להשתמש בזה?",
    a: "כן. קוד הורים בן ארבע ספרות נועל את ההגדרות, כך שרק ההורה יכול לשנות רמת סינון או להוסיף אמנים.",
  },
  {
    q: "יש גרסה לאייפון?",
    a: "בשלב זה האפליקציה זמינה לאנדרואיד בלבד. אפשר לשלוח לנו הודעה בוואטסאפ ונעדכן כשתהיה גרסה לאייפון.",
  },
];

/* ------------------------------------------------------------------ */

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="eyebrow">{children}</span>
);

const ShowcaseRow = ({
  eyebrow, title, body, points, shots, reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points?: string[];
  shots: { src: string; alt: string }[];
  reverse?: boolean;
}) => (
  <AnimatedSection>
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? "lg:order-2" : ""}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-4 text-display-sm text-white">{title}</h3>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">{body}</p>
        {points && (
          <ul className="mt-6 space-y-2.5">
            {points.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-[0.9375rem] text-ink-soft">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={`flex justify-center gap-4 ${reverse ? "lg:order-1" : ""}`}>
        {shots.map((s, i) => (
          <Phone
            key={s.src}
            src={s.src}
            alt={s.alt}
            className={i > 0 ? "hidden max-w-[13rem] translate-y-8 md:block" : ""}
          />
        ))}
      </div>
    </div>
  </AnimatedSection>
);

/* ------------------------------------------------------------------ */

const FilterTube = () => {
  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FilterTube – יוטיוב מסונן וכשר",
    alternateName: ["פילטר טיוב", "FilterTube APK", "יוטיוב כשר", "יוטיוב מסונן"],
    operatingSystem: "Android 7.0+",
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "VideoApplication",
    inLanguage: "he",
    url: `${SITE.url}/filtertube`,
    downloadUrl: APK_URL,
    installUrl: APK_URL,
    fileSize: "25MB",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
    description:
      "FilterTube – אפליקציית יוטיוב מסוננת וכשרה בעברית לאנדרואיד. שלוש רמות סינון, מצב שמע, נגן ברקע, חלון צף, הורדות לצפייה אופליין, קוד הורים וללא פרסומות. חלופה חוקית לאפליקציות יוטיוב פרוצות.",
    featureList: features.map((f) => f.title),
    publisher: { "@id": `${SITE.url}/#business` },
    screenshot: [
      `${SITE.url}${SHOTS.feed}`,
      `${SITE.url}${SHOTS.player}`,
      `${SITE.url}${SHOTS.levels}`,
    ],
  };

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
    <div className="theme-filtertube bg-background text-foreground">
      <SEOHead
        title="FilterTube – יוטיוב מסונן וכשר להורדה (APK) | FilterPhone"
        description="FilterTube – אפליקציית יוטיוב מסוננת וכשרה בעברית לאנדרואיד, להורדה חינם. שלוש רמות סינון, מצב שמע, נגן ברקע, הורדות אופליין, קוד הורים וללא פרסומות. חלופה חוקית לאפליקציות יוטיוב פרוצות."
        path="/filtertube"
        keywords="יוטיוב מסונן, יוטיוב כשר, FilterTube, פילטר טיוב, יוטיוב מסונן להורדה, אפליקציית יוטיוב כשרה, יוטיוב ללא פרסומות, יוטיוב לילדים, סינון יוטיוב"
        image={`${SITE.url}${SHOTS.feed}`}
        imageAlt="מסך הפיד של FilterTube – יוטיוב מסונן וכשר"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(softwareLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <Breadcrumbs items={[{ label: "FilterTube – יוטיוב מסונן" }]} />

      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden" aria-label="FilterTube – יוטיוב מסונן וכשר">
        <div className="pointer-events-none absolute inset-0 texture-traces opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,hsl(358_76%_50%/0.18),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="container-custom relative grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <span className="inline-flex items-center gap-2 rounded-sm border border-primary/35 bg-primary/10 px-3 py-1.5 text-[0.8125rem] font-bold text-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-70 motion-safe:animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              אפליקציה משלנו · 30 יום פרימיום חינם
            </span>

            <h1 className="mt-6 text-display-xl text-white">
              יוטיוב מסונן,
              <span className="mt-1 block text-primary">בלי הפתעות.</span>
            </h1>

            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-ink-soft">
              FilterTube היא אפליקציית אנדרואיד שמציגה תוכן יוטיוב אחרי סינון: שלוש רמות סינון
              לבחירתכם, קוד הורים שנועל אותן, מצב שמע ונגן ברקע – וללא פרסומות ותגובות.
            </p>

            <div className="mt-9 max-w-sm space-y-3">
              <ApkDownloadButton href={APK_URL} label="הורדת האפליקציה (APK)" block />
              <a href={WA_FILTERTUBE} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full gap-2">
                  <MessageCircle className="h-4 w-4" />
                  שאלה לפני שמורידים? דברו איתנו
                </Button>
              </a>
            </div>

            {/* The facts people actually need before installing an APK */}
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-7">
              {[
                { term: "מערכת", value: "אנדרואיד 7+" },
                { term: "גודל", value: "כ-25MB" },
                { term: "חשבון גוגל", value: "לא נדרש" },
              ].map((f) => (
                <div key={f.term}>
                  <dt className="text-[0.75rem] text-muted-foreground">{f.term}</dt>
                  <dd className="mt-1 text-[0.9375rem] font-bold text-white">{f.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end justify-center gap-4 lg:col-span-6 lg:gap-6"
          >
            <Phone src={SHOTS.player} alt="נגן הווידאו של FilterTube" className="hidden max-w-[12.5rem] translate-y-10 sm:block" />
            <Phone src={SHOTS.feed} alt="מסך הפיד של FilterTube – יוטיוב מסונן" priority />
            <Phone src={SHOTS.levels} alt="בחירת רמת סינון ב-FilterTube" className="hidden max-w-[12.5rem] translate-y-10 md:block" />
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------- Filter levels */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="רמות הסינון">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>הלב של האפליקציה</Eyebrow>
            <h2 className="mt-4 text-display-md text-white">בוחרים רמת סינון – ונועלים אותה</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              לא כל בית צריך את אותו דבר. FilterTube נותנת שלוש רמות, וקוד הורים בן ארבע ספרות
              שמונע שינוי שלהן.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {filterLevels.map((lvl, i) => (
              <AnimatedSection key={lvl.name} delay={i * 0.06}>
                <div className="h-full bg-surface p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
                    <lvl.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-white">{lvl.name}</h3>
                  <p className="mt-1 text-[0.875rem] font-semibold text-primary">{lvl.summary}</p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{lvl.detail}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Features */}
      <section className="section-padding" aria-label="תכונות האפליקציה">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>מה יש באפליקציה</Eyebrow>
            <h2 className="mt-4 text-display-md text-white">כל מה שמחפשים באפליקציה פרוצה, בלי הסיכון</h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={(i % 4) * 0.05}>
                <div className="h-full panel panel-hover p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/12 text-primary ring-1 ring-primary/25">
                    <f.icon className="h-[1.125rem] w-[1.125rem]" />
                  </span>
                  <h3 className="mt-4 text-[0.9375rem] font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-soft">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Showcase */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="מסכים מתוך האפליקציה">
        <div className="container-custom space-y-24 md:space-y-32">
          <ShowcaseRow
            eyebrow="הגדרה ראשונה"
            title="שלוש דקות, ומותאם לבית שלכם"
            body="בוחרים רמת סינון, קובעים קוד הורים, ומסמנים את סוג התוכן שמעניין. מכאן האפליקציה יודעת מה להראות – ובעיקר מה להסתיר."
            points={["התאמה לפי גיל וסוג תוכן", "קוד הורים לנעילת ההגדרות", "החלפת רמת סינון בלחיצה", "30 יום פרימיום חינם"]}
            shots={[
              { src: SHOTS.login, alt: "מסך ההתחברות של FilterTube" },
              { src: SHOTS.levels, alt: "בחירת רמת הסינון ב-FilterTube" },
            ]}
          />

          <ShowcaseRow
            reverse
            eyebrow="חוויית הניגון"
            title="נגן מלא, בלי מה שמסביב"
            body="שליטה במהירות ובאיכות, מצב שמע בלבד, ניגון ברקע וחלון צף. כל מה שהיה דורש אפליקציה חיצונית – נמצא כאן, בתוך סביבה מסוננת."
            points={["ללא פרסומות", "נגן ברקע וחלון צף", "איכות עד 1080p", "הורדות לצפייה אופליין"]}
            shots={[
              { src: SHOTS.overlay, alt: "שכבת הניגון של FilterTube" },
              { src: SHOTS.quality, alt: "הגדרות איכות ומהירות ב-FilterTube" },
            ]}
          />

          <ShowcaseRow
            eyebrow="תוכן וגילוי"
            title="פיד שאפשר לתת לילד ביד"
            body="כל סרטון עובר סינון לפני שהוא מגיע לפיד. אין תגובות, אין תכנים מוצעים שמושכים הלאה, ואין פרסומות. גם מוזיקה יהודית מובנית, לפי האמנים שבוחרים."
            shots={[
              { src: SHOTS.shorts, alt: "פיד השורטס המסונן של FilterTube" },
              { src: SHOTS.music, alt: "בחירת אמנים למוזיקה ב-FilterTube" },
            ]}
          />
        </div>
      </section>

      {/* ----------------------------------------------------- Comparison */}
      <section className="section-padding" aria-label="השוואה לאפליקציות יוטיוב פרוצות">
        <div className="container-custom max-w-3xl">
          <AnimatedSection className="text-center">
            <h2 className="text-display-md text-white">FilterTube מול אפליקציה פרוצה</h2>
            <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
              אותן תכונות שאנשים מחפשים – בלי להתקין APK ממקור לא מוכר, ועם סינון.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-10">
            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              <table className="w-full text-right">
                <caption className="sr-only">
                  השוואת תכונות בין FilterTube לבין אפליקציות יוטיוב פרוצות
                </caption>
                <thead>
                  <tr className="border-b border-border bg-surface-sunken">
                    <th scope="col" className="px-5 py-3.5 text-[0.8125rem] font-semibold text-muted-foreground md:px-6">
                      תכונה
                    </th>
                    <th scope="col" className="w-28 px-3 py-3.5 text-center text-[0.8125rem] font-bold text-primary">
                      FilterTube
                    </th>
                    <th scope="col" className="w-28 px-3 py-3.5 text-center text-[0.8125rem] font-semibold text-muted-foreground">
                      אפליקציה פרוצה
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comparison.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className="px-5 py-3.5 text-right text-[0.9375rem] font-medium text-ink-soft md:px-6">
                        {row.label}
                      </th>
                      <td className="px-3 py-3.5">
                        <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
                          <Check className="h-3.5 w-3.5 text-primary" aria-label="יש" />
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/5 ring-1 ring-border-strong">
                          {row.theirs ? (
                            <Check className="h-3.5 w-3.5 text-muted-foreground" aria-label="יש" />
                          ) : (
                            <Minus className="h-3.5 w-3.5 text-muted-foreground" aria-label="אין" />
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------------------ FAQ */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="שאלות נפוצות על FilterTube">
        <div className="container-custom grid gap-10 lg:grid-cols-12 lg:gap-12">
          <AnimatedSection className="lg:col-span-4">
            <Eyebrow>שאלות נפוצות</Eyebrow>
            <h2 className="mt-4 text-display-md text-white">מה שואלים אותנו על FilterTube</h2>
            <a
              href={WA_FILTERTUBE}
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
                <AccordionItem key={faq.q} value={`ft-faq-${i}`} className="border-0 px-5 md:px-6">
                  <AccordionTrigger className="py-[1.125rem] text-right text-[0.9375rem] font-bold text-white hover:no-underline md:text-base">
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

      {/* ------------------------------------------------------------ CTA */}
      <section className="relative overflow-hidden section-padding" aria-label="הורדת FilterTube">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,hsl(358_76%_50%/0.20),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="container-custom relative max-w-3xl text-center">
          <AnimatedSection>
            <h2 className="text-display-lg text-white">יוטיוב אחר. רגוע יותר.</h2>
            <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-soft">
              שלושים יום פרימיום חינם, בלי כרטיס אשראי ובלי חשבון גוגל. אם לא מתאים – פשוט מוחקים.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4">
              <div className="w-full max-w-sm">
                <ApkDownloadButton href={APK_URL} label="הורדת FilterTube (APK)" size="lg" block />
              </div>
              <a href={WA_FILTERTUBE} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  דברו איתנו בוואטסאפ
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------- Back to the main business */}
      <section className="border-t border-border bg-surface-sunken py-12" aria-label="שירותי הסינון שלנו">
        <div className="container-custom">
          <AnimatedSection>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent ring-1 ring-accent/30">
                  <Smartphone className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">רוצים לסנן גם את הטלפון עצמו?</h2>
                  <p className="mt-1.5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
                    FilterPhone היא מעבדה באשדוד לסינון טלפונים – משווק מורשה של הדרן, עסקן וכושר פליי,
                    וצריבת גרסאות כשרות למכשירי שיאומי Qin.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2.5">
                <Link to="/services">
                  <Button variant="outline">לשירותי הסינון</Button>
                </Link>
                <Link to="/compare">
                  <Button variant="outline">להשוואת מערכות</Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default FilterTube;
