import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { Button } from "./ui/button";

const WA_LINK = "https://wa.me/972527186881?text=שלום%20פילטר%20סמארט%2C%20אשמח%20לקבל%20פרטים";

const navLinks = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות" },
  { href: "/services", label: "שירותים" },
  { href: "/blog", label: "בלוג" },
  { href: "/contact", label: "צור קשר" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border/50">
      <nav className="container-custom flex items-center justify-between h-16 md:h-20" aria-label="ניווט ראשי">
        <Logo />

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${
                  location.pathname === link.href ? "text-primary bg-muted" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a href="tel:0527186881">
            <Button variant="outline" size="sm" className="gap-2">
              <Phone className="w-4 h-4" />
              052-718-6881
            </Button>
          </a>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gradient-primary text-primary-foreground border-0">
              WhatsApp
            </Button>
          </a>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "סגור תפריט" : "פתח תפריט"}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <ul className="container-custom py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.href ? "text-primary bg-muted" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-3 flex gap-2">
                <a href="tel:0527186881" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    052-718-6881
                  </Button>
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full gradient-primary text-primary-foreground border-0">
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
