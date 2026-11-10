import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  AlertTriangle, ArrowLeft, Download, Info, MessageCircle, PlayCircle, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import PhoneFrame from "@/components/PhoneFrame";
import { SITE, waLink } from "@/lib/site";
import { faqJsonLd, type FaqItem } from "@/lib/faq";
import { FILTERPHONE } from "@/lib/filterphoneApp";
import generalVideo from "@/assets/videos/install_general.mp4.asset.json";
import samsungVideo from "@/assets/videos/install_samsung.mp4.asset.json";
import xiaomiVideo from "@/assets/videos/install_xiaomi.mp4.asset.json";

/**
 * The install guide, by phone maker.
 *
 * The maker tabs keep every panel in the DOM and hide the inactive ones with the
 * `hidden` attribute, rather than unmounting them, so the Samsung and Xiaomi
 * steps are part of the page search engines render. Each maker's steps are
 * placed where they belong in the sequence — before or after the common install
 * — so someone picks their phone once and reads straight down.
 *
 * The steps follow the owner's guide, checked against docs/DEVICE_OWNER.md in
 * the app's repository (§4א covers the no-computer setup).
 */

type Maker = "samsung" | "xiaomi" | "other";

const MAKERS: { id: Maker; label: string }[] = [
  { id: "samsung", label: "סמסונג" },
  { id: "xiaomi", label: "שיאומי / רדמי / פוקו" },
  { id: "other", label: "שאר הטלפונים" },
];

/**
 * Tutorial videos. `src` is the landscape cut (desktop); `vertical` is the portrait
 * cut shown on phones. Missing vertical falls back to the landscape one.
 */
type GuideSrc = { src: string | null; vertical: string | null; poster: string; title: string };
const VIDEOS: Record<"all" | Maker, GuideSrc> = {
  all: { src: generalVideo.url, vertical: null, poster: "/install/poster-all.webp", title: "סרטון: הורדה והתקנה של FilterPhone" },
  samsung: { src: samsungVideo.url, vertical: null, poster: "/install/poster-samsung.webp", title: "סרטון: התקנת FilterPhone בסמסונג" },
  xiaomi: { src: xiaomiVideo.url, vertical: null, poster: "/install/poster-xiaomi.webp", title: "סרטון: התקנת FilterPhone בשיאומי" },
  other: { src: generalVideo.url, vertical: null, poster: "/install/poster-all.webp", title: "סרטון: הורדה והתקנה של FilterPhone" },
};

const WA = waLink("שלום, אני מנסה להתקין את FilterPhone ואשמח לעזרה");

/* --------------------------------------------------------------- Bits */

/** A settings path, shown as the chips you actually tap through. */
const Path = ({ steps }: { steps: string[] }) => (
  <span className="my-1 inline-flex flex-wrap items-center gap-1 align-middle">
    {steps.map((s, i) => (
      <span key={s} className="inline-flex items-center gap-1">
        {i > 0 && <span className="text-muted-foreground" aria-hidden="true">←</span>}
        <span className="rounded-sm border border-border bg-surface-sunken px-1.5 py-0.5 text-[0.8125rem] font-semibold text-ink">
          {s}
        </span>
      </span>
    ))}
  </span>
);

/** A button or toggle label on the phone's screen. */
const Tap = ({ children }: { children: ReactNode }) => (
  <strong className="rounded-sm bg-primary-tint px-1.5 py-0.5 font-semibold text-primary">{children}</strong>
);

