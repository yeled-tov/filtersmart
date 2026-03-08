import { useParams, Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFAQ from "@/components/ServiceFAQ";
import { useServices, fallbackServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const seoH1Map: Record<string, string> = {
  hadran: "התקנת הדרן באשדוד",
  askan: "עסקן התקנה באשדוד",
  "kosher-play": "כושר פליי התקנה באשדוד",
  "basic-filtering": "סינון בסיסי לאייפון ואנדרואיד באשדוד",
  "qin-f21-pro": "צריבת גרסה Qin F21 Pro באשדוד",
  "qin-f25": "צריבת גרסה Qin F25 באשדוד",
};

const seoDescMap: Record<string, string> = {
  hadran: "התקנת הדרן באשדוד ב-300₪ – ההגנה ההרמטית ביותר בשוק. גרסת מערכת שלמה שלא ניתנת להסרה. משווק מורשה FilterSmart ☎ 052-718-6881",
  askan: "התקנת עסקן באשדוד ב-300₪ – סינון AI חכם עם צריבה עמוקה. מיועד לאנשי עסקים. שירות מקצועי FilterSmart ☎ 052-718-6881",
  "kosher-play": "התקנת כושר פליי באשדוד ב-70₪ – חנות אפליקציות כשרה, צריבת MDM, וואטסאפ מסונן. FilterSmart ☎ 052-718-6881",
  "basic-filtering": "סינון בסיסי לאייפון ואנדרואיד באשדוד ב-20₪ בלבד – התקנה תוך 5 דקות, לא מאט את הטלפון. FilterSmart ☎ 052-718-6881",
  "qin-f21-pro": "צריבת גרסה כשרה ל-Qin F21 Pro באשדוד ב-70₪ – סינון מובנה וממשק מותאם. FilterSmart ☎ 052-718-6881",
  "qin-f25": "צריבת גרסה כשרה ל-Qin F25 באשדוד ב-70₪ – אופטימיזציה מלאה וסינון מובנה. FilterSmart ☎ 052-718-6881",
};

const seoKeywordsMap: Record<string, string> = {
  hadran: "הדרן אשדוד, התקנת הדרן, מחיר הדרן, סינון הדרן, הדרן טלפון",
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

  const waLink = settings?.whatsapp_link || "https://wa.me/972527186881";
  const bitLink = settings?.bit_link || "https://bitpay.co.il/app/me/0527186881";
  const phoneRaw = settings?.phone_raw || "0527186881";
  const phone = settings?.phone || "052-718-6881";

  if (!service) {
    return (
      <div className="section-padding container-custom text-center">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-4">שירות לא נמצא</h1>
        <Link to="/services" className="text-primary hover:underline">חזרה לשירותים</Link>
      </div>
    );
  }

  const h1Text = seoH1Map[service.slug] || service.name;
  const seoDesc = seoDescMap[service.slug] || service.short_desc || "";
  const seoKeywords = seoKeywordsMap[service.slug] || "";

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: h1Text,
    description: seoDesc,
    provider: {
      "@type": "LocalBusiness",
      name: "FilterSmart – פילטר סמארט",
      url: "https://smartfilter.co.il",
      telephone: "+972-52-718-6881",
      address: {
        "@type": "PostalAddress",
        streetAddress: "חטיבת גבעתי 2, כניסה ו׳",
        addressLocality: "אשדוד",
        addressCountry: "IL",
      },
    },
    areaServed: { "@type": "City", name: "אשדוד" },
    offers: {
      "@type": "Offer",
      price: service.price.replace("₪", ""),
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: "https://smartfilter.co.il/" },
      { "@type": "ListItem", position: 2, name: "שירותים", item: "https://smartfilter.co.il/services" },
      { "@type": "ListItem", position: 3, name: h1Text, item: `https://smartfilter.co.il/services/${service.slug}` },
    ],
  };

  return (
    <>
      <SEOHead
        title={`${h1Text} – ${service.price} | FilterSmart פילטר סמארט`}
        description={seoDesc}
        path={`/services/${service.slug}`}
        keywords={seoKeywords}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <Breadcrumbs
        items={[
          { label: "שירותים", path: "/services" },
          { label: h1Text },
        ]}
      />

      <article className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              {service.logo_url && (
                <img src={service.logo_url} alt={`${service.name} לוגו`} className="w-14 h-14 rounded-xl object-contain bg-muted p-2" loading="lazy" />
              )}
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{h1Text}</h1>
            </div>
            <span className="text-3xl font-bold gradient-text">{service.price}</span>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{service.description}</p>

          <div className="bg-card rounded-xl p-6 card-shadow mb-8">
            <h2 className="text-xl font-heading font-semibold text-card-foreground mb-4">מה כולל השירות</h2>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-card-foreground">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0">
                הזמן דרך WhatsApp
              </Button>
            </a>
            <a href={bitLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">שלם ב-BIT</Button>
            </a>
            <a href={`tel:${phoneRaw}`}>
              <Button size="lg" variant="outline">{phone}</Button>
            </a>
          </div>

          <ServiceFAQ slug={service.slug} />

          {/* Internal linking for SEO */}
          <nav className="mt-12 pt-8 border-t border-border" aria-label="שירותים נוספים">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-4">שירותים נוספים שלנו באשדוד</h2>
            <div className="flex flex-wrap gap-3">
              {allServices.filter((s) => s.slug !== service.slug).map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="text-sm px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  {s.name} – {s.price}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </article>
    </>
  );
};

export default ServiceDetail;