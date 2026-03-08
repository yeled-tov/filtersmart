import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 md:bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-muted text-foreground shadow-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
      aria-label="חזרה למעלה"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;
