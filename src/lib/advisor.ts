/**
 * Scoring engine behind the on-site filtering advisor.
 *
 * Every fact encoded here (price, install time, whether the device is wiped,
 * whether the filter can be removed) mirrors the service copy published on the
 * site. The engine is deliberately transparent: each point it awards carries a
 * human-readable reason, so the recommendation can always explain itself.
 */

export type WhoFor = "child" | "teen" | "adult" | "business";
export type DeviceKind = "iphone" | "android" | "qin" | "tablet" | "computer";
export type Strictness = "light" | "medium" | "strict";
export type MustKeep = "whatsapp" | "navigation" | "work" | "music";
export type Removability = "locked" | "prefer-locked" | "flexible";
export type Budget = "tight" | "balanced" | "open";
export type DataState = "keep" | "can-wipe";

export interface AdvisorAnswers {
  whoFor: WhoFor;
  device: DeviceKind;
  strictness: Strictness;
  mustKeep: MustKeep[];
  removability: Removability;
  budget: Budget;
  dataState: DataState;
}

export interface SolutionProfile {
  slug: string;
  name: string;
  shortName: string;
  price: number;
  priceLabel: string;
  installTime: string;
  /** Wiping the device means the customer must back up first. */
  wipesDevice: boolean;
  /** Whether the customer can take the filter off themselves. */
  removable: boolean;
  summary: string;
}

export const SOLUTIONS: Record<string, SolutionProfile> = {
  "basic-filtering": {
    slug: "basic-filtering",
    name: "סינון בסיסי לאייפון ואנדרואיד",
    shortName: "סינון בסיסי",
    price: 100,
    priceLabel: "100₪",
    installTime: "כ-5 דקות",
    wipesDevice: false,
    removable: true,
    summary: "חסימת אתרים ותכנים פוגעניים ברמה שבוחרים, בלי לגעת בנתונים שבמכשיר.",
  },
  "kosher-play": {
    slug: "kosher-play",
    name: "מערכת כושר פליי (Kosher Play)",
    shortName: "כושר פליי",
    price: 70,
    priceLabel: "70₪",
    installTime: "כ-30 דקות",
    wipesDevice: false,
    removable: false,
    summary: "חנות אפליקציות כשרה, וואטסאפ מסונן וצריבת MDM שמונעת איפוס והסרה.",
  },
  hadran: {
    slug: "hadran",
    name: "מערכת הדרן (Hadran)",
    shortName: "הדרן",
    price: 300,
    priceLabel: "300₪",
    installTime: "כ-45–90 דקות",
    wipesDevice: true,
    removable: false,
    summary: "גרסת מערכת מלאה עם הסינון ההרמטי ביותר – גם איפוס יצרן לא מסיר אותו.",
  },
  askan: {
    slug: "askan",
    name: "מערכת סינון עסקן (Askan)",
    shortName: "עסקן",
    price: 300,
    priceLabel: "300₪",
    installTime: "כ-45–90 דקות",
    wipesDevice: true,
    removable: false,
    summary: "סינון תמונות חכם מבוסס AI עם צריבה עמוקה – בנוי לשימוש עבודה יומיומי.",
  },
  "qin-f21-pro": {
    slug: "qin-f21-pro",
    name: "צריבת גרסה Qin F21 Pro",
    shortName: "צריבת Qin F21 Pro",
    price: 70,
    priceLabel: "70₪",
    installTime: "כ-30–60 דקות",
    wipesDevice: true,
    removable: false,
    summary: "גרסה כשרה ומותאמת למכשיר שיאומי Qin F21 Pro, עם סינון מובנה.",
  },
  "qin-f25": {
    slug: "qin-f25",
    name: "צריבת גרסה Qin F25",
    shortName: "צריבת Qin F25",
    price: 70,
    priceLabel: "70₪",
    installTime: "כ-30–60 דקות",
    wipesDevice: true,
    removable: false,
    summary: "גרסה כשרה ומותאמת למכשיר שיאומי Qin F25, עם סינון מובנה.",
  },
};

export interface Recommendation {
  slug: string;
  profile: SolutionProfile;
  score: number;
  /** 0–100, relative to the best possible score for these answers. */
  match: number;
  reasons: string[];
  cautions: string[];
}

