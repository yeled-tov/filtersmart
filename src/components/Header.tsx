import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { Button } from "./ui/button";

const WA_LINK = "https://wa.me/972527186881?text=שלום%20פילטר%20פון%2C%20אשמח%20לקבל%20פרטים";

const navLinks = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות" },
  { href: "/services", label: "שירותים" },
  { href: "/filtertube", label: "FilterTube" },
  { href: "/blog", label: "בלוג" },
  { href: "/contact", label: "צור קשר" },
  { href: "/my-account", label: "אזור אישי" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/80 backdrop-blur-2xl border-b border-border/40 shadow-sm"
          : "bg-card/50 backdrop-blur-xl border-b border-transparent"
      }`}
    >
      <nav className="container-custom flex items-center justify-between h-16 md:h-[72px]" aria-label="ניווט ראשי">
        <Logo />

        <ul className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href ||
              (link.href !== "/" && location.pathname.startsWith(link.href));
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-primary/8"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <a href="tel:0527186881">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Phone className="w-4 h-4" />
              <span className="font-medium" dir="ltr">052-718-6881</span>
            </Button>
          </a>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gradient-primary text-primary-foreground border-0 gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
          </a>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "סגור תפריט" : "פתח תפריט"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-card/95 backdrop-blur-2xl border-b border-border/40 overflow-hidden"
          >
            <ul className="container-custom py-3 space-y-0.5">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? "text-primary bg-primary/8" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
              <li className="pt-3 flex gap-2">
                <a href="tel:0527186881" className="flex-1">
                  <Button variant="outline" className="w-full gap-2 h-11">
                    <Phone className="w-4 h-4" />
                    052-718-6881
                  </Button>
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full gap-2 h-11 gradient-primary text-primary-foreground border-0 shadow-md shadow-primary/20">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
