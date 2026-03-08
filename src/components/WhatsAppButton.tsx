import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/972527186881?text=שלום%20פילטר%20סמארט%2C%20אשמח%20לקבל%20פרטים"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center justify-center w-[60px] h-[60px] rounded-full text-white shadow-lg hover:scale-110 transition-transform group"
    style={{ backgroundColor: "hsl(142, 70%, 45%)" }}
    aria-label="שלח הודעת WhatsApp"
    title="דברו איתנו בווצאפ"
  >
    <MessageCircle className="w-7 h-7" />
    <span className="absolute -top-10 right-0 bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      דברו איתנו בווצאפ
    </span>
  </a>
);

export default WhatsAppButton;
