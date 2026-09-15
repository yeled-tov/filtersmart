import { BadgeCheck, MapPin, Clock3, Wrench } from "lucide-react";

const items = [
  { icon: BadgeCheck, text: "משווק מורשה הדרן · עסקן · כושר פליי" },
  { icon: Wrench, text: "אייפון · גלקסי · שיאומי · טאבלט · מחשב" },
  { icon: Clock3, text: "התקנה ביום הפנייה" },
  { icon: MapPin, text: "מעבדה באשדוד, רובע ג׳" },
];

const TrustStrip = () => (
  <section className="border-y border-border bg-surface-sunken" aria-label="למה אפשר לסמוך עלינו">
    <div className="container-custom hidden items-center justify-between gap-6 py-4 md:flex">
      {items.map(({ icon: Icon, text }) => (
        <span key={text} className="flex items-center gap-2 text-[0.8125rem] font-medium text-ink-soft">
          <Icon className="h-4 w-4 shrink-0 text-primary/70" />
          {text}
        </span>
      ))}
    </div>

    {/* Mobile: a slow marquee keeps all four claims visible without wrapping */}
    <div className="overflow-hidden py-3.5 md:hidden">
      <div className="flex w-max animate-marquee gap-8">
        {[...items, ...items].map(({ icon: Icon, text }, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[0.8125rem] font-medium text-ink-soft">
            <Icon className="h-4 w-4 shrink-0 text-primary/70" />
            {text}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStrip;
