

## Plan: Technical Updates for FilterSmart

### 1. Remove Built-in Chatbot
- Delete `src/components/SmartChatbot.tsx`
- Remove `SmartChatbot` import and usage from `src/components/Layout.tsx`

### 2. Embed Chatbase Chatbot
- The Chatbase script is already present in `index.html` (confirmed from the provided file). No changes needed here.

### 3. Remove Hero Buttons ("דברו איתנו" and "לשירותים שלנו")
- In `src/pages/Index.tsx`, remove lines 52-64 (the `div` containing both buttons in the Hero section).

### 4. SEO Updates
- **H1**: The current H1 in `Index.tsx` (lines 45-48) splits across two elements. Will consolidate to: `פילטר סמארט - סינון טלפונים וצריבת גרסאות באשדוד`
- **Meta Description**: Update `SEOHead` call (line 23) and `index.html` meta tags to: `המעבדה המובילה באשדוד לסינון מכשירים, התקנת הדרן, עסקן וכושר פליי. שירות מקצועי ומהיר לציבור החרדי והדתי`
- **Favicon**: Already set as `/favicon.png` in `index.html`. No change needed.

### Files to modify:
- `src/components/Layout.tsx` — remove SmartChatbot
- `src/pages/Index.tsx` — remove hero buttons, update H1 and meta description
- `index.html` — update meta description
- Delete `src/components/SmartChatbot.tsx`

