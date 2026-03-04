import { useParams, Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { useServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: services, isLoading } = useServices();
  const { data: settings } = useSiteSettings();
  const service = services?.find((s) => s.slug === slug);

  const waLink = settings?.whatsapp_link || "https://wa.me/972527186881";
  const bitLink = settings?.bit_link || "https://bitpay.co.il/app/me/0527186881";
  const phoneRaw = settings?.phone_raw || "0527186881";
  const phone = settings?.phone || "052-718-6881";

  if (isLoading) {
    return (
      <div className="section-padding container-custom text-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="section-padding container-custom text-center">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-4">שירות לא נמצא</h1>
        <Link to="/services" className="text-primary hover:underline">חזרה לשירותים</Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${service.name} – ${service.price} | FilterSmart פילטר סמארט אשדוד`}
        description={service.short_desc || ""}
        path={`/services/${service.slug}`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            description: service.short_desc,
            provider: {
              "@type": "LocalBusiness",
              name: "FilterSmart – פילטר סמארט",
              url: "https://smartfilter.co.il",
            },
            offers: {
              "@type": "Offer",
              price: service.price.replace("₪", ""),
              priceCurrency: "ILS",
            },
          }),
        }}
      />

      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <Link to="/services" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary text-sm mb-6 transition-colors">
            <ArrowRight className="w-4 h-4" />
            חזרה לכל השירותים
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              {service.logo_url && (
                <img src={service.logo_url} alt={`${service.name} לוגו`} className="w-14 h-14 rounded-xl object-contain bg-muted p-2" />
              )}
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{service.name}</h1>
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
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
