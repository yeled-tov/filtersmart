import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Smartphone, Lock, Zap, Cpu, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";
import { useServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import TrustBadges from "@/components/TrustBadges";
import TrustStrip from "@/components/TrustStrip";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import AnimatedSection from "@/components/AnimatedSection";
import heroBg from "@/assets/hero-bg.jpg";
import { Helmet } from "react-helmet-async";

const ServiceCardSkeleton = () => (
  <div className="bg-card rounded-xl p-6 card-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-4 w-20" />
  </div>
);

const Index = () => {
  const { data: services, isLoading } = useServices();
  const { data: settings } = useSiteSettings();

  const waLink = settings?.whatsapp_link || "https://wa.me/972527186881";
  const bitLink = settings?.bit_link || "https://bitpay.co.il/app/me/0527186881";
  const heroTitle = settings?.hero_title || "פילטר סמארט - סינון טלפונים";
  const heroSubtitle = settings?.hero_subtitle || "וצריבת גרסאות באשדוד";
  const heroDesc = settings?.hero_description || "FilterSmart (פילטר סמארט) – פתרונות סינון לאייפון ואנדרואיד, התקנת הדרן, עסקן, כושר פליי וצריבת גרסה למכשירי שיאומי Qin. שירות מקצועי ואמין באשדוד.";

  const filteringServices = services?.filter((s) => s.category === "filtering") || [];
  const flashingServices = services?.filter((s) => s.category === "flashing") || [];

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "FilterSmart",
    telephone: "052-718-6881",
    email: "ywldyld@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "חטיבת גבעתי 2 כניסה ו׳",
      addressLocality: "אשדוד",
      addressCountry: "IL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.8028,
      longitude: 34.6552,
    },
    openingHours: ["Su-Th 09:00-18:00", "Fr 09:00-13:00"],
    priceRange: "₪₪",
    url: "https://smartfilter.co.il",
  };

  return (
    <>
      <SEOHead
        title="FilterSmart – פילטר סמארט: סינון טלפונים וצריבת גרסאות באשדוד"
        description="המעבדה המובילה באשדוד לסינון מכשירים, התקנת הדרן, עסקן וכושר פליי. שירות מקצועי ומהיר לציבור החרדי והדתי"
        path="/"
        keywords="סינון טלפון אשדוד, הדרן אשדוד, עסקן אשדוד, כושר פליי אשדוד, צריבת גרסה לשיאומי קין, חסימת אינטרנט באשדוד, פילטר סמארט"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" loading="eager" aria-hidden="true" />
          <div className="absolute inset-0 bg-foreground/45" />
        </div>
        <div className="relative container-custom py-20 md:py-32 lg:py-40">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-primary-foreground/20">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Shield className="w-4 h-4" />
              </motion.div>
              משווק מורשה – הדרן, עסקן, כושר פליי
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-6">
              {heroTitle}
              <span className="block mt-2" style={{ color: "hsl(155, 55%, 55%)" }}>{heroSubtitle}</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">{heroDesc}</p>
          </motion.div>
        </div>
      </section>

      <TrustStrip />
      <TrustBadges />

      {/* Features */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">למה FilterSmart?</h2>
              <p className="text-muted-foreground text-lg">פילטר סמארט – המומחים לסינון טלפונים והגנה דיגיטלית באשדוד</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "הגנה מקצועית", desc: "פתרונות סינון ברמה הגבוהה ביותר עם שכבות הגנה מרובות" },
              { icon: Smartphone, title: "כל המכשירים", desc: "אייפון, אנדרואיד ומכשירי שיאומי Qin – פתרון לכל סוג" },
              { icon: Zap, title: "שירות מהיר", desc: "התקנה מקצועית ומהירה, ללא איפוס המכשיר בשירותים הבסיסיים" },
              { icon: HeartHandshake, title: "מחירים הוגנים", desc: "מחירים שקופים והוגנים ללא עלויות נסתרות, עם אחריות מלאה" },
            ].map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-card rounded-xl p-8 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Filtering Services */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <Lock className="w-4 h-4" />
                סינון טלפונים והגנה
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">שירותי סינון והגנה דיגיטלית</h2>
              <p className="text-muted-foreground text-lg">פתרונות סינון מקצועיים לאייפון ואנדרואיד</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)
              : filteringServices.map((service, i) => (
                  <AnimatedSection key={service.slug} delay={i * 0.1}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="block bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                    >
                      {service.slug === "hadran" && (
                        <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          ⭐ הכי פופולרי
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {service.logo_url && (
                            <img src={service.logo_url} alt={`${service.name} לוגו`} className="w-10 h-10 rounded-lg object-contain bg-muted p-1" loading="lazy" />
                          )}
                          <h3 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                            {service.name}
                          </h3>
                        </div>
                        <span className="text-lg font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{service.short_desc}</p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        <span>פרטים נוספים</span>
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
          </div>
        </div>
      </section>

      {/* Flashing Services */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
                <Cpu className="w-4 h-4" />
                צריבת גרסאות ומערכות
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">צריבת גרסאות למכשירי שיאומי Qin</h2>
              <p className="text-muted-foreground text-lg">צריבת גרסה כשרה ומותאמת למכשירי Qin F21 Pro ו-Qin F25</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => <ServiceCardSkeleton key={i} />)
              : flashingServices.map((service, i) => (
                  <AnimatedSection key={service.slug} delay={i * 0.1}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="block bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                        <span className="text-lg font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{service.short_desc}</p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        <span>פרטים נוספים</span>
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
          </div>
        </div>
      </section>

      <Reviews />
      <FAQ />

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="relative container-custom py-16 md:py-24 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">מוכנים להגן על הטלפון שלכם?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">צרו קשר עוד היום ונתאים לכם את פתרון הסינון המושלם</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-card/90 text-foreground hover:bg-card text-base px-8 border-border hover:scale-105 transition-transform">
                  WhatsApp
                </Button>
              </a>
              <a href={bitLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 hover:scale-105 transition-transform">
                  שלם ב-BIT
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SEO Content */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom max-w-4xl">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6 text-center">סינון טלפונים וצריבת גרסאות באשדוד – FilterSmart</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              <strong className="text-foreground">FilterSmart (פילטר סמארט)</strong> הוא הכתובת המקצועית לסינון טלפונים וצריבת גרסאות באשדוד. אנו משווקים מורשים של מערכות הסינון המובילות בישראל – <strong className="text-foreground">הדרן (Hadran)</strong>, <strong className="text-foreground">עסקן (Askan)</strong> ו<strong className="text-foreground">כושר פליי (Kosher Play)</strong>.
            </p>
            <p>
              המומחיות שלנו כוללת סינון לאייפון ואנדרואיד, התקנת מערכות הגנה מתקדמות, וצריבת גרסאות כשרות למכשירי <strong className="text-foreground">שיאומי Qin F21 Pro</strong> ו-<strong className="text-foreground">Qin F25</strong>. כל עבודה מתבצעת באופן מקצועי עם תמיכה טכנית מלאה.
            </p>
            <p>
              אנו ממוקמים ברחוב חטיבת גבעתי 2, רובע ג׳, אשדוד – ומספקים שירות אמין, מהיר ובמחירים הוגנים. בין אם אתם מחפשים סינון בסיסי ב-20₪ או פתרון הרמטי כמו הדרן, אנחנו כאן בשבילכם.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
