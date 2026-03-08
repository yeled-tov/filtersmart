import { Phone, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileStickyBar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex border-t border-border bg-card/95 backdrop-blur-md">
      <a
        href="/contact"
        onClick={(e) => {
          e.preventDefault();
          navigate("/contact");
        }}
        className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white"
        style={{ backgroundColor: "hsl(142, 70%, 40%)" }}
      >
        <Phone className="w-4 h-4" />
        📞 צור קשר
      </a>
      <a
        href="/services"
        onClick={(e) => {
          e.preventDefault();
          navigate("/services");
        }}
        className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white"
        style={{ backgroundColor: "hsl(212, 72%, 42%)" }}
      >
        <Layers className="w-4 h-4" />
        🛠️ השירותים שלנו
      </a>
    </div>
  );
};

export default MobileStickyBar;
