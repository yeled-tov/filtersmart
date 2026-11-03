import {
  AppWindow, Ban, Bell, Bot, Eye, Flag, Shield, ShieldHalf, Globe, ImageOff, KeyRound, Link, Lock,
  MessageCircle, Navigation, Network, PackageCheck, RefreshCw, Scan, ScanSearch,
  Search, SearchX, Send, ShieldAlert, ShieldCheck, Smartphone, Store, UserX,
  VideoOff, WifiOff, Youtube, BatteryFull,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The facts about our own filtering app, in one place.
 *
 * Everything here is checked against the app's own repository
 * (yeled-tov/filterphone): the image levels against
 * server/filterphone/api/catalog.py, the browsing levels against
 * server/filterphone/websites.py, and the no-reset setup against
 * docs/DEVICE_OWNER.md §4א. The wording is the one the owner chose for the
 * website, which is more discreet than the internal catalogue but describes
 * the same behaviour. Nothing goes on the site that the app does not do.
 */

/* ----------------------------------------------------------- Download */

export const FILTERPHONE = {
  /** Our own download page, which also carries the install instructions. */
  downloadPage: "https://api.filterphone.com/download/",
  /**
   * The primary button. The slim build is a third of the size of the
   * universal one, and most visitors are on a phone, often on mobile data.
   */
  apk: "https://api.filterphone.com/download/FilterPhone.apk",
  /** For older phones whose CPU the slim build does not cover. */
  apkUniversal: "https://api.filterphone.com/download/FilterPhone-universal.apk",
  android: "אנדרואיד 8+",
  /** The no-computer setup needs Wireless debugging, which arrived in Android 11. */
  androidWireless: "אנדרואיד 11",
  price: { amount: 150, label: "150₪", period: "לשנה" },
  /** Toggles in the block catalogue, across twelve topics. */
  optionCount: 45,
} as const;

export const SUPPORTED_MAKERS = ["סמסונג", "שיאומי / רדמי / פוקו", "OnePlus", "OPPO", "פיקסל"];

/* ---------------------------------------------------------- Image levels */

export interface FilterLevel {
  level: 1 | 2 | 3;
  name: string;
  short: string;
  desc: string;
  /** Extra detail for the image-filtering deep-dive page. */
  detail?: string;
  icon: LucideIcon;
  isDefault?: boolean;
}

export const FILTER_LEVELS: FilterLevel[] = [
  {
    level: 1,
    name: "מחמיר",
    short: "הרמה השמורה ביותר",
    desc: "נופים, מוצרים ותמונות של גברים עוברים; כל השאר נחסם.",
    detail: "תמונה שהמערכת לא הצליחה לבדוק — נחסמת. באפליקציות שאי אפשר לסנן, התמונות לא נטענות.",
    icon: ShieldCheck,
    isDefault: true,
  },
  {
    level: 2,
    name: "בינוני",
    short: "תמונות צנועות עוברות",
    desc: "חשיפה מוסתרת אוטומטית — נצבעת באפור לפי הצורה — ותמונה חשופה ברובה נחסמת כולה.",
    detail: "כל אדם בתמונה מסווג בנפרד, כך שהצביעה חלה רק על מי שצריך. תוכן בוטה נחסם לגמרי. תקלה במנוע — חסימה.",
    icon: ShieldHalf,
  },
  {
    level: 3,
    name: "בסיסי",
    short: "רק תוכן בוטה נחסם",
    desc: "רק תוכן בוטה ומפורש נחסם. כל השאר עובר.",
    detail: "מתאים למי שרוצה רשת נקייה בלי להגביל גלישה יומיומית.",
    icon: Shield,
  },
];

/** Two switches that sit on top of whichever level is chosen. */
export const IMAGE_EXTRAS = [
  { icon: ImageOff, title: "בלי תמונות בכלל", desc: "כל תמונה מוחלפת במלבן אפור." },
  { icon: VideoOff, title: "בלי וידאו בדפדפן", desc: "סרטונים באתרים לא נטענים." },
];

/* -------------------------------------------------------- Browsing levels */

export interface WebLevel {
  name: string;
  short: string;
  desc: string;
}

/** How much of the web is open at all, chosen per customer. Order matters: narrowest first. */
export const WEB_LEVELS: WebLevel[] = [
  {
    name: "חיוני בלבד",
    short: "רק מה שחייבים",
    desc: "ממשלה ורשויות, בנקים ואשראי, קופות חולים, חשמל, תחבורה ציבורית, סלולר וביטוח, ודפי תשלום. בלי חיפוש ובלי שום אתר אחר.",
  },
  {
    name: "נקי לגמרי",
    short: "החיוני, ועוד אתרים נקיים",
    desc: "החיוני, ועוד תורה ויהדות, כלים ושירותים (PDF, טפסים, מייל, אישורי הגעה), קניות נקיות, חיפוש גוגל מסונן — וכל אתר שהבוט בדק ומצא נקי.",
  },
  {
    name: "נקי + קניות",
    short: "נקי, ועוד חנויות כלליות",
    desc: "כמו נקי, ועוד קניות כלליות — אליאקספרס, שיין, טמו, אמזון, יד 2 ועוד. התמונות באתרים האלה מסוננות.",
  },
  {
    name: "פתוח עם סינון",
    short: "הכול, חוץ ממה שנחסם",
    desc: "הכול פתוח חוץ מהקטגוריות שנחסמו — עם סינון התמונות המלא.",
  },
];

export const WEB_EXTRAS = ["חדשות לציבור החרדי", "חדשות כלליות", "ספורט", "קניות"];

/* ------------------------------------------------------------- Comparison */

export const COMPARISON: { ordinary: string; ours: string }[] = [
  {
    ordinary: "חוסם כמעט הכול — הטלפון הופך ל״טיפש״",
    ours: "הטלפון נשאר פתוח: אפליקציות, חנות, כרום, וואטסאפ — עם סינון",
  },
  {
    ordinary: "תמונות: או הכול או כלום",
    ours: "סינון תמונות חכם — כל תמונה נבדקת בזמן אמת, בשלוש רמות",
  },
  {
    ordinary: "אתר חסום — נגמר",
    ours: "אתר חסום ← ״שליחה לבדיקה״ בלחיצה, ואתר נקי נפתח תוך שניות",
  },
  {
    ordinary: "התקנה אצל טכנאי, לעיתים עם איפוס",
    ours: "התקנה אוטומטית מהטלפון עצמו, ברוב המכשירים בלי איפוס",
  },
  {
    ordinary: "קל לעקוף או להסיר",
    ours: "ניהול מכשיר מלא — אי אפשר להסיר או לכבות בלי אישור",
  },
];

/* --------------------------------------------------------------- Features */

export interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface FeatureGroup {
  title: string;
  features: Feature[];
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    title: "גלישה וכרום",
    features: [
      { icon: Scan, title: "סינון תמונות חכם", desc: "כל תמונה נבדקת בזמן אמת, בשלוש רמות." },
      { icon: Globe, title: "4 רמות גלישה", desc: "מ״חיוני בלבד״ ועד ״פתוח עם סינון״, ותוספות לפי בחירה." },
      { icon: Search, title: "תוצאות חיפוש נקיות", desc: "אתר חסום פשוט לא מופיע בתוצאות." },
      { icon: Send, title: "שליחה לבדיקה", desc: "אתר חסום? לחיצה אחת. אתר חדש נבדק אוטומטית תוך שניות." },
      { icon: Flag, title: "כפתור דיווח צף בכרום", desc: "דיווח על אתר או תמונה, או בקשה לפתוח משהו שנחסם בטעות." },
      { icon: SearchX, title: "חסימת מילות חיפוש", desc: "מילים לא ראויות נחסמות — בכל שפה." },
      { icon: Ban, title: "כרום בלבד", desc: "שאר הדפדפנים חסומים, כדי שאי אפשר לעקוף." },
    ],
  },
  {
    title: "וואטסאפ",
    features: [
      { icon: UserX, title: "תמונות פרופיל", desc: "חסומות — גם אלה שכבר שמורות בטלפון." },
      { icon: Eye, title: "סטטוסים וערוצים", desc: "חסימת סטטוסים, ערוצים, או כל טאב העדכונים." },
      { icon: MessageCircle, title: "מדיה", desc: "אפשר לחסום תמונות וסרטונים — ההודעות והשיחות ממשיכות." },
      { icon: Link, title: "קישורים בכרום המסונן", desc: "ולא בדפדפן הפנימי של וואטסאפ, שלא עובר סינון." },
    ],
  },
  {
    title: "אפליקציות וחנות",
    features: [
      { icon: PackageCheck, title: "Google Play מנוהל", desc: "גולשים בחנות, אבל מותקנות רק אפליקציות מאושרות. השאר — ״בקשת אישור״ ישר אלינו." },
      { icon: Store, title: "חנות FilterPhone", desc: "אפליקציות בסיסיות מוכנות, עם עדכונים." },
      { icon: AppWindow, title: "חסימה לפי קטגוריות", desc: "רשתות חברתיות, בידור, הימורים ועוד." },
      { icon: Youtube, title: "יוטיוב מסונן", desc: "דרך FilterTube." },
      { icon: Navigation, title: "מסלולים מוכנים", desc: "״כשר בלי אינטרנט״, ״ניווט בלבד״ (וויז, מוביט, פנגו, סלופארק) ועוד." },
    ],
  },
  {
    title: "הגנה וניהול",
    features: [
      { icon: Lock, title: "ניהול מכשיר מלא", desc: "אי אפשר להסיר את האפליקציה, לכבות את הסינון או לאפס מההגדרות בלי אישור." },
      { icon: WifiOff, title: "חסימת נקודה חמה", desc: "Wi-Fi ו-Bluetooth — כדי שאי אפשר לעקוף דרך טלפון אחר." },
      { icon: KeyRound, title: "קוד הורים", desc: "שינוי חסימות רק עם קוד." },
      { icon: ShieldAlert, title: "הגנה עצמית", desc: "ניסיון לכבות את ההגנה או להיכנס להגדרות שלה — נחסם." },
      { icon: Network, title: "תואם רשת כשרה", desc: "מזהה נטפרי או אתרוג לבד, ומסתדר איתם." },
      { icon: BatteryFull, title: "חיסכון בסוללה", desc: "הסינון לא ״אוכל״ את הטלפון." },
      { icon: RefreshCw, title: "החלפת מכשיר", desc: "שחזור לפי מספר טלפון — בלי להתחיל מאפס." },
    ],
  },
  {
    title: "שירות",
    features: [
      { icon: Bot, title: "תמיכה מיידית", desc: "באפליקציה ובוואטסאפ, כולל בוט שעונה מיד ומעביר בקשות לאישור." },
      { icon: Bell, title: "עדכון על כל בקשה", desc: "אתר, אפליקציה או שינוי רמה — מקבלים הודעה כשאושר או נדחה." },
    ],
  },
];

