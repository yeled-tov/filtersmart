import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bell, Check, CloudCog, Download, Headphones, Layers, ListMusic,
  Lock, MessageCircle, Minus, Music, PlayCircle, Radio, Settings2, Share2,
  Shield, ShieldCheck, Smartphone, Sparkles, UserCheck, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import ApkDownloadButton from "@/components/ApkDownloadButton";
import ReleaseStatus from "@/components/filtertube/ReleaseStatus";
import { useFilterTubeRelease } from "@/hooks/useFilterTubeRelease";
import { SITE, waLink } from "@/lib/site";
import { apkUrlFor } from "@/lib/filtertubeRelease";

/* App screenshots, bundled in /public/filtertube so they work on any host. */
const SHOTS = {
  account: "/filtertube/account.jpg",
  parentcode: "/filtertube/parentcode.jpg",
  levels: "/filtertube/levels.jpg",
  artists: "/filtertube/artists.jpg",
  success: "/filtertube/success.jpg",
  feed: "/filtertube/feed.jpg",
  shorts: "/filtertube/shorts.jpg",
  player: "/filtertube/player.jpg",
  music: "/filtertube/music.jpg",
  mixes: "/filtertube/mixes.jpg",
  library: "/filtertube/library.jpg",
  settings: "/filtertube/settings.jpg",
  settings2: "/filtertube/settings2.jpg",
};

const WA_FILTERTUBE = waLink("שלום, אשמח לפרטים על FilterTube – יוטיוב ויוטיוב מיוזיק מסוננים");

/* ------------------------------------------------------------------ */

/**
 * A device frame that stands straight. No perspective, no tilt, no glare, and
 * no drawn-on notch — the screenshots are Android, and anything painted over
 * the top just hides the app's own header. The frame only holds the picture.
 */
const Phone = ({
  src, alt, className = "", priority = false,
}: { src: string; alt: string; className?: string; priority?: boolean }) => (
  <div className={`aspect-[9/18.8] w-full max-w-[15rem] overflow-hidden rounded-[2rem] border-[6px] border-[hsl(240_12%_9%)] bg-[hsl(240_12%_9%)] shadow-float ${className}`}>
    <img
      src={src}
      alt={alt}
      width={240}
      height={501}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-cover"
    />
  </div>
);

/**
 * The app opens on a segmented pill: one app, two homes. Repeating it here
 * means the page and the phone show the same control.
 */
const ModeSwitch = ({ active }: { active: "music" | "tube" }) => (
  <div
    className="inline-flex items-center gap-1 rounded-full bg-secondary p-1.5"
    role="img"
    aria-label={`האפליקציה נפתחת על מתג בין FilterMusic ל-FilterTube; כעת ${active === "music" ? "FilterMusic" : "FilterTube"}`}
  >
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.9375rem] font-bold ${
        active === "music" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
      }`}
    >
      FilterMusic
      <Music className="h-3.5 w-3.5" aria-hidden="true" />
    </span>
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.9375rem] font-bold ${
        active === "tube" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
      }`}
    >
      FilterTube
      <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
    </span>
  </div>
);

/**
 * The two halves of the app, described the way the app itself splits them.
 */
const modes = [
  {
    key: "tube" as const,
    name: "FilterTube",
    tagline: "יוטיוב מסונן",
    icon: PlayCircle,
    body: "הפיד, החיפוש, השורטס והשידורים החיים של יוטיוב – אחרי סינון. לשוניות של הכל, חדשים, שידורים חיים ותורה, נגן מלא עם מהירות ואיכות, חלון צף וניגון ברקע.",
    points: ["פיד וידאו מסונן", "שורטס מסוננים", "שידורים חיים ותורה", "נגן ברקע וחלון צף"],
    shot: { src: SHOTS.feed, alt: "הפיד המסונן של FilterTube" },
  },
  {
    key: "music" as const,
    name: "FilterMusic",
    tagline: "יוטיוב מיוזיק מסונן",
    icon: Music,
    body: "נגן מוזיקה מלא בתוך אותה אפליקציה: בחירה מהירה, מיקסים שנבנים ממה שאתם שומעים, ספרייה עם לייקים והורדות, ורדיו לפי שיר. מה שיוטיוב מיוזיק עושה – רק שכל מה שנכנס פנימה עבר אישור.",
    points: ["מיקס יומי אישי", "מיקס לכל זמר", "רדיו לפי שיר", "האזנה במסך נעול"],
    shot: { src: SHOTS.music, alt: "המסך הראשי של FilterMusic – יוטיוב מיוזיק מסונן" },
  },
];

