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

  // Apps / WhatsApp / Kosher Play
  if (/וויז|וטסאפ|וואטסאפ|אפליקצי|כושר פליי|תמונות|חנות|kosher|play/.test(lower)) {
    return "⚡ כושר פליי (Kosher Play):\n\nכן, ניתן להשאיר רק ווייז ווואטסאפ, אבל זה אפשרי רק ב׳כושר פליי׳ ומעלה (לא בסינון הבסיסי).\n\nחשוב לדעת: בכושר פליי יש חסימה לתמונות פרופיל בוואטסאפ.\n\nלגבי אפליקציות – בחנויות של הדרן, עסקן וכושר פליי יש את כל האפליקציות הרגילות (בנקים, קופות חולים), אבל הכל מסונן וכשר.\n\n💰 עלות: 150 ₪ לכל החיים (ללא שירות) או 150 ₪ לשנה (עם שירות וגישה לחנות מלאה).";
  }

  // Performance / Data / Reset
  if (/איטי|תוקע|ביצועים|מהירות|מוחק|איפוס|גיבוי|נתונים|דאטה|מחיקה/.test(lower)) {
    return "📱 לגבי ביצועים ונתונים:\n\nחשוב להבין: ׳הדרן׳ וגם צריבת גרסה מלאה (לשיאומי קין 25 או F21) דורשים איפוס מלא של המכשיר ומוחקים את כל הנתונים, לכן חובה לעשות גיבוי מראש.\n\nהדרן עלול להאט מעט את המכשיר בגלל שינוי הגרסה.\n\nלעומת זאת, סינון ׳בסיסי׳ ו׳כושר פליי׳ לא מוחקים נתונים ולא פוגעים בכלל בביצועי המכשיר.";
  }

  // Pricing
  if (/כמה עולה|מחיר|תשלום|שקל|חודשי|עלות|תעריף|300|150|40|20/.test(lower)) {
    return "💰 המחירים שלנו:\n\nהמחירים עובדים ככה:\n• צריבה של הדרן עולה 300 ₪ חד פעמי אצלי + 40 ₪ כל חודש להדרן (התחייבות לשנה וחצי).\n• עסקן – גם 40 ₪ בחודש.\n• כושר פליי – שתי אופציות: 150 ₪ לכל החיים (ללא שירות) או 150 ₪ לשנה (עם שירות וגישה לחנות מלאה).\n• סינון בסיסי – 20 ₪ בלבד.";
  }

  // Removal
  if (/להסיר|לבטל|להתנתק|חרטה|הסרה|הורדה|להוריד/.test(lower)) {
    return "🔒 לגבי הסרת סינון:\n\nהכלל הוא כזה: את ׳הדרן׳ לא ניתן להסיר בשום צורה, גם אם תאפס את המכשיר – החסימה נשארת.\n\nבעסקן, כושר פליי ובסיסי – ניתן להסיר או לאפס, אבל *אך ורק* לאחר קבלת אישור מרחוק מספק החסימה.";
  }

  // Time & Location
  if (/זמן|כמה זמן|איפה|מיקום|כתובת|אשדוד|לחכות|לוקח|דקות|שעה|מגיעים|הגעה/.test(lower)) {
    return "📍 זמנים ומיקום:\n\nהתקנת סינון בסיסי לוקחת כ-5 דקות ואפשר לחכות במקום.\n\nהדרן, עסקן או כושר פליי דורשים בין חצי שעה לשעה וצריך לתאם מראש.\n\n🏠 אני יושב ברובע ג׳, רחוב חטיבת גבעתי 2 באשדוד (מול מסמר העיר).";
  }

  // Hadran
  if (/חזק|הרמטי|הדרן|מקסימלי|הגנה מקסימלית|הכי חזק|hadran/.test(lower)) {
    return "🛡️ הדרן (Hadran) – ההגנה ההרמטית ביותר:\n\nהדרן הוא פתרון הסינון החזק ביותר בשוק. מדובר בצריבת גרסה שלא ניתנת להסרה – גם איפוס מלא של המכשיר לא מוריד את החסימה.\n\n⚠️ חשוב: הדרן עלול להאט מעט את המכשיר וכולל רק אפליקציות כשרות מחנות ייעודית.\n\n💰 עלות: 300 ₪ התקנה + 40 ₪/חודש (מינימום שנה וחצי).";
  }

  // Askan
  if (/עבודה|עסקן|askan/.test(lower)) {
    return "🔧 עסקן (Askan):\n\nעסקן הוא פתרון הגנה חזקה ברמה גבוהה מאוד, אך בניגוד להדרן – ניתן להסיר אותו באישור הספק מרחוק.\n\nכולל רק אפליקציות כשרות מחנות ייעודית.\n\n💰 עלות: 40 ₪ לחודש.";
  }

  // Difference between services
  if (/הבדל|השוואה|לעומת|בין/.test(lower)) {
    return "⚖️ ההבדלים העיקריים בין המערכות:\n\n🛡️ הדרן – הגנה הרמטית מוחלטת, לא ניתן להסרה גם לא באיפוס. צריבת גרסה מלאה. 300₪ + 40₪/חודש.\n\n🔧 עסקן – הגנה חזקה מאוד, ניתן להסרה באישור ספק. 40₪/חודש.\n\n⚡ כושר פליי – VPN מקומי, לא מאט את המכשיר, משאיר וואטסאפ/וויז. 150₪ חד פעמי או לשנה.\n\n💡 סינון בסיסי – פתרון מהיר ב-20₪ בלבד, התקנה תוך 5 דקות.";
  }

  // Basic / Cheap
  if (/זול|פשוט|בסיסי|קל|מינימלי/.test(lower)) {
    return "💡 סינון בסיסי:\n\nפתרון מהיר ויעיל ב-20 ₪ בלבד.\n• התקנה תוך 5 דקות\n• לא מוחק נתונים\n• לא משפיע על ביצועי המכשיר\n• ניתן להסרה באישור ספק\n\nמתאים למי שרוצה שכבת הגנה בסיסית ללא שינוי במכשיר.";
  }

  // Fallback
  return "שאלה מעולה! 🤔\n\nיש לנו כמה סוגי הגנות:\n• 🛡️ הדרן – הגנה הרמטית שלא ניתן להסיר\n• 🔧 עסקן – הגנה חזקה עם אפשרות הסרה\n• ⚡ כושר פליי – מאוזן ומהיר, משאיר וואטסאפ\n• 💡 סינון בסיסי – פשוט וזול ב-20₪\n\nתוכל לפרט קצת יותר מה הצרכים שלך, או ללחוץ על הקישור לוואטסאפ שלנו להתייעצות אישית.";
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
            className="fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full gradient-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform backdrop-blur-md"
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
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 left-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl border border-border/50 flex flex-col bg-card/80 backdrop-blur-xl"
            style={{ height: "500px", maxHeight: "calc(100vh - 8rem)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 gradient-primary text-primary-foreground backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20 backdrop-blur-sm" dir="rtl">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.from === "user" ? "justify-start" : "justify-end"}`}
                >
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
                          : "bg-card/90 backdrop-blur-sm text-card-foreground rounded-br-sm shadow-sm border border-border/30"
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
                </motion.div>
              ))}

              {/* WhatsApp link */}
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
            <div className="px-3 py-2 border-t border-border/30 bg-card/60 backdrop-blur-sm overflow-x-auto" dir="rtl">
              <div className="flex gap-1.5 whitespace-nowrap pb-1">
                {quickReplies.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => send(qr)}
                    className="px-3 py-1.5 text-xs rounded-full border border-border/50 bg-muted/50 text-muted-foreground hover:border-primary hover:text-primary transition-colors shrink-0"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-3 py-2 border-t border-border/30 bg-card/60 backdrop-blur-sm flex items-center gap-2" dir="rtl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="הקלידו שאלה..."
                className="flex-1 bg-muted/40 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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
