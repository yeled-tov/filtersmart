import { Helmet } from "react-helmet-async";
import { Star, Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const reviews = [
  { name: "משה מאשדוד", text: "שירות מהיר ומקצועי! הצריבה בוצעה תוך חצי שעה והטלפון עובד מעולה. ממליץ בחום על FilterPhone.", rating: 5, service: "צריבת גרסה" },
  { name: "אברהם הלוי", text: "התקנתי הדרן אצל FilterPhone באשדוד – ההגנה הכי טובה שיש. השירות היה אדיב ומקצועי מאוד.", rating: 5, service: "התקנת הדרן" },
  { name: "יוסף כהן מאשדוד", text: "הסינון הבסיסי עלה לי רק 20 שקל והותקן ב-5 דקות. פשוט ויעיל, בדיוק מה שהייתי צריך.", rating: 5, service: "סינון בסיסי" },
  { name: "דוד פרץ", text: "התקנתי כושר פליי וואטסאפ עובד מצוין בלי תמונות פרופיל. חנות האפליקציות שלהם מעולה.", rating: 5, service: "כושר פליי" },
];

const reviewJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "FilterPhone – פילטר פון",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "47",
    "bestRating": "5"
  },
  "review": reviews.map((r) => ({
    "@type": "Review",
    "author": { "@type": "Person", "name": r.name },
    "reviewRating": { "@type": "Rating", "ratingValue": String(r.rating) },
    "reviewBody": r.text,
  })),
};

const Reviews = () => (
  <section className="section-padding bg-background" aria-label="חוות דעת לקוחות">
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(reviewJsonLd)}</script>
    </Helmet>
    <div className="container-custom">
      <AnimatedSection>
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(n => (
              <Star key={n} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-sm text-muted-foreground mr-2">(47 חוות דעת)</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4 text-balance">לקוחות ממליצים על FilterPhone</h2>
          <p className="text-muted-foreground text-lg">מה הלקוחות שלנו באשדוד אומרים על השירות</p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {reviews.map((r, i) => (
          <AnimatedSection key={i} delay={i * 0.08}>
            <div className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 border border-border/50 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-primary/20" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">"{r.text}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/8 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{r.name.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-heading font-semibold text-card-foreground">{r.name}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{r.service}</span>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
