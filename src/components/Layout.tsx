import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import UrgencyBanner from "./UrgencyBanner";
import AccessibilityButton from "./AccessibilityButton";
import WhatsAppButton from "./WhatsAppButton";
import ChatbotLoader from "./ChatbotLoader";
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

    {/* Floating layer: WhatsApp + back-to-top on the right, chat assistant on the left */}
    <WhatsAppButton />
    <BackToTop />
    <ChatbotLoader />
    <AccessibilityButton />
    <ExitIntentPopup />
  </div>
);

export default Layout;
