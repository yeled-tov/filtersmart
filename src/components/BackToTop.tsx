import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Sits above the WhatsApp button on the right; the left edge stays clear for the chat bubble. */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-[5.5rem] right-[1.4rem] z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-ink-soft shadow-card transition-all duration-200 hover:border-primary/40 hover:text-primary ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
      aria-label="חזרה לראש העמוד"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
};

export default BackToTop;
