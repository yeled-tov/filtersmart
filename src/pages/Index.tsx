import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Smartphone, Lock, Zap, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { services } from "@/data/services";
import heroBg from "@/assets/hero-bg.jpg";

const WA_LINK = "https://wa.me/972527186881?text=שלום%20פילטר%20סמארט%2C%20אשמח%20לקבל%20פרטים";

const filteringServices = services.filter((s) => s.category === "filtering");
const flashingServices = services.filter((s) => s.category === "flashing");

const Index = () => {
  return (
    <>
      <SEOHead
        title="FilterSmart – פילטר סמארט: סינון טלפונים וצריבת גרסאות באשדוד"
        description="המומחים לסינון טלפונים וצריבת גרסאות באשדוד. משווק מורשה הדרן, עסקן וכושר פליי. צריבת גרסה לשיאומי Qin F21/F22, סינון אייפון ואנדרואיד."
        path="/"
        keywords="סינון טלפון אשדוד, הדרן אשדוד, עסקן אשדוד, כושר פליי אשדוד, צריבת גרסה לשיאומי קין, חסימת אינטרנט באשדוד, פילטר סמארט"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" aria-hidden="true" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className="relative container-custom py-20 md:py-32 lg:py-40">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-primary-foreground/20">
              <Shield className="w-4 h-4" />
              משווק מורשה – הדרן, עסקן, כושר פליי
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-6">
              סינון טלפונים וצריבת
              <span className="block mt-2" style={{ color: "hsl(155, 55%, 55%)" }}>גרסאות באשדוד</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              FilterSmart (פילטר סמארט) – פתרונות סינון לאייפון ואנדרואיד, התקנת הדרן, עסקן, כושר פליי וצריבת גרסה למכשירי שיאומי Qin. שירות מקצועי ואמין באשדוד.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 text-base px-8">
                  לשירותים שלנו
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 text-base px-8">
                  דברו איתנו
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">למה FilterSmart?</h2>
            <p className="text-muted-foreground text-lg">פילטר סמארט – המומחים לסינון טלפונים והגנה דיגיטלית באשדוד</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "הגנה מקצועית", desc: "פתרונות סינון ברמה הגבוהה ביותר עם שכבות הגנה מרובות" },
              { icon: Smartphone, title: "תמיכה בכל המכשירים", desc: "אייפון, אנדרואיד ומכשירי שיאומי Qin – פתרון לכל סוגי המכשירים" },
              { icon: Zap, title: "שירות מהיר", desc: "התקנה מקצועית ומהירה, ללא איפוס המכשיר בשירותים הבסיסיים" },
            ].map((feature, i) => (
              <div key={i} className="bg-card rounded-xl p-8 card-shadow hover:card-shadow-hover transition-shadow group">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtering Services Category */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Lock className="w-4 h-4" />
              סינון טלפונים והגנה
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">שירותי סינון והגנה דיגיטלית</h2>
            <p className="text-muted-foreground text-lg">פתרונות סינון מקצועיים לאייפון ואנדרואיד – מסינון בסיסי ועד הגנה הרמטית</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteringServices.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {service.logo && (
                      <img src={service.logo} alt={`${service.name} לוגו`} className="w-10 h-10 rounded-lg object-contain bg-muted p-1" />
                    )}
                    <h3 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                  </div>
                  <span className="text-lg font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{service.shortDesc}</p>
                <div className="flex items-center text-primary text-sm font-medium">
                  <span>פרטים נוספים</span>
                  <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flashing Services Category */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
              <Cpu className="w-4 h-4" />
              צריבת גרסאות ומערכות
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">צריבת גרסאות למכשירי שיאומי Qin</h2>
            <p className="text-muted-foreground text-lg">צריבת גרסה כשרה ומותאמת למכשירי Qin F21 Pro ו-Qin F25</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {flashingServices.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <span className="text-lg font-bold gradient-text whitespace-nowrap mr-3">{service.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{service.shortDesc}</p>
                <div className="flex items-center text-primary text-sm font-medium">
                  <span>פרטים נוספים</span>
                  <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="relative container-custom py-16 md:py-24 text-center">
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">מוכנים להגן על הטלפון שלכם?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            צרו קשר עוד היום ונתאים לכם את פתרון הסינון המושלם
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 text-base px-8">
                WhatsApp
              </Button>
            </a>
            <a href="https://bitpay.co.il/app/me/0527186881" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8">
                שלם ב-BIT
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content Block */}
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
              אנו ממוקמים ברחוב חטיבת גבעתי 2, כניסה ו׳, אשדוד – ומספקים שירות אמין, מהיר ובמחירים הוגנים. בין אם אתם מחפשים סינון בסיסי ב-20₪ או פתרון הרמטי כמו הדרן, אנחנו כאן בשבילכם.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
