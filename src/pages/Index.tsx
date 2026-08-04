import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Smartphone, Lock, Zap, Cpu, HeartHandshake, Star, CheckCircle, Phone, Youtube, MessageCircle } from "lucide-react";
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

      {/* Hero – 3D bento grid */}
      <section className="relative overflow-hidden bg-background bg-mesh scene-3d" aria-label="FilterPhone – סינון טלפונים באשדוד">
        <div className="absolute inset-0 bg-grid" />
        <div className="glow-orb w-[26rem] h-[26rem] bg-primary/40 -top-32 right-[-6rem]" />
        <div className="glow-orb w-[22rem] h-[22rem] bg-accent/30 top-40 left-[-5rem]" />
        <div className="glow-orb w-[20rem] h-[20rem] bg-secondary/25 bottom-[-6rem] left-1/3" />

        <div className="relative container-custom py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:auto-rows-[168px]">
            {/* Main hero tile */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="tile-3d md:col-span-8 md:row-span-3 p-7 md:p-10 flex flex-col justify-between overflow-hidden"
            >
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-semibold mb-6">
                  <Shield className="w-4 h-4" />
                  משווק מורשה – הדרן, עסקן, כושר פליי
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] tracking-tight mb-5 text-balance">
                  {heroTitle}
                  <span className="block mt-2 gradient-text text-glow">{heroSubtitle}</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">{heroDesc}</p>
              </div>

              <div className="relative z-10 flex flex-wrap items-center gap-3 mt-8">
                <a href="tel:0527186881">
                  <Button size="lg" className="gradient-primary text-white border-0 h-12 px-7 text-base gap-2 shadow-lg shadow-primary/30 hover:scale-[1.03] transition-transform">
                    <Phone className="w-4 h-4" />
                    052-718-6881
                  </Button>
                </a>
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="h-12 px-7 text-base bg-white/5 border-white/15 hover:bg-white/10 backdrop-blur-md">
                    WhatsApp – הזמן עכשיו
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* FilterTube tile */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="tile-3d md:col-span-4 md:row-span-2 p-7 flex flex-col justify-center text-center card-shine"
            >
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-highlight flex items-center justify-center mb-4 shadow-lg shadow-accent/30">
                  <Youtube className="w-8 h-8 text-white" />
                </div>
                <span className="text-[0.7rem] font-bold tracking-[0.2em] text-highlight mb-2">חדש</span>
                <h2 className="text-2xl font-heading font-bold mb-2">FilterTube</h2>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  יוטיוב מסונן וכשר – ללא פרסומות וללא תכנים לא הולמים, עם 3 רמות סינון ומנעול הורים.
                </p>
                <Link to="/filtertube" className="w-full">
                  <Button className="w-full h-11 bg-white text-background hover:bg-white/90 font-bold gap-2">
                    לעמוד FilterTube
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="tile-3d md:col-span-2 p-6 flex flex-col justify-center">
              <div className="text-3xl font-heading font-bold gradient-text leading-none mb-1">500+</div>
              <div className="text-xs text-muted-foreground tracking-wider">לקוחות מרוצים</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="tile-3d md:col-span-2 p-6 flex flex-col justify-center">
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="w-4 h-4 fill-highlight text-highlight" />
                ))}
              </div>
              <div className="text-xs text-muted-foreground tracking-wider">5 כוכבים בגוגל</div>
            </motion.div>

            {/* Price anchor */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="tile-3d md:col-span-3 p-6 flex flex-col items-center justify-center gradient-border">
              <div className="text-xs font-bold text-secondary mb-1">סינון בסיסי החל מ-</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-heading font-bold">100</span>
                <span className="text-xl font-bold text-muted-foreground">₪</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">התקנה תוך 5 דקות</div>
            </motion.div>

            {/* Authorized partners */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} className="tile-3d md:col-span-5 p-6 flex items-center justify-around gap-3">
              {["הדרן", "עסקן", "כושר פליי"].map((brand, i) => (
                <div key={brand} className="flex items-center gap-3">
                  {i > 0 && <span className="h-6 w-px bg-white/10" />}
                  <span className="text-sm font-heading font-bold text-muted-foreground">{brand}</span>
                </div>
              ))}
            </motion.div>

            {/* WhatsApp helper */}
            <motion.a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="tile-3d md:col-span-4 p-6 flex items-center gap-4 group"
            >
              <span className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-lg shadow-[#25D366]/30">
                <MessageCircle className="w-6 h-6 text-white" />
              </span>
              <span className="flex flex-col text-right">
                <span className="font-bold text-foreground">צריכים עזרה בבחירה?</span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">דברו איתנו בוואטסאפ</span>
              </span>
            </motion.a>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Features */}
      <section className="section-padding bg-background bg-mesh scene-3d" aria-label="יתרונות FilterPhone">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4 text-balance">
                למה לבחור ב-<span className="gradient-text">FilterPhone</span>?
              </h2>
              <p className="text-muted-foreground text-lg">המומחים לסינון טלפונים והגנה דיגיטלית באשדוד</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "הגנה מקצועית", desc: "פתרונות סינון ברמה הגבוהה ביותר עם שכבות הגנה מרובות – הדרן, עסקן וכושר פליי", color: "from-primary to-accent" },
              { icon: Smartphone, title: "כל מכשיר, כל פלטפורמה", desc: "אייפון, גלקסי, סמסונג, שיאומי, וואווי, אנדרואיד, טאבלט ומחשב – הכתובת לכל סוג מכשיר", color: "from-secondary to-primary" },
              { icon: Zap, title: "שירות מהיר", desc: "התקנה מקצועית ומהירה. סינון בסיסי תוך 5 דקות, צריבה תוך 30-60 דקות", color: "from-highlight to-accent" },
              { icon: HeartHandshake, title: "מחירים הוגנים", desc: "סינון בסיסי מ-100₪ בלבד. מחירים שקופים ללא עלויות נסתרות, עם אחריות מלאה", color: "from-accent to-primary" },
            ].map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="tile-3d p-7 h-full card-shine">
                  <div className={`relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg shadow-primary/20`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="relative z-10 text-base font-heading font-bold text-card-foreground mb-2">{feature.title}</h3>
                  <p className="relative z-10 text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>


      {/* Filtering Services */}
      <section className="section-padding bg-background bg-mesh scene-3d" aria-label="שירותי סינון טלפונים">
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
                  className="tile-3d block p-6 group relative overflow-hidden card-shine"
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
                        <img src={service.logo_url} alt={`${service.name} לוגו`} className="w-11 h-11 rounded-xl object-contain bg-white/90 p-1.5" loading="lazy" />
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
      <section className="section-padding bg-background scene-3d" aria-label="שירותי צריבת גרסאות">
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
                  className="tile-3d block p-6 group card-shine"
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
