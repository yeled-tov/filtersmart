import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import UrgencyBanner from "./UrgencyBanner";
import AccessibilityButton from "./AccessibilityButton";
import WhatsAppButton from "./WhatsAppButton";
import ExitIntentPopup from "./ExitIntentPopup";
import BackToTop from "./BackToTop";

const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
    >
      דילוג לתוכן הראשי
    </a>

    <UrgencyBanner />
    <Header />

    <main id="main" className="flex-1">
      <Outlet />
    </main>

    <Footer />

    {/*
      Floating layer. Everything of ours lives on the right; the bottom-left
      corner is deliberately left empty for the Chatbase bubble, which injects
      its own button (#chatbase-bubble-button) there from index.html.
    */}
    <WhatsAppButton />
    <BackToTop />
    <AccessibilityButton />
    <ExitIntentPopup />
  </div>
);

export default Layout;