const Tip = ({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) => (
  <p className={`mt-3 flex items-start gap-2 rounded-md p-3 text-[0.875rem] leading-relaxed ${tone === "warn" ? "bg-accent-tint text-ink" : "bg-surface-sunken text-ink-soft"}`}>
    {tone === "warn" ? (
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
    ) : (
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
    )}
    <span>{children}</span>
  </p>
);

interface Step {
  title: string;
  body: ReactNode;
  /** Plain text of the step, for the HowTo markup. */
  text: string;
  /** Screenshot basename. App screens are in /public/filterphone; system screens go in /public/install. */
  shot?: { name: string; dir?: string; alt: string };
}

const StepList = ({ steps, start = 1 }: { steps: Step[]; start?: number }) => (
  <ol className="space-y-3">
    {steps.map((s, i) => (
      <li key={s.title}>
        <AnimatedSection delay={Math.min(i, 4) * 0.04}>
          <div className={`panel grid gap-5 p-5 md:p-6 ${s.shot ? "sm:grid-cols-[1fr_auto] sm:items-start" : ""}`}>
            <div className="flex gap-4">
              <span className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[0.875rem] font-bold text-primary-foreground">
                {start + i}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[1rem] font-bold leading-snug text-ink">{s.title}</h3>
                <div className="mt-2 text-[0.9375rem] leading-[1.9] text-ink-soft">{s.body}</div>
              </div>
            </div>
            {s.shot && (
              <PhoneFrame
                shot={s.shot.name}
                dir={s.shot.dir}
                alt={s.shot.alt}
                className="mx-auto max-w-[9.5rem] sm:mx-0"
                sizes="152px"
              />
            )}
          </div>
        </AnimatedSection>
      </li>
    ))}
  </ol>
);

const useIsPhone = () => {
  const [phone, setPhone] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 767px)");
    const on = () => setPhone(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return phone;
};

const GuideVideo = ({ which }: { which: keyof typeof VIDEOS }) => {
  const v = VIDEOS[which];
  const phone = useIsPhone();
  const vertical = phone && Boolean(v.vertical);
  const src = vertical ? v.vertical : v.src;
  return (
    <figure className={`overflow-hidden rounded-lg border border-border bg-ink shadow-sm ${vertical ? "mx-auto max-w-[22rem]" : ""}`}>
      <div className={`relative ${vertical ? "aspect-[9/16]" : "aspect-video"}`}>
        <video
          key={src ?? "none"}
          className="h-full w-full object-contain"
          poster={vertical ? undefined : v.poster}
          preload="metadata"
          playsInline
          controls={Boolean(src)}
          aria-label={v.title}
        >
          {src && <source src={src} type="video/mp4" />}
        </video>
        {!src && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-sm bg-white/90 px-2.5 py-1 text-[0.75rem] font-bold text-ink">
            <PlayCircle className="h-3.5 w-3.5" />
            סרטון הדרכה — בקרוב
          </span>
        )}
      </div>
      <figcaption className="sr-only">{v.title}</figcaption>
    </figure>
  );
};

