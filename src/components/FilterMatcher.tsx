import { useState } from "react";
import { Shield, Zap, Coins, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

type Answer = "protection" | "speed" | "price";

const questions = [
  { q: "מה הכי חשוב לכם?", options: [
    { label: "הגנה מקסימלית", value: "protection" as Answer, icon: Shield },
    { label: "מהירות הטלפון", value: "speed" as Answer, icon: Zap },
    { label: "מחיר נוח", value: "price" as Answer, icon: Coins },
  ]},
  { q: "האם חשוב לכם שלא ניתן יהיה להסיר את הסינון?", options: [
    { label: "כן, הכרחי", value: "protection" as Answer, icon: Shield },
    { label: "רצוי אבל לא קריטי", value: "speed" as Answer, icon: Zap },
    { label: "לא משנה", value: "price" as Answer, icon: Coins },
  ]},
  { q: "מה התקציב שלכם?", options: [
    { label: "מוכנים להשקיע לטובת הגנה מלאה", value: "protection" as Answer, icon: Shield },
    { label: "תקציב בינוני", value: "speed" as Answer, icon: Zap },
    { label: "מחפשים פתרון חסכוני", value: "price" as Answer, icon: Coins },
  ]},
];

const results: Record<string, { name: string; slug: string; desc: string }> = {
  protection: { name: "מערכת הדרן (Hadran)", slug: "hadran", desc: "ההגנה ההרמטית ביותר בשוק – צריבה שלא ניתנת להסרה." },
  speed: { name: "מערכת כושר פליי (Kosher Play)", slug: "kosher-play", desc: "שדרוג ענק עם VPN מקומי שלא מאט את הגלישה." },
  price: { name: "סינון בסיסי", slug: "basic-filtering", desc: "פתרון מהיר ויעיל ב-20₪ בלבד, התקנה תוך 5 דקות." },
};

const FilterMatcher = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleAnswer = (value: Answer) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    setStep(step + 1);
  };

  const getResult = () => {
    const counts: Record<string, number> = { protection: 0, speed: 0, price: 0 };
    answers.forEach((a) => counts[a]++);
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return results[winner];
  };

  const reset = () => { setStep(0); setAnswers([]); };

  const done = step >= questions.length;
  const result = done ? getResult() : null;

  return (
    <section className="section-padding bg-muted/50">
      <div className="container-custom max-w-2xl text-center">
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">🔍 מצאו את הסינון המתאים לכם</h2>
        <p className="text-muted-foreground text-lg mb-10">ענו על 3 שאלות קצרות ונמליץ על הפתרון המושלם</p>

        {!done ? (
          <div className="bg-card rounded-xl p-8 card-shadow">
            <p className="text-sm text-muted-foreground mb-2">שאלה {step + 1} מתוך {questions.length}</p>
            <h3 className="text-xl font-heading font-semibold text-card-foreground mb-6">{questions[step].q}</h3>
            <div className="space-y-3">
              {questions[step].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full flex items-center gap-3 px-5 py-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-right"
                >
                  <opt.icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-card-foreground font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : result && (
          <div className="bg-card rounded-xl p-8 card-shadow animate-fade-in">
            <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-card-foreground mb-2">אנחנו ממליצים על:</h3>
            <p className="text-xl font-semibold gradient-text mb-3">{result.name}</p>
            <p className="text-muted-foreground mb-6">{result.desc}</p>
            <div className="flex justify-center gap-3">
              <Link to={`/services/${result.slug}`}>
                <Button className="gradient-primary text-primary-foreground border-0">לפרטים נוספים</Button>
              </Link>
              <Button variant="outline" onClick={reset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                נסו שוב
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilterMatcher;
