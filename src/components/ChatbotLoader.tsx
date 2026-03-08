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
        className="relative w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-10"
        onClick={() => {
          if (window.chatbase) {
            window.chatbase("open");
          }
        }}
      >
        {/* Sonar pulse rings - positioned relative to the button */}
        <span className="absolute inset-0 rounded-full border-[3px] border-primary animate-[chatbot-sonar_2s_ease-out_infinite] pointer-events-none" />
        <span className="absolute inset-0 rounded-full border-[3px] border-primary animate-[chatbot-sonar_2s_ease-out_0.8s_infinite] pointer-events-none" />
        <MessageCircle className="w-6 h-6 text-primary-foreground relative z-10" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background z-20" />
      </button>
      <style>{`
        @keyframes chatbot-sonar {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ChatbotLoader;
