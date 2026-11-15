import { BadgeCheck, Clock3, MessageCircle, Phone, ShieldCheck, Smartphone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SITE, waLink } from "@/lib/site";
import { processSteps } from "@/lib/lab";

/**
 * The lab's own story: who we are as an installer, why to choose us, and how
 * an order goes. These blocks made the homepage very long, so they live on the
 * services page now. The wording is unchanged from when they were on the
 * homepage, including the title and description the owner edits in the admin.
 */

const valueProps = [
  {
    icon: BadgeCheck,
    title: "משווק מורשה, לא מתווך",
    body: "אנחנו מורשים רשמית להתקין הדרן, עסקן וכושר פליי. הצריבה נעשית כאן, במעבדה, ולא נשלחת לאף אחד אחר.",
  },
  {
    icon: Smartphone,
    title: "כל מכשיר, כל פלטפורמה",
    body: "אייפון, סמסונג גלקסי, שיאומי, וואווי וכל אנדרואיד. גם טאבלטים, מחשבים ומכשירי Qin כשרים.",
  },
  {
    icon: Clock3,
    title: "התקנה ביום הפנייה",
    body: "סינון בסיסי מוכן תוך חמש דקות. צריבה מלאה של הדרן או עסקן – בין 45 ל-90 דקות, בתיאום מראש.",
  },
  {
    icon: Wrench,
    title: "מלווים גם אחרי ההתקנה",
    body: "רוצים לשנות רמת סינון, לפתוח אפליקציה או להבין איך משהו עובד? מרימים טלפון ופותרים.",
  },
];

/** The admin-edited title and description, with the contact buttons and the lab's numbers. */
export const LabIntro = () => {
  const { data: settings } = useSiteSettings();
  const wa = settings?.whatsapp_link || SITE.whatsapp;
  const heroTitle = settings?.hero_title || "סינון טלפונים מקצועי";
  const heroSubtitle = settings?.hero_subtitle || "וצריבת גרסאות, באשדוד";
  const heroDesc =
    settings?.hero_description ||
    "משווק מורשה של הדרן, עסקן וכושר פליי. מתקינים סינון לאייפון, לגלקסי, לכל אנדרואיד, לטאבלט ולמחשב – וצורבים גרסאות כשרות למכשירי שיאומי Qin.";

  return (
    <section className="border-t border-border" aria-label="המעבדה שלנו">
      <div className="container-custom py-16 md:py-20">
        <AnimatedSection className="max-w-3xl">
          <span className="flex w-fit items-center gap-2 rounded-sm border border-border bg-surface-sunken px-3 py-1.5 text-[0.8125rem] font-semibold text-ink-soft">
            <ShieldCheck className="h-4 w-4 text-primary/70" />
            משווק מורשה · הדרן · עסקן · כושר פליי
          </span>

          <h2 className="mt-5 text-display-lg text-ink">
            {heroTitle}
            <span className="mt-2 block text-ink-soft">{heroSubtitle}</span>
          </h2>

          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">{heroDesc}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={`tel:${SITE.phoneRaw}`}>
              <Button size="lg" className="gap-2">
                <Phone className="h-4 w-4" />
                <span className="num">{SITE.phone}</span>
              </Button>
            </a>
            <a href={waLink("שלום פילטר פון, אשמח לקבל פרטים על סינון", wa)} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                שליחת הודעה בוואטסאפ
              </Button>
            </a>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-7">
            {[
              { value: "500+", label: "מכשירים סוננו" },
              { value: "5 דק׳", label: "סינון בסיסי מוכן" },
              { value: "6", label: "פתרונות סינון" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="num block text-2xl font-extrabold text-ink md:text-[1.75rem]">{stat.value}</span>
                  <span className="mt-1 block text-[0.8125rem] leading-snug text-muted-foreground">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </AnimatedSection>
      </div>
    </section>
  );
};

export const WhyUs = () => (
  <section className="section-padding" aria-label="למה לבחור ב-FilterPhone">
    <div className="container-custom">
      <SectionHeading
        eyebrow="למה אנחנו"
        title="סינון זה לא רק להתקין אפליקציה"
        lead="אנחנו עובדים מול כל חברות הסינון המובילות בישראל, ולכן אנחנו לא צריכים לדחוף לכם פתרון אחד. הפתרון שנציע הוא זה שמתאים למכשיר, לגיל ולשימוש שלכם."
      />

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        {valueProps.map((v, i) => (
          <AnimatedSection key={v.title} delay={i * 0.06}>
            <div className="h-full bg-surface p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-tint text-primary">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{v.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">{v.body}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export const Process = () => (
  <section className="section-padding bg-surface-sunken" aria-label="איך זה עובד">
    <div className="container-custom">
      <SectionHeading eyebrow="איך זה עובד" title="שלושה שלבים, בלי הפתעות" />
      <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
        {processSteps.map((s, i) => (
          <li key={s.title} className="bg-surface p-7">
            <AnimatedSection delay={i * 0.07}>
              <span className="num block text-[0.8125rem] font-bold tracking-widest text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">{s.body}</p>
            </AnimatedSection>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
