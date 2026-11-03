import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, CalendarCheck, Check, Clock3, Cpu, Download, ListChecks, Lock,
  MessageCircle, Phone, Play, Search, ShieldCheck, Smartphone, Sparkles, Star, Wrench, X, Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import TrustStrip from "@/components/TrustStrip";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import { SERVICE_FAQS, faqJsonLd } from "@/lib/faq";
import FilterAdvisor from "@/components/FilterAdvisor";
import PhoneFrame from "@/components/PhoneFrame";
import { useServices, fallbackServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SITE, waLink } from "@/lib/site";
import {
  COMPARISON, FEATURE_GROUPS, FILTERPHONE, FILTER_LEVELS, HOME_FAQ, IMAGE_EXTRAS,
  INSTALL_METHODS, INSTALL_STEPS, SUPPORTED_MAKERS, WEB_EXTRAS, WEB_LEVELS,
} from "@/lib/filterphoneApp";

const valueProps = [
  {
    icon: BadgeCheck,
    title: "משווק מורשה, לא מתווך",
    body: "אנחנו מורשים רשמית להתקין הדרן, עסקן וכושר פליי. הצריבה נעשית כאן, במעבדה, ולא נשלחת לאף אחד אחר.",
  },
  {
    icon: Smartphone,
    title: "כל מכשיר, כל פלטפורמה",
    body: "אייפון, סמסונג גלקסי, שיאומי, וואווי וכל אנדרואיד. גם טאבלטים, מחשבים ומכשירי Qin כשרים.",
  },
  {
    icon: Clock3,
    title: "התקנה ביום הפנייה",
    body: "סינון בסיסי מוכן תוך חמש דקות. צריבה מלאה של הדרן או עסקן – בין 45 ל-90 דקות, בתיאום מראש.",
  },
  {
    icon: Wrench,
    title: "מלווים גם אחרי ההתקנה",
    body: "רוצים לשנות רמת סינון, לפתוח אפליקציה או להבין איך משהו עובד? מרימים טלפון ופותרים.",
  },
];

const processSteps = [
  {
    title: "מאבחנים את הצורך",
    body: "בטלפון, בוואטסאפ או דרך יועץ הסינון באתר – מבינים למי המכשיר, מה חייב להישאר פתוח ומה חייב להיחסם.",
  },
  {
    title: "בוחרים את המערכת",
    body: "מסבירים בשקיפות מה כל פתרון עושה, כמה הוא עולה, כמה זמן ההתקנה לוקחת ומה קורה לתוכן שבמכשיר.",
  },
  {
    title: "מתקינים ומוסרים",
    body: "מבצעים את ההתקנה או הצריבה במעבדה שלנו באשדוד, בודקים איתכם שהכול עובד ומסבירים איך להמשיך מכאן.",
  },
];

