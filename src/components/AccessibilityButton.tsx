import { useState } from "react";

const AccessibilityIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <circle cx="12" cy="4.5" r="2" />
    <path d="M12 7.5c-3.5 0-6.5 1-6.5 1L6 10.5s2.5-.7 5-.9v3.4l-3.5 6.5 1.8.9L12 15l2.7 5.4 1.8-.9L13 13V9.6c2.5.2 5 .9 5 .9l.5-2s-3-1-6.5-1z" />
  </svg>
);

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
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-1.5">
      {open && (
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-lg p-3 card-shadow animate-fade-in space-y-1.5 w-44">
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
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 text-primary-foreground shadow-sm hover:scale-105 transition-transform"
        aria-label="תפריט נגישות"
      >
        <AccessibilityIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AccessibilityButton;
