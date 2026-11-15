import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Download, Info, List, MessageCircle,
  Play, RotateCcw, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import StepVideo from "@/components/StepVideo";
import { SITE, waLink } from "@/lib/site";
import { faqJsonLd, type FaqItem } from "@/lib/faq";
import { FILTERPHONE } from "@/lib/filterphoneApp";
import { VIDEO_FILES, clipFor, clipSeconds, type Maker } from "@/lib/installVideos";
import guide from "@/data/installGuide.json";

/**
 * The install guide: one step on the screen at a time.
 *
 * People got lost in the long version of this page — three "parts", tabs, and a
 * video per maker that ran through everything at once. Here you pick your phone
 * and get a single action per screen, with the part of the video that shows it
 * and one big button to move on. It runs from the download to the end of the
 * device-management setup ("הצריבה"), which the videos never covered.
 *
 * The step is kept in the address (#samsung-pair), so the phone's own Back
 * button goes back a step, a support message can link to an exact step, and a
 * reload — common when someone leaves for Settings and returns — lands where
 * they were. The last step is also remembered, for coming back days later once
 * the account is approved.
 *
 * The wording lives in src/data/installGuide.json, which the prerenderer reads
 * too, so crawlers get the same steps the page shows. It follows the app's own
 * screens (app/lib/src/screens/install_screen.dart in the app's repository),
 * button label for button label.
 */

/* --------------------------------------------------------------- Data */

type Tone = "info" | "warn";
interface Tip { tone: Tone; text: string; makers?: Maker[] }
interface Step {
  id: string;
  phase: string;
  makers?: Maker[];
  title: string;
  why: string;
  action?: "download";
  items: string[] | Record<Maker, string[]>;
  tips?: Tip[];
}
interface Guide {
  phases: { id: string; label: string }[];
  steps: Step[];
  faqs: FaqItem[];
}

const GUIDE = guide as unknown as Guide;

const MAKERS: { id: Maker; label: string; sub: string }[] = [
  { id: "samsung", label: "סמסונג", sub: "Galaxy" },
  { id: "xiaomi", label: "שיאומי", sub: "Redmi · POCO" },
  { id: "other", label: "טלפון אחר", sub: "פיקסל, OnePlus, OPPO ועוד" },
];

const isMaker = (v: string | undefined): v is Maker => MAKERS.some((m) => m.id === v);
const makerLabel = (m: Maker) => MAKERS.find((x) => x.id === m)!.label;
const stepsFor = (m: Maker) => GUIDE.steps.filter((s) => !s.makers || s.makers.includes(m));
const itemsFor = (s: Step, m: Maker) => (Array.isArray(s.items) ? s.items : s.items[m]);
const tipsFor = (s: Step, m: Maker) => (s.tips ?? []).filter((t) => !t.makers || t.makers.includes(m));
const plain = (t: string) => t.replace(/\*\*/g, "");

/** `**שם הכפתור**` in the data becomes the highlighted label of something on the phone's screen. */
const rich = (text: string): ReactNode =>
  text.split("**").map((part, i) =>
    i % 2 ? (
      <strong
        key={i}
        className="rounded-[3px] bg-primary-tint px-[3px] py-px font-bold text-primary [-webkit-box-decoration-break:clone] [box-decoration-break:clone] [unicode-bidi:isolate]"
      >
        {part}
      </strong>
    ) : (
      part
    ),
  );

