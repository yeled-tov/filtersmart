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

const SITE_URL = "https://filterphone.com";
const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/zQzpmcciMefmd1jcMZlCnfScdqW2/social-images/social-1772354974246-Gemini_Generated_Image_8ki41m8ki41m8ki4.webp";

// Per-route SEO metadata + fallback body content
// Every route here will get its own prerendered HTML shell.
const routes = [
  {
    path: "/",
    title:
      "סינון טלפונים באשדוד מ-20₪ ⭐ 5.0 (47 חוות דעת) | FilterPhone פילטר פון",
    description:
      "✅ הכתובת #1 לסינון טלפונים בישראל! אייפון, גלקסי, אנדרואיד, מחשב – כל מכשיר. הדרן 300₪ | עסקן 300₪ | כושר פליי 70₪ | סינון בסיסי 20₪. משווק מורשה ✓ 500+ לקוחות ☎ 052-718-6881",
    keywords:
      "סינון טלפון, סינון טלפון אשדוד, סינון אייפון, סינון גלקסי, סינון סמסונג, סינון אנדרואיד, הדרן, עסקן, כושר פליי, FilterPhone, פילטר פון",
    h1: "FilterPhone – סינון טלפונים מקצועי באשדוד מ-20₪",
    lead: "הכתובת #1 בישראל לסינון טלפונים – אייפון, גלקסי, סמסונג, שיאומי, אנדרואיד, מחשב וטאבלט. משווק מורשה של הדרן, עסקן וכושר פליי. 500+ לקוחות מרוצים, דירוג 5.0 עם 47 חוות דעת.",
    sections: [
      {
        h2: "השירותים שלנו",
        items: [
          "סינון בסיסי – 20₪ – התקנה תוך 5 דקות לאייפון ואנדרואיד",
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
      "שירותי סינון טלפון באשדוד מ-20₪ | אייפון, גלקסי, אנדרואיד – FilterPhone",
    description:
      "✅ כל שירותי הסינון במקום אחד: סינון בסיסי 20₪, כושר פליי 70₪, הדרן 300₪, עסקן 300₪. אייפון, גלקסי, סמסונג, שיאומי – כל מכשיר. צריבת גרסה Qin 70₪ ☎ 052-718-6881",
    keywords:
      "סינון טלפון אשדוד, סינון אייפון, סינון גלקסי, סינון סמסונג, התקנת הדרן, כושר פליי התקנה, עסקן התקנה, צריבת גרסה שיאומי",
    h1: "השירותים שלנו",
    lead: "פתרונות סינון וצריבת גרסאות מקצועיים לכל סוגי המכשירים – שירות מהיר ואמין באשדוד.",
    sections: [
      {
        h2: "סינון טלפונים והגנה דיגיטלית",
        items: [
          "סינון בסיסי לאייפון ואנדרואיד – 20₪",
          "מערכת כושר פליי (Kosher Play) – 70₪",
          "מערכת הדרן (Hadran) – 300₪ – הכי פופולרי",
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
    path: "/services/basic-filtering",
    title: "סינון בסיסי לאייפון ואנדרואיד – 20₪ | FilterPhone אשדוד",
    description:
      "סינון אינטרנט בסיסי לאייפון וגלקסי – התקנה תוך 5 דקות בלבד, חסימת אתרים לא רצויים, מחיר 20₪ בלבד. שירות מהיר באשדוד ☎ 052-718-6881",
    keywords: "סינון בסיסי, סינון אייפון 20 שקל, סינון זול, חסימת אתרים",
    h1: "סינון בסיסי לאייפון ואנדרואיד – 20₪",
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
    title: "אודות FilterPhone – המעבדה המובילה לסינון טלפונים באשדוד",
    description:
      "FilterPhone – פילטר פון – המעבדה המובילה באשדוד לסינון טלפונים והגנה דיגיטלית. משווק מורשה של הדרן, עסקן וכושר פליי. 500+ לקוחות מרוצים, דירוג 5.0.",
    keywords: "אודות FilterPhone, פילטר פון אשדוד, סינון טלפונים מקצועי",
    h1: "אודות FilterPhone",
    lead: "המעבדה המובילה באשדוד לסינון טלפונים, טאבלטים ומחשבים. משווק מורשה של כל חברות הסינון המובילות בישראל.",
  },
  {
    path: "/contact",
    title: "צור קשר – FilterPhone באשדוד ☎ 052-718-6881",
    description:
      "דברו איתנו! FilterPhone – חטיבת גבעתי 2, אשדוד. טלפון: 052-718-6881. ראשון-חמישי 09:00-19:00, שישי 09:00-13:00. גם ב-WhatsApp.",
    keywords: "צור קשר FilterPhone, טלפון פילטר פון, כתובת סינון אשדוד",
    h1: "צור קשר – FilterPhone",
    lead: "טלפון: 052-718-6881 | כתובת: חטיבת גבעתי 2, כניסה ו׳, רובע ג׳, אשדוד | שעות: א׳-ה׳ 09:00-19:00, ו׳ 09:00-13:00",
  },
  {
    path: "/blog",
    title: "מאמרים וחדשות על סינון טלפונים | FilterPhone בלוג",
    description:
      "בלוג FilterPhone – מאמרים מקצועיים על סינון טלפונים, הדרן, עסקן, כושר פליי, שיאומי Qin, עדכונים וטיפים לסינון דיגיטלי נכון.",
    keywords: "בלוג סינון טלפונים, מאמרים סינון, מדריך הדרן, מדריך כושר פליי",
    h1: "מאמרים וחדשות",
    lead: "מאמרים מקצועיים, מדריכים וטיפים על סינון טלפונים והגנה דיגיטלית.",
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

  return `<div id="seo-fallback" style="font-family:'Heebo',sans-serif;padding:24px;max-width:900px;margin:0 auto;text-align:right;direction:rtl;">
    <header>
      <h1>${route.h1}</h1>
      <p>${route.lead}</p>
    </header>
    <nav aria-label="ניווט ראשי">
      <ul>
        <li><a href="/">דף הבית</a></li>
        <li><a href="/services">שירותים</a></li>
        <li><a href="/about">אודות</a></li>
        <li><a href="/blog">מאמרים</a></li>
        <li><a href="/contact">צור קשר</a></li>
      </ul>
    </nav>
    ${sections}
    <section>
      <h2>צור קשר</h2>
      <p>טלפון: <a href="tel:+972527186881">052-718-6881</a></p>
      <p>כתובת: חטיבת גבעתי 2, כניסה ו׳, רובע ג׳, אשדוד</p>
      <p>שעות: ראשון-חמישי 09:00-19:00, שישי 09:00-13:00</p>
      <p>דירוג: 5.0 ⭐ (47 חוות דעת)</p>
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

  // Replace the SEO fallback inside #root with the route-specific one
  const fallback = buildFallback(route);
  // Replace from "<div id="seo-fallback"" up to the matching "</div>" that closes it.
  // Our template uses a single fallback block wrapped as `<div id="seo-fallback" ...> ... </div>` immediately before the closing `</div>` of #root.
  html = html.replace(
    /<div id="seo-fallback"[\s\S]*?<\/div>\s*<\/div>/,
    `${fallback}\n    </div>`,
  );

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
