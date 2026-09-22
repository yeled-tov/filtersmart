import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft, CheckCircle2, Clock3, HardDriveDownload, Lock, MessageCircle, Phone, Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import AnimatedSection from "@/components/AnimatedSection";
import { useServices, fallbackServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SOLUTIONS } from "@/lib/advisor";
import { SITE, waLink } from "@/lib/site";

const seoH1Map: Record<string, string> = {
  hadran: "התקנת הדרן באשדוד",
  askan: "התקנת עסקן באשדוד",
  "kosher-play": "התקנת כושר פליי באשדוד",
  "basic-filtering": "סינון בסיסי לאייפון ולאנדרואיד באשדוד",
  "qin-f21-pro": "צריבת גרסה Qin F21 Pro באשדוד",
  "qin-f25": "צריבת גרסה Qin F25 באשדוד",
};

const seoDescMap: Record<string, string> = {
  hadran: "התקנת הדרן באשדוד ב-300₪ – ההגנה ההרמטית ביותר בשוק. גרסת מערכת שלמה שאינה ניתנת להסרה, גם לא באיפוס יצרן. משווק מורשה FilterPhone.",
  askan: "התקנת עסקן באשדוד ב-300₪ – סינון AI חכם עם צריבה עמוקה, שנבנה כדי שהמכשיר ימשיך לתפקד לעבודה. משווק מורשה FilterPhone.",
  "kosher-play": "התקנת כושר פליי באשדוד ב-70₪ – חנות אפליקציות כשרה, וואטסאפ מסונן וצריבת MDM. התקנה תוך כ-30 דקות, בלי למחוק נתונים.",
  "basic-filtering": "סינון בסיסי לאייפון ולאנדרואיד באשדוד ב-100₪ – התקנה תוך חמש דקות, בלי למחוק נתונים ובלי להאט את המכשיר.",
  "qin-f21-pro": "צריבת גרסה כשרה ל-Qin F21 Pro באשדוד ב-70₪ – סינון מובנה וממשק מותאם. ביצוע תוך 30–60 דקות.",
  "qin-f25": "צריבת גרסה כשרה ל-Qin F25 באשדוד ב-70₪ – סינון מובנה וממשק מותאם. ביצוע תוך 30–60 דקות.",
};

