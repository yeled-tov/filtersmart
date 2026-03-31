import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";

const DISMISS_KEY = "fs_urgency_dismissed";

const UrgencyBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISS_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-l from-primary to-blue-600 text-white text-center text-sm font-medium py-2.5 px-4 relative z-50">
      <div className="flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5" />
        <span>שירות מהיר — בדרך כלל ביום הפנייה</span>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          localStorage.setItem(DISMISS_KEY, "1");
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity p-1"
        aria-label="סגור באנר"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default UrgencyBanner;
