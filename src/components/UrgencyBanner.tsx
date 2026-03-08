import { useState, useEffect } from "react";
import { X } from "lucide-react";

const DISMISS_KEY = "fs_urgency_dismissed";

const UrgencyBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISS_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-amber-400 text-amber-950 text-center text-sm font-semibold py-2 px-4 relative z-50">
      ⚡ שירות מהיר — בדרך כלל ביום הפנייה
      <button
        onClick={() => {
          setVisible(false);
          localStorage.setItem(DISMISS_KEY, "1");
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="סגור באנר"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default UrgencyBanner;
