import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import logoImg from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-foreground text-background" role="contentinfo">
    <div className="container-custom py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logoImg} alt="FilterPhone לוגו – סינון טלפונים באשדוד" className="w-9 h-9 rounded-lg object-cover" width={36} height={36} />
            <span className="text-lg font-heading font-bold">FilterPhone</span>
          </div>
          <p className="text-background/70 text-sm leading-relaxed">
            פילטר פון – המעבדה המובילה באשדוד לסינון טלפונים, התקנת הדרן, עסקן וכושר פליי וצריבת גרסאות לשיאומי Qin.
          </p>
        </div>

        <div>
          <h3 className="text-base font-heading font-semibold mb-4">ניווט מהיר</h3>
          <nav aria-label="ניווט תחתון">
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "בית" },
                { href: "/about", label: "אודות" },
                { href: "/services", label: "שירותים" },
                { href: "/blog", label: "בלוג" },
                { href: "/contact", label: "צור קשר" },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-background/70 hover:text-background transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <h3 className="text-base font-heading font-semibold mb-4">השירותים שלנו</h3>
          <nav aria-label="שירותים">
            <ul className="space-y-2 text-sm">
              {[
                { href: "/services/basic-filtering", label: "סינון בסיסי – 20₪" },
                { href: "/services/kosher-play", label: "כושר פליי – 70₪" },
                { href: "/services/hadran", label: "הדרן – 300₪" },
                { href: "/services/askan", label: "עסקן – 300₪" },
                { href: "/services/qin-f21-pro", label: "Qin F21 Pro – 70₪" },
                { href: "/services/qin-f25", label: "Qin F25 – 70₪" },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-background/70 hover:text-background transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <h3 className="text-base font-heading font-semibold mb-4">יצירת קשר</h3>
          <address className="not-italic">
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>רחוב חטיבת גבעתי 2, כניסה ו׳, אשדוד</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:0527186881" className="hover:text-background transition-colors" dir="ltr">052-718-6881</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:ywldyld@gmail.com" className="hover:text-background transition-colors">ywldyld@gmail.com</a>
              </li>
            </ul>
          </address>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-background/10 space-y-4">
        <p className="text-xs text-background/40 text-center leading-relaxed">
          הבהרה: השירות הניתן הינו עבור צריבת והתקנת המערכת. לאחר מכן, השירות והתמיכה השוטפת הינם באחריות חברות הסינון בלבד.
        </p>
        <div className="flex justify-center gap-4 text-xs text-background/50">
          <Link to="/privacy" className="hover:text-background transition-colors">מדיניות פרטיות</Link>
          <span>|</span>
          <Link to="/refund-policy" className="hover:text-background transition-colors">מדיניות ביטולים והחזרים</Link>
        </div>
        <p className="text-center text-sm text-background/50">© {new Date().getFullYear()} FilterPhone (פילטר פון) – סינון טלפונים באשדוד – כל הזכויות שמורות</p>
      </div>
    </div>
  </footer>
);

export default Footer;