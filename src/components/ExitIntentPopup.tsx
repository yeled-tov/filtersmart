import { useCallback, useEffect, useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EXIT_FLAG = "fp_exit_popup_shown";

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY > 0) return;
    try {
      if (sessionStorage.getItem(EXIT_FLAG)) return;
      sessionStorage.setItem(EXIT_FLAG, "1");
    } catch {
      /* private mode — show it once per page load instead */
    }
    setShow(true);
  }, []);

  useEffect(() => {
    // Desktop only: there is no exit intent to detect on touch devices.
    if (window.innerWidth < 1024) return;
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShow(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 9) {
      toast.error("נא למלא שם וטלפון תקין");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      phone: phone.trim(),
      message: "פנייה מחלון יציאה באתר",
    });
    setSending(false);
    if (error) {
      toast.error("השליחה נכשלה, נסו שוב");
      return;
    }
    toast.success("הפרטים התקבלו – נחזור אליכם בהקדם");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
      onClick={(e) => e.target === e.currentTarget && setShow(false)}
    >
      <div className="w-full max-w-md animate-scale-in rounded-xl border border-border bg-surface p-7 shadow-float">
        <button
          type="button"
          onClick={() => setShow(false)}
          className="absolute left-4 top-4 p-1 text-muted-foreground transition-colors hover:text-ink"
          aria-label="סגירה"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-tint text-primary">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <h2 id="exit-popup-title" className="mt-4 text-xl font-display font-bold text-ink">
          רוצים שנעזור לכם לבחור?
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
          השאירו שם וטלפון ונחזור אליכם עם המלצה מדויקת – בלי התחייבות ובלי לחץ.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-2.5">
          <Input placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="h-11" required />
          <Input placeholder="טלפון" type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className="h-11" required />
          <Button type="submit" disabled={sending} className="w-full">
            {sending ? "שולח…" : "שלחו לי המלצה"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
