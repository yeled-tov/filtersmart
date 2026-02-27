import { useState } from "react";
import { Eye } from "lucide-react";

const AccessibilityButton = () => {
  const [open, setOpen] = useState(false);

  const toggleHighContrast = () => document.documentElement.classList.toggle("high-contrast");
  const increaseFontSize = () => {
    const html = document.documentElement;
    const current = parseFloat(getComputedStyle(html).fontSize);
    html.style.fontSize = `${Math.min(current + 2, 24)}px`;
  };
  const resetFontSize = () => {
    document.documentElement.style.fontSize = "";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-card border border-border rounded-xl p-4 card-shadow animate-fade-in space-y-3 w-56">
          <h3 className="text-sm font-heading font-semibold text-card-foreground">נגישות</h3>
          <button onClick={increaseFontSize} className="w-full text-right text-sm px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            הגדל גופן +
          </button>
          <button onClick={resetFontSize} className="w-full text-right text-sm px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            אפס גודל גופן
          </button>
          <button onClick={toggleHighContrast} className="w-full text-right text-sm px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            ניגודיות גבוהה
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
        aria-label="תפריט נגישות"
      >
        <Eye className="w-7 h-7" />
      </button>
    </div>
  );
};

export default AccessibilityButton;
