import { Phone, MessageCircle } from "lucide-react";

const MobileStickyBar = () => (
  <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex border-t border-border bg-card/95 backdrop-blur-md">
    <a
      href="tel:0527186881"
      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white"
      style={{ backgroundColor: "hsl(142, 70%, 40%)" }}
    >
      <Phone className="w-4 h-4" />
      📞 התקשר
    </a>
    <a
      href="https://wa.me/972527186881"
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white"
      style={{ backgroundColor: "hsl(212, 72%, 42%)" }}
    >
      <MessageCircle className="w-4 h-4" />
      💬 ווצאפ
    </a>
  </div>
);

export default MobileStickyBar;