const PartHeading = ({ letter, title, lead }: { letter: string; title: string; lead?: string }) => (
  <div className="mb-6">
    <span className="eyebrow">חלק {letter}</span>
    <h2 className="mt-3 text-display-sm text-ink">{title}</h2>
    {lead && <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">{lead}</p>}
  </div>
);

/* --------------------------------------------------------------- Steps */

const COMMON_STEPS: Step[] = [
  {
    title: "פותחים את האתר בכרום ולוחצים ״הורדת האפליקציה״",
    text: "פותחים את האתר בכרום ולוחצים על הורדת האפליקציה.",
    body: (
      <>
        גולשים ל-filterphone.com <strong className="font-semibold text-ink">בכרום</strong>, ולוחצים על הכפתור{" "}
        <Tap>הורדת האפליקציה</Tap>.
      </>
    ),
  },
  {
    title: "כרום שואל ״להוריד בכל זאת?״",
    text: "כרום שואל אם להוריד בכל זאת — לוחצים הורדה.",
    body: (
      <>
        זו הודעה רגילה על כל קובץ שמגיע מחוץ לחנות. לוחצים <Tap>הורדה</Tap>.
      </>
    ),
  },
  {
    title: "בסוף ההורדה — לוחצים ״פתיחה״",
    text: "בסוף ההורדה לוחצים פתיחה, או נכנסים להורדות ובוחרים FilterPhone.",
    body: (
      <>
        לוחצים <Tap>פתיחה</Tap> בהודעה שמופיעה. פספסתם אותה? <Path steps={["הורדות", "FilterPhone"]} />
      </>
    ),
  },
  {
    title: "״מטעמי אבטחה, הטלפון לא מאפשר להתקין אפליקציות ממקור זה״",
    text: "אם הטלפון חוסם התקנה ממקור זה: לוחצים הגדרות, מדליקים אפשר ממקור זה, חוזרים אחורה ולוחצים התקנה.",
    body: (
      <>
        אם מופיעה ההודעה הזו: <Tap>הגדרות</Tap> ← מדליקים <Tap>אפשר ממקור זה</Tap> ← חוזרים אחורה ←{" "}
        <Tap>התקנה</Tap>.
      </>
    ),
  },
  {
    title: "Google Play Protect: ״אפליקציה לא מוכרת״",
    text: "אם Play Protect מזהיר על אפליקציה לא מוכרת: לוחצים פרטים נוספים ואז התקנה בכל זאת. אם אין כפתור כזה: Play Store, תמונת הפרופיל, Play Protect, הגדרות, מכבים את סריקת האפליקציות, מתקינים, ואחרי ההתקנה אפשר להדליק בחזרה.",
    body: (
      <>
        מופיע כמעט בכל טלפון. לוחצים <Tap>פרטים נוספים</Tap> ← <Tap>התקנה בכל זאת</Tap>.
        <Tip>
          אין כפתור כזה, וההתקנה נחסמת? פותחים את{" "}
          <Path steps={["Play Store", "תמונת הפרופיל למעלה", "Play Protect", "⚙"]} /> ← מכבים{" "}
          <Tap>סריקת אפליקציות באמצעות Play Protect</Tap> ← מתקינים.{" "}
          <strong className="font-semibold text-ink">אחרי ההתקנה אפשר להדליק בחזרה.</strong>
        </Tip>
      </>
    ),
  },
  {
    title: "פותחים את FilterPhone ונרשמים",
    text: "פותחים את FilterPhone, נרשמים, בוחרים דרך התקנה — אוטומטי, Root או ידני — ועוקבים אחרי הצעדים באפליקציה.",
    shot: { name: "welcome", alt: "מסך הפתיחה של FilterPhone – הצטרפות לשירות" },
    body: (
      <>
        נרשמים ← בוחרים דרך התקנה (<strong className="font-semibold text-ink">אוטומטי</strong> / Root / ידני) ←
        עוקבים אחרי הצעדים. <strong className="font-semibold text-ink">האפליקציה פותחת לבד כל מסך שצריך.</strong>
      </>
    ),
  },
];

/** What the recommended, no-computer setup will ask for — so nothing comes as a surprise. */
const WIRELESS_STEPS: Step[] = [
  {
    title: "הופכים למפתחים",
    text: "לוחצים 7 פעמים על מספר ה-Build עד שמופיע שהפכתם למפתח.",
    body: <>7 לחיצות על <Tap>מספר Build</Tap> (בשיאומי: על גרסת MIUI / OS), עד ״הפכת למפתח״.</>,
  },
  {
    title: "מדליקים ״ניפוי באגים אלחוטי״",
    text: "באפשרויות המפתחים מדליקים ניפוי באגים אלחוטי.",
    body: <>באפשרויות המפתחים מדליקים <Tap>ניפוי באגים אלחוטי</Tap>.</>,
  },
  {
    title: "מקבלים קוד התאמה",
    text: "נכנסים לניפוי באגים אלחוטי ובוחרים התאמת מכשיר באמצעות קוד התאמה — מופיע קוד בן 6 ספרות.",
    body: <>נכנסים ל״ניפוי באגים אלחוטי״ ← <Tap>התאמת מכשיר באמצעות קוד התאמה</Tap>. מופיע קוד בן 6 ספרות.</>,
  },
  {
    title: "מזינים את הקוד ב-FilterPhone",
    text: "מזינים את הקוד באפליקציה, ומכאן הכול נעשה לבד.",
    body: <>מכאן הכול נעשה לבד: ניהול המכשיר, ההרשאות, הסוללה והתעודה.</>,
  },
];

const SAMSUNG_BEFORE: Step[] = [
  {
    title: "מכבים את ״חסימה אוטומטית״ (Auto Blocker)",
    text: "בסמסונג עם One UI 6 ומעלה מכבים את החסימה האוטומטית: הגדרות, אבטחה ופרטיות, חסימה אוטומטית. אחרי ההתקנה אפשר להדליק בחזרה.",
    body: (
      <>
        בטלפונים חדשים (One UI 6 ומעלה) היא חוסמת כל התקנה מחוץ לחנות:{" "}
        <Path steps={["הגדרות", "אבטחה ופרטיות", "חסימה אוטומטית"]} /> ← לכבות.
        <Tip>אחרי ההתקנה אפשר להדליק בחזרה.</Tip>
      </>
    ),
  },
];

const SAMSUNG_AFTER: Step[] = [
  {
    title: "אפשרויות מפתחים — להתקנה האוטומטית",
    text: "בסמסונג: הגדרות, אודות הטלפון, מידע על התוכנה, ו-7 לחיצות על מספר Build.",
    body: (
      <>
        <Path steps={["הגדרות", "אודות הטלפון", "מידע על התוכנה"]} /> ← 7 לחיצות על <Tap>מספר Build</Tap>.
        האפליקציה מסבירה ופותחת את המסך לבד.
        <Tip tone="warn">תיקייה מאובטחת או Dual Messenger? צריך להסיר אותם לפני ההתקנה האוטומטית — גבו לפני.</Tip>
      </>
    ),
  },
];

const XIAOMI_DURING: Step[] = [
  {
    title: "״התקנת אפליקציות לא ידועות״",
    text: "בשיאומי, אם מופיע התקנת אפליקציות לא ידועות, מאשרים לכרום אפשר ממקור זה.",
    body: <>מאשרים לכרום <Tap>אפשר ממקור זה</Tap>.</>,
  },
  {
    title: "סריקת האבטחה של שיאומי",
    text: "אם מופיעה סריקת אבטחה של שיאומי, מחכים שתסתיים ולוחצים התקנה או התקן בכל זאת.",
    body: <>מחכים שהסריקה תסתיים, ולוחצים <Tap>התקנה</Tap> (או <Tap>התקן בכל זאת</Tap>).</>,
  },
];

const XIAOMI_AFTER: Step[] = [
  {
    title: "אפשרויות מפתחים",
    text: "בשיאומי: הגדרות, אודות הטלפון, ו-7 לחיצות על גרסת MIUI או גרסת OS.",
    body: (
      <>
        <Path steps={["הגדרות", "אודות הטלפון"]} /> ← 7 לחיצות על <Tap>גרסת MIUI</Tap> / <Tap>גרסת OS</Tap>.
      </>
    ),
  },
  {
    title: "״ניפוי באגים ב-USB (הגדרות אבטחה)״",
    text: "בשיאומי מדליקים ניפוי באגים ב-USB (הגדרות אבטחה) בהגדרות, הגדרות נוספות, אפשרויות מפתחים. שיאומי מבקשת חשבון Mi פעם אחת, ואחר כך אפשר לצאת ממנו. בטלפון עם Root לא צריך את זה.",
    body: (
      <>
        <Path steps={["הגדרות", "הגדרות נוספות", "אפשרויות מפתחים"]} /> ← מדליקים{" "}
        <Tap>ניפוי באגים ב-USB (הגדרות אבטחה)</Tap>.
        <Tip>
          שיאומי מבקשת חשבון Mi כדי להדליק אותה — פעם אחת. אחרי שהיא דלוקה אפשר לצאת מחשבון ה-Mi.
          האפליקציה בודקת לבד אם ההגדרה כבר דלוקה. <strong className="font-semibold text-ink">בטלפון עם Root — לא צריך את זה בכלל.</strong>
        </Tip>
      </>
    ),
  },
  {
    title: "הפעלה אוטומטית וסוללה ללא הגבלות",
    text: "אחרי ההתקנה מאשרים הפעלה אוטומטית וחיסכון בסוללה ללא הגבלות. האפליקציה פותחת את המסכים לבד.",
    body: (
      <>
        <Tap>הפעלה אוטומטית</Tap> ו<Path steps={["חיסכון בסוללה", "ללא הגבלות"]} />. האפליקציה פותחת את המסכים
        האלה לבד — צריך רק לאשר.
        <Tip tone="warn">אפליקציות כפולות או מרחב שני? צריך לכבות אותם לפני ההתקנה האוטומטית — גבו לפני.</Tip>
      </>
    ),
  },
];

const FAQS: FaqItem[] = [
  {
    q: "״האפליקציה לא הותקנה״",
    a: "כמעט תמיד זה Google Play Protect, או בסמסונג החסימה האוטומטית (Auto Blocker). ראו את הצעד של Play Protect בחלק א׳, ואת החסימה האוטומטית בחלק של סמסונג.",
  },
  {
    q: "״אין לי אפשרויות מפתחים״",
    a: "צריך להדליק אותן פעם אחת: 7 לחיצות על מספר ה-Build (בסמסונג: הגדרות ← אודות הטלפון ← מידע על התוכנה), או על גרסת MIUI / OS בשיאומי.",
  },
  {
    q: "״יש לי אפליקציות כפולות / תיקייה מאובטחת״",
    a: "צריך לכבות אותן לפני ההתקנה האוטומטית — וחשוב לגבות לפני, כי הנתונים של העותק הכפול נמחקים.",
  },
  {
    q: "״צריך לאפס את הטלפון?״",
    a: "ברוב הטלפונים לא. FilterPhone משביתה את החשבונות לכמה שניות בלבד, מפעילה את הניהול ומחזירה אותם — החשבונות לא נמחקים.",
  },
  {
    q: "״לא מצליח״",
    a: "כתבו לנו בוואטסאפ, ואנחנו מתקינים איתכם.",
  },
];

/* --------------------------------------------------------------- Page */

const isMaker = (v: string): v is Maker => MAKERS.some((m) => m.id === v);

/** Best guess from the phone itself. Chrome hides the model in the UA string, so ask for it. */
async function detectMaker(): Promise<Maker | null> {
  const ua = navigator.userAgent;
  const nav = navigator as Navigator & {
    userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ model?: string }> };
  };
  let model = "";
  try {
    model = (await nav.userAgentData?.getHighEntropyValues?.(["model"]))?.model ?? "";
  } catch {
    /* not offered — fall back to the UA string */
  }
  const hay = `${model} ${ua}`;
  if (/\bSM-|samsung/i.test(hay)) return "samsung";
  if (/xiaomi|redmi|poco|\bM2\d{3}|\b2\d{3}[A-Z0-9]{3,}\b/i.test(hay)) return "xiaomi";
  return null;
}

