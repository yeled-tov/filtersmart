import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, Lock, Clock3, HardDriveDownload, ShieldCheck, Star } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { useServices, fallbackServices } from "@/hooks/useServices";
import { SOLUTIONS } from "@/lib/advisor";
import { SITE } from "@/lib/site";
import { FILTERPHONE } from "@/lib/filterphoneApp";

const ServiceCard = ({
  slug, name, price, desc, logo, popular,
}: { slug: string; name: string; price: string; desc: string | null; logo?: string | null; popular?: boolean }) => {
  const profile = SOLUTIONS[slug];
  return (
    <Link to={`/services/${slug}`} className="group relative flex h-full flex-col panel panel-hover p-6">
      {popular && (
        <span className="absolute left-6 top-6 rounded-sm bg-accent px-2.5 py-1 text-[0.6875rem] font-bold text-accent-foreground">
          ההמלצה שלנו
        </span>
      )}
      <div className="flex items-start gap-3.5">
        {logo ? (
          <img src={logo} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 shrink-0 rounded-md border border-border object-contain p-1.5" />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
            <Lock className="h-5 w-5" />
          </span>
        )}
        <h3 className="mt-1 text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">{name}</h3>
      </div>

      <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">{desc}</p>

      {profile && (
        <ul className="mt-5 space-y-1.5 text-[0.8125rem] text-muted-foreground">
          <li className="flex items-center gap-2">
            <Clock3 className="h-3.5 w-3.5 shrink-0" />
            זמן התקנה: {profile.installTime}
          </li>
          <li className="flex items-center gap-2">
            <HardDriveDownload className="h-3.5 w-3.5 shrink-0" />
            {profile.wipesDevice ? "דורש מכשיר מאופס וגיבוי מראש" : "לא מוחק נתונים מהמכשיר"}
          </li>
        </ul>
      )}

      <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
          מה כלול בשירות
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        </span>
        <span className="num text-2xl font-extrabold text-ink">{price}</span>
      </div>
    </Link>
  );
};

