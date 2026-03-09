import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Cpu } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useServices, fallbackServices } from "@/hooks/useServices";

const Services = () => {
  const { data: services } = useServices();

  const allServices = services && services.length > 0 ? services : fallbackServices;
  const filteringServices = allServices.filter((s) => s.category === "filtering");
  const flashingServices = allServices.filter((s) => s.category === "flashing");

  return (
    <>
      <SEOHead
        title="שירותי סינון טלפון וצריבת גרסאות – FilterPhone פילטר פון אשדוד"
        description="מגוון שירותי סינון טלפון וצריבת גרסאות: סינון בסיסי, הדרן, עסקן, כושר פליי וצריבת גרסה לשיאומי Qin. שירות מקצועי באשדוד."
        path="/services"
        keywords="סינון טלפון אשדוד, התקנת הדרן אשדוד, כושר פליי התקנה, עסקן התקנה, צריבת גרסה לשיאומי קין"
      />
      <Breadcrumbs items={[{ label: "שירותים" }]} />

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
              השירותים <span className="gradient-text">שלנו</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              פתרונות סינון וצריבת גרסאות מקצועיים לכל סוגי המכשירים
            </p>
          </div>

          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">סינון טלפונים והגנה</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteringServices.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1 duration-300 group flex flex-col relative overflow-hidden"
                >
                  {service.slug === "hadran" && (
                    <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      ⭐ הכי פופולרי
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {service.logo_url && (
                        <img src={service.logo_url} alt={`${service.name} לוגו`} className="w-10 h-10 rounded-lg object-contain bg-muted p-1" loading="lazy" />
                      )}
                      <h3 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                    </div>
                    <span className="text-xl font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">{service.short_desc}</p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <span>פרטים נוספים</span>
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">צריבת גרסאות ומערכות</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              {flashingServices.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1 duration-300 group flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-xl font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">{service.short_desc}</p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <span>פרטים נוספים</span>
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
