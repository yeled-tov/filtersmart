import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Contrast, RotateCcw } from "lucide-react";

const AccessibilityIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <circle cx="12" cy="4.5" r="2" />
    <path d="M12 7.5c-3.5 0-6.5 1-6.5 1L6 10.5s2.5-.7 5-.9v3.4l-3.5 6.5 1.8.9L12 15l2.7 5.4 1.8-.9L13 13V9.6c2.5.2 5 .9 5 .9l.5-2s-3-1-6.5-1z" />
  </svg>
);

const MIN_FONT = 16;
const MAX_FONT = 22;

const AccessibilityButton = () => {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(MIN_FONT);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.fontSize = fontSize === MIN_FONT ? "" : `${fontSize}px`;
  }, [fontSize]);

  // Clicking anywhere outside closes the panel.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const reset = () => {
    setFontSize(MIN_FONT);
    document.documentElement.classList.remove("high-contrast");
  };

  return (
    <div ref={panelRef} className="fixed left-2 top-1/2 z-40 flex -translate-y-1/2 flex-col items-start gap-2">
      {open && (
        <div className="w-52 animate-scale-in rounded-lg border border-border bg-surface p-3 shadow-float">
          <h2 className="mb-2 px-1 text-sm font-bold text-ink">נגישות</h2>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.min(MAX_FONT, s + 2))}
                disabled={fontSize >= MAX_FONT}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-border py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-sunken disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                הגדלה
              </button>
              <button
                type="button"
                onClick={() => setFontSize((s) => Math.max(MIN_FONT, s - 2))}
                disabled={fontSize <= MIN_FONT}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-border py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-sunken disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" />
                הקטנה
              </button>
            </div>
            <button
              type="button"
              onClick={() => document.documentElement.classList.toggle("high-contrast")}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-right text-sm font-medium text-ink-soft transition-colors hover:bg-surface-sunken"
            >
              <Contrast className="h-4 w-4" />
              ניגודיות גבוהה
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-right text-sm font-medium text-ink-soft transition-colors hover:bg-surface-sunken"
            >
              <RotateCcw className="h-4 w-4" />
              איפוס
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-card transition-colors hover:bg-primary hover:text-white"
        aria-label="תפריט נגישות"
      >
        <AccessibilityIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AccessibilityButton;
