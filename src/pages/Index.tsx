import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, CalendarCheck, Clock3, Cpu, Download, Lock, MessageCircle,
  Phone, Play, ShieldCheck, Smartphone, Star, Wrench, Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import TrustStrip from "@/components/TrustStrip";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import FilterAdvisor from "@/components/FilterAdvisor";
import { useServices, fallbackServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SITE, waLink } from "@/lib/site";

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
    name: "FilterPhone – סינון טלפונים מקצועי באשדוד",
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#business` },
    inLanguage: "he-IL",
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE.url}/hero.jpg` },
    description:
      "מעבדה מקצועית לסינון טלפונים באשדוד. משווק מורשה של הדרן, עסקן וכושר פליי, וצריבת גרסאות כשרות למכשירי שיאומי Qin.",
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
        title="סינון טלפונים באשדוד מ-100₪ | הדרן, עסקן, כושר פליי – FilterPhone"
        description="סינון טלפונים מקצועי באשדוד לכל מכשיר – אייפון, גלקסי, שיאומי, אנדרואיד, טאבלט ומחשב. משווק מורשה הדרן, עסקן וכושר פליי. סינון בסיסי 100₪, כושר פליי 70₪, הדרן ועסקן 300₪. התקנה ביום הפנייה."
        path="/"
        keywords="סינון טלפון, סינון טלפון אשדוד, סינון אייפון, סינון גלקסי, סינון אנדרואיד, התקנת הדרן, עסקן, כושר פליי, צריבת גרסה שיאומי Qin, פילטר פון"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webPageJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceListJsonLd)}</script>
      </Helmet>

      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden band-ink" aria-label="סינון טלפונים באשדוד">
        <div className="pointer-events-none absolute inset-0 texture-traces opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent"
          aria-hidden="true"
        />

        <div className="container-custom relative grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[0.8125rem] font-semibold text-white/80">
              <ShieldCheck className="h-4 w-4 text-white/60" />
              משווק מורשה · הדרן · עסקן · כושר פליי
            </span>

            <h1 className="mt-6 text-display-xl text-white">
              {heroTitle}
              <span className="mt-2 block text-white/55">{heroSubtitle}</span>
            </h1>

            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-white/65">{heroDesc}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href={`tel:${SITE.phoneRaw}`}>
                <Button size="lg" variant="inverse" className="gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="num">{SITE.phone}</span>
                </Button>
              </a>
              <a href={waLink("שלום פילטר פון, אשמח לקבל פרטים על סינון", wa)} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline-inverse" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  שליחת הודעה בוואטסאפ
                </Button>
              </a>
              <a href="#advisor" className="text-sm font-semibold text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline">
                או תנו ליועץ להתאים לכם ←
              </a>
            </div>

            {/* Proof line */}
            <dl className="mt-11 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-7">
              {[
                { value: "500+", label: "מכשירים סוננו" },
                { value: "5 דק׳", label: "סינון בסיסי מוכן" },
                { value: "6", label: "פתרונות סינון" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="num block text-2xl font-extrabold text-white md:text-[1.75rem]">{stat.value}</span>
                    <span className="mt-1 block text-[0.8125rem] leading-snug text-white/45">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Price card — the question everyone actually arrives with */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
            aria-label="מחירון מקוצר"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-float">
              <div className="flex items-baseline justify-between border-b border-border px-6 py-4">
                <h2 className="text-lg font-display font-bold text-ink">כמה זה עולה</h2>
                <span className="text-xs font-medium text-muted-foreground">מחיר כולל התקנה</span>
              </div>
              <ul className="divide-y divide-border">
                {allServices.slice(0, 5).map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/services/${s.slug}`}
                      className="group flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-surface-sunken"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[0.9375rem] font-semibold text-ink group-hover:text-primary">
                          {s.name}
                        </span>
                        {s.slug === "askan" && (
                          <span className="mt-0.5 flex items-center gap-1 text-[0.75rem] font-semibold text-accent">
                            <Star className="h-3 w-3 fill-current" />
                            ההמלצה שלנו כיום
                          </span>
                        )}
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
            </div>

            {/* Second product, surfaced without asking anyone to scroll for it */}
            <Link
              to="/filtertube"
              className="group mt-3 flex items-center gap-3.5 rounded-xl border border-white/15 bg-white/[0.06] p-4 transition-colors hover:border-white/30 hover:bg-white/[0.1]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-white">
                <Youtube className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-bold text-white">
                  ויש לנו גם יוטיוב מסונן – FilterTube
                </span>
                <span className="block text-[0.8125rem] leading-snug text-white/55">
                  אפליקציה חינמית לאנדרואיד · 3 רמות סינון ומנעול הורים
                </span>
              </span>
              <ArrowLeft className="h-4 w-4 shrink-0 text-white/50 transition-transform group-hover:-translate-x-1 group-hover:text-white" />
            </Link>
          </motion.aside>
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
                  {service.slug === "askan" && (
                    <span className="absolute left-6 top-6 rounded-sm bg-accent px-2.5 py-1 text-[0.6875rem] font-bold text-accent-foreground">
                      ההמלצה שלנו
                    </span>
                  )}
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

      <Reviews />
      <FAQ />

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
