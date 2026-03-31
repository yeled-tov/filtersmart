import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/972527186881?text=שלום%20פילטר%20פון%2C%20אשמח%20לקבל%20פרטים"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-20 md:bottom-6 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all group"
    style={{ backgroundColor: "hsl(142, 70%, 45%)" }}
    aria-label="שלח הודעת WhatsApp"
    title="דברו איתנו בווצאפ"
  >
    <MessageCircle className="w-6 h-6" />
    <span className="absolute right-full mr-3 bg-card text-foreground text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-border/50">
      דברו איתנו בווצאפ
    </span>
    {/* Pulse ring */}
    <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: "hsl(142, 70%, 45%)" }} />
  </a>
);

export default WhatsAppButton;
