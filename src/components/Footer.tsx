import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ArrowLeft } from "lucide-react";
import Logo from "./Logo";
import { SITE } from "@/lib/site";

const navColumns = [
  {
    title: "השירותים",
    links: [
      { href: "/services/basic-filtering", label: "סינון בסיסי", meta: "100₪" },
      { href: "/services/kosher-play", label: "כושר פליי", meta: "70₪" },
      { href: "/services/hadran", label: "הדרן", meta: "300₪" },
      { href: "/services/askan", label: "עסקן", meta: "300₪" },
      { href: "/services/qin-f21-pro", label: "צריבת Qin F21 Pro", meta: "70₪" },
      { href: "/services/qin-f25", label: "צריבת Qin F25", meta: "70₪" },
    ],
  },
  {
    title: "לפני שמחליטים",
    links: [
      { href: "/pricing", label: "מחירון מלא" },
      { href: "/compare", label: "השוואת מערכות סינון" },
      { href: "/filtertube", label: "FilterTube – יוטיוב ומיוזיק מסוננים" },
      { href: "/blog", label: "מדריכים ומאמרים" },
      { href: "/about", label: "אודות FilterPhone" },
      { href: "/contact", label: "צור קשר" },
    ],
  },
];

const Footer = () => (
  <footer className="band-ink" role="contentinfo">
    <div className="container-custom pb-8 pt-14 md:pt-20">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Logo inverse />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
            מעבדה מקצועית לסינון טלפונים באשדוד. משווק מורשה של הדרן, עסקן וכושר פליי,
            וצריבת גרסאות כשרות למכשירי שיאומי Qin.
          </p>
          <p className="mt-6 flex items-center gap-2 text-sm text-white/45">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            זמינים לשירותכם
          </p>
        </div>

        {navColumns.map((col) => (
          <nav key={col.title} className="lg:col-span-3" aria-label={col.title}>
            <h2 className="mb-5 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white/40">
              {col.title}
            </h2>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    to={l.href}
                    className="group flex items-center justify-between gap-3 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <span className="flex items-center gap-1.5">
                      <ArrowLeft className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      {l.label}
                    </span>
                    {"meta" in l && l.meta && (
                      <span className="num text-xs text-white/30">{l.meta}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Contact */}
        <div className="lg:col-span-2">
          <h2 className="mb-5 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white/40">
            יצירת קשר
          </h2>
          <address className="not-italic">
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-2.5 text-white/60 transition-colors hover:text-white"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/35" />
                  <span>
                    {SITE.street}
                    <span className="block text-xs text-white/35 group-hover:text-white/60">
                      {SITE.neighbourhood} · ניווט ←
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.phoneRaw}`} className="flex items-center gap-2.5 text-white/60 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-white/35" />
                  <span className="num">{SITE.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 text-white/60 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-white/35" />
                  <span className="break-all">{SITE.email}</span>
                </a>
              </li>
              <li className="flex gap-2.5 text-white/60">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/35" />
                <span>
                  א׳–ה׳ 09:00–19:00
                  <span className="block text-xs text-white/35">ו׳ 09:00–13:00</span>
                </span>
              </li>
            </ul>
          </address>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-6">
        <p className="mx-auto mb-5 max-w-3xl text-center text-xs leading-relaxed text-white/30">
          הבהרה: השירות הניתן הוא עבור צריבת והתקנת המערכת. לאחר מכן, השירות והתמיכה השוטפת
          הם באחריות חברות הסינון בלבד.
        </p>
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link to="/privacy" className="transition-colors hover:text-white/75">מדיניות פרטיות</Link>
            <span className="text-white/15">|</span>
            <Link to="/refund-policy" className="transition-colors hover:text-white/75">מדיניות ביטולים</Link>
            <span className="text-white/15">|</span>
            <Link to="/my-account" className="transition-colors hover:text-white/75">אזור אישי</Link>
          </div>
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} FilterPhone (פילטר פון) · כל הזכויות שמורות
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