const Install = () => {
  const [maker, setMaker] = useState<Maker>("other");
  const [detected, setDetected] = useState(false);
  const tabRefs = useRef<Record<Maker, HTMLButtonElement | null>>({ samsung: null, xiaomi: null, other: null });

  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "");
    if (isMaker(fromHash)) {
      setMaker(fromHash);
      return;
    }
    let cancelled = false;
    detectMaker().then((m) => {
      if (!cancelled && m) {
        setMaker(m);
        setDetected(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const choose = (m: Maker) => {
    setMaker(m);
    setDetected(false);
    // Keep the choice in the address so a support message can link straight to it.
    window.history.replaceState(null, "", `#${m}`);
  };

  // Arrow keys move between tabs; in RTL, left is "next".
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = MAKERS.findIndex((m) => m.id === maker);
    const delta = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = MAKERS[(i + delta + MAKERS.length) % MAKERS.length].id;
    choose(next);
    tabRefs.current[next]?.focus();
  };

  const allSteps = [...COMMON_STEPS, ...WIRELESS_STEPS];
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "איך מתקינים את FilterPhone – סינון לטלפון אנדרואיד",
    description: "מדריך התקנה צעד-צעד ל-FilterPhone: הורדה, התקנה מחוץ לחנות, Play Protect, והתקנה אוטומטית בלי מחשב — כולל צעדים מיוחדים לסמסונג ולשיאומי.",
    inLanguage: "he",
    totalTime: "PT10M",
    tool: [{ "@type": "HowToTool", name: "טלפון אנדרואיד 8 ומעלה" }, { "@type": "HowToTool", name: "דפדפן כרום" }],
    step: allSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.text,
    })),
  };

  return (
    <>
      <SEOHead
        title="מדריך התקנה – FilterPhone | סמסונג, שיאומי וכל אנדרואיד"
        description="איך מתקינים את FilterPhone צעד-צעד: הורדה מכרום, התקנה מחוץ לחנות, Play Protect, החסימה האוטומטית של סמסונג, הגדרות שיאומי והתקנה אוטומטית בלי מחשב ובלי איפוס."
        path="/install"
        keywords="מדריך התקנה FilterPhone, התקנת סינון, סינון לסמסונג, סינון לשיאומי, התקנת אפליקציה מחוץ לחנות, Play Protect, חסימה אוטומטית סמסונג, ניפוי באגים אלחוטי, סינון בלי איפוס"
        image={`${SITE.url}/og-install.jpg`}
        imageAlt="מדריך התקנה – FilterPhone"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(howToLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd(FAQS))}</script>
      </Helmet>

      <Breadcrumbs items={[{ label: "מדריך התקנה" }]} />

      {/* ------------------------------------------------------------ Hero */}
      <section className="border-b border-border" aria-label="מדריך התקנה">
        <div className="container-custom py-12 md:py-16">
          <AnimatedSection className="max-w-3xl">
            <span className="eyebrow">מדריך התקנה</span>
            <h1 className="mt-4 text-display-lg text-ink">מתקינים את FilterPhone, צעד אחרי צעד</h1>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft">
              כחמש דקות, מהטלפון עצמו. האפליקציה מובילה אתכם ופותחת לבד כל מסך בהגדרות — כאן מוסבר מה תראו
              בדרך, ומה לעשות אם משהו נתקע.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={FILTERPHONE.apk} rel="noopener">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  <Download className="h-4 w-4" />
                  הורדת האפליקציה
                </Button>
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="whatsapp" className="w-full gap-2 sm:w-auto">
                  <MessageCircle className="h-4 w-4" />
                  נתקעתם? נתקין איתכם
                </Button>
              </a>
            </div>
            <p className="mt-4 text-[0.8125rem] text-muted-foreground">
              טלפון ישן שהאפליקציה לא נפתחת בו?{" "}
              <a href={FILTERPHONE.apkUniversal} rel="noopener" className="font-semibold text-primary link-underline">
                גרסה לכל סוגי המעבדים
              </a>
            </p>
          </AnimatedSection>

          {/* Maker selector */}
          <div className="mt-10">
            <p id="maker-label" className="text-[0.9375rem] font-bold text-ink">
              איזה טלפון יש לכם?
              {detected && <span className="mr-2 text-[0.8125rem] font-medium text-muted-foreground">(זיהינו אוטומטית — אפשר לשנות)</span>}
            </p>
            <div role="tablist" aria-labelledby="maker-label" className="mt-3 grid grid-cols-3 gap-2 sm:inline-grid sm:gap-3">
              {MAKERS.map((m) => {
                const on = m.id === maker;
                return (
                  <button
                    key={m.id}
                    ref={(el) => {
                      tabRefs.current[m.id] = el;
                    }}
                    role="tab"
                    id={`tab-${m.id}`}
                    aria-selected={on}
                    aria-controls={`before-${m.id} after-${m.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => choose(m.id)}
                    onKeyDown={onTabKey}
                    className={`flex min-h-[3.25rem] items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-center text-[0.875rem] font-bold leading-tight transition-colors sm:px-5 sm:text-[0.9375rem] ${
                      on
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-surface text-ink hover:border-primary/40 hover:bg-primary-tint"
                    }`}
                  >
                    <Smartphone className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden="true" />
                    {m.label}
                  </button>
                );
              })}
            </div>
            <span className="sr-only" aria-live="polite">
              מוצגים הצעדים עבור {MAKERS.find((m) => m.id === maker)?.label}
            </span>
          </div>
        </div>
      </section>

      <div className="container-custom max-w-4xl space-y-16 py-12 md:py-16">
        {/* ---------------------------------------------- Maker: before */}
        <section id="before-samsung" role="tabpanel" aria-labelledby="tab-samsung" hidden={maker !== "samsung"}>
          <PartHeading letter="ב׳" title="סמסונג (גלקסי) — לפני שמתחילים" lead="צעד אחד לפני ההורדה, ואחר כך כמו בכל טלפון." />
          <div className="mb-6"><GuideVideo which="samsung" /></div>
          <StepList steps={SAMSUNG_BEFORE} />
        </section>

        <section id="before-xiaomi" role="tabpanel" aria-labelledby="tab-xiaomi" hidden={maker !== "xiaomi"}>
          <PartHeading
            letter="ג׳"
            title="שיאומי / רדמי / פוקו — מה תראו בהתקנה"
            lead="MIUI ו-HyperOS מוסיפים שתי הודעות משלהם בזמן ההתקנה. שתיהן רגילות."
          />
          <div className="mb-6"><GuideVideo which="xiaomi" /></div>
          <StepList steps={XIAOMI_DURING} />
        </section>

        <section id="before-other" role="tabpanel" aria-labelledby="tab-other" hidden={maker !== "other"}>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-lg font-bold text-ink">אין צעדים מיוחדים — ממשיכים ישר להתקנה</h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
              ב-OnePlus, OPPO, פיקסל ושאר הטלפונים — עוקבים אחרי חלק א׳.
            </p>
            <Tip>
              OPPO, realme או OnePlus: אם יש באפשרויות המפתחים <Tap>השבתת ניטור הרשאות</Tap> — להדליק. האפליקציה
              מוסיפה צעד לזה.
            </Tip>
          </div>
        </section>

        {/* ------------------------------------------------ Part A: everyone */}
        <section id="common" aria-labelledby="common-title">
          <div className="mb-6">
            <span className="eyebrow">חלק א׳ · לכל הטלפונים</span>
            <h2 id="common-title" className="mt-3 text-display-sm text-ink">הורדה והתקנה</h2>
          </div>
          <div className="mb-6"><GuideVideo which="all" /></div>
          <StepList steps={COMMON_STEPS} />

          <AnimatedSection className="mt-8">
            <div className="rounded-lg bg-primary-tint p-5 md:p-6">
              <h3 className="text-[1.0625rem] font-bold text-ink">ההתקנה האוטומטית, בלי מחשב — מה תתבקשו לעשות</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink">
                זו הדרך המומלצת (אנדרואיד 11 ומעלה). האפליקציה תוביל אתכם; זה רק כדי שתדעו למה לצפות.
              </p>
              <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                {WIRELESS_STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-3 rounded-md bg-surface p-4">
                    <span className="num flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary text-[0.75rem] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[0.9375rem] font-bold text-ink">{s.title}</span>
                      <span className="mt-1 block text-[0.875rem] leading-[1.8] text-ink-soft">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[0.875rem] leading-relaxed text-ink">
                <strong className="font-semibold">החשבונות שלכם לא נמחקים.</strong> אנדרואיד לא מאפשר ניהול מכשיר כשיש
                חשבונות בטלפון, אז FilterPhone משביתה אותם לכמה שניות, מפעילה את הניהול ומחזירה אותם.
              </p>
            </div>
          </AnimatedSection>
        </section>

        {/* ---------------------------------------------- Maker: after */}
        <section id="after-samsung" role="tabpanel" aria-labelledby="tab-samsung" hidden={maker !== "samsung"}>
          <PartHeading letter="ב׳" title="סמסונג — להתקנה האוטומטית" />
          <StepList steps={SAMSUNG_AFTER} />
        </section>

        <section id="after-xiaomi" role="tabpanel" aria-labelledby="tab-xiaomi" hidden={maker !== "xiaomi"}>
          <PartHeading
            letter="ג׳"
            title="שיאומי — להתקנה האוטומטית ואחריה"
            lead="שיאומי דורשת עוד הגדרה אחת לפני ההתקנה האוטומטית, ושני אישורים אחריה."
          />
          <StepList steps={XIAOMI_AFTER} />
        </section>

        <section id="after-other" role="tabpanel" aria-labelledby="tab-other" hidden={maker !== "other"} />

        {/* ------------------------------------------------- Part D: problems */}
        <section id="problems" aria-labelledby="problems-title">
          <div className="mb-6">
            <span className="eyebrow">חלק ד׳</span>
            <h2 id="problems-title" className="mt-3 text-display-sm text-ink">בעיות נפוצות</h2>
          </div>
          <Accordion type="single" collapsible className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`install-faq-${i}`} className="border-0 px-5 md:px-6">
                <AccordionTrigger className="py-[1.125rem] text-right text-[0.9375rem] font-bold text-ink hover:no-underline md:text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[0.9375rem] leading-relaxed text-ink-soft">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 flex flex-col items-start gap-4 rounded-lg border border-border bg-surface-sunken p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9375rem] leading-relaxed text-ink">
              <strong className="font-semibold">לא מצליחים?</strong> כתבו לנו — אנחנו מתקינים איתכם.
            </p>
            <a href={WA} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button variant="whatsapp" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                וואטסאפ
              </Button>
            </a>
          </div>
        </section>

        <AnimatedSection>
          <Link to="/" className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-primary link-underline">
            מה מקבלים עם FilterPhone
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </AnimatedSection>
      </div>
    </>
  );
};

export default Install;
