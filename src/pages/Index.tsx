import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Smartphone, Lock, Zap, Cpu, HeartHandshake, Star, CheckCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { useServices, fallbackServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import TrustStrip from "@/components/TrustStrip";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import AnimatedSection from "@/components/AnimatedSection";
import FilterMatcher from "@/components/FilterMatcher";
import heroBg from "@/assets/hero-bg.jpg";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { data: services } = useServices();
  const { data: settings } = useSiteSettings();

  const waLink = settings?.whatsapp_link || "https://wa.me/972527186881";
  const bitLink = settings?.bit_link || "https://bitpay.co.il/app/me/0527186881";
  const heroTitle = settings?.hero_title || "סינון טלפונים מקצועי";
  const heroSubtitle = settings?.hero_subtitle || "וצריבת גרסאות באשדוד";
  const heroDesc = settings?.hero_description || "FilterPhone – פתרונות סינון לאייפון ואנדרואיד, התקנת הדרן, עסקן, כושר פליי וצריבת גרסה למכשירי שיאומי Qin. שירות מקצועי ואמין באשדוד.";

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
        title="FilterPhone – פילטר פון | סינון טלפונים מקצועי באשדוד מ-20₪"
        description="FilterPhone – המעבדה המובילה באשדוד לסינון טלפונים. התקנת הדרן 300₪, עסקן 300₪, כושר פליי 70₪, סינון בסיסי 20₪. משווק מורשה. צריבת גרסה Qin 70₪ ☎ 052-718-6881"
        path="/"
        keywords="סינון טלפון אשדוד, הדרן אשדוד, עסקן אשדוד, כושר פליי אשדוד, צריבת גרסה לשיאומי קין, חסימת אינטרנט באשדוד, פילטר פון, סינון אייפון, סינון אנדרואיד, התקנת הדרן, מחיר הדרן, סינון טלפון מחיר"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="סינון טלפונים מקצועי באשדוד – FilterPhone" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-l from-foreground/70 via-foreground/55 to-foreground/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
        </div>
        <div className="relative container-custom py-20 md:py-28 lg:py-36">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6 backdrop-blur-md border border-white/15">
              <Shield className="w-4 h-4 text-green-300" />
              משווק מורשה – הדרן, עסקן, כושר פליי
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-heading font-bold text-white leading-[1.15] mb-6 text-balance">
              {heroTitle}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-l from-green-300 to-emerald-200">{heroSubtitle}</span>
            </h1>
            <p className="text-base md:text-lg text-white/75 mb-8 leading-relaxed max-w-xl">{heroDesc}</p>

            <div className="flex flex-wrap items-center gap-3">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gradient-primary text-white border-0 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all text-base px-7 h-12">
                  WhatsApp – הזמן עכשיו
                </Button>
              </a>
              <a href="tel:0527186881">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm text-base px-7 h-12 gap-2">
                  <Phone className="w-4 h-4" />
                  052-718-6881
                </Button>
              </a>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { value: "500+", label: "לקוחות מרוצים" },
                { value: "20₪", label: "סינון בסיסי מ-" },
                { value: "5 דק׳", label: "זמן התקנה" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-xl md:text-2xl font-heading font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <TrustStrip />

      {/* Features */}
      <section className="section-padding bg-background bg-mesh" aria-label="יתרונות FilterPhone">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4 text-balance">
                למה לבחור ב-<span className="gradient-text">FilterPhone</span>?
              </h2>
              <p className="text-muted-foreground text-lg">המומחים לסינון טלפונים והגנה דיגיטלית באשדוד</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: "הגנה מקצועית", desc: "פתרונות סינון ברמה הגבוהה ביותר עם שכבות הגנה מרובות – הדרן, עסקן וכושר פליי", color: "from-blue-500 to-blue-600" },
              { icon: Smartphone, title: "כל המכשירים", desc: "אייפון, אנדרואיד ומכשירי שיאומי Qin F21 Pro ו-F25 – פתרון לכל סוג מכשיר", color: "from-violet-500 to-violet-600" },
              { icon: Zap, title: "שירות מהיר", desc: "התקנה מקצועית ומהירה. סינון בסיסי תוך 5 דקות, צריבה תוך 30-60 דקות", color: "from-amber-500 to-orange-500" },
              { icon: HeartHandshake, title: "מחירים הוגנים", desc: "סינון בסיסי מ-20₪ בלבד. מחירים שקופים ללא עלויות נסתרות, עם אחריות מלאה", color: "from-emerald-500 to-green-600" },
            ].map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="bg-card rounded-2xl p-7 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 group h-full border border-border/50 card-shine">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-heading font-semibold text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Filtering Services */}
      <section className="section-padding bg-muted/40" aria-label="שירותי סינון טלפונים">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-sm font-semibold mb-4">
                <Lock className="w-4 h-4" />
                סינון טלפונים והגנה
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4 text-balance">שירותי סינון טלפון והגנה דיגיטלית</h2>
              <p className="text-muted-foreground text-lg">פתרונות סינון מקצועיים לאייפון ואנדרואיד – מ-20₪ בלבד</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteringServices.map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.08}>
                <Link
                  to={`/services/${service.slug}`}
                  className="block bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden border border-border/50"
                >
                  {service.slug === "hadran" && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      <Star className="w-3 h-3 fill-current" />
                      הכי פופולרי
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {service.logo_url && (
                        <img src={service.logo_url} alt={`${service.name} לוגו`} className="w-11 h-11 rounded-xl object-contain bg-muted p-1.5" loading="lazy" />
                      )}
                      <div>
                        <h3 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xl font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{service.short_desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      <span>פרטים נוספים</span>
                      <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Flashing Services */}
      <section className="section-padding bg-background bg-mesh" aria-label="שירותי צריבת גרסאות">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/8 text-secondary text-sm font-semibold mb-4">
                <Cpu className="w-4 h-4" />
                צריבת גרסאות
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4 text-balance">צריבת גרסאות כשרות למכשירי שיאומי Qin</h2>
              <p className="text-muted-foreground text-lg">גרסה כשרה ומותאמת למכשירי Qin F21 Pro ו-Qin F25 – 70₪ בלבד</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {flashingServices.map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.08}>
                <Link
                  to={`/services/${service.slug}`}
                  className="block bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 group border border-border/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-xl font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{service.short_desc}</p>
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

      {/* Filter Matcher Bot */}
      <FilterMatcher />

      <Reviews />
      <FAQ />

      {/* CTA */}
      <section className="relative overflow-hidden" aria-label="יצירת קשר">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />
        <div className="relative container-custom py-16 md:py-24 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-white mb-4 text-balance">מוכנים להגן על הטלפון שלכם?</h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">צרו קשר עוד היום ונתאים לכם את פתרון הסינון המושלם – שירות מקצועי באשדוד</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-primary hover:bg-white/95 text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all font-semibold">
                  WhatsApp – 052-718-6881
                </Button>
              </a>
              <a href={bitLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white/25 hover:bg-white/10 text-base px-8 h-12 backdrop-blur-sm">
                  שלם ב-BIT
                </Button>
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-white/50 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-300" /> אחריות מלאה</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-300" /> שירות מהיר</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-300" /> מחירים הוגנים</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SEO Content */}
      <section className="section-padding bg-muted/20" aria-label="מידע על סינון טלפונים באשדוד">
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
