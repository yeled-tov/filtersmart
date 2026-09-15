import { useEffect, useState } from "react";
import { X, Zap } from "lucide-react";

const DISMISS_KEY = "fp_notice_dismissed";

const UrgencyBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(DISMISS_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-accent text-accent-foreground">
      <div className="container-custom flex min-h-9 items-center justify-center gap-2 py-1.5 pl-9 text-center text-[0.8125rem] font-medium leading-snug">
        <Zap className="h-3.5 w-3.5 shrink-0" />
        <span>
          רוב ההתקנות מבוצעות ביום הפנייה
          <span className="hidden sm:inline"> · תיאום מראש בטלפון או בוואטסאפ</span>
        </span>
      </div>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          try {
            localStorage.setItem(DISMISS_KEY, "1");
          } catch {
            /* private mode — the banner simply returns next visit */
          }
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-1 opacity-70 transition-opacity hover:opacity-100"
        aria-label="סגירת ההודעה"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default UrgencyBanner;
