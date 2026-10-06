import { Eye, Scan, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The facts about our own filtering app, in one place.
 *
 * The level names and descriptions are copied from the app's own catalogue
 * (server/filterphone/api/catalog.py) rather than rewritten for marketing, so
 * what a customer reads here is what the app will actually do to an image.
 */

export interface FilterLevel {
  level: 1 | 2 | 3;
  name: string;
  short: string;
  desc: string;
  note?: string;
  icon: LucideIcon;
}

export const FILTER_LEVELS: FilterLevel[] = [
  {
    level: 1,
    name: "מחמיר",
    short: "כל תמונה של אישה נחסמת",
    desc: "כל תמונה של אישה או ילדה נחסמת, גם בלבוש צנוע. תמונות של גברים, נופים ומוצרים עוברות.",
    note: "תמונה שהמערכת לא הצליחה לבדוק — נחסמת. באפליקציות שאי אפשר לסנן, התמונות לא נטענות.",
    icon: ShieldCheck,
  },
  {
    level: 2,
    name: "בינוני",
    short: "לבוש צנוע עובר, חשיפה נצבעת",
    desc: "תמונות בלבוש צנוע עוברות. עור חשוף נצבע בשחור לפי צורת הגוף — ידיים, כתפיים, רגליים — ובלבוש חשוף מאוד נצבע כל הגוף חוץ מהפנים. עירום נחסם לגמרי.",
    note: "כל אדם בתמונה מסווג בנפרד, כך שגבר באותה תמונה לא נצבע. תקלה במנוע — חסימה.",
    icon: Scan,
  },
  {
    level: 3,
    name: "בסיסי",
    short: "רק עירום נחסם",
    desc: "רק תמונות עירום מפורש נחסמות. כל השאר עובר.",
    note: "מתאים למי שרוצה רשת נקייה בלי להגביל גלישה יומיומית.",
    icon: Eye,
  },
];

export interface BlockCategory {
  title: string;
  /** How many toggles this topic holds. */
  count: number;
  desc: string;
  examples?: string;
}

/** The block catalogue, as the twelve topics the admin screen groups it into. */
export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    title: "תמונות ווידאו",
    count: 2,
    desc: "מעבר לרמת הסינון: בלי תמונות בכלל, בלי סרטונים.",
  },
  {
    title: "וואטסאפ והודעות",
    count: 6,
    desc: "תמונות פרופיל, סטטוסים, מדיה — או חסימה מלאה.",
    examples: "וואטסאפ · טלגרם · ויבר",
  },
  {
    title: "רשתות חברתיות",
    count: 11,
    desc: "חסימה מלאה — באפליקציה ובדפדפן.",
    examples: "פייסבוק · אינסטגרם · טיקטוק · X · סנאפצ׳ט · פינטרסט ועוד",
  },
  {
    title: "גוגל ואנדרואיד",
    count: 6,
    desc: "חנות האפליקציות, הפיד של גוגל, חיפוש תמונות.",
    examples: "Google Play · Discover · Google Photos",
  },
  {
    title: "דפדפנים",
    count: 2,
    desc: "דפדפנים שלא עוברים סינון תמונות, או כל הגלישה.",
  },
  {
    title: "וידאו, מוזיקה ובידור",
    count: 6,
    desc: "יוטיוב, נטפליקס, ספוטיפיי ועוד.",
  },
  {
    title: "קניות",
    count: 5,
    desc: "חנויות אונליין עם הרבה תמונות שקשה לסנן באפליקציה.",
    examples: "אליאקספרס · טמו · שיין · אמזון · איביי",
  },
  {
    title: "חדשות וספורט",
    count: 2,
    desc: "אתרי חדשות כלליים ואתרי ספורט.",
  },
  {
    title: "בינה מלאכותית",
    count: 1,
    desc: "צ׳אטבוטים ומחוללי תמונות.",
  },
  { title: "משחקים", count: 1, desc: "משחקים אונליין וחנויות משחקים." },
  { title: "היכרויות", count: 1, desc: "אפליקציות ואתרי היכרויות." },
  {
    title: "הגנה מפני עקיפה",
    count: 2,
    desc: "סגירת הדרכים לעקוף את הסינון.",
    examples: "אתרי APK · אפליקציות VPN",
  },
];

export const FILTERPHONE = {
  /** Our own download page, which also carries the install instructions. */
  downloadPage: "https://api.filterphone.com/download/",
  apk: "https://api.filterphone.com/download/FilterPhone.apk",
  /** For older phones whose CPU the slim build does not cover. */
  apkUniversal: "https://api.filterphone.com/download/FilterPhone-universal.apk",
  android: "אנדרואיד 7+",
  price: { amount: 150, label: "150₪", period: "לשנה" },
  levels: FILTER_LEVELS,
  categories: BLOCK_CATEGORIES,
  /** Toggles in the catalogue, across the twelve topics above. */
  optionCount: 45,
} as const;
