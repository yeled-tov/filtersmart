import { Phone, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileStickyBar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex border-t border-border/40 bg-card/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <a
        href="/contact"
        onClick={(e) => {
          e.preventDefault();
          navigate("/contact");
        }}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white transition-colors"
        style={{ backgroundColor: "hsl(142, 70%, 40%)" }}
      >
        <Phone className="w-4 h-4" />
        צור קשר
      </a>
      <a
        href="/services"
        onClick={(e) => {
          e.preventDefault();
          navigate("/services");
        }}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white transition-colors"
        style={{ backgroundColor: "hsl(217, 72%, 48%)" }}
      >
        <Layers className="w-4 h-4" />
        השירותים שלנו
      </a>
    </div>
  );
};

export default MobileStickyBar;