const Services = () => {
  const { data: services } = useServices();
  const allServices = services && services.length > 0 ? services : fallbackServices;
  const filtering = allServices.filter((s) => s.category === "filtering");
  const flashing = allServices.filter((s) => s.category === "flashing");

  return (
    <>
      <SEOHead
        title="שירותי סינון טלפון באשדוד | אייפון, גלקסי, אנדרואיד – FilterPhone"
        description="כל שירותי הסינון של FilterPhone במקום אחד: הסינון שלנו FilterPhone (150₪ לשנה), סינון בסיסי 100₪, כושר פליי 70₪, הדרן 300₪, עסקן 300₪ וצריבת גרסה למכשירי Qin 70₪."
        path="/services"
        keywords="סינון טלפון אשדוד, סינון אייפון, סינון גלקסי, התקנת הדרן, כושר פליי התקנה, עסקן התקנה, צריבת גרסה שיאומי"
      />
      <Breadcrumbs items={[{ label: "שירותים" }]} />

      <section className="section-padding" aria-label="שירותי סינון וצריבה">
        <div className="container-custom">
          <SectionHeading
            as="h1"
            eyebrow="השירותים שלנו"
            title="כל רמות הסינון, בשקיפות מלאה"
            lead="בכל כרטיס כתוב כמה זה עולה, כמה זמן ההתקנה לוקחת ומה קורה לתוכן שבמכשיר. בעמוד של כל שירות תמצאו את הפירוט המלא."
          />

          {/* Our own filter, first and marked as the recommendation */}
          <AnimatedSection className="mt-12">
            <Link
              to="/"
              className="group relative grid gap-6 overflow-hidden rounded-xl border-2 border-primary/25 bg-primary-tint/40 p-6 transition-colors hover:border-primary/50 md:grid-cols-[1fr_auto] md:items-center md:p-8"
            >
              {/* In the flow on phones, so it can never sit on top of the heading */}
              <span className="flex w-fit items-center gap-1 rounded-sm bg-accent px-2.5 py-1 text-[0.6875rem] font-bold text-accent-foreground md:absolute md:left-6 md:top-6">
                <Star className="h-3 w-3 fill-current" />
                ההמלצה שלנו
              </span>
              <div className="flex items-start gap-4">
                <img src="/filterphone-app-icon.png" alt="" width={52} height={52} className="h-[3.25rem] w-[3.25rem] shrink-0 rounded-xl" />
                <div className="min-w-0">
                  <span className="eyebrow">הסינון שלנו</span>
                  <h2 className="mt-2 text-xl font-bold text-ink transition-colors group-hover:text-primary md:text-2xl">
                    FilterPhone — סינון לטלפון אנדרואיד
                  </h2>
                  <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft">
                    הטלפון נשאר חכם ופתוח, ומה שעובר בו מסונן: סינון תמונות בשלוש רמות, ארבע רמות גלישה,
                    וואטסאפ מסונן וניהול מכשיר מלא. התקנה מהטלפון עצמו, ברוב הטלפונים בלי איפוס.
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.8125rem] text-muted-foreground">
                    <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 shrink-0" />ניהול מכשיר מלא</li>
                    <li className="flex items-center gap-1.5"><HardDriveDownload className="h-3.5 w-3.5 shrink-0" />לא מוחק נתונים מהמכשיר</li>
                    <li className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 shrink-0" />{FILTERPHONE.android}</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-end justify-between gap-6 border-t border-border pt-4 md:flex-col md:items-end md:border-0 md:pt-0">
                <span className="text-left">
                  <span className="num block text-3xl font-extrabold text-primary">{FILTERPHONE.price.label}</span>
                  <span className="block text-[0.8125rem] text-muted-foreground">{FILTERPHONE.price.period}, למכשיר</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                  לכל הפרטים ולהורדה
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          </AnimatedSection>

          <div className="mt-12">
            <AnimatedSection>
              <div className="rule-label mb-6">
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary/70" />
                  סינון טלפונים והגנה דיגיטלית
                </span>
              </div>
            </AnimatedSection>
            <div className="grid gap-4 md:grid-cols-2">
              {filtering.map((s, i) => (
                <AnimatedSection key={s.slug} delay={i * 0.05}>
                  <ServiceCard
                    slug={s.slug}
                    name={s.name}
                    price={s.price}
                    desc={s.short_desc}
                    logo={s.logo_url}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <AnimatedSection>
              <div className="rule-label mb-6">
                <span className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary/70" />
                  צריבת גרסאות כשרות למכשירי שיאומי Qin
                </span>
              </div>
            </AnimatedSection>
            <div className="grid gap-4 md:grid-cols-2">
              {flashing.map((s, i) => (
                <AnimatedSection key={s.slug} delay={i * 0.05}>
                  <ServiceCard slug={s.slug} name={s.name} price={s.price} desc={s.short_desc} />
                </AnimatedSection>
              ))}
            </div>
          </div>

          <AnimatedSection className="mt-14">
            <div className="flex flex-col items-center gap-5 rounded-lg border border-border bg-surface-sunken p-8 text-center">
              <h2 className="text-display-sm">עדיין מתלבטים?</h2>
              <p className="max-w-lg text-[0.9375rem] leading-relaxed text-ink-soft">
                יועץ הסינון שלנו ידרג את כל הפתרונות לפי הגיל, המכשיר והשימוש שלכם – ויסביר למה כל אחד
                מהם מתאים או לא. אפשר גם פשוט להשוות בין המערכות.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/#advisor">
                  <Button>ליועץ הסינון</Button>
                </Link>
                <Link to="/compare">
                  <Button variant="outline">להשוואה בין המערכות</Button>
                </Link>
                <a href={`tel:${SITE.phoneRaw}`}>
                  <Button variant="outline">
                    <span className="num">{SITE.phone}</span>
                  </Button>
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Services;
