import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AccessibilityButton from "./AccessibilityButton";
import WhatsAppButton from "./WhatsAppButton";
import ChatbotLoader from "./ChatbotLoader";

const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppButton />
    <AccessibilityButton />
    <ChatbotLoader />
  </div>
);

export default Layout;
