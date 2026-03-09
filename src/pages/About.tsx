import { Shield, Award, Users, MapPin } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";

const About = () => (
  <>
    <SEOHead
      title="אודות FilterPhone – פילטר פון: סינון טלפונים מקצועי באשדוד"
      description="FilterPhone (פילטר פון) – משווק מורשה של הדרן, עסקן וכושר פליי באשדוד. שירות סינון טלפון מקצועי ואמין."
      path="/about"
    />
    <Breadcrumbs items={[{ label: "אודות" }]} />

    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            אודות <span className="gradient-text">FilterPhone</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            FilterPhone (פילטר פון) הוקמה מתוך תשוקה להגנה דיגיטלית ומחויבות לשירות מקצועי. אנו משווק מורשה של המותגים המובילים בתחום הסינון – הדרן, עסקן וכושר פליי – ופועלים מאשדוד לשרת לקוחות מכל הארץ.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Shield, title: "מומחיות בסינון", desc: "ניסיון רב בהתקנת פתרונות סינון מגוונים לכל סוגי המכשירים" },
              { icon: Award, title: "משווק מורשה", desc: "מורשים רשמית להתקנת הדרן, עסקן וכושר פליי" },
              { icon: Users, title: "שירות אישי", desc: "כל לקוח מקבל יחס אישי והתאמת הפתרון לצרכים שלו" },
              { icon: MapPin, title: "מיקום נוח", desc: "רחוב חטיבת גבעתי 2, כניסה ו׳, אשדוד" },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-xl p-6 card-shadow">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-lg font-heading font-semibold text-card-foreground mb-2">{item.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl p-8 card-shadow">
            <h2 className="text-xl font-heading font-semibold text-card-foreground mb-4">החזון שלנו</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              אנו מאמינים שכל אדם ומשפחה ראויים לגלוש באינטרנט בביטחון. המטרה שלנו היא להנגיש פתרונות סינון מקצועיים ואיכותיים לכל מי שזקוק להם – במחירים הוגנים ועם שירות ברמה הגבוהה ביותר.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              עם ניסיון רב בתחום, אנו מלווים את הלקוחות שלנו מהרגע הראשון ועד לאחר ההתקנה – עם תמיכה טכנית מלאה ומענה מהיר.
            </p>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default About;