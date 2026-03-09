import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Smartphone, Lock, Zap, Cpu, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { useServices, fallbackServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import TrustBadges from "@/components/TrustBadges";
import TrustStrip from "@/components/TrustStrip";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import AnimatedSection from "@/components/AnimatedSection";
import heroBg from "@/assets/hero-bg.jpg";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { data: services } = useServices();
  const { data: settings } = useSiteSettings();

  const waLink = settings?.whatsapp_link || "https://wa.me/972527186881";
  const bitLink = settings?.bit_link || "https://bitpay.co.il/app/me/0527186881";
  const heroTitle = settings?.hero_title || "פילטר פון - סינון טלפונים";
  const heroSubtitle = settings?.hero_subtitle || "וצריבת גרסאות באשדוד";
  const heroDesc = settings?.hero_description || "FilterPhone (פילטר פון) – פתרונות סינון לאייפון ואנדרואיד, התקנת הדרן, עסקן, כושר פליי וצריבת גרסה למכשירי שיאומי Qin. שירות מקצועי ואמין באשדוד.";

  const allServices = services && services.length > 0 ? services : fallbackServices;
  const filteringServices = allServices.filter((s) => s.category === "filtering");
  const flashingServices = allServices.filter((s) => s.category === "flashing");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "בית", "item": "https://filterphone.com/" }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "כמה עולה סינון טלפון באשדוד?",
        "acceptedAnswer": { "@type": "Answer", "text": "סינון בסיסי לאייפון ואנדרואיד עולה 20₪ בלבד. מערכת כושר פליי עולה 70₪. מערכות הדרן ועסקן עולות 300₪." }
      },
      {
        "@type": "Question",
        "name": "האם הצריבה פוגעת בטלפון?",
        "acceptedAnswer": { "@type": "Answer", "text": "לא. מדובר בשכבת תוכנה מקצועית שמותקנת על המכשיר. הצריבה לא פוגעת בחומרה ולא משפיעה לרעה על ביצועי הטלפון." }
      },
      {
        "@type": "Question",
        "name": "כמה זמן לוקחת התקנת הדרן?",
        "acceptedAnswer": { "@type": "Answer", "text": "התקנת הדרן לוקחת כ-45-90 דקות. סינון בסיסי לוקח כ-5 דקות בלבד." }
      },
      {
        "@type": "Question",
        "name": "איפה נמצא FilterPhone באשדוד?",
        "acceptedAnswer": { "@type": "Answer", "text": "אנחנו נמצאים ברחוב חטיבת גבעתי 2, כניסה ו׳, רובע ג׳, אשדוד. שירות בתיאום מראש בטלפון 052-718-6881." }
      },
      {
        "@type": "Question",
        "name": "האם אפשר להסיר את סינון הדרן?",
        "acceptedAnswer": { "@type": "Answer", "text": "הדרן לא ניתן להסרה – גם איפוס לא מוריד את החסימה. זוהי ההגנה ההרמטית ביותר בשוק." }
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="FilterPhone – פילטר פון: סינון טלפונים וצריבת גרסאות באשדוד | מ-20₪"
        description="המעבדה המובילה באשדוד לסינון מכשירים. התקנת הדרן 300₪, עסקן 300₪, כושר פליי 70₪, סינון בסיסי 20₪. צריבת גרסה לשיאומי Qin 70₪. משווק מורשה ☎ 052-718-6881"
        path="/"
        keywords="סינון טלפון אשדוד, הדרן אשדוד, עסקן אשדוד, כושר פליי אשדוד, צריבת גרסה לשיאומי קין, חסימת אינטרנט באשדוד, פילטר פון, סינון אייפון, סינון אנדרואיד, התקנת הדרן, מחיר הדרן, סינון טלפון מחיר"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="סינון טלפונים מקצועי באשדוד – FilterPhone" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
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
      <section className="section-padding bg-background" aria-label="יתרונות FilterPhone">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">למה לבחור ב-FilterPhone באשדוד?</h2>
              <p className="text-muted-foreground text-lg">פילטר פון – המומחים לסינון טלפונים והגנה דיגיטלית באשדוד</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "הגנה מקצועית", desc: "פתרונות סינון ברמה הגבוהה ביותר עם שכבות הגנה מרובות – הדרן, עסקן וכושר פליי" },
              { icon: Smartphone, title: "כל המכשירים", desc: "אייפון, אנדרואיד ומכשירי שיאומי Qin F21 Pro ו-F25 – פתרון לכל סוג מכשיר" },
              { icon: Zap, title: "שירות מהיר באשדוד", desc: "התקנה מקצועית ומהירה באשדוד. סינון בסיסי תוך 5 דקות, צריבה תוך 30-60 דקות" },
              { icon: HeartHandshake, title: "מחירים הוגנים", desc: "סינון בסיסי מ-20₪ בלבד. מחירים שקופים ללא עלויות נסתרות, עם אחריות מלאה" },
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
      <section className="section-padding bg-muted/50" aria-label="שירותי סינון טלפונים">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <Lock className="w-4 h-4" />
                סינון טלפונים והגנה
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">שירותי סינון טלפון והגנה דיגיטלית באשדוד</h2>
              <p className="text-muted-foreground text-lg">פתרונות סינון מקצועיים לאייפון ואנדרואיד – מ-20₪ בלבד</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteringServices.map((service, i) => (
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
      <section className="section-padding bg-background" aria-label="שירותי צריבת גרסאות">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
                <Cpu className="w-4 h-4" />
                צריבת גרסאות ומערכות
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">צריבת גרסאות כשרות למכשירי שיאומי Qin באשדוד</h2>
              <p className="text-muted-foreground text-lg">צריבת גרסה כשרה ומותאמת למכשירי Qin F21 Pro ו-Qin F25 – 70₪ בלבד</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {flashingServices.map((service, i) => (
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
      <section className="relative overflow-hidden" aria-label="יצירת קשר">
        <div className="absolute inset-0 gradient-primary" />
        <div className="relative container-custom py-16 md:py-24 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">מוכנים להגן על הטלפון שלכם?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">צרו קשר עוד היום ונתאים לכם את פתרון הסינון המושלם – שירות מקצועי באשדוד</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-card/90 text-foreground hover:bg-card text-base px-8 border-border hover:scale-105 transition-transform">
                  WhatsApp – 052-718-6881
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
      <section className="section-padding bg-muted/30" aria-label="מידע על סינון טלפונים באשדוד">
        <div className="container-custom max-w-4xl">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6 text-center">סינון טלפונים וצריבת גרסאות באשדוד – FilterPhone פילטר פון</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p>
              <strong className="text-foreground">FilterPhone (פילטר פון)</strong> הוא הכתובת המקצועית מספר 1 ל<strong className="text-foreground">סינון טלפונים באשדוד</strong> ו<strong className="text-foreground">צריבת גרסאות</strong>. אנו משווקים מורשים של מערכות הסינון המובילות בישראל – <strong className="text-foreground">הדרן (Hadran)</strong>, <strong className="text-foreground">עסקן (Askan)</strong> ו<strong className="text-foreground">כושר פליי (Kosher Play)</strong>.
            </p>
            <p>
              <strong className="text-foreground">התקנת הדרן באשדוד</strong> – ההגנה ההרמטית ביותר בשוק. גרסת מערכת שלמה שלא ניתנת להסרה בשום צורה. מחיר: <strong className="text-foreground">300₪</strong>. <strong className="text-foreground">התקנת עסקן באשדוד</strong> – סינון AI חכם עם צריבה עמוקה. מחיר: <strong className="text-foreground">300₪</strong>. <strong className="text-foreground">כושר פליי התקנה</strong> – חנות אפליקציות כשרה עם MDM. מחיר: <strong className="text-foreground">70₪</strong>. <strong className="text-foreground">סינון בסיסי</strong> מ-<strong className="text-foreground">20₪</strong> בלבד.
            </p>
            <p>
              המומחיות שלנו כוללת <strong className="text-foreground">סינון לאייפון</strong> ו<strong className="text-foreground">סינון אנדרואיד</strong>, התקנת מערכות הגנה מתקדמות, וצריבת גרסאות כשרות למכשירי <strong className="text-foreground">שיאומי Qin F21 Pro</strong> ו-<strong className="text-foreground">Qin F25</strong> (70₪). כל עבודה מתבצעת באופן מקצועי עם תמיכה טכנית מלאה.
            </p>
            <p>
              אנו ממוקמים ב<strong className="text-foreground">רחוב חטיבת גבעתי 2, רובע ג׳, אשדוד</strong> – ומספקים שירות אמין, מהיר ובמחירים הוגנים. לתיאום: <strong className="text-foreground">052-718-6881</strong>. בין אם אתם מחפשים <strong className="text-foreground">סינון טלפון זול</strong>, <strong className="text-foreground">חסימת אינטרנט באשדוד</strong> או פתרון הרמטי כמו <strong className="text-foreground">הדרן</strong>, אנחנו כאן בשבילכם.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;