import { Shield, Award, Users, MapPin, Heart, Clock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";

const About = () => (
  <>
    <SEOHead
      title="אודות FilterPhone – פילטר פון | סינון טלפונים מקצועי באשדוד"
      description="FilterPhone (פילטר פון) – משווק מורשה של הדרן, עסקן וכושר פליי באשדוד. ניסיון רב בסינון טלפונים, שירות אמין ומקצועי. ☎ 052-718-6881"
      path="/about"
      keywords="פילטר פון אשדוד, FilterPhone אודות, סינון טלפונים אשדוד, משווק מורשה הדרן"
    />
    <Breadcrumbs items={[{ label: "אודות" }]} />

    <section className="section-padding bg-background bg-mesh">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6 text-balance">
              אודות <span className="gradient-text">FilterPhone</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              FilterPhone (פילטר פון) הוקמה מתוך תשוקה להגנה דיגיטלית ומחויבות לשירות מקצועי. אנו משווק מורשה של המותגים המובילים בתחום הסינון – הדרן, עסקן וכושר פליי – ופועלים מאשדוד לשרת לקוחות מכל הארץ.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {[
              { icon: Shield, title: "מומחיות בסינון", desc: "ניסיון רב בהתקנת פתרונות סינון מגוונים לכל סוגי המכשירים – אייפון, אנדרואיד ומכשירי Qin", color: "from-blue-500 to-blue-600" },
              { icon: Award, title: "משווק מורשה", desc: "מורשים רשמית להתקנת הדרן, עסקן וכושר פליי – המותגים המובילים בישראל", color: "from-amber-500 to-orange-500" },
              { icon: Users, title: "500+ לקוחות מרוצים", desc: "כל לקוח מקבל יחס אישי והתאמת הפתרון לצרכים שלו. דירוג 5 כוכבים", color: "from-violet-500 to-purple-600" },
              { icon: MapPin, title: "מיקום נוח באשדוד", desc: "רחוב חטיבת גבעתי 2, כניסה ו׳, רובע ג׳ – נגישים וזמינים", color: "from-emerald-500 to-green-600" },
              { icon: Clock, title: "שירות מהיר", desc: "סינון בסיסי תוך 5 דקות. צריבת גרסה תוך 30-60 דקות. בדרך כלל ביום הפנייה", color: "from-cyan-500 to-teal-600" },
              { icon: Heart, title: "מחירים הוגנים", desc: "מחירים שקופים מ-100₪ בלבד, ללא עלויות נסתרות, עם אחריות מלאה", color: "from-rose-500 to-pink-600" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50 hover:card-shadow-hover transition-all duration-300 h-full">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-sm`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-heading font-semibold text-card-foreground mb-2">{item.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3}>
            <div className="bg-card rounded-2xl p-8 card-shadow border border-border/50">
              <h2 className="text-xl font-heading font-semibold text-card-foreground mb-4">החזון שלנו</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                אנו מאמינים שכל אדם ומשפחה ראויים לגלוש באינטרנט בביטחון. המטרה שלנו היא להנגיש פתרונות סינון מקצועיים ואיכותיים לכל מי שזקוק להם – במחירים הוגנים ועם שירות ברמה הגבוהה ביותר.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                עם ניסיון רב בתחום, אנו מלווים את הלקוחות שלנו מהרגע הראשון ועד לאחר ההתקנה – עם תמיכה טכנית מלאה ומענה מהיר.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  </>
);

export default About;