/* ---------------------------------------------------------------- Install */

export const INSTALL_STEPS = [
  { title: "מורידים", desc: "את האפליקציה, מכפתור ההורדה באתר." },
  { title: "מתקינים", desc: "האפליקציה מובילה צעד-צעד ופותחת לבד כל מסך בהגדרות." },
  { title: "בוחרים רמת סינון", desc: "ואנחנו מאשרים ומפעילים." },
];

export const INSTALL_METHODS = [
  {
    icon: Smartphone,
    title: "אוטומטי — בלי מחשב",
    badge: "מומלץ",
    desc: "דרך ״ניפוי באגים אלחוטי״ מתוך הטלפון עצמו. אנדרואיד 11 ומעלה.",
  },
  {
    icon: ScanSearch,
    title: "עם Root",
    desc: "לחיצה אחת ואישור — הכול אוטומטי.",
  },
  {
    icon: AppWindow,
    title: "ידני",
    desc: "עם מחשב (כבל USB), או צעד-צעד.",
  },
];

/* ---------------------------------------------------------- Block catalogue */

export interface BlockCategory {
  title: string;
  /** How many toggles this topic holds. */
  count: number;
  desc: string;
  examples?: string;
}

/** The forty-five toggles, as the twelve topics the app's onboarding groups them into. */
export const BLOCK_CATEGORIES: BlockCategory[] = [
  { title: "תמונות ווידאו", count: 2, desc: "בלי תמונות בכלל, בלי סרטונים." },
  { title: "וואטסאפ והודעות", count: 6, desc: "תמונות פרופיל, סטטוסים, מדיה — או חסימה מלאה.", examples: "וואטסאפ · טלגרם · ויבר" },
  { title: "רשתות חברתיות", count: 11, desc: "חסימה מלאה — באפליקציה ובדפדפן.", examples: "פייסבוק · אינסטגרם · טיקטוק · X ועוד" },
  { title: "גוגל ואנדרואיד", count: 6, desc: "חנות האפליקציות, הפיד של גוגל, חיפוש תמונות.", examples: "Google Play · Discover · Google Photos" },
  { title: "דפדפנים", count: 2, desc: "דפדפנים שלא עוברים סינון, או כל הגלישה." },
  { title: "וידאו, מוזיקה ובידור", count: 6, desc: "יוטיוב, נטפליקס, ספוטיפיי ועוד." },
  { title: "קניות", count: 5, desc: "חנויות אונליין עם הרבה תמונות.", examples: "אליאקספרס · טמו · שיין · אמזון · איביי" },
  { title: "חדשות וספורט", count: 2, desc: "אתרי חדשות כלליים ואתרי ספורט." },
  { title: "בינה מלאכותית", count: 1, desc: "צ׳אטבוטים ומחוללי תמונות." },
  { title: "משחקים", count: 1, desc: "משחקים אונליין וחנויות משחקים." },
  { title: "היכרויות", count: 1, desc: "אפליקציות ואתרי היכרויות." },
  { title: "הגנה מפני עקיפה", count: 2, desc: "סגירת הדרכים לעקוף את הסינון.", examples: "אתרי APK · אפליקציות VPN" },
];

