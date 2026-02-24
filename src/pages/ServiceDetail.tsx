import { useParams, Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { services } from "@/data/services";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find((s) => s.slug === slug);

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
        title={`${service.name} – ${service.price} | SmartFilter אשדוד`}
        description={service.shortDesc}
        path={`/services/${service.slug}`}
        keywords={service.keywords}
      />

      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <Link to="/services" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary text-sm mb-6 transition-colors">
            <ArrowRight className="w-4 h-4" />
            חזרה לכל השירותים
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{service.name}</h1>
            <span className="text-3xl font-bold gradient-text">{service.price}</span>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{service.longDesc}</p>

          <div className="bg-card rounded-xl p-6 card-shadow mb-8">
            <h2 className="text-xl font-heading font-semibold text-card-foreground mb-4">מה כולל השירות</h2>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-card-foreground">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="https://wa.me/972527186881" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0">
                הזמן דרך WhatsApp
              </Button>
            </a>
            <a href="https://bitpay.co.il/app/me/0527186881" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                שלם ב-BIT
              </Button>
            </a>
            <a href="tel:0527186881">
              <Button size="lg" variant="outline">
                052-718-6881
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