/** `#samsung-pair` → Samsung, the "pair" step. `#samsung` alone opens Samsung's first step. */
const parseHash = (hash: string): { maker: Maker | null; step: string | null } => {
  let raw = hash.replace(/^#/, "");
  try {
    raw = decodeURIComponent(raw);
  } catch {
    /* a malformed fragment is treated as no fragment */
  }
  const [m, ...rest] = raw.split("-");
  return isMaker(m) ? { maker: m, step: rest.join("-") || null } : { maker: null, step: null };
};

const STORE = "fp-install";
const KEEP_MS = 30 * 24 * 60 * 60 * 1000;

const readSaved = (): { maker: Maker; step: string } | null => {
  try {
    const v = JSON.parse(window.localStorage.getItem(STORE) ?? "null");
    if (v && isMaker(v.maker) && typeof v.step === "string" && Date.now() - v.t < KEEP_MS) return v;
  } catch {
    /* private mode, or storage blocked — the guide works without it */
  }
  return null;
};

const writeSaved = (v: { maker: Maker; step: string } | null) => {
  try {
    if (v) window.localStorage.setItem(STORE, JSON.stringify({ ...v, t: Date.now() }));
    else window.localStorage.removeItem(STORE);
  } catch {
    /* see readSaved */
  }
};

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

const iso = (seconds: number) => `PT${Math.floor(seconds / 60)}M${Math.round(seconds % 60)}S`;

/* --------------------------------------------------------------- Bits */

const TipBox = ({ tip }: { tip: Tip }) => (
  <p
    className={`flex items-start gap-2.5 rounded-md p-3.5 text-[0.9375rem] leading-relaxed ${
      tip.tone === "warn" ? "bg-accent-tint text-ink" : "bg-surface-sunken text-ink-soft"
    }`}
  >
    {tip.tone === "warn" ? (
      <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
    ) : (
      <Info className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
    )}
    <span>{rich(tip.text)}</span>
  </p>
);

/** Where you are: the four phases, and the step count inside them. */
const Progress = ({ steps, index }: { steps: Step[]; index: number }) => {
  const phase = steps[index].phase;
  const phaseAt = GUIDE.phases.findIndex((p) => p.id === phase);
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <ol className="flex items-center gap-1.5 text-[0.8125rem] font-bold sm:gap-3 sm:text-[0.875rem]" aria-label="שלבי ההתקנה">
        {GUIDE.phases.map((p, i) => {
          const done = i < phaseAt;
          const on = i === phaseAt;
          return (
            <li key={p.id} className="flex min-w-0 flex-1 items-center gap-1.5" aria-current={on ? "step" : undefined}>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.75rem] ${
                  done ? "bg-success text-white" : on ? "bg-primary text-primary-foreground" : "bg-surface-sunken text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : <span className="num">{i + 1}</span>}
              </span>
              <span className={`truncate ${on ? "text-ink" : "text-muted-foreground"}`}>{p.label}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex items-center gap-3">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-surface-sunken"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={index + 1}
          aria-label="התקדמות במדריך"
        >
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
        </div>
        <span className="shrink-0 text-[0.8125rem] font-bold text-ink">
          שלב <span className="num">{index + 1}</span> מתוך <span className="num">{steps.length}</span>
        </span>
      </div>
    </div>
  );
};

/** On a phone the clip waits behind one tap, so the instructions stay on the first screen. */
const StepClip = ({ step, maker, phone }: { step: Step; maker: Maker; phone: boolean }) => {
  const clip = clipFor(maker, step.id, phone);
  const [open, setOpen] = useState(false);
  if (!clip) return null;
  const label = `סרטון: ${step.title}`;

  if (!phone) return <StepVideo key={clip.url + clip.start} clip={clip} label={label} />;

  return open ? (
    <div>
      <StepVideo key={clip.url + clip.start} clip={clip} label={label} autoPlay />
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="mx-auto mt-2 block text-[0.875rem] font-semibold text-primary underline underline-offset-4"
      >
        סגירת הסרטון
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex w-full items-center gap-4 rounded-lg border border-primary/25 bg-primary-tint p-3 text-right transition-colors hover:border-primary/50"
    >
      <span className="relative h-24 w-[3.375rem] shrink-0 overflow-hidden rounded-md bg-[hsl(205_48%_8%)]">
        <img
          src={clip.poster}
          alt=""
          width={54}
          height={96}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[1rem] font-bold text-ink">סרטון קצר של השלב הזה</span>
        <span className="mt-0.5 block text-[0.875rem] text-ink-soft">
          <span className="num">{clipSeconds(clip)}</span> שניות. רואים בדיוק איפה ללחוץ.
        </span>
      </span>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft">
        <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" aria-hidden="true" />
      </span>
    </button>
  );
};

interface PanelProps {
  step: Step;
  maker: Maker;
  number: number;
  total: number;
  phone: boolean;
  /** Shown on its own, with the forward and back buttons. */
  solo: boolean;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onNext?: () => void;
  onBack?: () => void;
  isLast?: boolean;
}

const StepPanel = ({ step, maker, number, total, phone, solo, headingRef, onNext, onBack, isLast }: PanelProps) => {
  const items = itemsFor(step, maker);
  const tips = tipsFor(step, maker);
  const help = waLink(`שלום, אני מתקין את FilterPhone (${makerLabel(maker)}) ונתקעתי בשלב ${number}: ${plain(step.title)}`);

  return (
    <article aria-labelledby={`title-${step.id}`} className={solo ? "" : "panel p-5 md:p-7"}>
      {!solo && (
        <p className="mb-2 text-[0.8125rem] font-bold text-primary">
          שלב <span className="num">{number}</span> מתוך <span className="num">{total}</span>
        </p>
      )}
      <h2
        id={`title-${step.id}`}
        ref={headingRef}
        tabIndex={-1}
        className={`text-ink outline-none ${solo ? "text-[1.625rem] font-extrabold leading-tight md:text-display-sm" : "text-xl font-bold"}`}
      >
        {step.title}
      </h2>
      <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">{step.why}</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-start lg:gap-10">
        <div className="lg:order-2">
          <StepClip step={step} maker={maker} phone={phone} />
        </div>

        <div className="space-y-4 lg:order-1">
          <ol className="space-y-3">
            {items.map((it, i) => (
              <li key={it} className="flex gap-3.5 rounded-lg border border-border bg-surface p-4">
                <span className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[0.9375rem] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 pt-0.5 text-[1.0625rem] leading-[1.75] text-ink">{rich(it)}</span>
              </li>
            ))}
          </ol>

          {step.action === "download" && (
            <div className="rounded-lg bg-primary-tint p-4">
              <a href={FILTERPHONE.apk} rel="noopener" className="block">
                <Button size="lg" className="h-14 w-full gap-2 text-[1.0625rem]">
                  <Download className="h-5 w-5" />
                  הורדת האפליקציה
                </Button>
              </a>
              <p className="mt-3 text-center text-[0.8125rem] text-ink-soft">
                טלפון ישן, והאפליקציה לא נפתחת אחרי ההתקנה?{" "}
                <a href={FILTERPHONE.apkUniversal} rel="noopener" className="font-semibold text-primary underline underline-offset-4">
                  גרסה לכל סוגי המעבדים
                </a>
              </p>
            </div>
          )}

          {tips.map((t) => (
            <TipBox key={t.text} tip={t} />
          ))}
        </div>
      </div>

      {solo && (
        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" size="lg" className="h-12 gap-2" onClick={onBack}>
              <ArrowRight className="h-4 w-4" />
              {number === 1 ? "חזרה לבחירת הטלפון" : "לשלב הקודם"}
            </Button>
            <Button size="lg" className="h-14 gap-2 text-[1.0625rem] sm:min-w-[16rem]" onClick={onNext}>
              {isLast ? "עשיתי, סיימתי" : "עשיתי, לשלב הבא"}
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-5 text-center text-[0.9375rem] text-ink-soft sm:text-right">
            נתקעתם בשלב הזה?{" "}
            <a href={help} target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline underline-offset-4">
              כתבו לנו בוואטסאפ, ונתקין איתכם
            </a>
          </p>
        </div>
      )}
    </article>
  );
};

/* --------------------------------------------------------------- Page */

const WA = waLink("שלום, אני מנסה להתקין את FilterPhone ואשמח לעזרה");

const Install = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const phone = useIsPhone();
  const route = useMemo(() => parseHash(hash), [hash]);

  const [picked, setPicked] = useState<Maker>("other");
  const [detected, setDetected] = useState(false);
  const [saved, setSaved] = useState<{ maker: Maker; step: string } | null>(null);
  const [isAndroid, setIsAndroid] = useState(true);

  const top = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  const maker = route.maker ?? picked;
  const steps = useMemo(() => stepsFor(maker), [maker]);
  const mode: "start" | "all" | "done" | "step" = !route.maker
    ? "start"
    : route.step === "all"
      ? "all"
      : route.step === "done"
        ? "done"
        : "step";
  const index = mode === "step" ? Math.max(0, steps.findIndex((s) => s.id === route.step)) : -1;

  useEffect(() => {
    setSaved(readSaved());
    setIsAndroid(/android/i.test(navigator.userAgent));
    let cancelled = false;
    detectMaker().then((m) => {
      if (!cancelled && m) {
        setPicked(m);
        setDetected(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Remember the step, so coming back later — after the account is approved — picks up there.
  useEffect(() => {
    if (mode === "step") writeSaved({ maker, step: steps[index].id });
    else if (mode === "done") writeSaved(null);
  }, [mode, maker, steps, index]);

  // A new step starts at its top, with its title announced.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (mode === "start") return;
    }
    top.current?.scrollIntoView({ block: "start" });
    heading.current?.focus({ preventScroll: true });
  }, [hash, mode]);

  const go = (m: Maker, step: string) => navigate({ hash: `#${m}-${step}` });
  const toStart = () => navigate({ hash: "" });

  const next = () => go(maker, index + 1 < steps.length ? steps[index + 1].id : "done");
  const back = () => (index > 0 ? go(maker, steps[index - 1].id) : toStart());

  const savedStep = saved ? stepsFor(saved.maker).find((s) => s.id === saved.step) : undefined;
  const savedNumber = saved && savedStep ? stepsFor(saved.maker).indexOf(savedStep) + 1 : 0;

  /* Structured data describes the general (any-Android) sequence. */
  const generic = stepsFor("other");
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "איך מתקינים את FilterPhone – סינון לטלפון אנדרואיד",
    description:
      "מדריך התקנה צעד-צעד ל-FilterPhone: כיבוי Play Protect, הורדה והתקנה, הרשמה, והצריבה (ניהול המכשיר) בלי מחשב — כולל הצעדים המיוחדים לסמסונג ולשיאומי.",
    inLanguage: "he",
    tool: [{ "@type": "HowToTool", name: "טלפון אנדרואיד 8 ומעלה" }, { "@type": "HowToTool", name: "דפדפן כרום" }, { "@type": "HowToTool", name: "חיבור Wi-Fi" }],
    step: generic.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: plain(s.title),
      text: itemsFor(s, "other").map(plain).join(" "),
      url: `${SITE.url}/install#other-${s.id}`,
    })),
  };

  const videoLd = (
    [
      ["other", "התקנת FilterPhone בטלפון אנדרואיד – סרטון הדרכה", "הורדה והתקנה של FilterPhone בכל טלפון אנדרואיד: האזהרה של כרום, כיבוי זמני של Play Protect, התקנה ממקור לא מוכר והרשמה לשירות.", "/install/poster-all.webp"],
      ["samsung", "התקנת FilterPhone בסמסונג גלקסי – סרטון הדרכה", "התקנת FilterPhone בסמסונג גלקסי: כיבוי החסימה האוטומטית (Auto Blocker) ו-Play Protect, הורדה, התקנה והפעלת אפשרויות המפתחים.", "/install/poster-samsung.webp"],
      ["xiaomi", "התקנת FilterPhone בשיאומי, רדמי ופוקו – סרטון הדרכה", "התקנת FilterPhone בשיאומי: Play Protect, התקנת אפליקציות לא ידועות, סריקת האבטחה של שיאומי, אפשרויות מפתחים והרשאות ריצה ברקע.", "/install/poster-xiaomi.webp"],
    ] as const
  ).map(([m, name, description, thumb]) => ({
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `${SITE.url}${thumb}`,
    uploadDate: VIDEO_FILES[m].land.uploaded,
    duration: iso(VIDEO_FILES[m].land.duration),
    contentUrl: VIDEO_FILES[m].land.url,
    inLanguage: "he",
  }));

  return (
    <>
      <SEOHead
        title="מדריך התקנה – FilterPhone | סמסונג, שיאומי וכל אנדרואיד"
        description="מתקינים את FilterPhone צעד אחרי צעד, עם סרטונים קצרים: Play Protect, החסימה האוטומטית של סמסונג, התקנה, הרשמה והצריבה בלי מחשב ובלי איפוס."
        path="/install"
        keywords="מדריך התקנה FilterPhone, התקנת סינון לטלפון, סינון לסמסונג, סינון לשיאומי, כיבוי Play Protect, חסימה אוטומטית סמסונג, ניפוי באגים אלחוטי, קוד התאמה, סינון בלי איפוס"
        image={`${SITE.url}/og-install.jpg`}
        imageAlt="מדריך התקנה – FilterPhone"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(howToLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd(GUIDE.faqs))}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@graph": videoLd })}</script>
      </Helmet>

      <Breadcrumbs items={[{ label: "מדריך התקנה" }]} />

      <div ref={top} className="scroll-mt-24 border-b border-border">
        <div className="container-custom max-w-5xl py-8 md:py-12">
          {/* The page keeps one H1 in every state; on a step it steps back to a label. */}
          <h1 className={mode === "start" ? "text-display-md text-ink md:text-display-lg" : "eyebrow font-body"}>
            {mode === "start" ? "מתקינים את FilterPhone, צעד אחרי צעד" : "מדריך התקנה ל-FilterPhone"}
          </h1>

          {/* ------------------------------------------------------ Start */}
          {mode === "start" && (
            <div className="mt-4">
              <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
                פעולה אחת בכל מסך, עם סרטונים קצרים שמראים איפה ללחוץ. מההורדה ועד שהטלפון מוגן.
              </p>

              {saved && savedStep && (
                <div className="mt-6 rounded-lg border border-primary/30 bg-primary-tint p-4 md:p-5">
                  <p className="text-[1rem] font-bold text-ink">
                    עצרתם בשלב <span className="num">{savedNumber}</span>: {plain(savedStep.title)}
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Button size="lg" className="h-12 gap-2" onClick={() => go(saved.maker, saved.step)}>
                      להמשיך מאיפה שעצרתי
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-12 gap-2"
                      onClick={() => {
                        writeSaved(null);
                        setSaved(null);
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                      להתחיל מההתחלה
                    </Button>
                  </div>
                </div>
              )}

              {!isAndroid && (
                <p className="mt-6 flex items-start gap-2.5 rounded-md bg-accent-tint p-3.5 text-[0.9375rem] leading-relaxed text-ink">
                  <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    את ההתקנה עושים מהטלפון עצמו. פתחו בכרום, בטלפון שעליו מתקינים, את הכתובת{" "}
                    <strong className="num font-bold">filterphone.com/install</strong>
                  </span>
                </p>
              )}

              <fieldset className="mt-8">
                <legend className="text-xl font-bold text-ink">איזה טלפון יש לכם?</legend>
                {detected && (
                  <p className="mt-1 text-[0.875rem] text-muted-foreground">זיהינו לבד. אם טעינו, בוחרים אחר.</p>
                )}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {MAKERS.map((m) => {
                    const on = m.id === picked;
                    return (
                      <label
                        key={m.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                          on ? "border-primary bg-primary-tint" : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="maker"
                          value={m.id}
                          checked={on}
                          onChange={() => {
                            setPicked(m.id);
                            setDetected(false);
                          }}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            on ? "bg-primary text-primary-foreground" : "bg-surface-sunken text-muted-foreground"
                          }`}
                        >
                          {on ? <Check className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[1.0625rem] font-bold text-ink">{m.label}</span>
                          <span className="block text-[0.8125rem] text-muted-foreground" dir="auto">{m.sub}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <Button size="lg" className="mt-6 h-14 w-full gap-2 text-[1.0625rem] sm:w-auto sm:min-w-[18rem]" onClick={() => go(picked, steps[0].id)}>
                מתחילים
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <p className="mt-3 text-[0.875rem] text-muted-foreground">
                צריך: הטלפון עצמו (אנדרואיד <span className="num">8</span> ומעלה), כרום וחיבור Wi-Fi.
              </p>
            </div>
          )}

          {/* ------------------------------------------------------- Step */}
          {mode === "step" && (
            <div className="mt-4 space-y-6">
              <Progress steps={steps} index={index} />
              {/* Every step stays in the page, hidden, so the whole guide is there for search engines. */}
              {steps.map((s, i) => (
                <div key={s.id} hidden={i !== index}>
                  {i === index ? (
                    <StepPanel
                      step={s}
                      maker={maker}
                      number={i + 1}
                      total={steps.length}
                      phone={phone}
                      solo
                      headingRef={heading}
                      onNext={next}
                      onBack={back}
                      isLast={i === steps.length - 1}
                    />
                  ) : (
                    <>
                      <h2>{s.title}</h2>
                      <p>{s.why}</p>
                      <ol>
                        {itemsFor(s, maker).map((it) => (
                          <li key={it}>{plain(it)}</li>
                        ))}
                      </ol>
                    </>
                  )}
                </div>
              ))}
              <p className="text-center text-[0.875rem] text-muted-foreground">
                {makerLabel(maker)} ·{" "}
                <button type="button" onClick={toStart} className="font-semibold text-primary underline underline-offset-4">
                  החלפת טלפון
                </button>{" "}
                ·{" "}
                <button type="button" onClick={() => go(maker, "all")} className="font-semibold text-primary underline underline-offset-4">
                  כל השלבים בדף אחד
                </button>
              </p>
            </div>
          )}

          {/* -------------------------------------------------------- All */}
          {mode === "all" && (
            <div className="mt-4">
              <h2 ref={heading} tabIndex={-1} className="text-display-sm text-ink outline-none">
                כל השלבים: {makerLabel(maker)}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2" onClick={() => go(maker, steps[0].id)}>
                  <ArrowRight className="h-4 w-4" />
                  חזרה לתצוגת שלב-שלב
                </Button>
                <Button variant="outline" onClick={toStart}>החלפת טלפון</Button>
              </div>
              <div className="mt-6 space-y-5">
                {steps.map((s, i) => (
                  <StepPanel key={s.id} step={s} maker={maker} number={i + 1} total={steps.length} phone={phone} solo={false} />
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------- Done */}
          {mode === "done" && (
            <div className="mt-4">
              <div className="rounded-lg border border-success/30 bg-success/10 p-6 md:p-8">
                <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
                <h2 ref={heading} tabIndex={-1} className="mt-3 text-display-sm text-ink outline-none">
                  סיימתם. הטלפון מוגן.
                </h2>
                <p className="mt-3 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
                  FilterPhone מותקנת, הצריבה הושלמה והסינון פעיל. רוצים לשנות רמת סינון או חסימות? ב-FilterPhone
                  לוחצים <strong className="font-bold text-ink">בקשת שינוי</strong>.
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link to="/filtertube" className="panel panel-hover block p-5">
                  <span className="block text-[1.0625rem] font-bold text-ink">רוצים גם יוטיוב מסונן?</span>
                  <span className="mt-1 block text-[0.9375rem] text-ink-soft">FilterTube: יוטיוב ויוטיוב מיוזיק מסוננים, להורדה.</span>
                </Link>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="panel panel-hover block p-5">
                  <span className="block text-[1.0625rem] font-bold text-ink">משהו לא עובד?</span>
                  <span className="mt-1 block text-[0.9375rem] text-ink-soft">כתבו לנו בוואטסאפ, ונבדוק יחד.</span>
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2" onClick={() => go(maker, steps[steps.length - 1].id)}>
                  <ArrowRight className="h-4 w-4" />
                  חזרה לשלב האחרון
                </Button>
                <Link to="/">
                  <Button variant="outline">לדף הבית</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------ What's ahead */}
      {mode === "start" && (
        <section className="border-b border-border bg-surface-sunken" aria-labelledby="overview-title">
          <div className="container-custom max-w-5xl py-10 md:py-14">
            <h2 id="overview-title" className="text-display-sm text-ink">
              מה נעשה: {makerLabel(picked)}
            </h2>
            <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">
              <span className="num">{steps.length}</span> שלבים קצרים, בארבעה חלקים. אפשר גם לקפוץ ישר לשלב.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {GUIDE.phases.map((p, pi) => {
                const inPhase = steps.filter((s) => s.phase === p.id);
                if (!inPhase.length) return null;
                return (
                  <div key={p.id} className="panel p-5">
                    <h3 className="flex items-center gap-2 text-[1.0625rem] font-bold text-ink">
                      <span className="num flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[0.8125rem] font-bold text-primary-foreground">
                        {pi + 1}
                      </span>
                      {p.label}
                    </h3>
                    <ol className="mt-3 space-y-1.5">
                      {inPhase.map((s) => (
                        <li key={s.id} className="flex gap-2 text-[0.9375rem] leading-relaxed">
                          <span className="num w-5 shrink-0 text-muted-foreground">{steps.indexOf(s) + 1}.</span>
                          <Link to={{ hash: `#${picked}-${s.id}` }} className="text-ink underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary">
                            {plain(s.title)}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" className="mt-6 gap-2" onClick={() => go(picked, "all")}>
              <List className="h-4 w-4" />
              כל השלבים בדף אחד
            </Button>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------- Problems */}
      <section id="problems" className="container-custom max-w-5xl py-10 md:py-14" aria-labelledby="problems-title">
        <h2 id="problems-title" className="text-display-sm text-ink">בעיות נפוצות</h2>
        <Accordion type="single" collapsible className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {GUIDE.faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`install-faq-${i}`} className="border-0 px-5 md:px-6">
              <AccordionTrigger className="py-[1.125rem] text-right text-[1rem] font-bold text-ink hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[0.9375rem] leading-relaxed text-ink-soft">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-6 flex flex-col items-start gap-4 rounded-lg border border-border bg-surface-sunken p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[1rem] leading-relaxed text-ink">
            <strong className="font-bold">לא מצליחים?</strong> כתבו לנו, ואנחנו מתקינים איתכם.
          </p>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="whatsapp" size="lg" className="w-full gap-2">
              <MessageCircle className="h-4 w-4" />
              וואטסאפ
            </Button>
          </a>
        </div>
      </section>
    </>
  );
};

export default Install;
