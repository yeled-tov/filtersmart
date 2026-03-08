import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

declare global {
  interface Window {
    chatbase?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

const ChatbotLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkChatbase = () => {
      const chatbaseFrame = document.querySelector('iframe[src*="chatbase"]');
      if (chatbaseFrame) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (checkChatbase()) return;

    const interval = setInterval(() => {
      if (checkChatbase()) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (isLoaded) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        className="w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center hover:scale-105 transition-transform relative"
        style={{
          animation: 'glow-pulse 2s ease-in-out infinite'
        }}
        onClick={() => {
          if (window.chatbase) {
            window.chatbase("open");
          }
        }}
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
      </button>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 hsl(var(--primary) / 0.5), 0 0 0 8px hsl(var(--primary) / 0.12);
          }
          50% {
            box-shadow: 0 0 0 5px hsl(var(--primary) / 0.25), 0 0 0 14px hsl(var(--primary) / 0.06);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatbotLoader;