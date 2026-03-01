import { Star } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const reviews = [
  { name: "משה מאשדוד", text: "שירות מהיר ומקצועי! הצריבה בוצעה תוך חצי שעה והטלפון עובד מעולה. ממליץ בחום.", rating: 5 },
  { name: "אברהם הלוי", text: "התקנתי הדרן אצל FilterSmart – ההגנה הכי טובה שיש. השירות היה אדיב ומקצועי מאוד.", rating: 5 },
  { name: "יוסף כהן מאשדוד", text: "הסינון הבסיסי עלה לי רק 20 שקל והותקן ב-5 דקות. פשוט ויעיל, בדיוק מה שהייתי צריך.", rating: 5 },
  { name: "דוד פרץ", text: "התקנתי כושר פליי וואטסאפ עובד מצוין בלי תמונות פרופיל. חנות האפליקציות שלהם מעולה.", rating: 5 },
];

const Reviews = () => (
  <section className="section-padding bg-background">
    <div className="container-custom">
      <AnimatedSection>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">⭐ לקוחות ממליצים</h2>
          <p className="text-muted-foreground text-lg">מה הלקוחות שלנו אומרים על FilterSmart</p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {reviews.map((r, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div className="bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{r.text}"</p>
              <p className="text-sm font-heading font-semibold text-card-foreground">— {r.name}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
