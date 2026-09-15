import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Check, MessageCircle, Minus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { SOLUTIONS } from "@/lib/advisor";
import { SITE, waLink } from "@/lib/site";

const ORDER = ["kosher-play", "basic-filtering", "hadran", "askan", "qin-f21-pro", "qin-f25"];

const includes: Record<string, string[]> = {
  "basic-filtering": [
    "חסימת אתרים ותכנים פוגעניים",
    "רמת סינון לבחירה, כולל חסימת רשתות חברתיות",
    "חסימת App Store באייפון (אופציונלי)",
    "אינו מאט את מהירות הגלישה",
  ],
  "kosher-play": [
    "חנות אפליקציות כשרה מאושרת",
    "וואטסאפ ללא תמונות פרופיל וסטטוסים",
    "סינון תמונות ב-VPN מקומי",
    "צריבת MDM שמונעת איפוס והסרה",
  ],
  hadran: [
    "גרסת מערכת שלמה עם סינון מוסמך",
    "לא ניתן להסרה – גם לא באיפוס יצרן",
    "רמת ההגנה הגבוהה ביותר שיש לנו",
    "הבחירה הנפוצה ביותר אצל הורים",
  ],
  askan: [
    "סינון תמונות חכם מבוסס AI",
    "צריבה עמוקה על מכשיר מאופס או חדש",
    "בנוי לשימוש עבודה יומיומי",
    "מיועד לאנשי עסקים",
  ],
  "qin-f21-pro": [
    "גרסה כשרה מותאמת ל-Qin F21 Pro",
    "סינון מובנה מהרגע הראשון",
    "ממשק מותאם למכשיר",
  ],
  "qin-f25": [
    "גרסה כשרה מותאמת ל-Qin F25",
    "סינון מובנה מהרגע הראשון",
    "אופטימיזציה מלאה למכשיר",
  ],
};

