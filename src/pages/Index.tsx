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
      { "@type": "ListItem", "position": 1, "name": "בית", "item": "https://www.filterphone.com/" }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "כמה עולה סינון טלפון באשדוד?",
        "acceptedAnswer": { "@type": "Answer", "text": "סינון בסיסי לאייפון, גלקסי ואנדרואיד עולה 100₪ בלבד. מערכת כושר פליי עולה 70₪. מערכות הדרן ועסקן עולות 300₪. צריבת גרסה Qin עולה 70₪." }
      },
      {
        "@type": "Question",
        "name": "האם אפשר לסנן כל סוג טלפון?",
        "acceptedAnswer": { "@type": "Answer", "text": "כן! FilterPhone מספקים סינון לכל הפלטפורמות: אייפון (iPhone), סמסונג גלקסי (Galaxy), שיאומי, וואווי, אנדרואיד כללי, מכשירי Qin ואפילו פתרונות סינון למחשבים. אנחנו הכתובת לכל מכשיר." }
      },
      {
        "@type": "Question",
        "name": "האם הצריבה פוגעת בטלפון?",
        "acceptedAnswer": { "@type": "Answer", "text": "לא. מדובר בשכבת תוכנה מקצועית שמותקנת על המכשיר. הצריבה לא פוגעת בחומרה ולא משפיעה לרעה על ביצועי הטלפון." }
      },
      {
        "@type": "Question",
        "name": "כמה זמן לוקחת התקנת הדרן?",
        "acceptedAnswer": { "@type": "Answer", "text": "התקנת הדרן לוקחת כ-45-90 דקות. סינון בסיסי לוקח כ-5 דקות בלבד. השירות בדרך כלל ניתן ביום הפנייה." }
      },
      {
        "@type": "Question",
        "name": "מה ההבדל בין הדרן, עסקן וכושר פליי?",
        "acceptedAnswer": { "@type": "Answer", "text": "הדרן (300₪) – ההגנה ההרמטית ביותר, צריבה שלא ניתנת להסרה. עסקן (300₪) – סינון AI חכם עם צריבה עמוקה, מיועד לאנשי עסקים. כושר פליי (70₪) – חנות אפליקציות כשרה עם MDM ווואטסאפ מסונן. סינון בסיסי (100₪) – פתרון פשוט ומהיר לחסימת אתרים." }
      },
      {
        "@type": "Question",
        "name": "איפה נמצא FilterPhone באשדוד?",
        "acceptedAnswer": { "@type": "Answer", "text": "אנחנו נמצאים ברחוב חטיבת גבעתי 2, כניסה ו׳, רובע ג׳, אשדוד. שירות בתיאום מראש בטלפון 052-718-6881 או WhatsApp." }
      },
      {
        "@type": "Question",
        "name": "האם אפשר להסיר את סינון הדרן?",
        "acceptedAnswer": { "@type": "Answer", "text": "הדרן לא ניתן להסרה – גם איפוס יצרן לא מוריד את החסימה. זוהי ההגנה ההרמטית ביותר בשוק, מושלמת להורים שרוצים הגנה מוחלטת." }
      },
      {
        "@type": "Question",
        "name": "איזה חברות סינון אתם עובדים איתן?",
        "acceptedAnswer": { "@type": "Answer", "text": "אנחנו משווקים מורשים של כל חברות הסינון המובילות בישראל: הדרן (Hadran), עסקן (Askan), כושר פליי (Kosher Play). בנוסף, אנו מספקים סינון בסיסי עצמאי וצריבת גרסאות כשרות למכשירי שיאומי Qin." }
      },
      {
        "@type": "Question",
        "name": "האם אתם מסננים גם גלקסי וסמסונג?",
        "acceptedAnswer": { "@type": "Answer", "text": "בהחלט! אנחנו מסננים את כל מכשירי סמסונג גלקסי (Galaxy S, Galaxy A, Galaxy Note) וכל מכשיר אנדרואיד אחר. כולל התקנת הדרן, עסקן, כושר פליי וסינון בסיסי." }
      }
    ]
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "איך לסנן טלפון באשדוד – FilterPhone",
    "description": "מדריך קצר להזמנת שירות סינון טלפון אצל FilterPhone באשדוד",
    "totalTime": "PT1H",
    "estimatedCost": { "@type": "MonetaryAmount", "currency": "ILS", "value": "100" },
    "step": [
      { "@type": "HowToStep", "name": "בחרו סוג סינון", "text": "בחרו את רמת הסינון המתאימה: סינון בסיסי (100₪), כושר פליי (70₪), עסקן (300₪) או הדרן (300₪)." },
      { "@type": "HowToStep", "name": "צרו קשר", "text": "התקשרו ל-052-718-6881 או שלחו הודעת WhatsApp לתיאום." },
      { "@type": "HowToStep", "name": "הגיעו אלינו", "text": "הגיעו לרחוב חטיבת גבעתי 2, כניסה ו׳, רובע ג׳, אשדוד." },
      { "@type": "HowToStep", "name": "התקנה מקצועית", "text": "הצוות המקצועי שלנו יתקין את הסינון תוך 5 דקות עד שעה, תלוי בסוג." }
    ]
  };

  return (
    <>
      <SEOHead
        title="סינון טלפונים באשדוד מ-100₪ ⭐ 5.0 (47 חוות דעת) | FilterPhone פילטר פון"
        description="✅ הכתובת #1 לסינון טלפונים בישראל! סינון אייפון, גלקסי, אנדרואיד, מחשב – כל מכשיר, כל פלטפורמה. הדרן 300₪ | עסקן 300₪ | כושר פליי 70₪ | סינון בסיסי 100₪. משווק מורשה ✓ 500+ לקוחות מרוצים ☎ 052-718-6881"
        path="/"
        keywords="סינון טלפון, סינון טלפון אשדוד, סינון אייפון, סינון אנדרואיד, סינון גלקסי, סינון סמסונג, סינון שיאומי, סינון מחשב, חסימת אינטרנט, הדרן, עסקן, כושר פליי, פילטר פון, FilterPhone, התקנת הדרן אשדוד, מחיר הדרן, מחיר סינון טלפון, סינון טלפון זול, סינון טלפון ילדים, סינון תוכן אינטרנט, צריבת גרסה שיאומי, סינון טלפון מחיר, חסימת אתרים בטלפון, סינון אייפון אשדוד, סינון גלקסי אשדוד, סינון טלפון לילדים, סינון נייד, חסימת אינטרנט באשדוד, נטפרי, רימון, סינון תוכן"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
      </Helmet>

      {/* Hero — Tesla-style minimalist */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center bg-radial-blue">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-mesh opacity-60" />
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                top: `${(i * 37) % 100}%`,
                left: `${(i * 53) % 100}%`,
                animation: `particle-float ${3 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
        {/* Top blue glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative container-custom py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto"
          >
            {/* Rating chip */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-8 backdrop-blur-md">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(n => <Star key={n} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
              <span>5.0 · 47 חוות דעת · משווק מורשה</span>
            </div>

            {/* Massive headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white mb-6 text-balance leading-[1.05]">
              סינון טלפונים
              <span className="block text-gradient-blue mt-2">באשדוד</span>
            </h1>

            <p className="text-base md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              משווק מורשה של הדרן, עסקן וכושר פליי. סינון מקצועי לאייפון, גלקסי, שיאומי ואנדרואיד – החל מ-100₪.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="tel:0527186881">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 text-base px-8 h-14 rounded-full font-semibold gap-2 transition-all hover:scale-[1.03]">
                  <Phone className="w-4 h-4" />
                  התקשר עכשיו
                </Button>
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/40 text-base px-8 h-14 rounded-full font-semibold backdrop-blur-md">
                  WhatsApp
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 pt-12 border-t border-white/5 max-w-2xl mx-auto">
              {[
                { value: "500+", label: "לקוחות" },
                { value: "5.0", label: "דירוג" },
                { value: "5 דק׳", label: "התקנה" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-4xl font-heading font-bold text-white">{stat.value}</div>
                  <div className="text-xs md:text-sm text-white/40 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </motion.div>
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
              { icon: Shield, title: "הגנה מקצועית", desc: "פתרונות סינון ברמה הגבוהה ביותר עם שכבות הגנה מרובות – הדרן, עסקן וכושר פליי" },
              { icon: Smartphone, title: "כל מכשיר, כל פלטפורמה", desc: "אייפון, גלקסי, סמסונג, שיאומי, וואווי, אנדרואיד, טאבלט ומחשב – הכתובת לכל סוג מכשיר" },
              { icon: Zap, title: "שירות מהיר", desc: "התקנה מקצועית ומהירה. סינון בסיסי תוך 5 דקות, צריבה תוך 30-60 דקות" },
              { icon: HeartHandshake, title: "מחירים הוגנים", desc: "סינון בסיסי מ-100₪ בלבד. מחירים שקופים ללא עלויות נסתרות, עם אחריות מלאה" },
            ].map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="card-premium p-7 group h-full card-shine">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">{feature.title}</h3>
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
              <p className="text-muted-foreground text-lg">פתרונות סינון מקצועיים לאייפון ואנדרואיד – מ-100₪ בלבד</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteringServices.map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.08}>
                <Link
                  to={`/services/${service.slug}`}
                  className="block card-premium p-6 group relative overflow-hidden"
                >
                  {service.slug === "hadran" && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      הכי פופולרי
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {service.logo_url && (
                        <img src={service.logo_url} alt={`${service.name} לוגו`} className="w-11 h-11 rounded-xl object-contain bg-white/5 p-1.5" loading="lazy" />
                      )}
                      <div>
                        <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-white whitespace-nowrap mr-3">{service.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{service.short_desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-primary text-sm font-medium gap-1">
                      <span>פרטים נוספים</span>
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
                  className="block card-premium p-6 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-2xl font-bold text-white whitespace-nowrap mr-3">{service.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{service.short_desc}</p>
                  <div className="flex items-center text-primary text-sm font-medium gap-1">
                    <span>פרטים נוספים</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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

      {/* CTA — Tesla-style minimal */}
      <section className="relative overflow-hidden bg-background" aria-label="יצירת קשר">
        <div className="absolute inset-0 bg-radial-blue opacity-90" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative container-custom py-24 md:py-36 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6 text-balance leading-[1.05]">
              מוכנים להגן<br />על הטלפון שלכם?
            </h2>
            <p className="text-white/60 text-lg md:text-xl mb-12 max-w-xl mx-auto">
              צרו קשר עוד היום ונתאים לכם את פתרון הסינון המושלם
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="tel:0527186881">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 text-base px-8 h-14 rounded-full font-semibold gap-2 transition-all hover:scale-[1.03]">
                  <Phone className="w-4 h-4" />
                  052-718-6881
                </Button>
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/40 text-base px-8 h-14 rounded-full font-semibold backdrop-blur-md">
                  WhatsApp
                </Button>
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12 text-white/40 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> אחריות מלאה</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> שירות מהיר</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> מחירים הוגנים</span>
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
              <strong className="text-foreground">FilterPhone (פילטר פון)</strong> הוא הכתובת המקצועית מספר 1 ל<strong className="text-foreground">סינון טלפונים באשדוד</strong>, <strong className="text-foreground">חסימת תוכן באינטרנט</strong> ו<strong className="text-foreground">צריבת גרסאות כשרות</strong>. אנו משווקים מורשים של מערכות הסינון המובילות בישראל – <strong className="text-foreground">הדרן (Hadran)</strong>, <strong className="text-foreground">עסקן (Askan)</strong> ו<strong className="text-foreground">כושר פליי (Kosher Play)</strong>.
            </p>

            <h3 className="text-lg font-heading font-semibold text-foreground !mb-2">סינון לכל סוגי המכשירים והפלטפורמות</h3>
            <p>
              אנחנו מתמחים ב<strong className="text-foreground">סינון לכל מכשיר בשוק</strong>: <strong className="text-foreground">סינון אייפון (iPhone)</strong> – כל הדגמים כולל iPhone 15, 14, 13 ומטה. <strong className="text-foreground">סינון סמסונג גלקסי (Galaxy)</strong> – כולל Galaxy S24, Galaxy A, Galaxy Note. <strong className="text-foreground">סינון שיאומי (Xiaomi)</strong> – כולל מכשירי Qin F21 Pro ו-Qin F25 עם צריבת גרסה כשרה. <strong className="text-foreground">סינון וואווי (Huawei)</strong>, <strong className="text-foreground">סינון אופו (Oppo)</strong>, <strong className="text-foreground">סינון ואן פלוס (OnePlus)</strong> – כל מכשיר אנדרואיד.
            </p>
            <p>
              לא רק טלפונים – אנחנו מספקים גם פתרונות <strong className="text-foreground">סינון למחשב</strong>, <strong className="text-foreground">סינון לטאבלט</strong> (כולל <strong className="text-foreground">אייפד iPad</strong> וטאבלטים אנדרואיד), ו<strong className="text-foreground">סינון אינטרנט ביתי</strong>. הכתובת האחת והיחידה לכל צרכי הסינון שלכם.
            </p>

            <h3 className="text-lg font-heading font-semibold text-foreground !mb-2">חברות הסינון המובילות בישראל</h3>
            <p>
              <strong className="text-foreground">התקנת הדרן באשדוד</strong> – ההגנה ההרמטית ביותר בשוק, גרסת מערכת שלמה שלא ניתנת להסרה. מחיר: <strong className="text-foreground">300₪</strong>. <strong className="text-foreground">התקנת עסקן באשדוד</strong> – סינון AI חכם עם צריבה עמוקה, מושלם לאנשי עסקים. מחיר: <strong className="text-foreground">300₪</strong>. <strong className="text-foreground">התקנת כושר פליי</strong> – חנות אפליקציות כשרה עם MDM ווואטסאפ מסונן. מחיר: <strong className="text-foreground">70₪</strong>. <strong className="text-foreground">סינון בסיסי</strong> לאייפון, גלקסי ואנדרואיד – מ-<strong className="text-foreground">100₪</strong> בלבד.
            </p>

            <h3 className="text-lg font-heading font-semibold text-foreground !mb-2">למה לבחור ב-FilterPhone?</h3>
            <p>
              <strong className="text-foreground">500+ לקוחות מרוצים</strong> עם דירוג <strong className="text-foreground">5 כוכבים</strong>. שירות ביום הפנייה. מחירים הנמוכים ביותר בשוק. ניסיון רב בכל סוגי המכשירים. תמיכה טכנית גם אחרי ההתקנה. אנו ממוקמים ב<strong className="text-foreground">רחוב חטיבת גבעתי 2, רובע ג׳, אשדוד</strong>. לתיאום: <strong className="text-foreground">052-718-6881</strong>.
            </p>
            <p>
              בין אם אתם מחפשים <strong className="text-foreground">סינון טלפון לילדים</strong>, <strong className="text-foreground">סינון טלפון זול</strong>, <strong className="text-foreground">חסימת אינטרנט באשדוד</strong>, <strong className="text-foreground">סינון תוכן למבוגרים</strong>, או פתרון הרמטי ברמה הגבוהה ביותר כמו <strong className="text-foreground">הדרן</strong> – FilterPhone פילטר פון הוא הכתובת שלכם. <strong className="text-foreground">כל מכשיר, כל פלטפורמה, כל רמת סינון – מקום אחד.</strong>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
