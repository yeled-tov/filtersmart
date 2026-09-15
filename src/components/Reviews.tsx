import { Star } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

/**
 * Customer quotes. These are presented as plain testimonials and deliberately
 * carry no Review/AggregateRating markup: Google ignores self-serving review
 * structured data on a LocalBusiness, and emitting it risks a spam flag.
 * Star ratings in search come from the Google Business Profile, not from here.
 */
const reviews = [
  {
    name: "משה, אשדוד",
    service: "צריבת גרסה",
    text: "שירות מהיר ומקצועי. הצריבה בוצעה תוך חצי שעה והטלפון עובד מעולה. ממליץ בחום.",
  },
  {
    name: "אברהם הלוי",
    service: "התקנת הדרן",
    text: "התקנתי הדרן אצל FilterPhone באשדוד – ההגנה הכי טובה שיש. השירות היה אדיב ומקצועי מאוד.",
  },
  {
    name: "יוסף כהן, אשדוד",
    service: "סינון בסיסי",
    text: "הסינון הבסיסי הותקן תוך חמש דקות ובלי למחוק לי כלום מהטלפון. פשוט ויעיל, בדיוק מה שהייתי צריך.",
  },
  {
    name: "דוד פרץ",
    service: "כושר פליי",
    text: "התקנתי כושר פליי והוואטסאפ עובד מצוין בלי תמונות פרופיל. חנות האפליקציות שלהם מעולה.",
  },
];

const Reviews = () => (
  <section className="section-padding" aria-label="חוות דעת לקוחות">
    <div className="container-custom">
      <SectionHeading
        eyebrow="לקוחות מספרים"
        title="מה אומרים אנשים שכבר סיננו אצלנו"
        lead="ארבע פניות אמיתיות מהחודשים האחרונים, על ארבעה שירותים שונים."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {reviews.map((r, i) => (
          <AnimatedSection key={r.name} delay={i * 0.06}>
            <figure className="flex h-full flex-col panel p-6">
              <div className="flex items-center gap-0.5" aria-label="דירוג 5 מתוך 5">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star key={n} className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
                {r.text}
              </blockquote>
              <figcaption className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-tint text-sm font-bold text-primary">
                    {r.name.charAt(0)}
                  </span>
                  <span className="text-sm font-semibold text-ink">{r.name}</span>
                </span>
                <span className="rounded-sm bg-surface-sunken px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {r.service}
                </span>
              </figcaption>
            </figure>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
