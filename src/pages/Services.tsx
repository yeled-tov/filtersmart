import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { services } from "@/data/services";

const Services = () => {
  return (
    <>
      <SEOHead
        title="שירותי סינון טלפון – SmartFilter אשדוד | הדרן, עסקן, כושר פליי"
        description="מגוון שירותי סינון טלפון והגנה דיגיטלית: סינון בסיסי, הדרן, עסקן, כושר פליי וצריבת גרסה Qin. שירות מקצועי באשדוד."
        path="/services"
        keywords="סינון טלפון אשדוד, התקנת הדרן אשדוד, כושר פליי התקנה, עסקן התקנה"
      />

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
              השירותים <span className="gradient-text">שלנו</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              פתרונות סינון והגנה דיגיטלית מקצועיים לכל סוגי המכשירים
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1 group flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </h2>
                  <span className="text-xl font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">{service.shortDesc}</p>
                <div className="flex items-center text-primary text-sm font-medium">
                  <span>פרטים נוספים</span>
                  <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