interface Reason {
  /** Reasons sharing a tag make the same point; only the first one survives. */
  tag: string;
  text: string;
}

interface Bucket {
  score: number;
  reasons: Reason[];
  cautions: string[];
}

const BUDGET_CEILING: Record<Budget, number> = {
  tight: 100,
  balanced: 200,
  open: Number.POSITIVE_INFINITY,
};

const DEVICE_LABEL: Record<DeviceKind, string> = {
  iphone: "אייפון",
  android: "אנדרואיד (גלקסי, שיאומי ועוד)",
  qin: "מכשיר כשר Qin",
  tablet: "טאבלט",
  computer: "מחשב",
};

const WHO_LABEL: Record<WhoFor, string> = {
  child: "ילד/ה",
  teen: "נער/ה",
  adult: "מבוגר / שימוש אישי",
  business: "איש עסקים / שימוש עבודה",
};

const STRICTNESS_LABEL: Record<Strictness, string> = {
  light: "חסימת תכנים פוגעניים בלבד",
  medium: "גם חסימת רשתות חברתיות ובידור",
  strict: "סינון מלא ומחמיר",
};

const MUST_KEEP_LABEL: Record<MustKeep, string> = {
  whatsapp: "וואטסאפ",
  navigation: "ניווט (ווייז / מפות)",
  work: "אפליקציות עבודה ובנק",
  music: "מוזיקה ותוכן שמע",
};

const REMOVABILITY_LABEL: Record<Removability, string> = {
  locked: "חייב שלא ניתן יהיה להסיר",
  "prefer-locked": "עדיף שיהיה נעול, אבל לא הכרחי",
  flexible: "לא משנה",
};

const BUDGET_LABEL: Record<Budget, string> = {
  tight: "עד 100₪",
  balanced: "עד 200₪",
  open: "העיקר הפתרון הנכון",
};

const DATA_LABEL: Record<DataState, string> = {
  keep: "חשוב לשמור את התוכן שבמכשיר",
  "can-wipe": "אפשר לאפס את המכשיר",
};

export const ANSWER_LABELS = {
  whoFor: WHO_LABEL,
  device: DEVICE_LABEL,
  strictness: STRICTNESS_LABEL,
  mustKeep: MUST_KEEP_LABEL,
  removability: REMOVABILITY_LABEL,
  budget: BUDGET_LABEL,
  dataState: DATA_LABEL,
};

/** Which solutions are even worth scoring for a given device. */
function candidatesFor(device: DeviceKind): string[] {
  switch (device) {
    case "qin":
      return ["qin-f21-pro", "qin-f25", "basic-filtering"];
    case "iphone":
      return ["basic-filtering", "hadran", "askan"];
    case "tablet":
    case "computer":
      return ["basic-filtering"];
    case "android":
    default:
      return ["basic-filtering", "kosher-play", "hadran", "askan"];
  }
}

function add(bucket: Bucket, points: number, tag?: string, reason?: string) {
  bucket.score += points;
  if (tag && reason && points > 0) bucket.reasons.push({ tag, text: reason });
}

/** Keeps the first reason for each tag, so the result never says the same thing twice. */
function dedupe(reasons: Reason[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of reasons) {
    if (seen.has(r.tag)) continue;
    seen.add(r.tag);
    out.push(r.text);
  }
  return out;
}

/**
 * Ranks the available solutions against the visitor's answers.
 * Always returns at least one recommendation.
 */
