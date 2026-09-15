import { useEffect, useState } from "react";
import { MessageSquareText } from "lucide-react";

declare global {
  interface Window {
    chatbase?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

/**
 * Placeholder for the Chatbase assistant bubble (bottom-left).
 * Chatbase is loaded a couple of seconds after `load` so it never competes with
 * the first paint; until its own bubble appears we show this stand-in, which
 * queues an "open" call if someone taps it early. It removes itself the moment
 * the real widget mounts.
 */
const ChatbotLoader = () => {
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    const found = () => Boolean(document.querySelector('iframe[src*="chatbase"]'));
    if (found()) {
      setWidgetReady(true);
      return;
    }
    const interval = window.setInterval(() => {
      if (found()) {
        setWidgetReady(true);
        window.clearInterval(interval);
      }
    }, 500);
    return () => window.clearInterval(interval);
  }, []);

  if (widgetReady) return null;

  return (
    <button
      type="button"
      onClick={() => window.chatbase?.("open")}
      className="group fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-float transition-transform duration-200 hover:scale-105"
      aria-label="פתיחת הצ׳אט עם העוזר החכם"
    >
      <span
        className="absolute inset-0 rounded-full border-2 border-primary/50 motion-safe:animate-ping"
        aria-hidden="true"
      />
      <MessageSquareText className="relative h-6 w-6" />
    </button>
  );
};

export default ChatbotLoader;