/* -------------------------------------------------------------------- FAQ */

export const HOME_FAQ = [
  {
    q: "האם הטלפון ״נחסם״?",
    a: "לא. הטלפון עובד כרגיל — אפליקציות, וואטסאפ, חנות, כרום — רק עם סינון.",
  },
  {
    q: "צריך לאפס את הטלפון?",
    a: "ברוב הטלפונים לא. ההתקנה האוטומטית לא מוחקת חשבונות ולא מאפסת: FilterPhone משביתה את החשבונות לכמה שניות בלבד, מפעילה את הניהול ומחזירה אותם.",
  },
  {
    q: "אפשר לשנות רמה אחר כך?",
    a: "כן, בכל רגע — דרכנו, ועם קוד הורים אם הוגדר.",
  },
  {
    q: "אתר נחסם בטעות?",
    a: "לוחצים ״שליחה לבדיקה״ — אתר נקי נפתח תוך שניות, ואחרת הבקשה מגיעה אלינו לאישור.",
  },
  {
    q: "זה עובד בוואטסאפ?",
    a: "כן — תמונות פרופיל, סטטוסים, ערוצים, ואפשרות לחסום מדיה. הקישורים נפתחים בכרום המסונן.",
  },
  {
    q: "על אילו טלפונים?",
    a: "אנדרואיד 8 ומעלה — סמסונג, שיאומי, OnePlus, OPPO, פיקסל ועוד. ההתקנה האוטומטית בלי מחשב עובדת מאנדרואיד 11.",
  },
  {
    q: "זה מאט את הטלפון או את הסוללה?",
    a: "לא באופן מורגש — הסינון בנוי לחסוך בסוללה.",
  },
  {
    q: "אפשר להסיר?",
    a: "רק באישור — זה מה שהופך את הסינון לאמין.",
  },
];
