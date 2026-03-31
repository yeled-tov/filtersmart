import { Shield, Star, Users } from "lucide-react";

const badges = [
  { icon: Shield, text: "משווק מורשה הדרן" },
  { icon: Shield, text: "משווק מורשה עסקן" },
  { icon: Shield, text: "משווק מורשה כושר פליי" },
  { icon: Users, text: "500+ לקוחות מרוצים" },
  { icon: Star, text: "דירוג 5 כוכבים" },
];

const TrustStrip = () => (
  <section className="bg-card border-y border-border/40 py-3.5 overflow-hidden">
    <div className="container-custom hidden md:flex items-center justify-center gap-8">
      {badges.map((b, i) => (
        <span key={i} className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
          <b.icon className="w-3.5 h-3.5 text-primary/70" />
          {b.text}
        </span>
      ))}
    </div>
    <div className="md:hidden relative">
      <div className="flex animate-marquee gap-10 whitespace-nowrap">
        {[...badges, ...badges].map((b, i) => (
          <span key={i} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <b.icon className="w-3.5 h-3.5 text-primary/70" />
            {b.text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  </section>
);

export default TrustStrip;
