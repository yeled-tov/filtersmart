import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Cpu, Star } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import { useServices, fallbackServices } from "@/hooks/useServices";

const Services = () => {
  const { data: services } = useServices();

  const allServices = services && services.length > 0 ? services : fallbackServices;
  const filteringServices = allServices.filter((s) => s.category === "filtering");
  const flashingServices = allServices.filter((s) => s.category === "flashing");

  return (
    <>
      <SEOHead
        title="שירותי סינון טלפון באשדוד מ-20₪ | אייפון, גלקסי, אנדרואיד – FilterPhone"
        description="✅ כל שירותי הסינון במקום אחד: סינון בסיסי 20₪, כושר פליי 70₪, הדרן 300₪, עסקן 300₪. אייפון, גלקסי, סמסונג, שיאומי – כל מכשיר. צריבת גרסה Qin 70₪ ☎ 052-718-6881"
        path="/services"
        keywords="סינון טלפון אשדוד, סינון אייפון, סינון גלקסי, סינון סמסונג, התקנת הדרן, כושר פליי התקנה, עסקן התקנה, צריבת גרסה שיאומי, מחיר סינון טלפון, סינון בסיסי, סינון אנדרואיד, סינון טלפון לילדים"
      />
      <Breadcrumbs items={[{ label: "שירותים" }]} />

      <section className="section-padding bg-background bg-mesh">
        <div className="container-custom">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center mb-14">
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4 text-balance">
                השירותים <span className="gradient-text">שלנו</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                פתרונות סינון וצריבת גרסאות מקצועיים לכל סוגי המכשירים – שירות מהיר ואמין באשדוד
              </p>
            </div>
          </AnimatedSection>

          <div className="mb-16">
            <AnimatedSection>
              <div className="flex items-center gap-2.5 mb-8">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-heading font-semibold text-foreground">סינון טלפונים והגנה דיגיטלית</h2>
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteringServices.map((service, i) => (
                <AnimatedSection key={service.slug} delay={i * 0.08}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1 duration-300 group flex flex-col relative overflow-hidden border border-border/50 h-full"
                  >
                    {service.slug === "hadran" && (
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        הכי פופולרי
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {service.logo_url && (
                          <img src={service.logo_url} alt={`${service.name} לוגו`} className="w-11 h-11 rounded-xl object-contain bg-muted p-1.5" loading="lazy" />
                        )}
                        <h3 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                      </div>
                      <span className="text-xl font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">{service.short_desc}</p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      <span>פרטים נוספים</span>
                      <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <div>
            <AnimatedSection>
              <div className="flex items-center gap-2.5 mb-8">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-heading font-semibold text-foreground">צריבת גרסאות למכשירי שיאומי Qin</h2>
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
              {flashingServices.map((service, i) => (
                <AnimatedSection key={service.slug} delay={i * 0.08}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1 duration-300 group flex flex-col border border-border/50 h-full"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <span className="text-xl font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">{service.short_desc}</p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      <span>פרטים נוספים</span>
                      <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
