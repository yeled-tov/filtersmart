import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { SITE, WA_DEFAULT } from "@/lib/site";

const navLinks = [
  { href: "/services", label: "שירותים" },
  { href: "/pricing", label: "מחירון" },
  { href: "/compare", label: "השוואת מערכות" },
  { href: "/filtertube", label: "FilterTube" },
  { href: "/blog", label: "מדריכים" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צור קשר" },
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

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-b border-border bg-surface lg:hidden"
            >
              <div className="container-custom py-3">
                <ul className="divide-y divide-border">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className={`flex items-center justify-between py-3.5 text-[0.9375rem] font-medium ${
                          isActive(link.href) ? "text-primary" : "text-ink"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-2.5 pb-2">
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
