import { Zap, Settings, ShieldCheck } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const badges = [
  { icon: Zap, label: "שירות מהיר באשדוד" },
  { icon: Settings, label: "התאמה אישית לכל צורך" },
  { icon: ShieldCheck, label: "אחריות מלאה על ההתקנה" },
];

const TrustBadges = () => (
  <section className="py-8 md:py-12 bg-background border-b border-border">
    <div className="container-custom">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {badges.map((b, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-muted/50 border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <b.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-semibold text-foreground text-sm md:text-base">{b.label}</span>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBadges;
