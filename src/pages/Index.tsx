import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, CalendarCheck, Check, ChevronDown, Compass, Cpu, Download, ListChecks, Lock,
  MessageCircle, Phone, Play, ShieldCheck, Sparkles, Star, Tag, Wrench, X, Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import FilterAdvisor from "@/components/FilterAdvisor";
import PhoneFrame from "@/components/PhoneFrame";
import { useServices, fallbackServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SITE, waLink } from "@/lib/site";
import {
  COMPARISON, FEATURE_GROUPS, FILTERPHONE, FILTER_LEVELS, HOME_FAQ, INSTALL_STEPS, SUPPORTED_MAKERS, WEB_LEVELS,
} from "@/lib/filterphoneApp";

/**
 * The homepage.
 *
 * It used to run to about thirty phone screens, and people could not find
 * FilterTube or the install guide in it. It is now a short page that answers
 * "what is this" and then sends you where you were going: the shortcuts sit
 * directly under the hero, and each topic gets a few lines and a link to the
 * page that covers it. The lab's own story (why us, how an order goes) moved to
 * /services; the full image and browsing levels are on /filterphone and
 * /internet-filtering.
 */

/** The six features shown up front; the rest open on demand. */
const TOP_FEATURES = [
  "סינון תמונות חכם",
  "שליחה לבדיקה",
  "סטטוסים וערוצים",
  "Google Play מנוהל",
  "ניהול מכשיר מלא",
  "תמיכה מיידית",
];

const ALL_FEATURES = FEATURE_GROUPS.flatMap((g) => g.features);

