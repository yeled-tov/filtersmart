import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const ChatbotLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if chatbase is loaded
    const checkChatbase = () => {
      const chatbaseFrame = document.querySelector('iframe[src*="chatbase"]');
      if (chatbaseFrame) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // Initial check
    if (checkChatbase()) return;

    // Poll for chatbase iframe
    const interval = setInterval(() => {
      if (checkChatbase()) {
        clearInterval(interval);
      }
    }, 500);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  // Hide placeholder once chatbase is loaded
  if (isLoaded) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        className="w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center animate-pulse hover:scale-105 transition-transform"
        onClick={() => {
          // Try to trigger chatbase if it exists
          if (window.chatbase) {
            window.chatbase("open");
          }
        }}
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
    </div>
  );
};

export default ChatbotLoader;