const Pricing = () => {
  const rows = ORDER.map((slug) => SOLUTIONS[slug]);

  const offersJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "מחירון סינון טלפונים וצריבת גרסאות – FilterPhone אשדוד",
    url: `${SITE.url}/pricing`,
    provider: { "@id": `${SITE.url}/#business` },
    itemListElement: rows.map((s, i) => ({
      "@type": "Offer",
      position: i + 1,
      price: String(s.price),
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/services/${s.slug}`,
      itemOffered: { "@type": "Service", name: s.name, description: s.summary },
    })),
  };

  return (
    <>
      <SEOHead
        title="מחירון סינון טלפון 2026 – כמה עולה סינון באשדוד | FilterPhone"
        description="מחירון מלא ושקוף: סינון בסיסי 100₪, כושר פליי 70₪, הדרן 300₪, עסקן 300₪, צריבת גרסה Qin 70₪. מה כלול בכל פתרון, כמה זמן ההתקנה לוקחת ומה קורה לנתונים שבמכשיר."
        path="/pricing"
        keywords="מחיר סינון טלפון, כמה עולה סינון טלפון, מחירון סינון, מחיר הדרן, מחיר עסקן, מחיר כושר פליי, סינון טלפון זול"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(offersJsonLd)}</script>
      </Helmet>
      <Breadcrumbs items={[{ label: "מחירון" }]} />

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            eyebrow="מחירון"
            title="כמה עולה סינון טלפון אצלנו"
            lead="כל המחירים כוללים את ההתקנה, ואין עלויות נסתרות. אם פתרון זול יותר עושה את העבודה עבורכם – זה מה שנמליץ."
          />

          {/* Comparison table (desktop) */}
          <AnimatedSection delay={0.08} className="mt-12 hidden lg:block">
            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              <table className="w-full text-right">
                <caption className="sr-only">מחירון שירותי הסינון וצריבת הגרסאות של FilterPhone</caption>
                <thead>
                  <tr className="border-b border-border bg-surface-sunken text-[0.8125rem] text-muted-foreground">
                    <th scope="col" className="px-6 py-3.5 font-semibold">השירות</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">מחיר</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">זמן התקנה</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">נתונים במכשיר</th>
                    <th scope="col" className="px-6 py-3.5 font-semibold">ניתן להסרה</th>
                    <th scope="col" className="px-6 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((s) => (
                    <tr key={s.slug} className="transition-colors hover:bg-surface-sunken">
                      <th scope="row" className="px-6 py-4 text-right">
                        <span className="block font-bold text-ink">{s.name}</span>
                        <span className="mt-0.5 block text-[0.8125rem] font-normal text-muted-foreground">{s.summary}</span>
                      </th>
                      <td className="num px-6 py-4 text-lg font-extrabold text-primary">{s.priceLabel}</td>
                      <td className="px-6 py-4 text-sm text-ink-soft">{s.installTime}</td>
                      <td className="px-6 py-4 text-sm text-ink-soft">
                        {s.wipesDevice ? "נדרש גיבוי – מכשיר מאופס" : "נשמרים כפי שהם"}
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-soft">
                        {s.removable ? (
                          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" />כן</span>
                        ) : (
                          <span className="flex items-center gap-1.5"><Minus className="h-4 w-4 text-muted-foreground" />לא</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/services/${s.slug}`} className="flex items-center gap-1 text-sm font-semibold text-primary">
                          לפרטים
                          <ArrowLeft className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>

          {/* Cards (mobile + tablet) */}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:hidden">
            {rows.map((s, i) => (
              <AnimatedSection key={s.slug} delay={i * 0.05}>
                <div className="flex h-full flex-col panel p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-bold text-ink">{s.name}</h2>
                    <span className="num shrink-0 text-2xl font-extrabold text-primary">{s.priceLabel}</span>
                  </div>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{s.summary}</p>
                  <dl className="mt-4 space-y-1.5 text-[0.8125rem] text-muted-foreground">
                    <div className="flex justify-between gap-3"><dt>זמן התקנה</dt><dd className="font-medium text-ink-soft">{s.installTime}</dd></div>
                    <div className="flex justify-between gap-3"><dt>נתונים</dt><dd className="font-medium text-ink-soft">{s.wipesDevice ? "נדרש גיבוי" : "נשמרים"}</dd></div>
                    <div className="flex justify-between gap-3"><dt>ניתן להסרה</dt><dd className="font-medium text-ink-soft">{s.removable ? "כן" : "לא"}</dd></div>
                  </dl>
                  <Link to={`/services/${s.slug}`} className="mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-sm font-semibold text-primary">
                    לפרטים המלאים
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* What each one includes */}
          <div className="mt-16">
            <AnimatedSection>
              <h2 className="text-display-sm">מה כלול בכל פתרון</h2>
            </AnimatedSection>
            <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
              {rows.map((s, i) => (
                <AnimatedSection key={s.slug} delay={i * 0.04}>
                  <div className="h-full bg-surface p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-base font-bold text-ink">{s.shortName}</h3>
                      <span className="num font-extrabold text-primary">{s.priceLabel}</span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {(includes[s.slug] ?? []).map((f) => (
                        <li key={f} className="flex gap-2 text-[0.875rem] leading-relaxed text-ink-soft">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <AnimatedSection className="mt-14">
            <div className="flex flex-col items-center gap-5 rounded-lg border border-border bg-surface-sunken p-8 text-center">
              <h2 className="text-display-sm">לא בטוחים איזה מחיר רלוונטי לכם?</h2>
              <p className="max-w-lg text-[0.9375rem] leading-relaxed text-ink-soft">
                שלחו לנו את דגם המכשיר ומה אתם רוצים לחסום, ונחזור עם מחיר מדויק ומה זה כולל.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={waLink("שלום פילטר פון, אשמח לקבל הצעת מחיר לסינון")} target="_blank" rel="noopener noreferrer">
                  <Button variant="whatsapp" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    לקבלת הצעת מחיר
                  </Button>
                </a>
                <a href={`tel:${SITE.phoneRaw}`}>
                  <Button variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="num">{SITE.phone}</span>
                  </Button>
                </a>
                <Link to="/#advisor">
                  <Button variant="outline">ליועץ הסינון</Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Pricing;
