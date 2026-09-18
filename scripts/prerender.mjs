// Post-build prerender: generate per-route static HTML files so Google (and any bot)
// receives unique <title>, <meta description>, canonical, and readable fallback content
// for every indexable URL - even before any JavaScript executes.
//
// Output: dist/<route>/index.html (Vercel serves static files before applying SPA rewrites)

import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const indexPath = path.join(distDir, "index.html");

const SITE_URL = "https://www.filterphone.com";
const OG_IMAGE = "https://www.filterphone.com/hero.jpg";
// Served from FilterTube's own site, not from GitHub: a GitHub release link
// stops working the moment that repository is made private, and this URL is
// baked into prerendered HTML and structured data that search engines keep.
const APK_URL = "https://filter-tube-52d8e.web.app/download/FilterTube.apk";

// Per-route SEO metadata + fallback body content
// Every route here will get its own prerendered HTML shell.
const routes = [
  {
    path: "/",
    title:
      "סינון טלפונים באשדוד מ-100₪ | הדרן, עסקן, כושר פליי – FilterPhone",
    description:
      "סינון טלפונים מקצועי באשדוד לכל מכשיר – אייפון, גלקסי, שיאומי, אנדרואיד, טאבלט ומחשב. משווק מורשה הדרן, עסקן וכושר פליי. סינון בסיסי 100₪, כושר פליי 70₪, הדרן ועסקן 300₪. התקנה ביום הפנייה.",
    keywords:
      "סינון טלפון, סינון טלפון אשדוד, סינון אייפון, סינון גלקסי, סינון סמסונג, סינון אנדרואיד, הדרן, עסקן, כושר פליי, FilterPhone, פילטר פון",
    h1: "FilterPhone – סינון טלפונים מקצועי באשדוד מ-100₪",
    lead: "מעבדה מקצועית לסינון טלפונים באשדוד – אייפון, גלקסי, סמסונג, שיאומי, אנדרואיד, טאבלט ומחשב. משווק מורשה של הדרן, עסקן וכושר פליי, וצריבת גרסאות כשרות למכשירי שיאומי Qin.",
    sections: [
      {
        h2: "השירותים שלנו",
        items: [
          "סינון בסיסי – 100₪ – התקנה תוך 5 דקות לאייפון ואנדרואיד",
          "כושר פליי (Kosher Play) – 70₪ – חנות אפליקציות כשרה + MDM",
          "הדרן (Hadran) – 300₪ – ההגנה ההרמטית ביותר, לא ניתן להסרה",
          "עסקן (Askan) – 300₪ – סינון AI חכם לאנשי עסקים",
          "צריבת גרסה Qin F21 Pro / F25 – 70₪ – גרסה כשרה לשיאומי Qin",
        ],
      },
      {
        h2: "מכשירים נתמכים",
        text: "אנחנו מסננים את כל סוגי המכשירים: אייפון (iPhone) כל הדגמים, סמסונג גלקסי (Galaxy S24, S23, S22, A54, Note), שיאומי (Xiaomi) כולל Qin, וואווי (Huawei), אופו, ואן פלוס, וכל מכשיר אנדרואיד. גם טאבלטים (אייפד, גלקסי טאב), מחשבים ומחשבים ניידים.",
      },
    ],
  },
  {
    path: "/services",
    title:
      "שירותי סינון טלפון באשדוד | אייפון, גלקסי, אנדרואיד – FilterPhone",
    description:
      "כל שירותי הסינון של FilterPhone במקום אחד: סינון בסיסי 100₪, כושר פליי 70₪, הדרן 300₪, עסקן 300₪ וצריבת גרסה למכשירי Qin 70₪. לכל מכשיר – אייפון, גלקסי, שיאומי ואנדרואיד.",
    keywords:
      "סינון טלפון אשדוד, סינון אייפון, סינון גלקסי, סינון סמסונג, התקנת הדרן, כושר פליי התקנה, עסקן התקנה, צריבת גרסה שיאומי",
    h1: "השירותים שלנו",
    lead: "פתרונות סינון וצריבת גרסאות מקצועיים לכל סוגי המכשירים – שירות מהיר ואמין באשדוד.",
    sections: [
      {
        h2: "סינון טלפונים והגנה דיגיטלית",
        items: [
          "סינון בסיסי לאייפון ואנדרואיד – 100₪",
          "מערכת כושר פליי (Kosher Play) – 70₪",
          "מערכת הדרן (Hadran) – 300₪ – ההגנה ההרמטית ביותר",
          "מערכת סינון עסקן (Askan) – 300₪",
        ],
      },
      {
        h2: "צריבת גרסאות למכשירי שיאומי Qin",
        items: [
          "צריבת גרסה Qin F21 Pro – 70₪",
          "צריבת גרסה Qin F25 – 70₪",
        ],
      },
    ],
  },
  {
    path: "/pricing",
    title: "מחירון סינון טלפון 2026 – כמה עולה סינון באשדוד | FilterPhone",
    description:
      "מחירון מלא ושקוף: סינון בסיסי 100₪, כושר פליי 70₪, הדרן 300₪, עסקן 300₪, צריבת גרסה Qin 70₪. מה כלול בכל פתרון, כמה זמן ההתקנה לוקחת ומה קורה לנתונים שבמכשיר.",
    keywords:
      "מחיר סינון טלפון, כמה עולה סינון טלפון, מחירון סינון, מחיר הדרן, מחיר עסקן, מחיר כושר פליי",
    h1: "מחירון סינון טלפונים וצריבת גרסאות – FilterPhone אשדוד",
    lead: "כל המחירים כוללים התקנה, בלי עלויות נסתרות.",
    sections: [
      {
        h2: "מחירון מלא",
        items: [
          "מערכת כושר פליי (Kosher Play) – 70₪ – התקנה כ-30 דקות, ללא מחיקת נתונים",
          "צריבת גרסה Qin F21 Pro – 70₪ – ביצוע 30–60 דקות, נדרש מכשיר מאופס",
          "צריבת גרסה Qin F25 – 70₪ – ביצוע 30–60 דקות, נדרש מכשיר מאופס",
          "סינון בסיסי לאייפון ואנדרואיד – 100₪ – התקנה כ-5 דקות, ללא מחיקת נתונים",
          "מערכת הדרן (Hadran) – 300₪ – צריבה 45–90 דקות, נדרש מכשיר מאופס",
          "מערכת סינון עסקן (Askan) – 300₪ – צריבה 45–90 דקות, נדרש מכשיר מאופס",
        ],
      },
    ],
    links: [
      { href: "/compare", text: "השוואה בין מערכות הסינון" },
      { href: "/services", text: "כל השירותים" },
    ],
  },
  {
    path: "/compare",
    title: "הדרן או עסקן או כושר פליי? השוואת מערכות סינון | FilterPhone",
    description:
      "השוואה מלאה בין מערכות הסינון בישראל: הדרן, עסקן, כושר פליי וסינון בסיסי. רמת סינון, עמידות לאיפוס, מה קורה לנתונים, מחיר ולמי כל מערכת מתאימה.",
    keywords:
      "הדרן או עסקן, השוואת מערכות סינון, מה ההבדל בין הדרן לעסקן, כושר פליי מול הדרן, איזה סינון הכי טוב",
    h1: "השוואת מערכות סינון – הדרן, עסקן, כושר פליי וסינון בסיסי",
    lead: "אנחנו עובדים מול כל חברות הסינון, ולכן ההשוואה כאן אומרת את זה כמו שזה.",
    sections: [
      {
        h2: "מה ההבדל בין המערכות",
        items: [
          "הדרן (300₪) – רמת הסינון הגבוהה ביותר, לא ניתן להסרה גם באיפוס יצרן, נדרש מכשיר מאופס. מתאים במיוחד לילדים ולנוער.",
          "עסקן (300₪) – צריבה עמוקה עם סינון תמונות מבוסס AI, נבנתה כדי שהמכשיר ימשיך לתפקד לעבודה. נדרש מכשיר מאופס.",
          "כושר פליי (70₪) – חנות אפליקציות כשרה, וואטסאפ מסונן וצריבת MDM שמונעת איפוס. אינה מוחקת נתונים.",
          "סינון בסיסי (100₪) – חסימת אתרים ברמה לבחירה, התקנה תוך 5 דקות, ניתן לשינוי ולהסרה.",
        ],
      },
    ],
    links: [
      { href: "/pricing", text: "מחירון מלא" },
      { href: "/services", text: "כל השירותים" },
    ],
  },
  {
    path: "/services/basic-filtering",
    title: "סינון בסיסי לאייפון ואנדרואיד – 100₪ | FilterPhone אשדוד",
    description:
      "סינון אינטרנט בסיסי לאייפון וגלקסי – התקנה תוך 5 דקות בלבד, חסימת אתרים לא רצויים, מחיר 100₪ בלבד. שירות מהיר באשדוד ☎ 052-718-6881",
    keywords: "סינון בסיסי, מחיר סינון אייפון, סינון זול, חסימת אתרים",
    h1: "סינון בסיסי לאייפון ואנדרואיד – 100₪",
    lead: "פתרון מהיר ויעיל לחסימת תוכן לא רצוי – התקנה תוך 5 דקות בלבד.",
  },
  {
    path: "/services/kosher-play",
    title: "כושר פליי (Kosher Play) – 70₪ | חנות אפליקציות כשרה – FilterPhone",
    description:
      "מערכת Kosher Play: חנות אפליקציות כשרה, צריבת MDM למניעת איפוס, וואטסאפ מסונן ללא תמונות פרופיל. התקנה מקצועית באשדוד – 70₪.",
    keywords: "כושר פליי, Kosher Play, MDM, אפליקציות כשרות, וואטסאפ מסונן",
    h1: "מערכת כושר פליי (Kosher Play) – 70₪",
    lead: "חנות אפליקציות כשרה עם צריבת MDM, וואטסאפ מסונן – התקנה מקצועית באשדוד.",
  },
  {
    path: "/services/hadran",
    title: "הדרן (Hadran) – 300₪ | ההגנה ההרמטית ביותר – FilterPhone",
    description:
      "מערכת הדרן – ההגנה החזקה וההרמטית ביותר בישראל. צריבה שלא ניתנת להסרה גם באיפוס יצרן. מושלם לילדים ונוער. התקנה ב-300₪.",
    keywords: "הדרן, Hadran, סינון לילדים, הגנה הרמטית, התקנת הדרן אשדוד",
    h1: "מערכת הדרן (Hadran) – 300₪",
    lead: "ההגנה החזקה וההרמטית ביותר בשוק – צריבה מוסמכת שלא ניתנת להסרה בשום צורה.",
  },
  {
    path: "/services/askan",
    title: "עסקן (Askan) – 300₪ | סינון AI חכם לאנשי עסקים – FilterPhone",
    description:
      "מערכת עסקן – סינון AI חכם עם צריבה עמוקה, מיועד לאנשי עסקים. מסנן תמונות מתקדם, מקום אמין באשדוד ☎ 052-718-6881",
    keywords: "עסקן, Askan, סינון AI, סינון לאנשי עסקים",
    h1: "מערכת סינון עסקן (Askan) – 300₪",
    lead: "צריבה מקצועית עם מסנן AI חכם – לאנשי עסקים שמחפשים סינון ברמה הגבוהה ביותר.",
  },
  {
    path: "/services/qin-f21-pro",
    title: "צריבת גרסה Qin F21 Pro – 70₪ | FilterPhone אשדוד",
    description:
      "צריבת גרסה כשרה ומותאמת למכשיר שיאומי Qin F21 Pro. גרסה יציבה, סינון מובנה. התקנה מקצועית באשדוד – 70₪.",
    keywords: "Qin F21 Pro, צריבת גרסה שיאומי, שיאומי כשר",
    h1: "צריבת גרסה Qin F21 Pro – 70₪",
    lead: "צריבת גרסה כשרה ומותאמת למכשיר שיאומי Qin F21 Pro.",
  },
  {
    path: "/services/qin-f25",
    title: "צריבת גרסה Qin F25 – 70₪ | FilterPhone אשדוד",
    description:
      "צריבת גרסה כשרה ומותאמת למכשיר שיאומי Qin F25. גרסה יציבה, סינון מובנה. התקנה מקצועית באשדוד – 70₪.",
    keywords: "Qin F25, צריבת גרסה שיאומי, שיאומי כשר",
    h1: "צריבת גרסה Qin F25 – 70₪",
    lead: "צריבת גרסה כשרה ומותאמת למכשיר שיאומי Qin F25.",
  },
  {
    path: "/about",
    title: "אודות FilterPhone – פילטר פון | מעבדת סינון טלפונים באשדוד",
    description:
      "FilterPhone (פילטר פון) היא מעבדה באשדוד לסינון טלפונים וצריבת גרסאות. משווק מורשה של הדרן, עסקן וכושר פליי, עם ניסיון בכל סוגי המכשירים.",
    keywords: "אודות FilterPhone, פילטר פון אשדוד, מעבדת סינון אשדוד",
    h1: "אודות FilterPhone",
    lead: "מעבדה באשדוד לסינון טלפונים, טאבלטים ומחשבים. משווק מורשה של חברות הסינון המובילות בישראל – ולכן ההמלצה נקבעת לפי הצורך, לא לפי מוצר.",
  },
  {
    path: "/contact",
    title: "צור קשר – FilterPhone פילטר פון אשדוד | 052-718-6881",
    description:
      "יצירת קשר עם FilterPhone באשדוד לשירותי סינון טלפון. טלפון 052-718-6881, וואטסאפ זמין, חטיבת גבעתי 2, כניסה ו׳, רובע ג׳. שירות בתיאום מראש, בדרך כלל ביום הפנייה.",
    keywords: "צור קשר FilterPhone, טלפון פילטר פון, כתובת סינון אשדוד",
    h1: "צור קשר – FilterPhone",
    lead: "טלפון: 052-718-6881 | כתובת: חטיבת גבעתי 2, כניסה ו׳, רובע ג׳, אשדוד | שעות: א׳-ה׳ 09:00-19:00, ו׳ 09:00-13:00",
  },
  {
    path: "/filtertube",
    title: "FilterTube (פילטר טיוב) – יוטיוב ויוטיוב מיוזיק מסוננים להורדה APK",
    image: "/filtertube-og.jpg",
    imageAlt: "FilterTube – יוטיוב ויוטיוב מיוזיק מסוננים, אפליקציה לאנדרואיד",
    description:
      "FilterTube – אפליקציה אחת בעברית לאנדרואיד ובה יוטיוב מסונן וגם יוטיוב מיוזיק מסונן, להורדה חינם. שלוש רמות סינון, מצב הכל כאודיו, מיקסים, נגן ברקע, הורדות אופליין, קוד הורים וללא פרסומות. חלופה חוקית לאפליקציות יוטיוב פרוצות.",
    keywords:
      "יוטיוב מסונן, יוטיוב מסונן להורדה, יוטיוב כשר, יוטיוב פרוץ, יוטיוב פרוץ להורדה, יוטיוב APK, FilterTube, FilterTube APK, FilterMusic, פילטר טיוב, יוטיוב מיוזיק מסונן, יוטיוב עם מיוזיק, יוטיוב מיוזיק כשר, מוזיקה כשרה אפליקציה, נגן מוזיקה כשר, YouTube Vanced חלופה, YouTube ReVanced עברית, NewPipe עברית, סינון יוטיוב, סינון ליוטיוב, יוטיוב לילדים, יוטיוב לחרדים, יוטיוב דתי, יוטיוב ללא פרסומות, נגן יוטיוב ברקע, יוטיוב אופליין, אפליקציית יוטיוב מסונן לאנדרואיד",
    h1: "FilterTube – יוטיוב ויוטיוב מיוזיק מסוננים להורדה (APK)",
    lead: "FilterTube היא אפליקציית אנדרואיד אחת ובה שני עולמות: FilterTube – יוטיוב מסונן, ו-FilterMusic – יוטיוב מיוזיק מסונן. מחליפים ביניהם במתג אחד. שלוש רמות סינון, קוד הורים שנועל אותן, מצב ״הכל כאודיו״ ונגן ברקע – וללא פרסומות ותגובות. חלופה חוקית לאפליקציות יוטיוב פרוצות. 30 יום פרימיום חינם.",
    sections: [
      {
        h2: "אפליקציה אחת, שני בתים: FilterTube ו-FilterMusic",
        items: [
          "FilterTube – יוטיוב מסונן: פיד, חיפוש, שורטס, שידורים חיים וערוצי תורה",
          "FilterMusic – יוטיוב מיוזיק מסונן: בחירה מהירה, מיקס יומי אישי ומיקס לכל זמר",
          "רדיו שממשיך מכל שיר, ותור ניגון עם ״הבא בתור״",
          "מחליפים בין השניים במתג אחד בראש המסך – אותה רמת סינון ואותו קוד הורים",
        ],
      },
      {
        h2: "התכונות המרכזיות של FilterTube",
        items: [
          "רמת מחמיר: כל התוכן מוצג כווידאו, המוזיקה נשמעת כאודיו בלבד בלי קליפים, וערוצי ״דתי לייט״ אינם מוצגים",
          "רמת רגיל: כמו מחמיר, אבל גם המוזיקה מוצגת כווידאו",
          "רמת דתי לייט: מוסיפה שירים חילוניים בביצוע גברים בלבד, שמתנגנים כאודיו בלבד",
          "מתג ״הכל כאודיו״ – חל על כל רמות הסינון: גם שיעורים, גם חדשות וגם מוזיקה יישמעו ולא ייראו",
          "נגן ברקע וחלון צף – גם כשהמסך נעול",
          "הורדות לצפייה והאזנה אופליין, עם מנהל הורדות",
          "קוד הורים שנועל את רמת הסינון ואת הצגת השורטס",
          "סנכרון ענן – החשבון, הלייקים והספרייה עוברים איתכם למכשיר הבא",
          "התראה על סרטון חדש בערוץ מאושר בלבד",
          "שיתוף האפליקציה בקישור, בקוד QR או בהעברת קובץ ההתקנה בבלוטות'",
          "ללא פרסומות וללא תגובות",
          "30 יום פרימיום חינם – ללא כרטיס אשראי ובלי חשבון גוגל",
          "אנדרואיד 7.0 ומעלה",
        ],
      },
      {
        h2: "מי מחליט אילו ערוצים נכנסים",
        text: "כל ערוץ ברשימה נבדק ואושר ידנית על ידי אדם – לא על ידי בינה מלאכותית ולא באופן אוטומטי. מה שלא אושר פשוט לא קיים באפליקציה, גם לא בתוצאות החיפוש. זה ההבדל בין סינון אמיתי לבין חסימה לפי מילות מפתח.",
      },
      {
        h2: "יוטיוב מיוזיק מסונן – נגן מוזיקה כשר",
        text: "מי שחיפש יוטיוב עם מיוזיק בגרסה מסוננת מקבל את שניהם בהתקנה אחת. FilterMusic נותן מסך בית מוזיקלי, מיקס יומי שנבנה ממה שאתם שומעים, מיקס נפרד לכל זמר, רדיו לפי שיר וספרייה עם לייקים והורדות. הנגן ממשיך ברקע ובמסך נעול, בלי פרסומות ובלי מנוי.",
      },
      {
        h2: "החלופה הכשרה ליוטיוב פרוץ",
        text: "מחפשים יוטיוב פרוץ להורדה? FilterTube נותנת את כל התכונות של יוטיוב פרימיום ואפליקציות פרוצות – הורדות, נגן ברקע, ללא פרסומות – בסביבה חוקית, בטוחה וכשרה לחלוטין, ללא סיכון של APK ממקור לא מוכר, ועם סינון אנושי אמיתי לפני שהתוכן מוצג.",
      },
      {
        h2: "איך מורידים את יוטיוב המסונן?",
        text: "לוחצים על כפתור ההורדה בעמוד ומקבלים את קובץ ה-APK הרשמי של FilterTube. ההתקנה חינמית, לא דורשת חשבון גוגל ולא דורשת רוט. מתאים לאנדרואיד 7.0 ומעלה. קישור הורדה ישיר: https://filter-tube-52d8e.web.app/download/FilterTube.apk",
      },
      {
        h2: "למי זה מתאים?",
        text: "להורים שרוצים יוטיוב לילדים בלי הפתעות, לבחורי ישיבה ולציבור החרדי והדתי שמחפשים יוטיוב כשר ומוזיקה כשרה, ולכל מי שרוצה יוטיוב ומוזיקה ללא פרסומות בצורה חוקית. מחפשים גם סינון לטלפון עצמו? ראו את שירותי הסינון שלנו – הדרן, עסקן וכושר פליי.",
      },
    ],
    jsonLd: [
      {
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
        url: "https://www.filterphone.com/filtertube",
        downloadUrl: APK_URL,
        installUrl: APK_URL,
        offers: { "@type": "Offer", price: "0", priceCurrency: "ILS", availability: "https://schema.org/InStock" },
        description:
          "אפליקציה אחת בעברית לאנדרואיד ובה יוטיוב מסונן ויוטיוב מיוזיק מסונן. חלופה חוקית ליוטיוב פרוץ / YouTube Vanced / NewPipe: 3 רמות סינון, מצב הכל כאודיו, מיקסים, נגן ברקע, חלון צף, הורדות אופליין ואפס פרסומות.",
        publisher: { "@type": "Organization", name: "FilterPhone", url: "https://www.filterphone.com" },
        screenshot: [
          "https://www.filterphone.com/filtertube/feed.jpg",
          "https://www.filterphone.com/filtertube/music.jpg",
          "https://www.filterphone.com/filtertube/levels.jpg",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "בית", item: "https://www.filterphone.com/" },
          { "@type": "ListItem", position: 2, name: "יוטיוב מסונן – FilterTube", item: "https://www.filterphone.com/filtertube" },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "מה זה יוטיוב מסונן ואיך מורידים אותו?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "יוטיוב מסונן הוא נגן וידאו שמציג רק תוכן שעבר סינון. FilterTube היא אפליקציית אנדרואיד חינמית להורדה כקובץ APK מהעמוד שלנו, ללא צורך בחשבון וללא רוט.",
            },
          },
          {
            "@type": "Question",
            name: "מה זה FilterMusic, ומה הקשר ליוטיוב מיוזיק?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "FilterMusic הוא מצב המוזיקה של FilterTube, ומחליף בפועל את יוטיוב מיוזיק. מחליפים אליו במתג בראש המסך ומקבלים מסך בית מוזיקלי, מיקס יומי אישי, מיקס לכל זמר, רדיו וספרייה – מתוך אותה רשימת ערוצים מאושרת ובלי פרסומות.",
            },
          },
          {
            "@type": "Question",
            name: "האם FilterTube חלופה ליוטיוב פרוץ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "כן. FilterTube מספקת את כל התכונות של יוטיוב פרוץ, YouTube Vanced ו-NewPipe – הורדות, נגן ברקע וללא פרסומות – בסביבה מסוננת, כשרה וחוקית.",
            },
          },
          {
            "@type": "Question",
            name: "מי מחליט אילו ערוצים נכנסים לאפליקציה?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "כל ערוץ ברשימה נבדק ואושר ידנית על ידי אדם – לא על ידי בינה מלאכותית ולא באופן אוטומטי. מה שלא אושר פשוט לא קיים באפליקציה.",
            },
          },
          {
            "@type": "Question",
            name: "האם הפרימיום חינם?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "כן, 30 יום פרימיום חינם הכוללים הורדות, נגן ברקע וחלון צף, ללא צורך באמצעי תשלום.",
            },
          },
        ],
      },
    ],
    links: [
      { href: "/services", text: "שירותי סינון טלפונים באשדוד" },
      { href: "/services/hadran", text: "סינון הדרן" },
      { href: "/services/kosher-play", text: "כושר פליי" },
      {
        href: APK_URL,
        text: "הורדת FilterTube APK – יוטיוב ומיוזיק מסוננים",
      },
    ],
  },
  {

    path: "/blog",
    title: "מדריכים על סינון טלפון – הבלוג של FilterPhone",
    description:
      "מדריכים וטיפים על סינון טלפון, חסימת אינטרנט, בחירת מערכת סינון, מכשירי Qin וסינון לילדים. הידע שצברנו במעבדה, בכתב.",
    keywords: "מדריך סינון טלפון, מאמרים סינון, מדריך הדרן, מדריך כושר פליי",
    h1: "מדריכים על סינון טלפון",
    lead: "מדריכים קצרים וענייניים על סינון, חסימת תוכן ובחירת המערכת הנכונה.",
  },
  {
    path: "/privacy",
    title: "מדיניות פרטיות | FilterPhone",
    description:
      "מדיניות הפרטיות של FilterPhone – איך אנו שומרים על הפרטיות שלכם בעת שימוש באתר ובשירותים שלנו.",
    h1: "מדיניות פרטיות",
    lead: "FilterPhone מחויבת לשמירה על פרטיותכם. מסמך זה מפרט את אופן השימוש במידע שאנו אוספים.",
  },
  {
    path: "/refund-policy",
    title: "מדיניות החזרים | FilterPhone",
    description:
      "מדיניות החזרים וביטולים של FilterPhone – מידע על זכויות הצרכן וביטולי עסקה.",
    h1: "מדיניות החזרים",
    lead: "במסמך זה תמצאו את המידע המלא על מדיניות ההחזרים והביטולים שלנו.",
  },
  {
    path: "/my-account",
    title: "אזור אישי – ניהול הסינון שלי | FilterPhone",
    description:
      "התחבר לאזור האישי שלך ב-FilterPhone לניהול רמת הסינון, צפייה בסטטיסטיקות, הורדת קונפיג VPN ושליחת בקשות לשינוי הגדרות.",
    keywords: "אזור אישי, ניהול סינון, FilterPhone login, פילטר פון התחברות",
    h1: "אזור אישי – FilterPhone",
    lead: "התחבר כדי לראות את סטטוס הסינון שלך, לעדכן הגדרות ולשלוח בקשות.",
    noindex: true,
  },
  {
    path: "/crm-dashboard",
    title: "ניהול CRM – פאנל מנהלים | FilterPhone",
    description:
      "פאנל ניהול CRM ל-FilterPhone: ניהול לקוחות, בקשות, לוגים, VPN, AdGuard וסינון תמונות.",
    h1: "פאנל ניהול CRM",
    lead: "כניסה למנהלים בלבד.",
    noindex: true,
  },
];