const seoKeywordsMap: Record<string, string> = {
  hadran: "הדרן אשדוד, התקנת הדרן, מחיר הדרן, סינון הדרן",
  askan: "עסקן אשדוד, התקנת עסקן, מחיר עסקן, סינון עסקן",
  "kosher-play": "כושר פליי אשדוד, כושר פליי התקנה, מחיר כושר פליי, חנות אפליקציות כשרה",
  "basic-filtering": "סינון בסיסי אשדוד, סינון טלפון זול, חסימת אינטרנט אייפון, סינון אנדרואיד",
  "qin-f21-pro": "צריבת גרסה Qin F21 Pro, שיאומי קין, צריבת גרסה כשרה",
  "qin-f25": "צריבת גרסה Qin F25, שיאומי קין, צריבת גרסה כשרה",
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: services } = useServices();
  const { data: settings } = useSiteSettings();

  const allServices = services && services.length > 0 ? services : fallbackServices;
  const service = allServices.find((s) => s.slug === slug);

  const wa = settings?.whatsapp_link || SITE.whatsapp;
  const bitLink = settings?.bit_link || SITE.bit;

  if (!service) {
    return (
      <div className="container-custom section-padding text-center">
        {/* Served at 200, so it has to say noindex itself or Google files it
            as a soft 404 under the service's URL. */}
        <SEOHead
          title="השירות לא נמצא | FilterPhone"
          description="השירות המבוקש אינו קיים. אפשר לעבור לרשימת השירותים המלאה."
          path={`/services/${slug ?? ""}`}
          noindex
        />
        <h1 className="text-display-sm">השירות לא נמצא</h1>
        <p className="mt-4 text-ink-soft">ייתכן שהכתובת השתנתה. אפשר לחזור לרשימת השירותים המלאה.</p>
        <Link to="/services" className="mt-6 inline-block">
          <Button>לכל השירותים</Button>
        </Link>
      </div>
    );
  }

  const h1Text = seoH1Map[service.slug] || service.name;
  const seoDesc = seoDescMap[service.slug] || service.short_desc || "";
  const profile = SOLUTIONS[service.slug];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: h1Text,
    alternateName: service.name,
    description: seoDesc,
    serviceType: service.category === "flashing" ? "צריבת גרסה כשרה" : "סינון טלפון",
    provider: { "@id": `${SITE.url}/#business` },
    areaServed: { "@type": "City", name: "אשדוד" },
    url: `${SITE.url}/services/${service.slug}`,
    offers: {
      "@type": "Offer",
      price: service.price.replace(/[^\d]/g, ""),
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/services/${service.slug}`,
    },
  };

  const waMessage = `שלום פילטר פון, אשמח לתאם ${service.name} (${service.price}).`;

  return (
    <>
      <SEOHead
        title={`${h1Text} – ${service.price} | FilterPhone`}
        description={seoDesc}
        path={`/services/${service.slug}`}
        keywords={seoKeywordsMap[service.slug]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceJsonLd)}</script>
      </Helmet>

      <Breadcrumbs items={[{ label: "שירותים", path: "/services" }, { label: h1Text }]} />

      <article className="section-padding">
        <div className="container-custom grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Main column */}
          <div className="lg:col-span-7">
            <AnimatedSection>
              <div className="flex items-center gap-4">
                {service.logo_url && (
                  <img
                    src={service.logo_url}
                    alt={`הלוגו של ${service.name}`}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-lg border border-border object-contain p-2"
                  />
                )}
                <h1 className="text-display-lg">{h1Text}</h1>
              </div>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-soft">
                {service.description || service.short_desc}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.08}>
              <div className="mt-9 rounded-lg border border-border bg-surface p-6 md:p-7">
                <h2 className="text-display-sm">מה כלול בשירות</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                      <CheckCircle2 className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <ServiceFAQ slug={service.slug} />
            </AnimatedSection>

            <AnimatedSection delay={0.16}>
              <nav className="mt-12 border-t border-border pt-8" aria-label="שירותים נוספים">
                <h2 className="text-lg font-bold text-ink">שירותים נוספים שלנו</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {allServices
                    .filter((s) => s.slug !== service.slug)
                    .map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        className="rounded-sm border border-border bg-surface px-3.5 py-2 text-sm text-ink-soft transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {s.name} · <span className="num font-semibold">{s.price}</span>
                      </Link>
                    ))}
                </div>
                <Link to="/compare" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary link-underline">
                  להשוואה מלאה בין כל המערכות
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </nav>
            </AnimatedSection>
          </div>

          {/* Sticky order panel */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <AnimatedSection delay={0.06}>
                <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
                  <div className="border-b border-border px-6 py-5">
                    <span className="text-[0.8125rem] font-medium text-muted-foreground">מחיר כולל התקנה</span>
                    <p className="num mt-1 text-4xl font-extrabold text-primary">{service.price}</p>
                  </div>

                  {profile && (
                    <dl className="divide-y divide-border">
                      <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                        <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock3 className="h-4 w-4" />
                          זמן התקנה
                        </dt>
                        <dd className="text-sm font-semibold text-ink">{profile.installTime}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                        <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                          <HardDriveDownload className="h-4 w-4" />
                          נתונים במכשיר
                        </dt>
                        <dd className="text-sm font-semibold text-ink">
                          {profile.wipesDevice ? "נדרש גיבוי – המכשיר מאופס" : "נשמרים כפי שהם"}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                        <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                          {profile.removable ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          הסרה
                        </dt>
                        <dd className="text-sm font-semibold text-ink">
                          {profile.removable ? "ניתן לשינוי ולהסרה" : "נעול בפני הסרה"}
                        </dd>
                      </div>
                    </dl>
                  )}

                  <div className="space-y-2.5 border-t border-border bg-surface-sunken p-6">
                    <a href={waLink(waMessage, wa)} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="whatsapp" className="w-full gap-2">
                        <MessageCircle className="h-4 w-4" />
                        תיאום בוואטסאפ
                      </Button>
                    </a>
                    <a href={`tel:${SITE.phoneRaw}`} className="block">
                      <Button variant="outline" className="w-full gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="num">{SITE.phone}</span>
                      </Button>
                    </a>
                    <a href={bitLink} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="ghost" className="w-full">תשלום ב-BIT</Button>
                    </a>
                    <p className="pt-1 text-center text-xs text-muted-foreground">
                      {SITE.street}, {SITE.neighbourhood} · בתיאום מראש
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
};

export default ServiceDetail;
