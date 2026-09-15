import { Link } from "react-router-dom";
import { ArrowLeft, Check, Minus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";
import { SOLUTIONS } from "@/lib/advisor";
import { waLink } from "@/lib/site";

const COMPARED = ["basic-filtering", "kosher-play", "askan", "hadran"];

/** The system we point most customers to today. */
const RECOMMENDED = "askan";

type Cell = boolean | string;

const criteria: { label: string; values: Record<string, Cell> }[] = [
  {
    label: "רמת הסינון",
    values: {
      "basic-filtering": "קלה עד בינונית, לבחירתכם",
      "kosher-play": "בינונית–גבוהה",
      askan: "גבוהה",
      hadran: "הגבוהה ביותר",
    },
  },
  {
    label: "נעול בפני הסרה",
    values: { "basic-filtering": false, "kosher-play": true, askan: true, hadran: true },
  },
  {
    label: "עמיד לאיפוס יצרן",
    values: { "basic-filtering": false, "kosher-play": true, askan: true, hadran: true },
  },
  {
    label: "שומר על התוכן שבמכשיר",
    values: { "basic-filtering": true, "kosher-play": true, askan: false, hadran: false },
  },
  {
    label: "חנות אפליקציות כשרה",
    values: { "basic-filtering": false, "kosher-play": true, askan: false, hadran: false },
  },
  {
    label: "סינון תמונות חכם",
    values: { "basic-filtering": false, "kosher-play": true, askan: true, hadran: true },
  },
  {
    label: "מתאים לאייפון",
    values: { "basic-filtering": true, "kosher-play": false, askan: "לדגמים נבחרים", hadran: "לדגמים נבחרים" },
  },
  {
    label: "מתאים לשימוש עבודה",
    values: { "basic-filtering": true, "kosher-play": "חלקית", askan: true, hadran: "חלקית" },
  },
];

const bestFor: Record<string, string> = {
  "basic-filtering": "מי שרוצה חסימה ממוקדת ומהירה בלי לשנות את אופן השימוש במכשיר.",
  "kosher-play": "מי שרוצה מכשיר שנשאר שמיש, עם חנות אפליקציות כשרה ווואטסאפ מסונן.",
  askan: "רוב הלקוחות שלנו: הגנה חזקה יחד עם מכשיר שממשיך לתפקד ביום-יום.",
  hadran: "מי שרוצה את האטימות המרבית — הגנה שלא ניתן לעקוף או להסיר בשום דרך.",
};

const CellValue = ({ value }: { value: Cell }) => {
  if (value === true) return <Check className="mx-auto h-[1.125rem] w-[1.125rem] text-success" aria-label="כן" />;
  if (value === false) return <Minus className="mx-auto h-[1.125rem] w-[1.125rem] text-border-strong" aria-label="לא" />;
  return <span className="text-[0.8125rem] text-ink-soft">{value}</span>;
};

const Compare = () => {
  const cols = COMPARED.map((slug) => SOLUTIONS[slug]);

  return (
    <>
      <SEOHead
        title="הדרן או עסקן או כושר פליי? השוואת מערכות סינון | FilterPhone"
        description="השוואה מלאה בין מערכות הסינון בישראל: הדרן, עסקן, כושר פליי וסינון בסיסי. רמת סינון, עמידות לאיפוס, מה קורה לנתונים, מחיר ולמי כל מערכת מתאימה."
        path="/compare"
        keywords="הדרן או עסקן, השוואת מערכות סינון, מה ההבדל בין הדרן לעסקן, כושר פליי מול הדרן, איזה סינון הכי טוב"
      />
      <Breadcrumbs items={[{ label: "השוואת מערכות סינון" }]} />

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            eyebrow="השוואה"
            title="הדרן, עסקן או כושר פליי – מה ההבדל באמת"
            lead="אנחנו עובדים מול כל החברות, ולכן אין לנו אינטרס לדחוף מערכת אחת. הטבלה הזו אומרת את זה כמו שזה."
          />

          {/* Table (md and up) */}
          <AnimatedSection delay={0.08} className="mt-12 hidden md:block">
            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
              <table className="w-full min-w-[46rem] text-center">
                <caption className="sr-only">השוואה בין מערכות הסינון שאנחנו מתקינים</caption>
                <thead>
                  <tr className="border-b border-border bg-surface-sunken">
                    <th scope="col" className="w-48 px-5 py-4 text-right text-[0.8125rem] font-semibold text-muted-foreground">
                      מה משווים
                    </th>
                    {cols.map((c) => (
                      <th key={c.slug} scope="col" className="px-5 py-4">
                        {c.slug === RECOMMENDED && (
                          <span className="mb-1.5 inline-block rounded-sm bg-accent px-2 py-0.5 text-[0.6875rem] font-bold text-accent-foreground">
                            ההמלצה שלנו
                          </span>
                        )}
                        <span className="block text-[0.9375rem] font-bold text-ink">{c.shortName}</span>
                        <span className="num mt-1 block text-lg font-extrabold text-primary">{c.priceLabel}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {criteria.map((row) => (
                    <tr key={row.label} className="transition-colors hover:bg-surface-sunken">
                      <th scope="row" className="px-5 py-3.5 text-right text-[0.875rem] font-semibold text-ink">
                        {row.label}
                      </th>
                      {cols.map((c) => (
                        <td key={c.slug} className="px-5 py-3.5">
                          <CellValue value={row.values[c.slug]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-surface-sunken">
                    <th scope="row" className="px-5 py-4 text-right text-[0.875rem] font-semibold text-ink">
                      למי זה מתאים
                    </th>
                    {cols.map((c) => (
                      <td key={c.slug} className="px-5 py-4 text-[0.8125rem] leading-relaxed text-ink-soft">
                        {bestFor[c.slug]}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td />
                    {cols.map((c) => (
                      <td key={c.slug} className="px-5 py-4">
                        <Link to={`/services/${c.slug}`}>
                          <Button variant="outline" size="sm" className="w-full">לפרטים</Button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </AnimatedSection>

          {/* Stacked cards (mobile) */}
          <div className="mt-12 space-y-4 md:hidden">
            {cols.map((c, i) => (
              <AnimatedSection key={c.slug} delay={i * 0.05}>
                <div className="panel p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-lg font-bold text-ink">
                      {c.shortName}
                      {c.slug === RECOMMENDED && (
                        <span className="mr-2 inline-block rounded-sm bg-accent px-2 py-0.5 align-middle text-[0.6875rem] font-bold text-accent-foreground">
                          ההמלצה שלנו
                        </span>
                      )}
                    </h2>
                    <span className="num text-xl font-extrabold text-primary">{c.priceLabel}</span>
                  </div>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{bestFor[c.slug]}</p>
                  <dl className="mt-4 divide-y divide-border border-t border-border">
                    {criteria.map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="text-[0.8125rem] text-muted-foreground">{row.label}</dt>
                        <dd className="text-[0.8125rem] font-medium text-ink">
                          {row.values[c.slug] === true ? "כן" : row.values[c.slug] === false ? "לא" : row.values[c.slug]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Link to={`/services/${c.slug}`} className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary">
                    לפרטים המלאים
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Editorial explanation — the part search engines and people both read */}
          <div className="mt-16 max-w-3xl">
            <h2 className="text-display-sm">איך לבחור, בפועל</h2>
            <div className="prose-fp mt-5">
              <h3>מתי בוחרים עסקן — ההמלצה שלנו כיום</h3>
              <p>
                <strong>עסקן</strong> הוא הפתרון שאנחנו מפנים אליו את רוב הלקוחות היום. הוא צריבה
                עמוקה ברמת הגנה גבוהה, עם סינון תמונות מבוסס AI, אבל נבנה מזווית של מכשיר שממשיך
                לתפקד — ולא סביבה סגורה שמקשה על היום-יום. במחיר 300₪ הוא נותן את האיזון הטוב ביותר
                בין הגנה לבין מכשיר שאפשר לחיות איתו. נדרש מכשיר מאופס או חדש.
              </p>

              <h3>מתי בוחרים הדרן</h3>
              <p>
                <strong>הדרן</strong> הוא הפתרון שלוקחים כשההגנה חייבת להיות מוחלטת, בלי שום פשרה.
                זו לא אפליקציה שמותקנת מעל המערכת אלא <strong>גרסת מערכת שלמה</strong>, ולכן איפוס
                להגדרות יצרן לא מוריד אותו — זו רמת האטימות הגבוהה ביותר שאנחנו מתקינים. בתמורה,
                ההתקנה דורשת מכשיר מאופס וגיבוי מלא מראש, והמכשיר נשאר בסביבה סגורה יחסית.
              </p>

              <h3>מתי בוחרים כושר פליי</h3>
              <p>
                <strong>כושר פליי</strong> הוא האיזון: 70₪, התקנה של כחצי שעה, בלי למחוק כלום מהמכשיר.
                מקבלים חנות אפליקציות כשרה, וואטסאפ בלי תמונות פרופיל וסטטוסים, וסינון תמונות ב-VPN
                מקומי שלא מאט את הגלישה. צריבת ה-MDM שבתוכו מונעת איפוס והסרה.
              </p>

              <h3>מתי סינון בסיסי מספיק</h3>
              <p>
                אם המטרה היא לחסום תכנים פוגעניים ופרסומות, ואולי גם רשתות חברתיות, בלי לשנות שום
                דבר אחר במכשיר – <strong>סינון בסיסי</strong> ב-100₪ יעשה את העבודה תוך חמש דקות.
                הוא גם הפתרון היחיד כאן שאפשר לשנות ולהסיר בקלות, מה שמתאים למבוגרים שבוחרים
                בסינון מרצון.
              </p>

              <p>
                מתלבטים? <Link to="/#advisor">יועץ הסינון באתר</Link> ידרג את כל האפשרויות לפי
                התשובות שלכם, או שפשוט תשלחו לנו הודעה ונעבור על זה יחד. את המחירים המלאים אפשר
                לראות ב<Link to="/pricing">מחירון</Link>.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={waLink("שלום פילטר פון, אשמח להתייעץ איזו מערכת סינון מתאימה לי")} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  להתייעצות בוואטסאפ
                </Button>
              </a>
              <Link to="/#advisor">
                <Button variant="outline">ליועץ הסינון</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Compare;
