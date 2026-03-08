const badges = [
  "✅ משווק מורשה הדרן",
  "✅ משווק מורשה עסקן",
  "✅ משווק מורשה כושר פליי",
  "⭐ 500+ לקוחות מרוצים",
];

const TrustStrip = () => (
  <section className="bg-muted/50 border-b border-border py-3 overflow-hidden">
    <div className="container-custom hidden md:flex items-center justify-center gap-8">
      {badges.map((b, i) => (
        <span key={i} className="text-sm font-semibold text-foreground whitespace-nowrap">
          {b}
        </span>
      ))}
    </div>
    <div className="md:hidden relative">
      <div className="flex animate-marquee gap-8 whitespace-nowrap">
        {[...badges, ...badges].map((b, i) => (
          <span key={i} className="text-sm font-semibold text-foreground">
            {b}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  </section>
);

export default TrustStrip;
