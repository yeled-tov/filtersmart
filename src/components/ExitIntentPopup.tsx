import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EXIT_FLAG = "fs_exit_popup_shown";

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && !sessionStorage.getItem(EXIT_FLAG)) {
      setShow(true);
      sessionStorage.setItem(EXIT_FLAG, "1");
    }
  }, []);

  useEffect(() => {
    // Desktop only
    if (window.innerWidth < 768) return;
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSending(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      phone: phone.trim(),
      message: "פנייה מחלון יציאה",
    });
    setSending(false);
    if (error) {
      toast.error("שגיאה בשליחה, נסו שוב");
      return;
    }
    toast.success("הפרטים נשלחו! נחזור אליכם בהקדם");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card rounded-2xl p-8 max-w-md w-full mx-4 card-shadow relative animate-scale-in">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="סגור"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            רגע לפני שאתם עוזבים! 👋
          </h2>
          <p className="text-muted-foreground">
            השאירו פרטים ונחזור אליכם תוך שעה
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="שם מלא"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="טלפון"
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button
            type="submit"
            disabled={sending}
            className="w-full gradient-primary text-primary-foreground border-0"
          >
            {sending ? "שולח..." : "שלחו פרטים"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