const Index = () => {
  const { data: services } = useServices();
  const { data: settings } = useSiteSettings();

  const wa = settings?.whatsapp_link || SITE.whatsapp;
  const bitLink = settings?.bit_link || SITE.bit;
  // These admin-edited fields used to be the hero. FilterPhone has the hero now, so they
  // introduce the "additional services" section instead — same words, lower down.
  const heroTitle = settings?.hero_title || "סינון טלפונים מקצועי";
  const heroSubtitle = settings?.hero_subtitle || "וצריבת גרסאות, באשדוד";
  const heroDesc =
    settings?.hero_description ||
    "משווק מורשה של הדרן, עסקן וכושר פליי. מתקינים סינון לאייפון, לגלקסי, לכל אנדרואיד, לטאבלט ולמחשב – וצורבים גרסאות כשרות למכשירי שיאומי Qin.";

  const allServices = services && services.length > 0 ? services : fallbackServices;
  const filteringServices = allServices.filter((s) => s.category === "filtering");
  const flashingServices = allServices.filter((s) => s.category === "flashing");

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
    featureList: FEATURE_GROUPS.flatMap((g) => g.features.map((f) => f.title)),
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

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "איך מזמינים סינון טלפון ב-FilterPhone אשדוד",
    description: "שלושה שלבים מפנייה ראשונה ועד מכשיר מסונן ומוכן לשימוש.",
    totalTime: "PT1H",
    estimatedCost: { "@type": "MonetaryAmount", currency: "ILS", value: "100" },
    step: processSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
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
        title="סינון לטלפון אנדרואיד | FilterPhone פילטר פון — סינון חכם"
        description="סינון לטלפון אנדרואיד שלא חונק אותו: סינון תמונות חכם בזמן אמת, 4 רמות גלישה, וואטסאפ מסונן וניהול מלא. התקנה אוטומטית בלי איפוס ברוב הטלפונים."
        path="/"
        keywords="סינון טלפונים, סינון לטלפון, סינון לאנדרואיד, סינון תמונות, סינון אינטרנט כשר, טלפון כשר עם אינטרנט, אפליקציית סינון, סינון וואטסאפ, סינון לשיאומי, סינון לסמסונג, פילטר פון, FilterPhone"
        image={`${SITE.url}/og-home.jpg`}
        imageAlt="FilterPhone – הטלפון נשאר חכם, התוכן נשאר נקי"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webPageJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(softwareJsonLd)}</script>
        {/* One FAQPage for the whole page: both question lists render with emitSchema off. */}
        <script type="application/ld+json">{JSON.stringify(faqJsonLd([...HOME_FAQ, ...SERVICE_FAQS]))}</script>
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceListJsonLd)}</script>
      </Helmet>

      {/* ---------------------------------------------------------- Hero */}
      <section id="download" className="relative overflow-hidden band-ink" aria-label="FilterPhone – סינון לטלפון אנדרואיד">
        <div className="pointer-events-none absolute inset-0 texture-traces opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent"
          aria-hidden="true"
        />

        <div className="container-custom relative grid gap-12 py-14 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-10">
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

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a href={FILTERPHONE.apk} rel="noopener" className="sm:w-auto">
                <Button size="lg" variant="inverse" className="w-full gap-2 sm:w-auto">
                  <Download className="h-4 w-4" />
                  הורדת האפליקציה
                </Button>
              </a>
              <Link to="/install" className="sm:w-auto">
                <Button size="lg" variant="outline-inverse" className="w-full gap-2 sm:w-auto">
                  <ListChecks className="h-4 w-4" />
                  מדריך התקנה
                </Button>
              </Link>
              <a href={waLink("שלום, אשמח לפרטים על הסינון של FilterPhone", wa)} target="_blank" rel="noopener noreferrer" className="sm:w-auto">
                <Button size="lg" variant="outline-inverse" className="w-full gap-2 sm:w-auto">
                  <MessageCircle className="h-4 w-4" />
                  דברו איתנו בוואטסאפ
                </Button>
              </a>
            </div>

            <p className="mt-4 text-[0.8125rem] leading-relaxed text-white/55">
              האפליקציה מותקנת מחוץ לחנות — זה תקין.{" "}
              <Link to="/install" className="font-semibold text-white/80 underline underline-offset-4 hover:text-white">
                מדריך התקנה צעד-צעד
              </Link>
              {" · "}
              טלפון ישן?{" "}
              <a href={FILTERPHONE.apkUniversal} rel="noopener" className="font-semibold text-white/80 underline underline-offset-4 hover:text-white">
                גרסה לכל סוגי המעבדים
              </a>
            </p>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-7">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end justify-center gap-5 lg:col-span-5"
          >
            <PhoneFrame
              shot="levels"
              alt="בחירת רמת סינון התמונות באפליקציית FilterPhone"
              className="hidden max-w-[12rem] translate-y-8 sm:block"
              sizes="192px"
            />
            <PhoneFrame
              shot="welcome"
              alt="מסך הפתיחה של אפליקציית FilterPhone – סינון אינטרנט ותמונות לכל הטלפון"
              className="max-w-[14rem]"
              priority
              sizes="224px"
            />
          </motion.div>
        </div>
      </section>

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

      {/* --------------------------------------------------- Image levels */}
      <section id="image-filtering" className="section-padding border-t border-border bg-surface-sunken" aria-label="שלוש רמות סינון תמונות">
        <div className="container-custom grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
          <div className="lg:col-span-8">
            <SectionHeading
              eyebrow="סינון תמונות"
              title="שלוש רמות סינון תמונות"
              lead="סינון התמונות פועל בכל אתר בכרום ובאפליקציות שאפשר לסנן. כל תמונה נבדקת בשרת לפני שהיא מוצגת — ואתם בוחרים כמה מחמיר."
            />

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {FILTER_LEVELS.map((lvl, i) => (
                <AnimatedSection key={lvl.level} delay={i * 0.06}>
                  <div className="panel h-full p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-tint text-primary">
                        <lvl.icon className="h-[1.125rem] w-[1.125rem]" />
                      </span>
                      {lvl.isDefault ? (
                        <span className="rounded-sm bg-accent-tint px-2 py-0.5 text-[0.6875rem] font-bold text-accent">
                          ברירת מחדל
                        </span>
                      ) : (
                        <span className="num text-[0.75rem] font-bold text-muted-foreground">רמה {lvl.level}</span>
                      )}
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-ink">{lvl.name}</h3>
                    <p className="mt-1 text-[0.875rem] font-semibold text-primary">{lvl.short}</p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{lvl.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.18} className="mt-4">
              <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
                {IMAGE_EXTRAS.map((x) => (
                  <div key={x.title} className="flex items-start gap-3.5 bg-surface p-5">
                    <x.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span>
                      <span className="block text-[0.9375rem] font-bold text-ink">{x.title}</span>
                      <span className="block text-[0.875rem] text-ink-soft">{x.desc}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[0.8125rem] text-muted-foreground">
                שני המתגים האלה זמינים בנוסף לרמה, למי שרוצה.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.22} className="mt-8">
              <Link to="/filterphone" className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-primary link-underline">
                איך סינון התמונות עובד — הפירוט המלא
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.1} className="hidden justify-center lg:col-span-4 lg:flex">
            <PhoneFrame shot="levels" alt="מסך בחירת רמת הסינון באפליקציית FilterPhone" className="max-w-[14rem]" sizes="224px" />
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------- Browsing levels */}
      <section id="browsing-levels" className="section-padding" aria-label="ארבע רמות גלישה">
        <div className="container-custom">
          <SectionHeading
            eyebrow="רמות גלישה בכרום"
            title="כמה מהאינטרנט פתוח — בוחרים לכל אחד"
            lead="מעל סינון התמונות יש שאלה נוספת: אילו אתרים נפתחים בכלל. ארבע רמות, מהסגורה לפתוחה, ונבחרות לכל לקוח בנפרד."
          />

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WEB_LEVELS.map((lvl, i) => (
              <li key={lvl.name}>
                <AnimatedSection delay={i * 0.06} className="h-full">
                  <div className="panel flex h-full flex-col p-6">
                    {/* How open: one bar per level, filled up to this one */}
                    <div className="flex gap-1" role="img" aria-label={`רמת פתיחות ${i + 1} מתוך ${WEB_LEVELS.length}`}>
                      {WEB_LEVELS.map((_, j) => (
                        <span key={j} className={`h-1.5 flex-1 rounded-full ${j <= i ? "bg-primary" : "bg-border"}`} />
                      ))}
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-ink">{lvl.name}</h3>
                    <p className="mt-1 text-[0.875rem] font-semibold text-primary">{lvl.short}</p>
                    <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">{lvl.desc}</p>
                  </div>
                </AnimatedSection>
              </li>
            ))}
          </ol>

          <AnimatedSection delay={0.2} className="mt-4">
            <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-[0.9375rem] font-bold text-ink">תוספות לכל לקוח</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {WEB_EXTRAS.map((x) => (
                    <li key={x} className="rounded-sm border border-border bg-surface-sunken px-3 py-1 text-[0.8125rem] font-medium text-ink-soft">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="flex max-w-md items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink">
                <Search className="mt-1 h-4 w-4 shrink-0 text-accent" />
                <span>
                  <strong className="font-semibold">מה שלא ברמה — לא מופיע גם בתוצאות החיפוש</strong> בגוגל ובבינג.
                </span>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* -------------------------------------------------------- Features */}
      <section id="features" className="section-padding border-t border-border bg-surface-sunken" aria-label="מה מקבלים עם FilterPhone">
        <div className="container-custom">
          <SectionHeading
            eyebrow="מה מקבלים"
            title="כל מה שיש בסינון, במקום אחד"
            lead="מסינון תמונות ורמות גלישה, דרך וואטסאפ וחנות האפליקציות, ועד ניהול מכשיר מלא שלא מאפשר לעקוף."
          />

          <div className="mt-12 space-y-12">
            {FEATURE_GROUPS.map((group) => (
              <div key={group.title}>
                <AnimatedSection>
                  <h3 className="rule-label mb-5">
                    <span>{group.title}</span>
                  </h3>
                </AnimatedSection>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.features.map((f, i) => (
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Install */}
      <section id="install" className="section-padding" aria-label="התקנה ב-3 צעדים">
        <div className="container-custom">
          <SectionHeading
            eyebrow="התקנה"
            title="מתקינים מהטלפון עצמו, בשלושה צעדים"
            lead="בלי טכנאי ובלי מעבדה. האפליקציה מובילה אתכם, ופותחת לבד כל מסך שצריך בהגדרות."
          />

          <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {INSTALL_STEPS.map((s, i) => (
              <li key={s.title} className="bg-surface p-7">
                <AnimatedSection delay={i * 0.07}>
                  <span className="num block text-[0.8125rem] font-bold tracking-widest text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">{s.desc}</p>
                </AnimatedSection>
              </li>
            ))}
          </ol>

          <AnimatedSection delay={0.1} className="mt-12">
            <h3 className="text-lg font-bold text-ink">שלוש דרכי התקנה — בוחרים באפליקציה</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {INSTALL_METHODS.map((m) => (
                <div key={m.title} className="panel relative h-full p-6">
                  {m.badge && (
                    <span className="absolute left-5 top-5 rounded-sm bg-accent px-2 py-0.5 text-[0.6875rem] font-bold text-accent-foreground">
                      {m.badge}
                    </span>
                  )}
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-tint text-primary">
                    <m.icon className="h-[1.125rem] w-[1.125rem]" />
                  </span>
                  <h4 className="mt-4 text-[0.9375rem] font-bold text-ink">{m.title}</h4>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-soft">{m.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mt-4">
            <div className="rounded-lg bg-primary-tint p-6 md:p-7">
              <h3 className="flex items-center gap-2.5 text-[1.0625rem] font-bold text-ink">
                <ShieldCheck className="h-5 w-5 text-primary" />
                בלי איפוס ובלי מחיקת חשבונות — ברוב הטלפונים
              </h3>
              <p className="mt-3 max-w-3xl text-[0.9375rem] leading-relaxed text-ink">
                אנדרואיד לא מאפשר ניהול מכשיר כשיש חשבונות בטלפון. FilterPhone משביתה את החשבונות{" "}
                <strong className="font-semibold">לכמה שניות בלבד</strong>, מפעילה את הניהול ומחזירה אותם —
                החשבונות לא נמחקים. בשיאומי בלי Root צריך להדליק פעם אחת הגדרה נוספת, והמדריך מסביר איך.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="mt-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                <strong className="font-semibold text-ink">נתמך:</strong> אנדרואיד 8 ומעלה (ההתקנה האוטומטית בלי מחשב — מאנדרואיד 11).
                <span className="block">{SUPPORTED_MAKERS.join(" · ")} ועוד.</span>
              </p>
              <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
                <a href={FILTERPHONE.apk} rel="noopener">
                  <Button className="w-full gap-2 sm:w-auto">
                    <Download className="h-4 w-4" />
                    הורדת האפליקציה
                  </Button>
                </a>
                <Link to="/install">
                  <Button variant="outline" className="w-full gap-2 sm:w-auto">
                    <ListChecks className="h-4 w-4" />
                    למדריך ההתקנה המלא
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ----------------------------------------------------- FilterPhone FAQ */}
      <FAQ
        id="faq"
        items={HOME_FAQ}
        eyebrow="שאלות נפוצות"
        title="מה שואלים על FilterPhone"
        lead="ואם השאלה שלכם לא כאן — כתבו לנו בוואטסאפ, נענה מהר."
        ariaLabel="שאלות נפוצות על FilterPhone"
        emitSchema={false}
      />

      {/* ------------------------------------------- Additional services intro */}
      {/* The previous hero, moved down and set light: same badge, same admin-edited
          title and description, same contact buttons, same price list. */}
      <section id="services" className="border-t border-border" aria-label="שירותים נוספים">
        <div className="container-custom grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
          <AnimatedSection className="lg:col-span-7">
            <span className="eyebrow">שירותים נוספים</span>
            <span className="mt-4 flex w-fit items-center gap-2 rounded-sm border border-border bg-surface-sunken px-3 py-1.5 text-[0.8125rem] font-semibold text-ink-soft">
              <ShieldCheck className="h-4 w-4 text-primary/70" />
              משווק מורשה · הדרן · עסקן · כושר פליי
            </span>

            <h2 className="mt-5 text-display-lg text-ink">
              {heroTitle}
              <span className="mt-2 block text-ink-soft">{heroSubtitle}</span>
            </h2>

            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">{heroDesc}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={`tel:${SITE.phoneRaw}`}>
                <Button size="lg" className="gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="num">{SITE.phone}</span>
                </Button>
              </a>
              <a href={waLink("שלום פילטר פון, אשמח לקבל פרטים על סינון", wa)} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  שליחת הודעה בוואטסאפ
                </Button>
              </a>
              <a href="#advisor" className="text-sm font-semibold text-ink-soft underline-offset-4 transition-colors hover:text-primary hover:underline">
                או תנו ליועץ להתאים לכם ←
              </a>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-7">
              {[
                { value: "500+", label: "מכשירים סוננו" },
                { value: "5 דק׳", label: "סינון בסיסי מוכן" },
                { value: "6", label: "פתרונות סינון" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="num block text-2xl font-extrabold text-ink md:text-[1.75rem]">{stat.value}</span>
                    <span className="mt-1 block text-[0.8125rem] leading-snug text-muted-foreground">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </AnimatedSection>

          {/* Price card — FilterPhone first and marked as our recommendation, then every installed service */}
          <AnimatedSection delay={0.1} className="lg:col-span-5">
            <aside aria-label="מחירון מקוצר" className="overflow-hidden rounded-xl border border-border bg-surface shadow-float">
              <div className="flex items-baseline justify-between border-b border-border px-6 py-4">
                <h3 className="text-lg font-display font-bold text-ink">כמה זה עולה</h3>
                <span className="text-xs font-medium text-muted-foreground">מחיר כולל התקנה</span>
              </div>
              <ul className="divide-y divide-border">
                <li>
                  <a href="#download" className="group flex items-center justify-between gap-4 bg-primary-tint/40 px-6 py-3.5 transition-colors hover:bg-primary-tint">
                    <span className="min-w-0">
                      <span className="block truncate text-[0.9375rem] font-semibold text-ink group-hover:text-primary">
                        FilterPhone — הסינון שלנו
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-[0.75rem] font-semibold text-accent">
                        <Star className="h-3 w-3 fill-current" />
                        ההמלצה שלנו כיום
                      </span>
                    </span>
                    <span className="shrink-0 text-left">
                      <span className="num block text-lg font-extrabold text-primary">{FILTERPHONE.price.label}</span>
                      <span className="block text-[0.6875rem] font-medium text-muted-foreground">{FILTERPHONE.price.period}</span>
                    </span>
                  </a>
                </li>
                {allServices.slice(0, 5).map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/services/${s.slug}`}
                      className="group flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-surface-sunken"
                    >
                      <span className="block min-w-0 truncate text-[0.9375rem] font-semibold text-ink group-hover:text-primary">
                        {s.name}
                      </span>
                      <span className="num shrink-0 text-lg font-extrabold text-primary">{s.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border bg-surface-sunken px-6 py-4">
                <Link
                  to="/pricing"
                  className="flex items-center justify-between text-sm font-semibold text-primary"
                >
                  למחירון המלא ולמה שכלול בכל פתרון
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </AnimatedSection>
        </div>
      </section>
      <TrustStrip />

      {/* ------------------------------------------------- Why FilterPhone */}
      <section className="section-padding" aria-label="למה לבחור ב-FilterPhone">
        <div className="container-custom">
          <SectionHeading
            eyebrow="למה אנחנו"
            title="סינון זה לא רק להתקין אפליקציה"
            lead="אנחנו עובדים מול כל חברות הסינון המובילות בישראל, ולכן אנחנו לא צריכים לדחוף לכם פתרון אחד. הפתרון שנציע הוא זה שמתאים למכשיר, לגיל ולשימוש שלכם."
          />

          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {valueProps.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.06}>
                <div className="h-full bg-surface p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-tint text-primary">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{v.title}</h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">{v.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Services */}
      <section className="section-padding bg-surface-sunken" aria-label="שירותי סינון טלפונים">
        <div className="container-custom">
          <SectionHeading
            eyebrow="סינון והגנה"
            title="ארבע רמות סינון – מהקל ועד ההרמטי"
            lead="כל פתרון עונה על צורך אחר. בעמוד של כל שירות תמצאו בדיוק מה הוא חוסם, מה נשאר פתוח, כמה זמן ההתקנה לוקחת ומה קורה לתוכן שבמכשיר."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {filteringServices.map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.05}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group relative flex h-full flex-col panel panel-hover p-6"
                >
                  <div className="flex items-start gap-3.5">
                    {service.logo_url ? (
                      <img
                        src={service.logo_url}
                        alt=""
                        width={44}
                        height={44}
                        loading="lazy"
                        className="h-11 w-11 shrink-0 rounded-md border border-border object-contain p-1.5"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
                        <Lock className="h-5 w-5" />
                      </span>
                    )}
                    <h3 className="mt-1 text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                      {service.name}
                    </h3>
                  </div>

                  <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">{service.short_desc}</p>

                  <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                      מה כלול בשירות
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </span>
                    <span className="num text-2xl font-extrabold text-ink">{service.price}</span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          {/* Flashing */}
          <div className="mt-14">
            <AnimatedSection>
              <div className="rule-label mb-6">
                <span className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary/70" />
                  צריבת גרסאות למכשירי שיאומי Qin
                </span>
              </div>
            </AnimatedSection>
            <div className="grid gap-4 md:grid-cols-2">
              {flashingServices.map((service, i) => (
                <AnimatedSection key={service.slug} delay={i * 0.05}>
                  <Link to={`/services/${service.slug}`} className="group flex h-full items-center justify-between gap-4 panel panel-hover p-6">
                    <span className="min-w-0">
                      <span className="block text-lg font-bold text-ink transition-colors group-hover:text-primary">
                        {service.name}
                      </span>
                      <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink-soft">
                        {service.short_desc}
                      </span>
                    </span>
                    <span className="num shrink-0 text-2xl font-extrabold text-ink">{service.price}</span>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <AnimatedSection className="mt-10 text-center">
            <Link to="/compare" className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-primary link-underline">
              לא בטוחים מה ההבדל? להשוואה מלאה בין המערכות
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ------------------------------------------------- Services FAQ */}
      <FAQ className="" emitSchema={false} />

      {/* -------------------------------------------------------- Process */}
      <section className="section-padding bg-surface-sunken" aria-label="איך זה עובד">
        <div className="container-custom">
          <SectionHeading eyebrow="איך זה עובד" title="שלושה שלבים, בלי הפתעות" />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {processSteps.map((s, i) => (
              <li key={s.title} className="bg-surface p-7">
                <AnimatedSection delay={i * 0.07}>
                  <span className="num block text-[0.8125rem] font-bold tracking-widest text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">{s.body}</p>
                </AnimatedSection>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------ FilterTube */}
      <section id="filtertube" className="section-padding" aria-label="FilterTube – יוטיוב ויוטיוב מיוזיק מסוננים">
        <div className="container-custom">
          <SectionHeading
            eyebrow="המוצר שלנו"
            title="ויש לנו גם יוטיוב ומיוזיק מסוננים – FilterTube"
            lead="הרבה לקוחות מסננים את הטלפון ואז נתקעים עם אותה שאלה: מה עושים עם יוטיוב, ומה עם המוזיקה. אז פיתחנו אפליקציה משלנו שפותרת את שניהם."
          />

          <AnimatedSection delay={0.08} className="mt-10">
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <div className="grid lg:grid-cols-12">
                <div className="p-8 md:p-11 lg:col-span-7">
                  <span className="inline-flex items-center gap-2 rounded-sm bg-accent-tint px-3 py-1.5 text-[0.8125rem] font-bold text-accent">
                    <Youtube className="h-4 w-4" />
                    אפליקציה לאנדרואיד · הורדה חינם
                  </span>

                  <h3 className="mt-5 text-display-sm">יוטיוב ומיוזיק, בלי מה שלא רוצים שייכנס הביתה</h3>

                  <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
                    FilterTube היא אפליקציה אחת בעברית ובה שני עולמות: <strong className="font-semibold text-ink">FilterTube</strong>{" "}
                    – יוטיוב מסונן, ו-<strong className="font-semibold text-ink">FilterMusic</strong> – יוטיוב מיוזיק
                    מסונן. כל ערוץ מאושר ידנית על ידי אדם לפני שהוא מוצג, אין תגובות, אין פרסומות
                    ואין אלגוריתם שמושך לאן שלא רוצים. בוחרים רמת סינון, נועלים אותה בקוד הורים –
                    ומשאירים את התוכן שכן מתאים.
                  </p>

                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {[
                      ["שלוש רמות סינון", "מחמיר, רגיל ודתי לייט – נעולות בקוד הורים"],
                      ["יוטיוב מיוזיק מסונן", "מיקס יומי, מיקס לכל זמר ורדיו – בלי פרסומות"],
                      ["מצב ״הכל כאודיו״", "אפשר להפוך את כל האפליקציה לשמע בלבד"],
                      ["אישור ידני של כל ערוץ", "על ידי אדם, לא על ידי בינה מלאכותית"],
                    ].map(([title, desc]) => (
                      <li key={title} className="flex gap-2.5">
                        <BadgeCheck className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-success" />
                        <span>
                          <span className="block text-[0.9375rem] font-semibold text-ink">{title}</span>
                          <span className="block text-[0.8125rem] leading-snug text-muted-foreground">{desc}</span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/filtertube">
                      <Button className="gap-2">
                        <Play className="h-4 w-4" />
                        לעמוד FilterTube ולצילומי מסך
                      </Button>
                    </Link>
                    <a href={SITE.filterTubeApk} rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        הורדת האפליקציה
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="relative flex items-center justify-center gap-4 bg-surface-sunken p-8 lg:col-span-5">
                  <img
                    src="/filtertube/music.jpg"
                    alt="מסך FilterMusic – יוטיוב מיוזיק מסונן"
                    width={200}
                    height={430}
                    loading="lazy"
                    className="hidden h-[300px] w-auto rotate-[-4deg] rounded-xl border-4 border-ink object-cover shadow-card sm:block"
                  />
                  <img
                    src="/filtertube/feed.jpg"
                    alt="מסך הפיד של אפליקציית FilterTube – יוטיוב מסונן"
                    width={240}
                    height={520}
                    loading="lazy"
                    className="h-[340px] w-auto rounded-xl border-4 border-ink object-cover shadow-float sm:h-[380px]"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* -------------------------------------------------------- Advisor */}
      <FilterAdvisor />

      <Reviews />

      {/* ------------------------------------------------------------ CTA */}
      <section className="band-ink relative overflow-hidden" aria-label="יצירת קשר">
        <div className="pointer-events-none absolute inset-0 texture-traces opacity-60" aria-hidden="true" />
        <div className="container-custom relative py-16 text-center md:py-24">
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

      {/* -------------------------------------------------- FilterPhone prose */}
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

            <h3>סינון תמונות ורמות גלישה</h3>
            <p>
              בלב המערכת יש שני דברים נפרדים. הראשון הוא <strong>סינון תמונות</strong> חכם: כל תמונה נבדקת
              בשרת לפני שהיא מוצגת, בשלוש רמות — מחמיר, בינוני ובסיסי. השני הוא <strong>רמת הגלישה</strong>:
              כמה מהאינטרנט פתוח בכלל, מ״חיוני בלבד״ ועד ״פתוח עם סינון״. יחד הם נותנים{" "}
              <strong>סינון אינטרנט כשר</strong> שמתאים לכל בית ולכל אדם, ונקבע לכל לקוח בנפרד.
            </p>

            <h3>סינון וואטסאפ, חנות ואפליקציות</h3>
            <p>
              <strong>סינון וואטסאפ</strong> חוסם תמונות פרופיל, סטטוסים וערוצים, ואפשר לחסום גם מדיה —
              ההודעות והשיחות ממשיכות לעבוד, והקישורים נפתחים בכרום המסונן. חנות Google Play נשארת, אבל
              מותקנות בה רק אפליקציות מאושרות, ויש מסלולים מוכנים כמו ״כשר בלי אינטרנט״ ו״ניווט בלבד״.
            </p>

            <h3>סינון לסמסונג, לשיאומי ולכל אנדרואיד</h3>
            <p>
              FilterPhone עובדת על אנדרואיד 8 ומעלה: <strong>סינון לסמסונג</strong> גלקסי,{" "}
              <strong>סינון לשיאומי</strong>, רדמי ופוקו, OnePlus, OPPO, פיקסל ועוד. ההתקנה נעשית מהטלפון
              עצמו, וברוב הטלפונים בלי איפוס ובלי מחיקת חשבונות. את כל הצעדים לפי יצרן אפשר לראות
              ב<Link to="/install">מדריך ההתקנה</Link>, ואת הפירוט על מנוע התמונות
              ב<Link to="/filterphone">עמוד סינון התמונות</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- SEO copy */}
      <section className="section-padding" aria-label="מידע על סינון טלפונים באשדוד">
        <div className="container-custom max-w-3xl">
          <h2 className="text-display-sm">סינון טלפונים באשדוד – מה כדאי לדעת לפני שמחליטים</h2>
          <div className="prose-fp mt-6">
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
        </div>
      </section>
    </>
  );
};

export default Index;
