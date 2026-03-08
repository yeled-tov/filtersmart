import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AccessibilityButton from "./AccessibilityButton";
import WhatsAppButton from "./WhatsAppButton";
import ChatbotLoader from "./ChatbotLoader";
import MobileStickyBar from "./MobileStickyBar";
import ExitIntentPopup from "./ExitIntentPopup";
import UrgencyBanner from "./UrgencyBanner";
import BackToTop from "./BackToTop";

const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <UrgencyBanner />
    <Header />
    <main className="flex-1 pb-14 md:pb-0">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppButton />
    <AccessibilityButton />
    <ChatbotLoader />
    <MobileStickyBar />
    <ExitIntentPopup />
    <BackToTop />
  </div>
);

export default Layout;