export function recommend(answers: AdvisorAnswers): Recommendation[] {
  const slugs = candidatesFor(answers.device);
  const buckets = new Map<string, Bucket>();

  for (const slug of slugs) {
    const s = SOLUTIONS[slug];
    const b: Bucket = { score: 10, reasons: [], cautions: [] };

    // --- Who is it for -------------------------------------------------
    if (answers.whoFor === "child" || answers.whoFor === "teen") {
      if (!s.removable) {
        add(b, 22, "locked", "הסינון נעול ולא ניתן להסרה על ידי המשתמש – קריטי כשמדובר בילדים ובנוער");
      } else {
        b.cautions.push("המשתמש יכול להסיר את הסינון בעצמו – שווה לשקול פתרון נעול");
      }
      if (slug === "hadran") add(b, 14, "parents", "הפתרון שאנחנו ממליצים עליו הכי הרבה להורים");
    }
    if (answers.whoFor === "business") {
      if (slug === "askan") add(b, 26, "fit", "נבנה בדיוק לשימוש עסקי – סינון תמונות חכם בלי לחסום את העבודה");
      if (slug === "hadran") add(b, 6, "fit", "הגנה מלאה, אבל נוקשה יותר לשימוש עסקי יומיומי");
      if (slug === "basic-filtering") add(b, 8, "fit", "מאפשר להשאיר פתוח כל מה שצריך לעבודה");
    }
    if (answers.whoFor === "adult") {
      if (slug === "basic-filtering") add(b, 10, "fit", "שליטה מלאה ברמת הסינון, בלי לשנות את אופן השימוש במכשיר");
      if (slug === "kosher-play") add(b, 8, "fit", "מאזן בין סינון אמיתי לבין מכשיר שנשאר שמיש");
    }

    // --- How strict ----------------------------------------------------
    if (answers.strictness === "strict") {
      if (slug === "hadran") add(b, 24, "strictness", "רמת הסינון הגבוהה ביותר שיש לנו");
      if (slug === "qin-f21-pro" || slug === "qin-f25") add(b, 22, "strictness", "גרסה כשרה מלאה עם סינון מובנה");
      if (slug === "kosher-play") add(b, 14, "strictness", "חנות אפליקציות כשרה ווואטסאפ מסונן");
      if (slug === "askan") add(b, 12);
      if (slug === "basic-filtering") {
        b.cautions.push("סינון בסיסי הוא פתרון קל יחסית – לרמת חומרה גבוהה עדיף פתרון צרוב");
      }
    }
    if (answers.strictness === "medium") {
      if (slug === "kosher-play") add(b, 18, "strictness", "חוסם את חנות האפליקציות הרגילה ומשאיר חנות כשרה");
      if (slug === "basic-filtering") add(b, 16, "strictness", "אפשר לחסום רשתות חברתיות ובידור ולהשאיר את השאר פתוח");
      if (slug === "askan") add(b, 12);
      if (slug === "hadran") add(b, 10);
    }
    if (answers.strictness === "light") {
      if (slug === "basic-filtering") add(b, 24, "strictness", "בדיוק הרמה שביקשתם – חסימה ממוקדת בלי לשנות את המכשיר");
      if (slug === "kosher-play") add(b, 8);
      if (slug === "hadran" || slug === "askan") {
        b.cautions.push("זה פתרון חזק בהרבה ממה שביקשתם – ייתכן שתרגישו אותו ביום-יום");
      }
    }

    // --- Removability --------------------------------------------------
    if (answers.removability === "locked") {
      if (!s.removable)
        add(
          b,
          20,
          "locked",
          slug === "hadran"
            ? "גם איפוס להגדרות יצרן לא מסיר את הסינון"
            : "נעול בפני הסרה על ידי המשתמש",
        );
      else b.cautions.push("ניתן להסרה על ידי המשתמש");
    }
    if (answers.removability === "prefer-locked" && !s.removable) {
      add(b, 9, "locked", "נעול בפני הסרה על ידי המשתמש");
    }
    if (answers.removability === "flexible" && s.removable) {
      add(b, 7, "locked", "אפשר לשנות את רמת הסינון או להסיר בקלות בהמשך");
    }

    // --- What has to keep working --------------------------------------
    if (answers.mustKeep.includes("whatsapp")) {
      if (slug === "kosher-play") add(b, 12, "whatsapp", "וואטסאפ ממשיך לעבוד, מסונן – בלי תמונות פרופיל וסטטוסים");
      if (slug === "basic-filtering") add(b, 8, "whatsapp", "לא נוגע באפליקציות שכבר מותקנות, כולל וואטסאפ");
      if (slug === "askan") add(b, 6);
    }
    if (answers.mustKeep.includes("work")) {
      if (slug === "askan") add(b, 14, "work", "מיועד למי שצריך שהמכשיר ימשיך לתפקד לעבודה");
      if (slug === "basic-filtering") add(b, 10, "work", "אפשר להשאיר פתוחות את כל אפליקציות העבודה והבנק");
      if (slug === "hadran") b.cautions.push("סביבה סגורה – כדאי לוודא מראש שאפליקציות העבודה נתמכות");
      if (slug === "qin-f21-pro" || slug === "qin-f25") {
        b.cautions.push("מכשיר Qin מוגבל באפליקציות – לא תמיד מתאים לשימוש עבודה");
      }
    }
    if (answers.mustKeep.includes("navigation")) {
      if (slug === "basic-filtering") add(b, 7, "navigation", "ניווט ומפות ממשיכים לעבוד כרגיל");
      if (slug === "kosher-play") add(b, 6, "navigation", "אפליקציות ניווט זמינות בחנות הכשרה");
    }
    if (answers.mustKeep.includes("music")) {
      if (slug === "kosher-play") add(b, 6, "music", "תוכן שמע ומוזיקה זמינים בחנות הכשרה");
      if (slug === "basic-filtering") add(b, 5);
    }

    // --- Data on the device --------------------------------------------
    if (answers.dataState === "keep") {
      if (s.wipesDevice) {
        b.score -= 16;
        b.cautions.push("ההתקנה מוחקת את תוכן המכשיר – צריך גיבוי מלא מראש");
      } else {
        add(b, 12, "data", "מותקן בלי למחוק שום דבר מהמכשיר");
      }
    } else if (s.wipesDevice) {
      add(b, 5, "data", "מכיוון שאפשר לאפס, אפשר ללכת על צריבה עמוקה");
    }

    // --- Budget ---------------------------------------------------------
    const ceiling = BUDGET_CEILING[answers.budget];
    if (s.price <= ceiling) {
      add(b, 12, "budget", `${s.priceLabel} – בתוך התקציב שציינתם`);
    } else {
      b.score -= 14;
      b.cautions.push(`${s.priceLabel} – מעל התקציב שציינתם`);
    }
    if (answers.budget === "tight" && s.price <= 70) {
      add(b, 6, "budget", "אחד הפתרונות המשתלמים שלנו");
    }

    // --- Device fit -------------------------------------------------------
    if (answers.device === "qin" && (slug === "qin-f21-pro" || slug === "qin-f25")) {
      add(b, 24, "device", "הגרסה נצרבת ישירות למכשיר ה-Qin שלכם");
    }
    if ((answers.device === "tablet" || answers.device === "computer") && slug === "basic-filtering") {
      add(b, 18, "device", `אנחנו מסננים גם ${DEVICE_LABEL[answers.device]} – הפתרון מותאם למכשיר`);
      b.cautions.push("לסינון טאבלט או מחשב נתאים את ההגדרות בשיחה קצרה איתכם");
    }
    if (answers.device === "iphone" && slug === "basic-filtering") {
      add(b, 8, "device", "באייפון אפשר גם לחסום את ה-App Store לחלוטין");
    }

    buckets.set(slug, b);
  }

  const best = Math.max(...[...buckets.values()].map((b) => b.score), 1);

  return [...buckets.entries()]
    .map(([slug, b]) => ({
      slug,
      profile: SOLUTIONS[slug],
      score: b.score,
      match: Math.max(35, Math.min(99, Math.round((b.score / best) * 100))),
      // Keep the explanation readable — the three strongest reasons carry it.
      reasons: dedupe(b.reasons).slice(0, 3),
      cautions: b.cautions.slice(0, 2),
    }))
    .sort((a, b) => b.score - a.score || a.profile.price - b.profile.price);
}

/** Human-readable recap of the answers, used for the WhatsApp message and the CRM note. */
export function summariseAnswers(answers: AdvisorAnswers): string {
  const keep =
    answers.mustKeep.length > 0
      ? answers.mustKeep.map((k) => MUST_KEEP_LABEL[k]).join(", ")
      : "אין דרישה מיוחדת";

  return [
    `למי: ${WHO_LABEL[answers.whoFor]}`,
    `מכשיר: ${DEVICE_LABEL[answers.device]}`,
    `רמת סינון: ${STRICTNESS_LABEL[answers.strictness]}`,
    `חייב להמשיך לעבוד: ${keep}`,
    `הסרה: ${REMOVABILITY_LABEL[answers.removability]}`,
    `נתונים: ${DATA_LABEL[answers.dataState]}`,
    `תקציב: ${BUDGET_LABEL[answers.budget]}`,
  ].join("\n");
}
