import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { SITE, WA_DEFAULT } from "@/lib/site";

/** The desktop bar: the things people come for, in the order they come for them. */
const navLinks = [
  { href: "/install", label: "מדריך התקנה" },
  { href: "/filtertube", label: "FilterTube" },
  { href: "/services", label: "שירותי מעבדה" },
  { href: "/pricing", label: "מחירון" },
  { href: "/compare", label: "השוואת מערכות" },
  // "מאמרים", not "מדריכים": it sits next to the install guide and means something else.
  { href: "/blog", label: "מאמרים" },
  { href: "/contact", label: "צור קשר" },
];

/** Always one tap away on a phone, without opening the menu. */
const quickLinks = [
  { href: "/install", label: "מדריך התקנה" },
  { href: "/filtertube", label: "FilterTube" },
  { href: "/services", label: "שירותים" },
  { href: "/pricing", label: "מחירון" },
];

/** The phone menu, grouped so each link can be found under what it belongs to. */
const menuGroups = [
  {
    title: "האפליקציות שלנו",
    links: [
      { href: "/", label: "FilterPhone — סינון לטלפון" },
      { href: "/install", label: "מדריך התקנה" },
      { href: "/filtertube", label: "FilterTube — יוטיוב מסונן" },
    ],
  },
  {
    title: "סינון במעבדה",
    links: [
      { href: "/services", label: "כל השירותים" },
      { href: "/pricing", label: "מחירון" },
      { href: "/compare", label: "השוואת מערכות" },
    ],
  },
  {
    title: "מידע",
    links: [
      { href: "/filterphone", label: "סינון תמונות — איך זה עובד" },
      { href: "/internet-filtering", label: "סינון אינטרנט" },
      { href: "/blog", label: "מאמרים" },
      { href: "/about", label: "אודות" },
      { href: "/contact", label: "צור קשר" },
    ],
  },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  // The install guide shows one step at a time; nothing should compete with it.
  const showQuick = pathname !== "/install";

  return (
    <>
      {/* Utility bar — the details people scan for before they call */}
      <div className="hidden band-ink border-b border-white/10 lg:block">
        <div className="container-custom flex h-9 items-center justify-between text-[0.8125rem] text-white/60">
          <div className="flex items-center gap-6">
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <MapPin className="h-3.5 w-3.5" />
              {SITE.street}, {SITE.neighbourhood}
            </a>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {SITE.hours}
            </span>
          </div>
          <a href={`tel:${SITE.phoneRaw}`} className="flex items-center gap-1.5 font-semibold text-white/85 transition-colors hover:text-white">
            <Phone className="h-3.5 w-3.5" />
            <span className="num">{SITE.phone}</span>
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 bg-surface/90 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled ? "border-b border-border shadow-soft" : "border-b border-transparent"
        }`}
      >
        <nav className="container-custom flex h-[68px] items-center justify-between gap-6" aria-label="ניווט ראשי">
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`relative block px-3 py-2 text-[0.9375rem] font-medium transition-colors ${
                    isActive(link.href) ? "text-primary" : "text-ink-soft hover:text-primary"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <a href={`tel:${SITE.phoneRaw}`} className="lg:hidden">
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                <span className="num">{SITE.phone}</span>
              </Button>
            </a>
            <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                דברו איתנו
              </Button>
            </a>
          </div>

          <button
            type="button"
            className="-ml-2 rounded-md p-2 text-ink transition-colors hover:bg-surface-sunken lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "סגירת תפריט" : "פתיחת תפריט"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {showQuick && !mobileOpen && (
          <ul
            className="flex gap-2 overflow-x-auto border-t border-border px-5 py-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
            aria-label="קיצורי דרך"
          >
            {quickLinks.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link
                  to={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-bold transition-colors ${
                    isActive(link.href)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-ink hover:border-primary/50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-b border-border bg-surface lg:hidden"
            >
              <div className="container-custom max-h-[calc(100dvh-68px)] overflow-y-auto py-3">
                {menuGroups.map((group) => (
                  <div key={group.title} className="border-b border-border py-2 last:border-0">
                    <p className="pb-1 pt-2 text-[0.75rem] font-bold tracking-wide text-muted-foreground">{group.title}</p>
                    <ul>
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            to={link.href}
                            aria-current={pathname === link.href ? "page" : undefined}
                            className={`flex items-center justify-between py-3 text-[1rem] font-semibold ${
                              pathname === link.href ? "text-primary" : "text-ink"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="mt-3 grid grid-cols-2 gap-2.5 pb-2">
                  <a href={`tel:${SITE.phoneRaw}`}>
                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="num">{SITE.phone}</span>
                    </Button>
                  </a>
                  <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer">
                    <Button variant="whatsapp" className="w-full gap-2">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