/**
 * The three levels, plus the audio switch, in the app's own words from its
 * setup screen. They differ on two axes: whether the "דתי לייט" channels are
 * shown at all, and which content is downgraded to audio.
 */
const filterLevels = [
  {
    name: "מחמיר",
    icon: Headphones,
    summary: "מוזיקה כאודיו, השאר וידאו",
    detail: "כל התוכן מוצג כווידאו, ומוזיקה נשמעת כאודיו בלבד – בלי קליפים. ערוצי ״דתי לייט״ אינם מוצגים.",
  },
  {
    name: "רגיל",
    icon: Video,
    summary: "הכול וידאו",
    detail: "כמו ״מחמיר״, אבל גם המוזיקה מוצגת כווידאו. ערוצי ״דתי לייט״ עדיין אינם מוצגים.",
  },
  {
    name: "דתי לייט",
    icon: ShieldCheck,
    summary: "מוסיף שירים חילוניים, כאודיו",
    detail: "מוסיף שירים חילוניים – גברים בלבד – והם מתנגנים כאודיו בלבד, לעולם לא כווידאו.",
  },
];

const features = [
  { icon: Shield, title: "שלוש רמות סינון", desc: "מחמיר, רגיל ודתי לייט – ונעילה שלהן בקוד הורים." },
  { icon: Radio, title: "מצב ״הכל כאודיו״", desc: "בלי מסך בכלל: שיעורים, חדשות ומוזיקה נשמעים ולא נראים." },
  { icon: ListMusic, title: "מיקסים שמתעדכנים", desc: "מיקס יומי ומיקס לכל זמר, שנבנים ממה שאתם באמת שומעים." },
  { icon: Layers, title: "חלון צף ונגן ברקע", desc: "הניגון ממשיך תוך כדי גלישה, כתיבה או מסך נעול." },
  { icon: Download, title: "הורדות לצפייה אופליין", desc: "מנהל הורדות עם לייקים, מהירות והורדות במקביל." },
  { icon: Lock, title: "קוד הורים", desc: "נועל את רמת הסינון ואת הצגת השורטס. רק ההורה משנה." },
  { icon: CloudCog, title: "סנכרון ענן", desc: "החשבון, הלייקים והספרייה נשמרים ועוברים איתכם למכשיר הבא." },
  { icon: Bell, title: "התראה על סרטון חדש", desc: "רק מערוץ מאושר שבחרתם לעקוב אחריו. שום דבר אחר." },
  { icon: Settings2, title: "שליטה בנגן ובתצוגה", desc: "איכות ומהירות, מחוות בנגן, צבע ראשי, מצב בהיר או כהה ו-120 הרץ." },
  { icon: Share2, title: "שיתוף האפליקציה", desc: "קישור להורדה, קוד QR או העברת קובץ ההתקנה בבלוטות'." },
  { icon: UserCheck, title: "חיבור לחשבון יוטיוב", desc: "מביא את הלייקים, המנויים והמוזיקה שאהבתם – לא חובה." },
  { icon: Sparkles, title: "בלי פרסומות ובלי תגובות", desc: "אין פרסומות, אין תגובות, ואין אלגוריתם שמושך הלאה." },
];

const comparison: { label: string; ours: boolean; theirs: boolean }[] = [
  { label: "ללא פרסומות", ours: true, theirs: true },
  { label: "נגן ברקע", ours: true, theirs: true },
  { label: "הורדות לצפייה אופליין", ours: true, theirs: true },
  { label: "חלון צף", ours: true, theirs: true },
  { label: "אפליקציה חוקית, לא APK פרוץ", ours: true, theirs: false },
  { label: "סינון תוכן לפני הצגה", ours: true, theirs: false },
  { label: "אישור ידני של כל ערוץ, על ידי אדם", ours: true, theirs: false },
  { label: "שלוש רמות סינון להורים", ours: true, theirs: false },
  { label: "קוד הורים לנעילת הגדרות", ours: true, theirs: false },
  { label: "יוטיוב מיוזיק מסונן בתוך האפליקציה", ours: true, theirs: false },
  { label: "ממשק מלא בעברית", ours: true, theirs: false },
];

