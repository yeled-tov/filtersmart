import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

type Step = "welcome" | "q1" | "q2" | "q3" | "result";
type Answer = "protection" | "speed" | "price";

interface Message {
  from: "bot" | "user";
  text: string;
  options?: { label: string; value: Answer }[];
}

const results: Record<string, { name: string; slug: string; desc: string }> = {
  protection: { name: "מערכת הדרן (Hadran)", slug: "hadran", desc: "ההגנה ההרמטית ביותר בשוק – צריבה שלא ניתנת להסרה." },
  speed: { name: "מערכת כושר פליי (Kosher Play)", slug: "kosher-play", desc: "שדרוג ענק עם VPN מקומי שלא מאט את הגלישה." },
  price: { name: "סינון בסיסי", slug: "basic-filtering", desc: "פתרון מהיר ויעיל ב-20₪ בלבד, התקנה תוך 5 דקות." },
};

const botQuestions: Record<string, { text: string; options: { label: string; value: Answer }[] }> = {
  q1: {
    text: "מה הכי חשוב לכם בסינון? 🤔",
    options: [
      { label: "🛡️ הגנה מקסימלית", value: "protection" },
      { label: "⚡ מהירות הטלפון", value: "speed" },
      { label: "💰 מחיר נוח", value: "price" },
    ],
  },
  q2: {
    text: "האם חשוב לכם שלא ניתן יהיה להסיר את הסינון?",
    options: [
      { label: "כן, הכרחי", value: "protection" },
      { label: "רצוי אבל לא קריטי", value: "speed" },
      { label: "לא משנה", value: "price" },
    ],
  },
  q3: {
    text: "מה התקציב שלכם? 💳",
    options: [
      { label: "מוכנים להשקיע להגנה מלאה", value: "protection" },
      { label: "תקציב בינוני", value: "speed" },
      { label: "מחפשים פתרון חסכוני", value: "price" },
    ],
  },
};

const FilterMatcher = () => {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "שלום! 👋 אני הבוט של FilterPhone. אעזור לכם למצוא את פתרון הסינון המושלם." },
    { from: "bot", text: botQuestions.q1.text, options: botQuestions.q1.options },
  ]);
  const [step, setStep] = useState<Step>("q1");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleOption = (label: string, value: Answer) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    const userMsg: Message = { from: "user", text: label };
    const nextStep = step === "q1" ? "q2" : step === "q2" ? "q3" : "result";

    if (nextStep === "result") {
      const counts: Record<string, number> = { protection: 0, speed: 0, price: 0 };
      newAnswers.forEach((a) => counts[a]++);
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      const result = results[winner];

      setMessages((prev) => [
        ...prev,
        userMsg,
        { from: "bot", text: `מעולה! ✅ בהתבסס על התשובות שלכם, אני ממליץ על:\n\n🏆 **${result.name}**\n${result.desc}` },
      ]);
      setStep("result");
    } else {
      const q = botQuestions[nextStep];
      setMessages((prev) => [...prev, userMsg, { from: "bot", text: q.text, options: q.options }]);
      setStep(nextStep);
    }
  };

  const reset = () => {
    setMessages([
      { from: "bot", text: "שלום! 👋 אני הבוט של FilterPhone. אעזור לכם למצוא את פתרון הסינון המושלם." },
      { from: "bot", text: botQuestions.q1.text, options: botQuestions.q1.options },
    ]);
    setStep("q1");
    setAnswers([]);
  };

  const getResultSlug = () => {
    const counts: Record<string, number> = { protection: 0, speed: 0, price: 0 };
    answers.forEach((a) => counts[a]++);
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return results[winner].slug;
  };

  return (
    <section className="section-padding bg-muted/50">
      <div className="container-custom max-w-2xl text-center">
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">🤖 בוט התאמת סינון</h2>
        <p className="text-muted-foreground text-lg mb-8">שוחחו עם הבוט שלנו ונמצא לכם את הפתרון המושלם</p>

        <div className="bg-card rounded-2xl card-shadow overflow-hidden text-right">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">FilterPhone Bot</p>
                <p className="text-xs text-muted-foreground">מקוון</p>
              </div>
            </div>
            {step === "result" && (
              <Button variant="ghost" size="sm" onClick={reset} className="gap-1 text-xs">
                <RotateCcw className="w-3 h-3" />
                התחל מחדש
              </Button>
            )}
          </div>

          <div ref={scrollRef} className="p-4 space-y-3 h-80 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-start" : "justify-end"}`}>
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.from === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        msg.from === "user"
                          ? "bg-primary text-primary-foreground rounded-bl-sm"
                          : "bg-muted text-card-foreground rounded-br-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.from === "bot" && msg.options && i === messages.length - 1 && step !== "result" && (
                      <div className="mt-2 space-y-1.5">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleOption(opt.label, opt.value)}
                            className="block w-full text-right px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium text-card-foreground"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.from === "user" && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <User className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {step === "result" && (
              <div className="flex justify-center gap-3 pt-3">
                <Link to={`/services/${getResultSlug()}`}>
                  <Button size="sm" className="gradient-primary text-primary-foreground border-0">לפרטים נוספים</Button>
                </Link>
                <Button size="sm" variant="outline" onClick={reset} className="gap-1">
                  <RotateCcw className="w-3 h-3" />
                  נסו שוב
                </Button>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center gap-2">
            <div className="flex-1 bg-card border border-border rounded-full px-4 py-2 text-sm text-muted-foreground">
              בחרו אפשרות מהרשימה למעלה...
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Send className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterMatcher;