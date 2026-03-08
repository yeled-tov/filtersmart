

## Plan: Remove chatbot button, keep only the sonar halo

The user wants to remove the visible button (the blue circle with the MessageCircle icon and green dot), keeping only the sonar pulse animation rings. The rings will still be clickable to open the chatbot.

### Changes to `src/components/ChatbotLoader.tsx`:
1. Remove the `bg-primary shadow-lg` styling from the button (make it transparent/invisible)
2. Remove the `<MessageCircle>` icon
3. Remove the green status dot (`<span>` with `bg-emerald-500`)
4. Keep the button element for click functionality but make it invisible — only the sonar pulse rings remain visible