// Generate the fallback body content for a route
function buildFallback(route) {
  const sections = (route.sections || [])
    .map((s) => {
      if (s.items) {
        return `<section><h2>${s.h2}</h2><ul>${s.items
          .map((i) => `<li>${i}</li>`)
          .join("")}</ul></section>`;
      }
      return `<section><h2>${s.h2}</h2><p>${s.text || ""}</p></section>`;
    })
    .join("");

  return `<div id="seo-fallback" aria-hidden="true" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;">
    <header>
      <h1>${route.h1}</h1>
      <p>${route.lead}</p>
    </header>
    <nav aria-label="ניווט ראשי">
      <ul>
        <li><a href="/">דף הבית</a></li>
        <li><a href="/services">שירותים</a></li>
        <li><a href="/pricing">מחירון</a></li>
        <li><a href="/compare">השוואת מערכות סינון</a></li>
        <li><a href="/filtertube">FilterTube – יוטיוב מסונן</a></li>
        <li><a href="/about">אודות</a></li>
        <li><a href="/blog">מדריכים</a></li>
        <li><a href="/contact">צור קשר</a></li>
      </ul>
    </nav>
    ${sections}
    ${(route.links || []).length ? `<nav aria-label="קישורים נוספים"><ul>${route.links
      .map((l) => `<li><a href="${l.href}">${l.text}</a></li>`)
      .join("")}</ul></nav>` : ""}
    <section>
      <h2>צור קשר</h2>
      <p>טלפון: <a href="tel:+972527186881">052-718-6881</a></p>
      <p>כתובת: חטיבת גבעתי 2, כניסה ו׳, רובע ג׳, אשדוד</p>
      <p>שעות: ראשון-חמישי 09:00-19:00, שישי 09:00-13:00</p>
    </section>
  </div>`;
}

// Inject route-specific metadata into the built index.html template
function injectRoute(template, route) {
  const fullUrl = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
  const escTitle = escapeHtml(route.title);
  const escDesc = escapeHtml(route.description);
  const escKw = route.keywords ? escapeHtml(route.keywords) : "";

  let html = template;

  // robots (noindex for private routes)
  if (route.noindex) {
    html = html.replace(
      /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="robots" content="noindex, nofollow" />`,
    );
    html = html.replace(
      /<meta\s+name=["']googlebot["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="googlebot" content="noindex, nofollow" />`,
    );
  }

  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escTitle}</title>`);
  // meta description
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${escDesc}" />`,
  );
  // canonical
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${fullUrl}" />`,
  );
  // og:title
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${escTitle}" />`,
  );
  // og:description
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${escDesc}" />`,
  );
  // og:url
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:url" content="${fullUrl}" />`,
  );
  // twitter:title
  html = html.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:title" content="${escTitle}" />`,
  );
  // twitter:description
  html = html.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:description" content="${escDesc}" />`,
  );

  // Social preview image. Link-preview bots (WhatsApp, Telegram, Facebook) never
  // run JavaScript, so react-helmet's og:image never reaches them — only this does.
  if (route.image) {
    const img = escapeHtml(`${SITE_URL}${route.image}`);
    const imgAlt = escapeHtml(route.imageAlt || route.title);
    const w = String(route.imageWidth || 1200);
    const h = String(route.imageHeight || 630);
    html = html.replace(
      /<meta\s+property=["']og:image["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image" content="${img}" />`,
    );
    html = html.replace(
      /<meta\s+property=["']og:image:secure_url["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image:secure_url" content="${img}" />`,
    );
    html = html.replace(
      /<meta\s+property=["']og:image:width["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image:width" content="${w}" />`,
    );
    html = html.replace(
      /<meta\s+property=["']og:image:height["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image:height" content="${h}" />`,
    );
    html = html.replace(
      /<meta\s+property=["']og:image:alt["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:image:alt" content="${imgAlt}" />`,
    );
    html = html.replace(
      /<meta\s+name=["']twitter:image["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:image" content="${img}" />`,
    );
    html = html.replace(
      /<meta\s+name=["']twitter:image:alt["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:image:alt" content="${imgAlt}" />`,
    );
  }
  // keywords (only for routes that specify)
  if (escKw) {
    html = html.replace(
      /<meta\s+name=["']keywords["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="keywords" content="${escKw}" />`,
    );
  }
  // itemprop name / description
  html = html.replace(
    /<meta\s+itemprop=["']name["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta itemprop="name" content="${escTitle}" />`,
  );
  html = html.replace(
    /<meta\s+itemprop=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta itemprop="description" content="${escDesc}" />`,
  );

  // Route-specific JSON-LD (structured data visible without JavaScript)
  if (route.jsonLd && route.jsonLd.length) {
    const blocks = route.jsonLd
      .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
      .join("\n    ");
    html = html.replace("</head>", `  ${blocks}\n  </head>`);
  }

  // Replace the crawler fallback inside #root with the route-specific one.
  // The attributes may be spread over several lines, so match the opening tag
  // by its id rather than by exact spacing; the block itself contains no nested
  // <div>, so the first `</div></div>` pair closes it and then #root.
  const fallback = buildFallback(route);
  const fallbackPattern = /<div\s[^>]*id="seo-fallback"[\s\S]*?<\/div>\s*<\/div>/;
  if (!fallbackPattern.test(html)) {
    throw new Error(
      `[prerender] Could not find the #seo-fallback block for ${route.path}. ` +
        "index.html changed shape — every route would otherwise ship the home page's fallback content.",
    );
  }
  html = html.replace(fallbackPattern, `${fallback}\n    </div>`);

  return html;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function main() {
  let template;
  try {
    template = await readFile(indexPath, "utf8");
  } catch (err) {
    console.error(`[prerender] Could not read ${indexPath}:`, err.message);
    process.exit(1);
  }

  let generated = 0;
  for (const route of routes) {
    const html = injectRoute(template, route);
    const outDir =
      route.path === "/" ? distDir : path.join(distDir, route.path);
    const outFile = path.join(outDir, "index.html");

    // Root (/) overwrites dist/index.html; all others write dist/<route>/index.html
    if (route.path !== "/") {
      await mkdir(outDir, { recursive: true });
    }
    await writeFile(outFile, html, "utf8");
    generated++;
    console.log(`[prerender] wrote ${path.relative(distDir, outFile)}`);
  }

  console.log(`[prerender] Generated ${generated} static HTML files.`);
}

main().catch((err) => {
  console.error("[prerender] Failed:", err);
  process.exit(1);
});
