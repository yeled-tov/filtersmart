import { Link } from "react-router-dom";
import { Award, Clock3, HeartHandshake, MapPin, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { SITE } from "@/lib/site";

const pillars = [
  {
    icon: Award,
    title: "משווק מורשה",
    body: "מורשים רשמית להתקין הדרן, עסקן וכושר פליי – המערכות המובילות בישראל.",
  },
  {
    icon: ShieldCheck,
    title: "מומחיות בכל המכשירים",
    body: "אייפון, סמסונג גלקסי, שיאומי, וואווי, מכשירי Qin, טאבלטים ומחשבים.",
  },
  {
    icon: Users,
    title: "מעל 500 מכשירים",
    body: "כל לקוח מקבל התאמה אישית לפי הגיל, השימוש והמכשיר – ולא פתרון גנרי.",
  },
  {
    icon: MapPin,
    title: "מעבדה באשדוד",
    body: `${SITE.street}, ${SITE.neighbourhood}. נגישים, בתיאום מראש.`,
  },
  {
    icon: Clock3,
    title: "שירות מהיר",
    body: "סינון בסיסי תוך חמש דקות, צריבה מלאה תוך 45–90 דקות. בדרך כלל ביום הפנייה.",
  },
  {
    icon: HeartHandshake,
    title: "מחירים שקופים",
    body: "המחיר שמופיע באתר הוא המחיר שמשלמים, כולל ההתקנה. בלי הפתעות.",
  },
];

const About = () => (
  <>
    <SEOHead
      title="אודות FilterPhone – פילטר פון | מעבדת סינון טלפונים באשדוד"
      description="FilterPhone (פילטר פון) היא מעבדה באשדוד לסינון טלפונים וצריבת גרסאות. משווק מורשה של הדרן, עסקן וכושר פליי, עם ניסיון בכל סוגי המכשירים."
      path="/about"
      keywords="פילטר פון אשדוד, FilterPhone אודות, מעבדת סינון אשדוד, משווק מורשה הדרן"
    />
    <Breadcrumbs items={[{ label: "אודות" }]} />

    <section className="section-padding">
      <div className="container-custom">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <AnimatedSection>
              <span className="eyebrow">אודות</span>
              <h1 className="mt-4 text-display-lg">
                אנחנו לא מוכרים סינון. אנחנו עוזרים לבחור נכון.
              </h1>
              <div className="prose-fp mt-6">
                <p>
                  <strong>FilterPhone (פילטר פון)</strong> היא מעבדה באשדוד שעוסקת בסינון טלפונים,
                  חסימת תוכן וצריבת גרסאות כשרות. אנחנו משווק מורשה של הדרן, עסקן וכושר פליי –
                  ודווקא בגלל שאנחנו עובדים מול כולן, אין לנו סיבה לדחוף מערכת אחת.
                </p>
                <p>
                  מי שמגיע אלינו מקבל קודם כול שאלות: למי המכשיר, מה חייב להישאר פתוח, מה חייב
                  להיחסם, ומה קורה לתוכן שכבר נמצא בטלפון. רק אחר כך מדברים על מוצר. לא פעם התשובה
                  היא הפתרון הזול יותר, וזה בסדר גמור.
                </p>
                <p>
                  מעבר לשירותי ההתקנה פיתחנו גם את <Link to="/filtertube">FilterTube</Link>,
                  אפליקציית אנדרואיד שמביאה גם יוטיוב מסונן וגם יוטיוב מיוזיק מסונן, כי לא כל
                  צורך נפתר בהתקנה במעבדה.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.1} className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-surface p-7 shadow-card">
              <h2 className="text-lg font-bold text-ink">מה שחשוב לנו</h2>
              <ul className="mt-5 space-y-5">
                {[
                  ["לומר את האמת על המוצר", "כולל מה הוא לא עושה, ומה המחיר האמיתי של הנוחות שאתם מוותרים עליה."],
                  ["לא להשאיר אתכם לבד אחרי ההתקנה", "שינוי רמת סינון, פתיחת אפליקציה או שאלה – מרימים טלפון."],
                  ["לכבד את הזמן שלכם", "מגיעים בתיאום, יוצאים עם מכשיר עובד ובדוק."],
                ].map(([t, d]) => (
                  <li key={t}>
                    <p className="font-semibold text-ink">{t}</p>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">{d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>

        <div className="mt-16">
          <SectionHeading eyebrow="למה אצלנו" title="שש סיבות שלקוחות חוזרים" />
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.05}>
                <div className="h-full bg-surface p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-tint text-primary">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-ink">{p.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection className="mt-14">
          <div className="flex flex-col items-center gap-5 rounded-lg border border-border bg-surface-sunken p-8 text-center">
            <h2 className="text-display-sm">בואו נדבר</h2>
            <p className="max-w-lg text-[0.9375rem] leading-relaxed text-ink-soft">
              שיחה קצרה תספיק כדי להבין מה מתאים לכם. אנחנו ב{SITE.street}, {SITE.neighbourhood}.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/contact"><Button>לעמוד יצירת הקשר</Button></Link>
              <a href={`tel:${SITE.phoneRaw}`}>
                <Button variant="outline"><span className="num">{SITE.phone}</span></Button>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </>
);

export default About;
