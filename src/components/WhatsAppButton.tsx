import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <>
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
      {/* Tooltip */}
      <span className="absolute -top-10 right-0 bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        דברו איתנו בווצאפ
      </span>
    </a>
    <style>{`
      @keyframes wa-pulse {
        0% { transform: scale(1); opacity: 0.6; }
        100% { transform: scale(2.2); opacity: 0; }
      }
      .fixed.right-6.bottom-20::before,
      .fixed.right-6.bottom-20::after,
      .fixed.right-6.md\\:bottom-6::before,
      .fixed.right-6.md\\:bottom-6::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 3px solid hsl(142, 70%, 45%);
        animation: wa-pulse 2s ease-out infinite;
        pointer-events: none;
      }
    `}</style>
    {/* Pulse rings rendered as siblings */}
    <div className="fixed bottom-20 md:bottom-6 right-6 z-40 w-[60px] h-[60px] rounded-full pointer-events-none" aria-hidden="true">
      <span className="absolute inset-0 rounded-full border-[3px] border-[hsl(142,70%,45%)] animate-[wa-sonar_2s_ease-out_infinite]" />
      <span className="absolute inset-0 rounded-full border-[3px] border-[hsl(142,70%,45%)] animate-[wa-sonar_2s_ease-out_0.8s_infinite]" />
    </div>
    <style>{`
      @keyframes wa-sonar {
        0% { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(2); opacity: 0; }
      }
    `}</style>
  </>
);

export default WhatsAppButton;
