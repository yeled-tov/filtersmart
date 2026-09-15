import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, Lock, Clock3, HardDriveDownload } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { useServices, fallbackServices } from "@/hooks/useServices";
import { SOLUTIONS } from "@/lib/advisor";
import { SITE } from "@/lib/site";

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
        description="כל שירותי הסינון של FilterPhone במקום אחד: סינון בסיסי 100₪, כושר פליי 70₪, הדרן 300₪, עסקן 300₪ וצריבת גרסה למכשירי Qin 70₪. לכל מכשיר – אייפון, גלקסי, שיאומי ואנדרואיד."
        path="/services"
        keywords="סינון טלפון אשדוד, סינון אייפון, סינון גלקסי, התקנת הדרן, כושר פליי התקנה, עסקן התקנה, צריבת גרסה שיאומי"
      />
      <Breadcrumbs items={[{ label: "שירותים" }]} />

      <section className="section-padding" aria-label="שירותי סינון וצריבה">
        <div className="container-custom">
          <SectionHeading
            eyebrow="השירותים שלנו"
            title="כל רמות הסינון, בשקיפות מלאה"
            lead="בכל כרטיס כתוב כמה זה עולה, כמה זמן ההתקנה לוקחת ומה קורה לתוכן שבמכשיר. בעמוד של כל שירות תמצאו את הפירוט המלא."
          />

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
                    popular={s.slug === "askan"}
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