const faqs = [
  {
    q: "מה זה FilterTube ובמה זה שונה מיוטיוב רגיל?",
    a: "FilterTube היא אפליקציית אנדרואיד בעברית שמציגה תוכן יוטיוב אחרי סינון. בתוכה יש שני חלקים: FilterTube – יוטיוב מסונן עם פיד, חיפוש, שורטס ושידורים חיים, ו-FilterMusic – יוטיוב מיוזיק מסונן עם מיקסים, רדיו וספרייה. יש שלוש רמות סינון, קוד הורים, ותכונות שביוטיוב שמורות למנוי בתשלום – נגן ברקע, חלון צף והורדות – בלי פרסומות ובלי תגובות.",
  },
  {
    q: "מה זה FilterMusic, ומה הקשר ליוטיוב מיוזיק?",
    a: "FilterMusic הוא מצב המוזיקה של האפליקציה, ומחליף בפועל את יוטיוב מיוזיק. מחליפים אליו בלחיצה על המתג בראש המסך ומקבלים מסך בית מוזיקלי, מיקס יומי אישי, מיקס נפרד לכל זמר שאתם שומעים, רדיו שממשיך מכל שיר, ספרייה עם הלייקים וההורדות – הכול מתוך אותה רשימת ערוצים מאושרת, ובלי פרסומות.",
  },
  {
    q: "זו חלופה חוקית ליוטיוב פרוץ?",
    a: "כן. FilterTube נותנת את מה שאנשים מחפשים באפליקציות פרוצות – הורדות, ניגון ברקע וללא פרסומות – בסביבה חוקית, בטוחה ומסוננת, בלי להתקין APK ממקור לא מוכר.",
  },
  {
    q: "מה ההבדל בין שלוש רמות הסינון?",
    a: "ההבדל הוא בשני דברים: אילו ערוצים מוצגים, ומה מתנגן כאודיו. מחמיר – כל התוכן מוצג כווידאו, והמוזיקה נשמעת כאודיו בלבד בלי קליפים, וערוצי ״דתי לייט״ אינם מוצגים. רגיל – כמו מחמיר, אבל גם המוזיקה מוצגת כווידאו, וערוצי ״דתי לייט״ עדיין אינם מוצגים. דתי לייט – מוסיף שירים חילוניים בביצוע גברים בלבד, והם מתנגנים כאודיו בלבד ולעולם לא כווידאו. בנוסף יש מתג ״הכל כאודיו״ שחל על כל הרמות.",
  },
  {
    q: "מה עושה המתג ״הכל כאודיו״?",
    a: "הוא מבטל את המסך לגמרי: גם שיעורים, גם חדשות וגם מוזיקה יישמעו ולא ייראו. הוא חל על כל רמות הסינון, לא תלוי בהן, ואפשר לכבות אותו בהגדרות. בשילוב עם ניגון ברקע האפליקציה עובדת כמו נגן שמע רגיל.",
  },
  {
    q: "מי מחליט אילו ערוצים נכנסים?",
    a: "כל ערוץ ברשימה נבדק ואושר ידנית על ידי אדם – לא על ידי בינה מלאכותית ולא באופן אוטומטי. מה שלא אושר פשוט לא קיים באפליקציה, גם לא בחיפוש.",
  },
  {
    q: "איך מורידים ומתקינים?",
    a: "לוחצים על כפתור ההורדה בעמוד ומקבלים את קובץ ה-APK הרשמי. ההתקנה חינמית, לא דורשת חשבון גוגל ולא דורשת רוט. מתאים לאנדרואיד 7.0 ומעלה. אפשר גם לשתף את האפליקציה הלאה בקישור, בקוד QR או בהעברת הקובץ בבלוטות'.",
  },
  {
    q: "הפרימיום באמת חינם ל-30 יום?",
    a: "כן, שלושים ימי ניסיון מלאים – כולל הורדות מהירות, ניגון ברקע ומסך כבוי, סינון מותאם אישית וקוד הורים. לא נדרש אמצעי תשלום כדי להתחיל.",
  },
  {
    q: "ילדים יכולים להשתמש בזה?",
    a: "כן. קוד הורים של ארבעה תווים ומעלה נועל את רמת הסינון ואת הצגת השורטס, כך שרק ההורה יכול לשנות אותם. הקוד עצמו אינו נשמר כטקסט במכשיר.",
  },
  {
    q: "צריך חשבון גוגל או מנוי יוטיוב פרימיום?",
    a: "לא. אפשר לפתוח חשבון FilterTube עם קוד בלבד, בלי גוגל. מי שכן בוחר להתחבר לחשבון יוטיוב מקבל את הלייקים, המנויים והמוזיקה שאהב – אבל זו אפשרות, לא דרישה. תכונות כמו ניגון ברקע והורדות כלולות באפליקציה עצמה ולא דורשות מנוי יוטיוב.",
  },
  {
    q: "מה קורה כשמחליפים מכשיר?",
    a: "יש סנכרון ענן. החשבון, הלייקים, המנויים והספרייה חוזרים במכשיר החדש אחרי כניסה לאותו חשבון.",
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
        <h3 className="mt-4 text-display-sm text-ink">{title}</h3>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">{body}</p>
        {points && (
          <ul className="mt-6 space-y-2.5">
            {points.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-[0.9375rem] text-ink-soft">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
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
  const { payload, isLive } = useFilterTubeRelease();
  const stable = payload?.stable ?? null;
  // The APK now comes from the app's hosting mirror, which stays reachable once
  // its repository goes private.
  const apkUrl = apkUrlFor(stable);

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FilterTube – יוטיוב ויוטיוב מיוזיק מסוננים",
    alternateName: [
      "פילטר טיוב", "FilterTube APK", "FilterMusic", "פילטר מיוזיק",
      "יוטיוב כשר", "יוטיוב מסונן", "יוטיוב מיוזיק מסונן",
    ],
    operatingSystem: "Android 7.0+",
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "VideoApplication",
    inLanguage: "he",
    url: `${SITE.url}/filtertube`,
    downloadUrl: apkUrl,
    installUrl: apkUrl,
    softwareVersion: stable?.versionName ?? undefined,
    datePublished: stable?.publishedAt ?? undefined,
    fileSize: stable?.sizeBytes ? `${Math.round(stable.sizeBytes / 1024 / 1024)}MB` : undefined,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
    description:
      "FilterTube – אפליקציה אחת בעברית לאנדרואיד ובה יוטיוב מסונן ויוטיוב מיוזיק מסונן. שלוש רמות סינון, מצב ״הכל כאודיו״, מיקסים, נגן ברקע, חלון צף, הורדות אופליין, קוד הורים וללא פרסומות. חלופה חוקית לאפליקציות יוטיוב פרוצות.",
    featureList: features.map((f) => f.title),
    publisher: { "@id": `${SITE.url}/#business` },
    screenshot: [
      `${SITE.url}${SHOTS.feed}`,
      `${SITE.url}${SHOTS.music}`,
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
        title="FilterTube (פילטר טיוב) – יוטיוב ויוטיוב מיוזיק מסוננים, להורדה APK"
        description="FilterTube (פילטר טיוב) – אפליקציה אחת בעברית לאנדרואיד ובה יוטיוב מסונן וגם יוטיוב מיוזיק מסונן, להורדה חינם. שלוש רמות סינון, מצב הכל כאודיו, מיקסים, נגן ברקע, הורדות אופליין, קוד הורים וללא פרסומות. חלופה חוקית ובטוחה לאפליקציות יוטיוב פרוצות."
        path="/filtertube"
        keywords="פילטר טיוב, FilterTube, FilterMusic, יוטיוב מסונן, יוטיוב כשר, סינון ליוטיוב, סינון יוטיוב, יוטיוב מיוזיק מסונן, יוטיוב עם מיוזיק, יוטיוב מיוזיק כשר, יוטיוב מסונן להורדה, אפליקציית יוטיוב כשרה, יוטיוב ללא פרסומות, יוטיוב לילדים, מוזיקה יהודית אפליקציה, יוטיוב פרוץ חלופה, נגן מוזיקה כשר"
        image={`${SITE.url}/filtertube-og.jpg`}
        imageAlt="FilterTube – יוטיוב ויוטיוב מיוזיק מסוננים, אפליקציה לאנדרואיד"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(softwareLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <Breadcrumbs items={[{ label: "FilterTube – יוטיוב מסונן" }]} />

      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden" aria-label="FilterTube – יוטיוב ויוטיוב מיוזיק מסוננים">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,hsl(353_100%_59%/0.10),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="container-custom relative grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-tint px-3.5 py-1.5 text-[0.8125rem] font-bold text-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-70 motion-safe:animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              אפליקציה משלנו · 30 יום פרימיום חינם
            </span>

            <h1 className="mt-6 text-display-xl text-ink">
              יוטיוב ומיוזיק,
              <span className="mt-1 block text-primary">אחרי סינון.</span>
            </h1>

            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-ink-soft">
              <strong className="font-semibold text-ink">FilterTube (פילטר טיוב)</strong> היא
              אפליקציית אנדרואיד אחת ובה שני עולמות: <strong className="font-semibold text-ink">FilterTube</strong> –
              יוטיוב מסונן, ו-<strong className="font-semibold text-ink">FilterMusic</strong> – יוטיוב
              מיוזיק מסונן. מחליפים ביניהם בלחיצה. שלוש רמות סינון, קוד הורים שנועל אותן, ונגן
              שממשיך ברקע – בלי פרסומות ובלי תגובות.
            </p>

            <div className="mt-8">
              <ModeSwitch active="tube" />
            </div>

            <div className="mt-8 max-w-sm space-y-3">
              <ApkDownloadButton
                href={apkUrl}
                label="הורדת האפליקציה (APK)"
                block
                downloads={payload?.totalDownloads ?? null}
                version={stable?.versionName ?? null}
              />
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
                { term: "גודל", value: stable?.sizeBytes ? `כ-${(stable.sizeBytes / 1024 / 1024).toFixed(0)}MB` : "כ-25MB" },
                { term: "חשבון גוגל", value: "לא נדרש" },
              ].map((f) => (
                <div key={f.term}>
                  <dt className="text-[0.75rem] text-muted-foreground">{f.term}</dt>
                  <dd className="mt-1 text-[0.9375rem] font-bold text-ink">{f.value}</dd>
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
            <Phone src={SHOTS.music} alt="FilterMusic – יוטיוב מיוזיק מסונן" className="hidden max-w-[12.5rem] translate-y-10 sm:block" />
            <Phone src={SHOTS.feed} alt="מסך הפיד של FilterTube – יוטיוב מסונן" priority />
            <Phone src={SHOTS.levels} alt="בחירת רמת סינון ב-FilterTube" className="hidden max-w-[12.5rem] translate-y-10 md:block" />
          </motion.div>
        </div>
      </section>

      <ReleaseStatus payload={payload} isLive={isLive} />

      {/* -------------------------------------------------- Two apps in one */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="FilterTube ו-FilterMusic">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>אפליקציה אחת, שני בתים</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">וידאו ומוזיקה – במתג אחד</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              בראש המסך יש מתג. צד אחד הוא יוטיוב מסונן, הצד השני הוא יוטיוב מיוזיק מסונן. אותה
              רשימת ערוצים מאושרת, אותה רמת סינון, אותו קוד הורים – שני ממשקים שונים.
            </p>
            <div className="mt-7">
              <ModeSwitch active="music" />
            </div>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {modes.map((m, i) => (
              <AnimatedSection key={m.key} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-7 rounded-[1.25rem] border border-border bg-surface p-7 shadow-sm sm:flex-row sm:items-start md:p-8">
                  <div className="flex-1">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[0.875rem] bg-primary text-primary-foreground">
                      <m.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold text-ink">{m.name}</h3>
                    <p className="mt-1 text-[0.875rem] font-semibold text-primary">{m.tagline}</p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{m.body}</p>
                    <ul className="mt-5 space-y-2">
                      {m.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-[0.875rem] text-ink-soft">
                          <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Phone src={m.shot.src} alt={m.shot.alt} className="mx-auto max-w-[11rem] sm:mx-0 sm:max-w-[9.5rem]" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Filter levels */}
      <section className="section-padding border-t border-border" aria-label="רמות הסינון">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>הלב של האפליקציה</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">בוחרים רמת סינון – ונועלים אותה</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              לא כל בית צריך את אותו דבר. FilterTube נותנת שלוש רמות, וקוד הורים שמונע שינוי שלהן.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {filterLevels.map((lvl, i) => (
              <AnimatedSection key={lvl.name} delay={i * 0.06}>
                <div className="h-full rounded-[1.25rem] border border-border bg-surface p-7 shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[0.875rem] bg-primary-tint text-primary">
                    <lvl.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{lvl.name}</h3>
                  <p className="mt-1 text-[0.875rem] font-semibold text-primary">{lvl.summary}</p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{lvl.detail}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* The audio switch is not a fourth level – it sits on top of all three. */}
          <AnimatedSection delay={0.18} className="mt-4">
            <div className="flex flex-col gap-5 rounded-[1.25rem] border border-border bg-surface p-7 shadow-sm sm:flex-row sm:items-center sm:gap-7">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.875rem] bg-primary text-primary-foreground">
                <Headphones className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-ink">
                  ומעל הכול: מתג ״הכל כאודיו״
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                  בלי מסך בכלל – גם שיעורים, גם חדשות וגם מוזיקה יישמעו ולא ייראו. המתג חל על כל
                  שלוש רמות הסינון, לא תלוי בהן, ואפשר לכבות אותו בהגדרות.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* The app says this on its own setup screen. It is the real differentiator. */}
          <AnimatedSection delay={0.24} className="mt-4">
            <div className="flex items-start gap-4 rounded-[1.25rem] bg-primary-tint p-7">
              <UserCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-[0.9375rem] leading-relaxed text-ink">
                <strong className="font-bold">כל ערוץ ברשימה נבדק ואושר ידנית על ידי אדם</strong> – לא
                על ידי בינה מלאכותית ולא באופן אוטומטי. מה שלא אושר, פשוט לא קיים באפליקציה.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------------- Features */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="תכונות האפליקציה">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <Eyebrow>מה יש באפליקציה</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">כל מה שמחפשים באפליקציה פרוצה, בלי הסיכון</h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={(i % 4) * 0.05}>
                <div className="h-full rounded-[1.25rem] border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[0.875rem] bg-primary-tint text-primary">
                    <f.icon className="h-[1.125rem] w-[1.125rem]" />
                  </span>
                  <h3 className="mt-4 text-[0.9375rem] font-bold text-ink">{f.title}</h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-soft">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Showcase */}
      <section className="section-padding border-t border-border" aria-label="מסכים מתוך האפליקציה">
        <div className="container-custom space-y-24 md:space-y-32">
          <ShowcaseRow
            eyebrow="הגדרה ראשונה"
            title="ארבעה מסכים, ומותאם לבית שלכם"
            body="נכנסים לחשבון – בגוגל או בקוד בלבד – קובעים קוד הורים, בוחרים רמת סינון, ומסמנים זמרים וערוצים שאוהבים. מכאן האפליקציה יודעת מה להראות, ובעיקר מה להסתיר."
            points={["כניסה בלי חשבון גוגל, אם רוצים", "קוד הורים שנועל את רמת הסינון", "בחירת זמרים שבונה את הבית", "30 יום פרימיום חינם"]}
            shots={[
              { src: SHOTS.account, alt: "מסך פתיחת החשבון ב-FilterTube" },
              { src: SHOTS.levels, alt: "בחירת רמת הסינון ב-FilterTube" },
            ]}
          />

          <ShowcaseRow
            reverse
            eyebrow="מוזיקה"
            title="FilterMusic: יוטיוב מיוזיק, מסונן"
            body="מסך בית מוזיקלי עם בחירה מהירה, מיקס יומי אישי ומיקס נפרד לכל זמר – שנבנים ממה שאתם באמת שומעים ומתעדכנים לבד. רדיו שממשיך מכל שיר, ונגן שלא עוצר כשהמסך נכבה."
            points={["המיקס היומי שלך", "מיקס לכל זמר, מתעדכן מעצמו", "רדיו לפי שיר", "האזנה ברקע ובמסך נעול"]}
            shots={[
              { src: SHOTS.music, alt: "המסך הראשי של FilterMusic" },
              { src: SHOTS.mixes, alt: "מסך המיקסים של FilterMusic" },
            ]}
          />

          <ShowcaseRow
            eyebrow="חוויית הניגון"
            title="נגן מלא, בלי מה שמסביב"
            body="עקוב, הורדה, רדיו, מצב אודיו וחלון צף – הכול משורת פעולות אחת מתחת לנגן. שליטה במהירות ובאיכות, תור ניגון, ומיני-נגן שנשאר איתכם בזמן שגולשים הלאה."
            points={["ללא פרסומות ובלי תגובות", "חלון צף וניגון ברקע", "מהירות ואיכות לבחירתכם", "תור ניגון והבא בתור"]}
            shots={[
              { src: SHOTS.player, alt: "נגן הווידאו של FilterTube" },
              { src: SHOTS.shorts, alt: "פיד השורטס המסונן של FilterTube" },
            ]}
          />

          <ShowcaseRow
            reverse
            eyebrow="ספרייה והגדרות"
            title="הכול נשמר, וההורה בשליטה"
            body="ספרייה עם סרטונים שאהבתם, ההורדות, הערוצים המאושרים והמנויים – עם סנכרון ענן שמחזיר את הכול במכשיר הבא. בהגדרות: רמת סינון נעולה, מנהל הורדות, מחוות בנגן, התראות ושיתוף האפליקציה."
            points={["סנכרון ענן לחשבון", "מנהל הורדות", "התראה על סרטון חדש בערוץ מאושר", "שיתוף בקישור, QR או בלוטות'"]}
            shots={[
              { src: SHOTS.library, alt: "מסך הספרייה של FilterTube" },
              { src: SHOTS.settings, alt: "מסך ההגדרות של FilterTube" },
            ]}
          />
        </div>
      </section>

      {/* ----------------------------------------------------- Comparison */}
      <section className="section-padding border-t border-border bg-surface-sunken" aria-label="השוואה לאפליקציות יוטיוב פרוצות">
        <div className="container-custom max-w-3xl">
          <AnimatedSection className="text-center">
            <h2 className="text-display-md text-ink">FilterTube מול אפליקציה פרוצה</h2>
            <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
              אותן תכונות שאנשים מחפשים – בלי להתקין APK ממקור לא מוכר, ועם סינון.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.08} className="mt-10">
            <div className="overflow-hidden rounded-[1.25rem] border border-border bg-surface shadow-sm">
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
                        <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3.5 w-3.5" aria-label="יש" />
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
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
      <section className="section-padding border-t border-border" aria-label="שאלות נפוצות על FilterTube">
        <div className="container-custom grid gap-10 lg:grid-cols-12 lg:gap-12">
          <AnimatedSection className="lg:col-span-4">
            <Eyebrow>שאלות נפוצות</Eyebrow>
            <h2 className="mt-4 text-display-md text-ink">מה שואלים אותנו על FilterTube</h2>
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
            <Accordion type="single" collapsible className="divide-y divide-border overflow-hidden rounded-[1.25rem] border border-border bg-surface shadow-sm">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`ft-faq-${i}`} className="border-0 px-5 md:px-6">
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

      {/* ------------------------------------------------------------ CTA */}
      <section className="relative overflow-hidden section-padding border-t border-border bg-surface" aria-label="הורדת FilterTube">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,hsl(353_100%_59%/0.10),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="container-custom relative max-w-3xl text-center">
          <AnimatedSection>
            <h2 className="text-display-lg text-ink">יוטיוב אחר. רגוע יותר.</h2>
            <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-soft">
              שלושים יום פרימיום חינם, בלי כרטיס אשראי ובלי חשבון גוגל. אם לא מתאים – פשוט מוחקים.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4">
              <div className="w-full max-w-sm">
                <ApkDownloadButton
                  href={apkUrl}
                  label="הורדת FilterTube (APK)"
                  size="lg"
                  block
                  downloads={payload?.totalDownloads ?? null}
                  version={stable?.versionName ?? null}
                />
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

      {/* --------------------------------------------------- Long-form copy */}
      <section className="section-padding border-t border-border" aria-label="על FilterTube – יוטיוב מסונן">
        <div className="container-custom max-w-3xl">
          <h2 className="text-display-sm text-ink">פילטר טיוב – יוטיוב ומיוזיק מסוננים בעברית, מה צריך לדעת</h2>
          <div className="prose-fp mt-6">
            <p>
              <strong>FilterTube</strong>, או בעברית <strong>פילטר טיוב</strong>, היא אפליקציית
              אנדרואיד שפיתחנו ב-FilterPhone כדי לענות על שאלה אחת שחוזרת אצל כמעט כל לקוח: מסננים
              את הטלפון – ומה עושים עם יוטיוב. האפליקציה מציגה תוכן יוטיוב, אבל רק אחרי סינון, ובלי
              פרסומות, בלי תגובות ובלי תכנים מוצעים שמושכים הלאה.
            </p>

            <h3>שתי אפליקציות בתוך אחת: FilterTube ו-FilterMusic</h3>
            <p>
              בראש המסך יש מתג. צד אחד הוא <strong>FilterTube</strong> – <strong>יוטיוב מסונן</strong> עם
              פיד, חיפוש, שורטס, שידורים חיים וערוצי תורה. הצד השני הוא <strong>FilterMusic</strong> –
              <strong> יוטיוב מיוזיק מסונן</strong>: מסך בית מוזיקלי, מיקס יומי אישי, מיקס נפרד לכל
              זמר, רדיו שממשיך מכל שיר וספרייה עם לייקים והורדות. מי שחיפש <strong>יוטיוב עם
              מיוזיק</strong> בגרסה מסוננת מקבל את שניהם בהתקנה אחת, על אותה רשימת ערוצים מאושרת
              ותחת אותה רמת סינון וקוד הורים.
            </p>

            <h3>שלוש רמות סינון, ומה בדיוק ההבדל</h3>
            <p>
              רמת <strong>מחמיר</strong> מציגה את כל התוכן כווידאו, אבל המוזיקה נשמעת כאודיו בלבד –
              בלי קליפים – וערוצי ״דתי לייט״ אינם מוצגים. רמת <strong>רגיל</strong> זהה, אלא שגם
              המוזיקה מוצגת כווידאו, וערוצי ״דתי לייט״ עדיין אינם מוצגים. רמת
              <strong> דתי לייט</strong> מוסיפה שירים חילוניים בביצוע גברים בלבד, והם מתנגנים כאודיו
              בלבד ולעולם לא כווידאו. מעל שלוש הרמות יש מתג נפרד, <strong>״הכל כאודיו״</strong>,
              שמבטל את המסך לגמרי – גם שיעורים, גם חדשות וגם מוזיקה יישמעו ולא ייראו. את רמת הסינון
              ואת הצגת השורטס נועלים בקוד הורים, כך שרק מי שיודע את הקוד יכול לשנות אותם.
            </p>

            <h3>מי מחליט מה נכנס פנימה</h3>
            <p>
              כל ערוץ ברשימה נבדק ואושר <strong>ידנית על ידי אדם</strong> – לא על ידי בינה מלאכותית
              ולא באופן אוטומטי. מה שלא אושר פשוט לא קיים באפליקציה, גם לא בתוצאות החיפוש. זה ההבדל
              המרכזי בין סינון אמיתי לבין חסימה לפי מילות מפתח.
            </p>

            <h3>סינון ליוטיוב בלי אפליקציה פרוצה</h3>
            <p>
              הרבה אנשים מחפשים <strong>יוטיוב פרוץ להורדה</strong> בשביל שלושה דברים: לעקוף
              פרסומות, לנגן ברקע ולהוריד סרטונים. FilterTube נותנת את שלושתם, אבל בלי להתקין קובץ
              APK ממקור לא מוכר, בלי להיכנס עם חשבון גוגל, ועם סינון תוכן אמיתי מעל הכול. מבחינת
              המשתמש זו אפליקציה אחת שמחליפה גם את הצורך בעקיפה וגם את הצורך בפיקוח.
            </p>

            <h3>נגן מוזיקה כשר שממשיך גם כשהמסך נעול</h3>
            <p>
              בוחרים אמנים בהתקנה, ומקבלים פיד מוזיקה אישי שמתעדכן לבד. הנגן ממשיך לעבוד ברקע
              ובמסך נעול, יש חלון צף, ואפשר להוריד מראש ולהאזין בלי חיבור לאינטרנט. בפועל מקבלים{" "}
              <strong>נגן מוזיקה</strong> בסגנון יוטיוב מיוזיק, בתוך סביבה מסוננת – בלי פרסומות
              ובלי מנוי.
            </p>

            <h3>למי זה מתאים</h3>
            <p>
              להורים שרוצים לתת מכשיר לילד בלי לדאוג מה יופיע בפיד; לבחורי ישיבה ולציבור החרדי
              והדתי שמחפשים <strong>יוטיוב כשר</strong> ו<strong>מוזיקה כשרה</strong>; ולכל מי
              שפשוט רוצה לצפות ולהאזין בלי פרסומות ובלי אלגוריתם שמושך הלאה. ההורדה חינמית,
              הפרימיום חינם לשלושים יום, והאפליקציה עובדת על אנדרואיד 7.0 ומעלה.
            </p>

            <p>
              מסננים את יוטיוב אבל המכשיר עצמו עדיין פתוח? אנחנו גם{" "}
              <Link to="/services">מסננים את הטלפון עצמו</Link> – הדרן, עסקן וכושר פליי – ואפשר
              לראות את ההבדלים ביניהם ב<Link to="/compare">עמוד ההשוואה</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- Back to the main business */}
      <section className="border-t border-border bg-surface py-12" aria-label="שירותי הסינון שלנו">
        <div className="container-custom">
          <AnimatedSection>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.875rem] bg-primary-tint text-primary">
                  <Smartphone className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-ink">רוצים לסנן גם את הטלפון עצמו?</h2>
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