const Index = () => {
  const { data: services } = useServices();
  const { data: settings } = useSiteSettings();

  const wa = settings?.whatsapp_link || SITE.whatsapp;
  const bitLink = settings?.bit_link || SITE.bit;
  // The description the owner edits in the admin introduces the lab's services here.
  const labDesc =
    settings?.hero_description ||
    "משווק מורשה של הדרן, עסקן וכושר פליי. מתקינים סינון לאייפון, לגלקסי, לכל אנדרואיד, לטאבלט ולמחשב – וצורבים גרסאות כשרות למכשירי שיאומי Qin.";

  const allServices = services && services.length > 0 ? services : fallbackServices;
  const topFeatures = TOP_FEATURES.map((t) => ALL_FEATURES.find((f) => f.title === t)).filter(Boolean) as typeof ALL_FEATURES;

  const shortcuts = [
    { to: "/install", icon: ListChecks, title: "מדריך התקנה", sub: "צעד אחרי צעד, עם סרטונים" },
    { to: "/filtertube", icon: Youtube, title: "FilterTube", sub: "יוטיוב ומיוזיק מסוננים" },
    { to: "/services", icon: Wrench, title: "סינון במעבדה", sub: "הדרן, עסקן, כושר פליי, אייפון" },
    { to: "/pricing", icon: Tag, title: "מחירון", sub: "כמה עולה כל פתרון" },
    { href: "#advisor", icon: Compass, title: "מה מתאים לי?", sub: "יועץ הסינון ממליץ" },
    {
      href: waLink("שלום, אשמח לפרטים על הסינון של FilterPhone", wa),
      external: true,
      icon: MessageCircle,
      title: "דברו איתנו",
      sub: "וואטסאפ, עונים מהר",
    },
  ];

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}/#webpage`,
    url: `${SITE.url}/`,
    name: "FilterPhone – סינון לטלפון אנדרואיד",
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#filterphone-app` },
    publisher: { "@id": `${SITE.url}/#business` },
    inLanguage: "he-IL",
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE.url}/og-home.jpg` },
    description:
      "סינון לטלפון אנדרואיד: סינון תמונות חכם בזמן אמת, 4 רמות גלישה, וואטסאפ מסונן וניהול מכשיר מלא. התקנה אוטומטית ברוב הטלפונים בלי איפוס ובלי מחיקת חשבונות.",
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/#filterphone-app`,
    name: "FilterPhone",
    alternateName: ["פילטר פון", "FilterPhone – סינון לטלפון"],
    operatingSystem: "Android 8.0+",
    applicationCategory: "SecurityApplication",
    inLanguage: "he",
    url: `${SITE.url}/`,
    downloadUrl: FILTERPHONE.apk,
    installUrl: FILTERPHONE.apk,
    softwareHelp: `${SITE.url}/install`,
    publisher: { "@id": `${SITE.url}/#business` },
    screenshot: [
      `${SITE.url}/filterphone/welcome.jpg`,
      `${SITE.url}/filterphone/levels.jpg`,
      `${SITE.url}/filterphone/blocks.jpg`,
    ],
    featureList: ALL_FEATURES.map((f) => f.title),
    offers: {
      "@type": "Offer",
      price: String(FILTERPHONE.price.amount),
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(FILTERPHONE.price.amount),
        priceCurrency: "ILS",
        unitCode: "ANN",
      },
    },
    description:
      "אפליקציית סינון לטלפון אנדרואיד: סינון תמונות חכם בשלוש רמות, ארבע רמות גלישה, וואטסאפ מסונן, Google Play מנוהל וניהול מכשיר מלא שאי אפשר לעקוף.",
  };

  const serviceListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "שירותי סינון טלפונים וצריבת גרסאות – FilterPhone אשדוד",
    itemListElement: allServices.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.short_desc || undefined,
        areaServed: { "@type": "City", name: "אשדוד" },
        provider: { "@id": `${SITE.url}/#business` },
        offers: {
          "@type": "Offer",
          price: s.price.replace(/[^\d]/g, ""),
          priceCurrency: "ILS",
          availability: "https://schema.org/InStock",
        },
        url: `${SITE.url}/services/${s.slug}`,
      },
    })),
  };

  return (
    <>
      <SEOHead
        title="FilterPhone – סינון לטלפון, סינון אינטרנט וסינון תמונות"
        description="סינון לטלפון אנדרואיד שלא חונק אותו: סינון תמונות חכם, 4 רמות סינון אינטרנט, וואטסאפ מסונן וניהול מלא. לסמסונג, לשיאומי ולכל סמארטפון. ברוב הטלפונים בלי איפוס."
        path="/"
        keywords="סינון טלפון, סינון לטלפון, סינון טלפונים, סינון אינטרנט, סינון סמארטפון, סינון לאנדרואיד, סינון תמונות, סינון גלקסי, סינון לסמסונג, סינון לשיאומי, סינון אינטרנט כשר, טלפון כשר עם אינטרנט, סמארטפון כשר, אפליקציית סינון, סינון וואטסאפ, פילטר פון, FilterPhone"
        image={`${SITE.url}/og-home.jpg`}
        imageAlt="FilterPhone – הטלפון נשאר חכם, התוכן נשאר נקי"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webPageJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(softwareJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceListJsonLd)}</script>
      </Helmet>

      {/* ---------------------------------------------------------- Hero */}
      <section id="download" className="relative overflow-hidden band-ink" aria-label="FilterPhone – סינון לטלפון אנדרואיד">
        <div className="pointer-events-none absolute inset-0 texture-traces opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent"
          aria-hidden="true"
        />

        <div className="container-custom relative grid gap-12 py-12 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[0.8125rem] font-semibold text-white/80">
              <Sparkles className="h-4 w-4 text-white/60" />
              פיתוח עצמי · סינון חדש לאנדרואיד
            </span>

            {/* One H1. The small line carries the search phrase; the large one carries the idea. */}
            <h1 className="mt-6 text-white">
              <span className="block text-[1.0625rem] font-bold text-white/70 md:text-lg">
                FilterPhone — סינון לטלפון אנדרואיד
              </span>
              <span className="mt-3 block text-display-xl">
                הטלפון נשאר חכם.
                <span className="block text-[hsl(22_70%_62%)]">התוכן נשאר נקי.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/70">
              סינון תמונות חכם בזמן אמת, רמות גלישה לבחירה, וואטסאפ מסונן — ניהול מלא מרחוק, והתקנה
              אוטומטית ברוב הטלפונים <strong className="font-semibold text-white">בלי איפוס ובלי מחיקת חשבונות</strong>.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a href={FILTERPHONE.apk} rel="noopener" className="sm:w-auto">
                <Button size="lg" variant="inverse" className="h-14 w-full gap-2 text-[1.0625rem] sm:w-auto">
                  <Download className="h-5 w-5" />
                  הורדת האפליקציה
                </Button>
              </a>
              <Link to="/install" className="sm:w-auto">
                <Button size="lg" variant="outline-inverse" className="h-14 w-full gap-2 text-[1.0625rem] sm:w-auto">
                  <ListChecks className="h-5 w-5" />
                  מדריך התקנה, צעד אחרי צעד
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-[0.8125rem] leading-relaxed text-white/55">
              האפליקציה מותקנת מחוץ לחנות — זה תקין, והמדריך מוביל אתכם.{" "}
              טלפון ישן?{" "}
              <a href={FILTERPHONE.apkUniversal} rel="noopener" className="font-semibold text-white/80 underline underline-offset-4 hover:text-white">
                גרסה לכל סוגי המעבדים
              </a>
            </p>

            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                { value: "3", label: "רמות סינון תמונות" },
                { value: "4", label: "רמות גלישה" },
                { value: "8+", label: "אנדרואיד" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="num block text-2xl font-extrabold text-white md:text-[1.75rem]">{stat.value}</span>
                    <span className="mt-1 block text-[0.8125rem] leading-snug text-white/50">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* The screenshots sit beside the text on wide screens; on a phone the shortcuts come first. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="hidden items-end justify-center gap-5 lg:col-span-5 lg:flex"
          >
            <PhoneFrame
              shot="levels"
              alt="בחירת רמת סינון התמונות באפליקציית FilterPhone"
              className="max-w-[12rem] translate-y-8"
              sizes="192px"
            />
            <PhoneFrame
              shot="welcome"
              alt="מסך הפתיחה של אפליקציית FilterPhone – סינון אינטרנט ותמונות לכל הטלפון"
              className="max-w-[14rem]"
              sizes="224px"
            />
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------ Shortcuts */}
      <nav className="border-b border-border bg-surface" aria-labelledby="shortcuts-title">
        <div className="container-custom py-8 md:py-10">
          <h2 id="shortcuts-title" className="text-lg font-bold text-ink md:text-xl">
            לאן אתם צריכים?
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {shortcuts.map((s) => {
              const inner = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="mt-3 block text-[1rem] font-bold leading-snug text-ink">{s.title}</span>
                  <span className="mt-1 block text-[0.8125rem] leading-snug text-muted-foreground">{s.sub}</span>
                </>
              );
              const cls = "group flex h-full flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/50 hover:bg-primary-tint/40";
              return (
                <li key={s.title}>
                  {s.to ? (
                    <Link to={s.to} className={cls}>
                      {inner}
                    </Link>
                  ) : (
                    <a
                      href={s.href}
                      className={cls}
                      {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {inner}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ----------------------------------------------------- Comparison */}
      <section className="section-padding" aria-label="למה FilterPhone שונה">
        <div className="container-custom">
          <SectionHeading
            eyebrow="למה FilterPhone שונה"
            title="לא חוסמים את הטלפון. מסננים אותו."
            lead="רוב מערכות הסינון לטלפון עובדות על עיקרון אחד: לסגור כמעט הכול. FilterPhone בנויה הפוך — הטלפון נשאר פתוח ושמיש, ומה שעובר בו מסונן."
          />

          <AnimatedSection delay={0.08} className="mt-10">
            <table className="w-full border-collapse text-right">
              <caption className="sr-only">השוואה בין סינון רגיל לבין FilterPhone</caption>
              <thead className="hidden md:table-header-group">
                <tr>
                  <th scope="col" className="w-1/2 pb-4 text-[0.8125rem] font-semibold text-muted-foreground">
                    סינון ״רגיל״
                  </th>
                  <th scope="col" className="w-1/2 pb-4 text-[0.8125rem] font-bold text-primary">
                    FilterPhone
                  </th>
                </tr>
              </thead>
              <tbody className="block space-y-3 md:table-row-group md:space-y-0">
                {COMPARISON.map((row) => (
                  <tr
                    key={row.ours}
                    className="block overflow-hidden rounded-lg border border-border bg-surface md:table-row md:rounded-none md:border-0 md:border-t md:bg-transparent"
                  >
                    <td className="block px-5 py-3.5 text-[0.9375rem] text-muted-foreground md:table-cell md:px-0 md:py-5 md:pl-8">
                      <span className="flex items-start gap-2.5">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70" aria-hidden="true" />
                        <span>
                          <span className="sr-only md:hidden">סינון רגיל: </span>
                          {row.ordinary}
                        </span>
                      </span>
                    </td>
                    <td className="block border-t border-border bg-primary-tint/50 px-5 py-3.5 text-[0.9375rem] font-semibold text-ink md:table-cell md:border-0 md:bg-transparent md:px-0 md:py-5">
                      <span className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                        <span>
                          <span className="sr-only md:hidden">FilterPhone: </span>
                          {row.ours}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AnimatedSection>
        </div>
      </section>

      {/* --------------------------------------------------------- Levels */}
      <section id="levels" className="section-padding border-t border-border bg-surface-sunken" aria-label="רמות הסינון">
        <div className="container-custom">
          <SectionHeading
            eyebrow="מה בוחרים"
            title="שתי בחירות: רמת התמונות ורמת הגלישה"
            lead="סינון התמונות קובע אילו תמונות מוצגות. סינון האינטרנט קובע אילו אתרים נפתחים בכלל. שתיהן נקבעות לכל לקוח בנפרד."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <AnimatedSection>
              <div id="image-filtering" className="panel flex h-full flex-col p-6 md:p-7">
                <h3 className="text-xl font-bold text-ink">סינון תמונות, בשלוש רמות</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  כל תמונה נבדקת לפני שהיא מוצגת, בכל אתר בכרום.
                </p>
                <ul className="mt-5 flex-1 divide-y divide-border">
                  {FILTER_LEVELS.map((lvl) => (
                    <li key={lvl.level} className="flex items-center gap-3.5 py-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
                        <lvl.icon className="h-[1.125rem] w-[1.125rem]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 text-[1rem] font-bold text-ink">
                          {lvl.name}
                          {lvl.isDefault && (
                            <span className="rounded-sm bg-accent-tint px-2 py-0.5 text-[0.6875rem] font-bold text-accent">ברירת מחדל</span>
                          )}
                        </span>
                        <span className="block text-[0.875rem] text-ink-soft">{lvl.short}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/filterphone" className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-primary link-underline">
                  איך סינון התמונות עובד
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.06}>
              <div id="browsing-levels" className="panel flex h-full flex-col p-6 md:p-7">
                <h3 className="text-xl font-bold text-ink">סינון אינטרנט, בארבע רמות</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  כמה מהאינטרנט פתוח, מהסגור ביותר ועד הפתוח ביותר.
                </p>
                <ol className="mt-5 flex-1 divide-y divide-border">
                  {WEB_LEVELS.map((lvl, i) => (
                    <li key={lvl.name} className="flex items-center gap-3.5 py-3.5">
                      {/* How open: one bar per level, filled up to this one */}
                      <span className="flex w-10 shrink-0 gap-0.5" role="img" aria-label={`רמת פתיחות ${i + 1} מתוך ${WEB_LEVELS.length}`}>
                        {WEB_LEVELS.map((_, j) => (
                          <span key={j} className={`h-5 flex-1 rounded-sm ${j <= i ? "bg-primary" : "bg-border"}`} />
                        ))}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[1rem] font-bold text-ink">{lvl.name}</span>
                        <span className="block text-[0.875rem] text-ink-soft">{lvl.short}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <Link to="/internet-filtering" className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-primary link-underline">
                  מה נפתח בכל רמת גלישה
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Features */}
      <section id="features" className="section-padding" aria-label="מה מקבלים עם FilterPhone">
        <div className="container-custom">
          <SectionHeading
            eyebrow="מה מקבלים"
            title="כל מה שיש בסינון, במקום אחד"
            lead="מסינון תמונות ורמות גלישה, דרך וואטסאפ וחנות האפליקציות, ועד ניהול מכשיר מלא שלא מאפשר לעקוף."
          />

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topFeatures.map((f, i) => (
              <li key={f.title}>
                <AnimatedSection delay={(i % 3) * 0.04} className="h-full">
                  <div className="flex h-full items-start gap-3.5 rounded-lg border border-border bg-surface p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
                      <f.icon className="h-[1.0625rem] w-[1.0625rem]" />
                    </span>
                    <span>
                      <span className="block text-[0.9375rem] font-bold text-ink">{f.title}</span>
                      <span className="mt-1 block text-[0.875rem] leading-relaxed text-ink-soft">{f.desc}</span>
                    </span>
                  </div>
                </AnimatedSection>
              </li>
            ))}
          </ul>

          {/* The full list stays in the page, one tap away. */}
          <details className="group mt-5 rounded-lg border border-border bg-surface">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-[1rem] font-bold text-ink [&::-webkit-details-marker]:hidden">
              <span>
                כל היכולות של FilterPhone <span className="num font-semibold text-muted-foreground">({ALL_FEATURES.length})</span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
            </summary>
            <div className="space-y-8 border-t border-border p-5">
              {FEATURE_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-[0.9375rem] font-bold text-primary">{group.title}</h3>
                  <ul className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.features.map((f) => (
                      <li key={f.title} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed">
                        <f.icon className="mt-1 h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
                        <span>
                          <strong className="font-semibold text-ink">{f.title}</strong>
                          <span className="text-ink-soft"> — {f.desc}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* --------------------------------------------------------- Install */}
      <section id="install" className="section-padding border-t border-border bg-surface-sunken" aria-label="התקנה ב-3 צעדים">
        <div className="container-custom">
          <SectionHeading
            eyebrow="התקנה"
            title="מתקינים מהטלפון עצמו, בשלושה צעדים"
            lead="בלי טכנאי ובלי מעבדה. ברוב הטלפונים בלי איפוס ובלי מחיקת חשבונות."
          />

          <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {INSTALL_STEPS.map((s, i) => (
              <li key={s.title} className="bg-surface p-6 md:p-7">
                <AnimatedSection delay={i * 0.07}>
                  <span className="num block text-[0.8125rem] font-bold tracking-widest text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{s.desc}</p>
                </AnimatedSection>
              </li>
            ))}
          </ol>

          <AnimatedSection delay={0.15} className="mt-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                <strong className="font-semibold text-ink">נתמך:</strong> אנדרואיד 8 ומעלה.
                <span className="block">{SUPPORTED_MAKERS.join(" · ")} ועוד.</span>
              </p>
              <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
                <Link to="/install">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    <ListChecks className="h-4 w-4" />
                    למדריך ההתקנה, עם סרטונים
                  </Button>
                </Link>
                <a href={FILTERPHONE.apk} rel="noopener">
                  <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                    <Download className="h-4 w-4" />
                    הורדת האפליקציה
                  </Button>
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------------ FilterTube */}
      <section id="filtertube" className="section-padding" aria-label="FilterTube – יוטיוב ויוטיוב מיוזיק מסוננים">
        <div className="container-custom">
          <AnimatedSection>
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <div className="grid lg:grid-cols-12">
                <div className="p-6 md:p-10 lg:col-span-7">
                  <span className="inline-flex items-center gap-2 rounded-sm bg-accent-tint px-3 py-1.5 text-[0.8125rem] font-bold text-accent">
                    <Youtube className="h-4 w-4" />
                    אפליקציה לאנדרואיד · הורדה חינם
                  </span>

                  <h2 className="mt-5 text-display-md text-ink">FilterTube — יוטיוב ומיוזיק מסוננים</h2>

                  <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
                    אפליקציה אחת בעברית ובה שני עולמות: <strong className="font-semibold text-ink">FilterTube</strong>, יוטיוב
                    מסונן, ו-<strong className="font-semibold text-ink">FilterMusic</strong>, יוטיוב מיוזיק מסונן. כל ערוץ מאושר
                    ידנית על ידי אדם, בלי תגובות ובלי פרסומות, ורמת הסינון ננעלת בקוד הורים.
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {["שלוש רמות סינון", "יוטיוב מיוזיק מסונן", "מצב ״הכל כאודיו״", "אישור ידני של כל ערוץ"].map((t) => (
                      <li key={t} className="flex items-center gap-1.5 rounded-sm border border-border bg-surface-sunken px-3 py-1.5 text-[0.8125rem] font-semibold text-ink-soft">
                        <BadgeCheck className="h-3.5 w-3.5 text-success" />
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <a href={SITE.filterTubeApk} rel="noopener noreferrer">
                      <Button size="lg" className="w-full gap-2 sm:w-auto">
                        <Download className="h-4 w-4" />
                        הורדת FilterTube
                      </Button>
                    </a>
                    <Link to="/filtertube">
                      <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                        <Play className="h-4 w-4" />
                        לעמוד FilterTube ולצילומי מסך
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="relative hidden items-center justify-center gap-4 bg-surface-sunken p-8 sm:flex lg:col-span-5">
                  <img
                    src="/filtertube/music.jpg"
                    alt="מסך FilterMusic – יוטיוב מיוזיק מסונן"
                    width={200}
                    height={430}
                    loading="lazy"
                    className="h-[300px] w-auto rotate-[-4deg] rounded-xl border-4 border-ink object-cover shadow-card"
                  />
                  <img
                    src="/filtertube/feed.jpg"
                    alt="מסך הפיד של אפליקציית FilterTube – יוטיוב מסונן"
                    width={240}
                    height={520}
                    loading="lazy"
                    className="h-[340px] w-auto rounded-xl border-4 border-ink object-cover shadow-float"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ----------------------------------------------- Lab services */}
      <section id="services" className="section-padding border-t border-border bg-surface-sunken" aria-label="שירותים נוספים">
        <div className="container-custom grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="שירותים נוספים"
              title="סינון במעבדה שלנו, באשדוד"
              lead={labDesc}
            />
            <AnimatedSection delay={0.1} className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/services">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  לכל השירותים
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/compare">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  השוואה בין המערכות
                </Button>
              </Link>
            </AnimatedSection>
          </div>

          {/* Price list — FilterPhone first and marked as our recommendation, then every installed service */}
          <AnimatedSection delay={0.08} className="lg:col-span-7">
            <aside aria-label="מחירון מקוצר" className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <div className="flex items-baseline justify-between border-b border-border px-5 py-4 md:px-6">
                <h3 className="font-display text-lg font-bold text-ink">כמה זה עולה</h3>
                <span className="text-xs font-medium text-muted-foreground">מחיר כולל התקנה</span>
              </div>
              <ul className="divide-y divide-border">
                <li>
                  <a href="#download" className="group flex items-center justify-between gap-4 bg-primary-tint/40 px-5 py-3.5 transition-colors hover:bg-primary-tint md:px-6">
                    <span className="flex min-w-0 items-center gap-3">
                      <img src="/filterphone-app-icon.png" alt="" width={36} height={36} loading="lazy" className="h-9 w-9 shrink-0 rounded-md" />
                      <span className="min-w-0">
                        <span className="block truncate text-[0.9375rem] font-semibold text-ink group-hover:text-primary">
                          FilterPhone — הסינון שלנו
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-[0.75rem] font-semibold text-accent">
                          <Star className="h-3 w-3 fill-current" />
                          ההמלצה שלנו כיום
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-left">
                      <span className="num block text-lg font-extrabold text-primary">{FILTERPHONE.price.label}</span>
                      <span className="block text-[0.6875rem] font-medium text-muted-foreground">{FILTERPHONE.price.period}</span>
                    </span>
                  </a>
                </li>
                {allServices.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/services/${s.slug}`}
                      className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface-sunken md:px-6"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        {s.logo_url ? (
                          <img
                            src={s.logo_url}
                            alt=""
                            width={36}
                            height={36}
                            loading="lazy"
                            className="h-9 w-9 shrink-0 rounded-md border border-border object-contain p-1"
                          />
                        ) : (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
                            {s.category === "flashing" ? <Cpu className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </span>
                        )}
                        <span className="block min-w-0 truncate text-[0.9375rem] font-semibold text-ink group-hover:text-primary">
                          {s.name}
                        </span>
                      </span>
                      <span className="num shrink-0 text-lg font-extrabold text-primary">{s.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border bg-surface-sunken px-5 py-4 md:px-6">
                <Link to="/pricing" className="flex items-center justify-between text-sm font-semibold text-primary">
                  למחירון המלא ולמה שכלול בכל פתרון
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </AnimatedSection>
        </div>
      </section>

      {/* -------------------------------------------------------- Advisor */}
      <FilterAdvisor />

      <Reviews />

      {/* ------------------------------------------------------------ FAQ */}
      <FAQ
        id="faq"
        items={HOME_FAQ}
        eyebrow="שאלות נפוצות"
        title="מה שואלים על FilterPhone"
        lead="ואם השאלה שלכם לא כאן — כתבו לנו בוואטסאפ, נענה מהר."
        ariaLabel="שאלות נפוצות על FilterPhone"
      />

      {/* ------------------------------------------------------------ CTA */}
      <section className="band-ink relative overflow-hidden" aria-label="יצירת קשר">
        <div className="pointer-events-none absolute inset-0 texture-traces opacity-60" aria-hidden="true" />
        <div className="container-custom relative py-16 text-center md:py-20">
          <AnimatedSection>
            <h2 className="mx-auto max-w-2xl text-display-md text-white">
              נשמח לשמוע מה המצב, ולהגיד לכם בכנות מה מתאים
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-white/60">
              שיחה קצרה מספיקה כדי להבין איזה סינון נכון למכשיר שלכם. אם פתרון זול יותר עושה את
              העבודה – זה מה שנגיד לכם.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={waLink("שלום פילטר פון, אשמח לקבל ייעוץ על סינון", wa)} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="inverse" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  דברו איתנו בוואטסאפ
                </Button>
              </a>
              <a href={`tel:${SITE.phoneRaw}`}>
                <Button size="lg" variant="outline-inverse" className="gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="num">{SITE.phone}</span>
                </Button>
              </a>
              <a href={bitLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline-inverse">
                  תשלום ב-BIT
                </Button>
              </a>
            </div>
            <p className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/45">
              <span className="flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4" /> בדרך כלל ביום הפנייה
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4" /> אחריות על ההתקנה
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> מחירים שקופים מראש
              </span>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ----------------------------------------------------------- Prose */}
      <section className="section-padding" aria-label="סינון לטלפון – מה זה FilterPhone">
        <div className="container-custom max-w-3xl">
          <h2 className="text-display-sm">סינון לטלפון אנדרואיד – מה זה FilterPhone</h2>
          <div className="prose-fp mt-6">
            <p>
              <strong>FilterPhone (פילטר פון)</strong> היא <strong>אפליקציית סינון</strong> לטלפונים
              אנדרואיד שפיתחנו בעצמנו. הרעיון פשוט: רוב מערכות <strong>סינון הטלפונים</strong> סוגרות כמעט
              הכול, והטלפון החכם הופך ל״טיפש״. FilterPhone משאירה את הטלפון פתוח — אפליקציות, חנות,
              כרום ווואטסאפ — ומסננת את מה שעובר בו. זו הדרך לקבל <strong>טלפון כשר עם אינטרנט</strong>,
              בלי לוותר על השימוש היומיומי.
            </p>
          </div>

          <details className="group mt-6">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-[0.9375rem] font-bold text-primary [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">להמשיך לקרוא על סינון לטלפון</span>
              <span className="hidden group-open:inline">לסגור</span>
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>

            <div className="prose-fp mt-6">
              <h3>סינון תמונות וסינון אינטרנט</h3>
              <p>
                בלב המערכת יש שני דברים נפרדים. הראשון הוא <strong>סינון תמונות</strong> חכם: כל תמונה נבדקת
                בשרת לפני שהיא מוצגת, בשלוש רמות — מחמיר, בינוני ובסיסי. השני הוא{" "}
                <Link to="/internet-filtering">סינון האינטרנט</Link>: כמה מהרשת פתוח בכלל, מ״חיוני בלבד״ ועד
                ״פתוח עם סינון״. יחד הם נותנים <strong>סינון אינטרנט כשר</strong> שמתאים לכל בית ולכל אדם,
                ונקבע לכל לקוח בנפרד.
              </p>

              <h3>סינון וואטסאפ, חנות ואפליקציות</h3>
              <p>
                <strong>סינון וואטסאפ</strong> חוסם תמונות פרופיל, סטטוסים וערוצים, ואפשר לחסום גם מדיה —
                ההודעות והשיחות ממשיכות לעבוד, והקישורים נפתחים בכרום המסונן. חנות Google Play נשארת, אבל
                מותקנות בה רק אפליקציות מאושרות, ויש מסלולים מוכנים כמו ״כשר בלי אינטרנט״ ו״ניווט בלבד״.
              </p>

              <h3>סינון לסמסונג, לשיאומי ולכל סמארטפון אנדרואיד</h3>
              <p>
                FilterPhone עובדת על אנדרואיד 8 ומעלה:{" "}
                <Link to="/samsung-filtering">סינון לסמסונג גלקסי</Link>,{" "}
                <Link to="/xiaomi-filtering">סינון לשיאומי, רדמי ופוקו</Link>, OnePlus, OPPO, פיקסל ועוד. ההתקנה
                נעשית מהטלפון עצמו, וברוב הטלפונים בלי איפוס ובלי מחיקת חשבונות. את כל הצעדים לפי יצרן אפשר
                לראות ב<Link to="/install">מדריך ההתקנה</Link>, את הפירוט על מנוע התמונות
                ב<Link to="/filterphone">עמוד סינון התמונות</Link>, ואת ההסבר על{" "}
                <Link to="/kosher-phone">סמארטפון כשר עם אינטרנט</Link> בעמוד משלו.
              </p>

              <h2>סינון טלפונים באשדוד – מה כדאי לדעת לפני שמחליטים</h2>
              <p>
                <strong>FilterPhone (פילטר פון)</strong> היא מעבדה באשדוד שעוסקת ב<strong>סינון טלפונים</strong>,
                חסימת תוכן ו<strong>צריבת גרסאות כשרות</strong>. אנחנו משווקים מורשים של מערכות הסינון
                המובילות בישראל – <strong>הדרן (Hadran)</strong>, <strong>עסקן (Askan)</strong> ו<strong>כושר פליי
                (Kosher Play)</strong> – ולצידן מספקים סינון בסיסי עצמאי וצריבת גרסאות למכשירי שיאומי Qin.
              </p>

              <h3>איזה מכשירים אנחנו מסננים</h3>
              <p>
                אנחנו עובדים על <strong>סינון אייפון (iPhone)</strong> בכל הדגמים, <strong>סינון סמסונג גלקסי
                (Galaxy S, Galaxy A, Note)</strong>, <strong>סינון שיאומי (Xiaomi)</strong> כולל מכשירי Qin
                F21 Pro ו-Qin F25, וכן וואווי, אופו, ואן פלוס וכל מכשיר אנדרואיד אחר. מעבר לטלפונים אנחנו
                מסננים גם <strong>טאבלטים</strong> (אייפד וטאבלטים אנדרואיד) ו<strong>מחשבים</strong>.
              </p>

              <h3>כמה עולה סינון טלפון</h3>
              <p>
                <strong>סינון בסיסי</strong> עולה 100₪ ומותקן תוך כחמש דקות, בלי למחוק שום דבר מהמכשיר.
                <strong> כושר פליי</strong> עולה 70₪ וכולל חנות אפליקציות כשרה, וואטסאפ מסונן וצריבת MDM.
                <strong> הדרן</strong> ו<strong>עסקן</strong> עולים 300₪ כל אחד וכוללים צריבה עמוקה של גרסת
                מערכת – הפתרונות החזקים ביותר, שדורשים מכשיר מאופס וגיבוי מראש.
                <strong> צריבת גרסה למכשירי Qin</strong> עולה 70₪. את הפירוט המלא אפשר לראות
                ב<Link to="/pricing">מחירון</Link>, ואת ההבדלים בין המערכות ב<Link to="/compare">עמוד ההשוואה</Link>.
              </p>

              <h3>איך בוחרים את רמת הסינון הנכונה</h3>
              <p>
                לילדים ולנוער אנחנו ממליצים על פתרון שלא ניתן להסרה, כדי שהסינון לא ייעלם באיפוס יצרן.
                לאנשי עסקים שצריכים שהמכשיר ימשיך לתפקד – עסקן נבנה בדיוק בשביל זה. מי שרוצה חסימה
                ממוקדת בלי לשנות את אופן השימוש במכשיר, יסתדר מצוין עם סינון בסיסי. אם אתם מתלבטים,
                <Link to="/#advisor"> יועץ הסינון שלנו</Link> ידרג את כל האפשרויות לפי התשובות שלכם.
              </p>

              <h3>סינון יוטיוב</h3>
              <p>
                בנוסף לשירותי הסינון פיתחנו את <Link to="/filtertube">FilterTube – יוטיוב מסונן וכשר</Link>:
                אפליקציית אנדרואיד עם שלוש רמות סינון, מנעול הורים, מצב שמע בלבד ונגינה ברקע, בלי פרסומות.
              </p>

              <p>
                המעבדה שלנו נמצאת ב{SITE.street}, {SITE.neighbourhood}, ואנחנו משרתים גם את אשקלון, יבנה,
                גדרה, קרית מלאכי והסביבה. לתיאום: <a href={`tel:${SITE.phoneRaw}`}>{SITE.phone}</a>.
              </p>
            </div>
          </details>
        </div>
      </section>
    </>
  );
};

export default Index;
