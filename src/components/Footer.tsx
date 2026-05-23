import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ArrowLeft } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background" role="contentinfo">
    <div className="container-custom pt-14 pb-8 md:pt-20 md:pb-10">
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-5">
            <img src="/logo.png" alt="FilterPhone לוגו" className="w-10 h-10 rounded-xl object-contain" width={40} height={40} loading="lazy" />
            <span className="text-xl font-heading font-bold">FilterPhone</span>
          </div>
          <p className="text-background/60 text-sm leading-relaxed mb-5">
            המעבדה המובילה באשדוד לסינון טלפונים, התקנת הדרן, עסקן וכושר פליי וצריבת גרסאות לשיאומי Qin.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-background/50">זמינים לשירותכם</span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-sm font-heading font-semibold mb-5 text-background/90 uppercase tracking-wider">ניווט מהיר</h3>
          <nav aria-label="ניווט תחתון">
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "דף הבית" },
                { href: "/about", label: "אודות" },
                { href: "/services", label: "כל השירותים" },
                { href: "/blog", label: "בלוג ומדריכים" },
                { href: "/contact", label: "צור קשר" },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-background/55 hover:text-background transition-colors text-sm flex items-center gap-1 group">
                    <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -mr-4 group-hover:mr-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-sm font-heading font-semibold mb-5 text-background/90 uppercase tracking-wider">השירותים שלנו</h3>
          <nav aria-label="שירותים">
            <ul className="space-y-2.5">
              {[
                { href: "/services/basic-filtering", label: "סינון בסיסי", price: "100₪" },
                { href: "/services/kosher-play", label: "כושר פליי", price: "70₪" },
                { href: "/services/hadran", label: "הדרן", price: "300₪" },
                { href: "/services/askan", label: "עסקן", price: "300₪" },
                { href: "/services/qin-f21-pro", label: "Qin F21 Pro", price: "70₪" },
                { href: "/services/qin-f25", label: "Qin F25", price: "70₪" },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-background/55 hover:text-background transition-colors text-sm flex items-center justify-between group">
                    <span className="flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -mr-4 group-hover:mr-0" />
                      {l.label}
                    </span>
                    <span className="text-background/35 text-xs">{l.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-heading font-semibold mb-5 text-background/90 uppercase tracking-wider">יצירת קשר</h3>
          <address className="not-italic">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-background/70" />
                </div>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=%D7%97%D7%98%D7%99%D7%91%D7%AA+%D7%92%D7%91%D7%A2%D7%AA%D7%99+2+%D7%90%D7%A9%D7%93%D7%95%D7%93"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="נווט אלינו: חטיבת גבעתי 2, אשדוד"
                >
                  <span className="text-background/55 group-hover:text-background transition-colors text-sm leading-relaxed">חטיבת גבעתי 2, כניסה ו׳</span>
                  <span className="block text-background/40 group-hover:text-background/70 transition-colors text-xs">רובע ג׳, אשדוד · נווט בגוגל מפות ←</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-background/70" />
                </div>
                <a href="tel:0527186881" className="text-background/55 hover:text-background transition-colors text-sm" dir="ltr">052-718-6881</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-background/70" />
                </div>
                <a href="mailto:ywldyld@gmail.com" className="text-background/55 hover:text-background transition-colors text-sm">ywldyld@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-background/70" />
                </div>
                <div className="text-sm">
                  <span className="text-background/55">א׳-ה׳: 09:00–19:00</span>
                  <span className="block text-background/40 text-xs">ו׳: 09:00–13:00</span>
                </div>
              </li>
            </ul>
          </address>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 pt-6 border-t border-background/8">
        <p className="text-xs text-background/30 text-center leading-relaxed mb-4">
          הבהרה: השירות הניתן הינו עבור צריבת והתקנת המערכת. לאחר מכן, השירות והתמיכה השוטפת הינם באחריות חברות הסינון בלבד.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-background/40">
            <Link to="/privacy" className="hover:text-background/70 transition-colors">מדיניות פרטיות</Link>
            <span className="text-background/20">|</span>
            <Link to="/refund-policy" className="hover:text-background/70 transition-colors">מדיניות ביטולים</Link>
          </div>
          <p className="text-xs text-background/30">
            © {new Date().getFullYear()} FilterPhone (פילטר פון) – כל הזכויות שמורות
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
