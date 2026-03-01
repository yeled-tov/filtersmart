import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WA_LINK = "https://wa.me/972527186881?text=שלום%20פילטר%20סמארט%2C%20אשמח%20לקבל%20פרטים";

interface Message {
  from: "bot" | "user";
  text: string;
}

const quickReplies = [
  "כמה עולה הדרן?",
  "זה מוחק לי נתונים?",
  "איפה אתם באשדוד?",
  "אני צריך הגנה הרמטית",
  "משהו זול ופשוט",
  "מה ההבדל בין עסקן להדרן?",
];

function matchResponse(input: string): string {
  const lower = input.trim();

  // Pricing
  if (/מחיר|עול[הת]|כמה|תעריף|עלות|300|150|40|20/.test(lower)) {
    return "💰 הנה התעריפים שלנו:\n\n• סינון בסיסי: 20 ₪ בלבד\n• כושר פליי: 150 ₪ לכל החיים (בלי שירות) או 150 ₪ לשנה עם שירות וחנות מלאה\n• עסקן: 40 ₪ לחודש\n• הדרן: 300 ₪ התקנה + 40 ₪ לחודש (מינימום שנה וחצי)";
  }

  // Data/Reset
  if (/מוחק|נתונים|גיבוי|איפוס|מחיקה|דאטה/.test(lower)) {
    return "📱 לגבי מחיקת נתונים:\n\n• צריבת גרסה (קין 25/F21) או הדרן – מוחקים הכל ודורשים גיבוי מראש.\n• כושר פליי ובסיסי – לא מוחקים נתונים כלל.";
  }

  // Removal
  if (/להסיר|הסרה|הורדה|להוריד|לבטל/.test(lower)) {
    return "🔒 לגבי הסרת סינון:\n\n• הדרן – לא ניתן להסיר. גם איפוס לא מוריד את החסימה.\n• עסקן, כושר פליי ובסיסי – ניתן להסיר באישור הספק מרחוק.";
  }

  // Location & Time
  if (/איפה|כתובת|אשדוד|מיקום|הגעה|מגיעים|זמן|לוקח|דקות|שעה/.test(lower)) {
    return "📍 אנחנו נמצאים ב:\nחטיבת גבעתי 2, רובע ג׳, אשדוד (מול מסמר העיר)\n\n⏱️ זמני התקנה:\n• בסיסי: 5 דקות\n• הדרן/עסקן/כושר פליי: חצי שעה עד שעה בתיאום מראש";
  }

  // Hadran
  if (/חזק|הרמטי|הדרן|מקסימלי|הגנה מקסימלית|הכי חזק/.test(lower)) {
    return "🛡️ הדרן (Hadran) – ההגנה ההרמטית ביותר:\n\n• צריבה שלא ניתנת להסרה – גם לא באיפוס\n• עשוי להאט מעט את המכשיר\n• כולל רק אפליקציות כשרות\n• עלות: 300 ₪ התקנה + 40 ₪/חודש";
  }

  // Askan
  if (/עבודה|עסקן|askan/.test(lower)) {
    return "🔧 עסקן (Askan):\n\n• הגנה חזקה ברמה גבוהה\n• 40 ₪ לחודש\n• ניתן להסיר באישור הספק מרחוק\n• כולל רק אפליקציות כשרות";
  }

  // Difference between Askan and Hadran
  if (/הבדל|השוואה|לעומת/.test(lower)) {
    return "⚖️ ההבדלים העיקריים:\n\n🛡️ הדרן: הגנה הרמטית, לא ניתן להסרה, צריבת גרסה מלאה (300₪ + 40₪/חודש)\n🔧 עסקן: הגנה חזקה, ניתן להסרה באישור ספק (40₪/חודש)\n⚡ כושר פליי: VPN מקומי, לא מאט, משאיר וואטסאפ/וויז (150₪)\n📱 בסיסי: פתרון מהיר ב-20₪";
  }

  // Kosher Play
  if (/תמונות|וואטסאפ|כושר|פליי|ביניים|whatsapp|kosher/.test(lower)) {
    return "⚡ כושר פליי (Kosher Play):\n\n• ניתן להשאיר וויז ווואטסאפ\n• חסימת תמונת פרופיל בוואטסאפ\n• לא משפיע על ביצועי המכשיר (VPN מקומי)\n• 150 ₪ לכל החיים או 150 ₪/שנה עם שירות";
  }

  // Basic / Cheap
  if (/זול|פשוט|בסיסי|קל|מינימלי|20/.test(lower)) {
    return "💡 סינון בסיסי:\n\n• פתרון מהיר ויעיל ב-20 ₪ בלבד\n• התקנה תוך 5 דקות\n• לא מוחק נתונים\n• לא משפיע על ביצועי המכשיר\n• ניתן להסרה";
  }

  // Apps
  if (/אפליקצי|חנות|אפליקציות|תוכנות|apps/.test(lower)) {
    return "📲 לגבי אפליקציות:\n\n• ניתן להשאיר וויז ווואטסאפ בכושר פליי ומעלה (לא בבסיסי)\n• יש חסימת תמונת פרופיל בכושר פליי\n• כל החנויות (הדרן, עסקן, כושר פליי) כוללות רק אפליקציות כשרות";
  }

  // Performance
  if (/מהירות|ביצועים|איטי|מאט|מהיר/.test(lower)) {
    return "⚡ לגבי ביצועים:\n\n• הדרן עשוי להאט מעט את המכשיר בגלל שינוי הגרסה\n• בסיסי וכושר פליי לא משפיעים על הביצועים כלל";
  }

  // Fallback
  return "שאלה מעולה! 🤔\n\nיש לנו כמה סוגי הגנות:\n• 🛡️ הדרן – הגנה הרמטית\n• 🔧 עסקן – הגנה חזקה\n• ⚡ כושר פליי – מאוזן ומהיר\n• 💡 סינון בסיסי – פשוט וזול\n\nתוכל לפרט קצת יותר מה הצרכים שלך?";
}

const SmartChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "שלום! 👋 אני העוזר של פילטר סמארט.\nאיך אני יכול לעזור לך לבחור את החסימה המתאימה?" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { from: "user", text: text.trim() };
    const botReply: Message = { from: "bot", text: matchResponse(text) };
    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full gradient-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="פתח צ׳אט"
          >
            <MessageCircle className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl border border-border bg-card flex flex-col"
            style={{ height: "500px", maxHeight: "calc(100vh - 8rem)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 gradient-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">FilterSmart Bot</p>
                  <p className="text-xs opacity-80">מקוון • משיב מיידית</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="סגור צ׳אט">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30" dir="rtl">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-start" : "justify-end"}`}>
                  <div className="flex items-end gap-1.5 max-w-[85%]">
                    {msg.from === "bot" && (
                      <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center shrink-0">
                        <Bot className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        msg.from === "user"
                          ? "bg-primary text-primary-foreground rounded-bl-sm"
                          : "bg-card text-card-foreground rounded-br-sm card-shadow"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.from === "user" && (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* WhatsApp link after every bot message */}
              {messages.length > 1 && messages[messages.length - 1].from === "bot" && (
                <div className="flex justify-end">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary hover:underline mr-8"
                  >
                    <ExternalLink className="w-3 h-3" />
                    דבר איתנו בוואטסאפ
                  </a>
                </div>
              )}
            </div>

            {/* Quick replies */}
            <div className="px-3 py-2 border-t border-border bg-card overflow-x-auto" dir="rtl">
              <div className="flex gap-1.5 whitespace-nowrap pb-1">
                {quickReplies.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => send(qr)}
                    className="px-3 py-1.5 text-xs rounded-full border border-border bg-muted/50 text-muted-foreground hover:border-primary hover:text-primary transition-colors shrink-0"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-3 py-2 border-t border-border bg-card flex items-center gap-2" dir="rtl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="הקלידו שאלה..."
                className="flex-1 bg-muted/50 border border-border rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-full gradient-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                disabled={!input.trim()}
                aria-label="שלח"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartChatbot;
