import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Baby, Briefcase, Check, CheckCircle2, Cpu,
  GraduationCap, Info, Laptop, Lock, MessageCircle, Monitor, Music,
  Navigation, RotateCcw, Send, Shield, ShieldCheck, Smartphone,
  Sparkles, Tablet, Unlock, User, Wallet,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE, waLink } from "@/lib/site";
import {
  recommend, summariseAnswers,
  type AdvisorAnswers, type Budget, type DataState, type DeviceKind,
  type MustKeep, type Recommendation, type Removability, type Strictness, type WhoFor,
} from "@/lib/advisor";

type Draft = Partial<AdvisorAnswers>;

interface Option<T> {
  value: T;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Step {
  key: keyof AdvisorAnswers;
  question: string;
  helper?: string;
  multi?: boolean;
  optional?: boolean;
  columns?: 2 | 3;
  options: Option<string>[];
}

const STEPS: Step[] = [
  {
    key: "whoFor",
    question: "בשביל מי הסינון?",
    helper: "זה הדבר שהכי משפיע על ההמלצה.",
    columns: 2,
    options: [
      { value: "child", label: "ילד או ילדה", hint: "עד גיל 12", icon: Baby },
      { value: "teen", label: "נער או נערה", hint: "13–18", icon: GraduationCap },
      { value: "adult", label: "מבוגר / בשבילי", hint: "שימוש אישי", icon: User },
      { value: "business", label: "עבודה ועסקים", hint: "המכשיר חייב לתפקד", icon: Briefcase },
    ],
  },
  {
    key: "device",
    question: "איזה מכשיר צריך לסנן?",
    columns: 3,
    options: [
      { value: "iphone", label: "אייפון", hint: "כל הדגמים", icon: Smartphone },
      { value: "android", label: "אנדרואיד", hint: "גלקסי, שיאומי ועוד", icon: Smartphone },
      { value: "qin", label: "מכשיר Qin", hint: "F21 Pro / F25", icon: Cpu },
      { value: "tablet", label: "טאבלט", hint: "אייפד או אנדרואיד", icon: Tablet },
      { value: "computer", label: "מחשב", hint: "נייח או נייד", icon: Monitor },
    ],
  },
  {
    key: "strictness",
    question: "כמה מחמיר הסינון צריך להיות?",
    options: [
      { value: "light", label: "חסימת תכנים פוגעניים בלבד", hint: "שאר המכשיר נשאר כרגיל", icon: Shield },
      { value: "medium", label: "גם רשתות חברתיות ובידור", hint: "האיזון המבוקש ביותר", icon: ShieldCheck },
      { value: "strict", label: "סינון מלא ומחמיר", hint: "סביבה סגורה לגמרי", icon: Lock },
    ],
  },
  {
    key: "mustKeep",
    question: "מה חייב להמשיך לעבוד במכשיר?",
    helper: "אפשר לבחור כמה תשובות, ואפשר גם לדלג.",
    multi: true,
    optional: true,
    columns: 2,
    options: [
      { value: "whatsapp", label: "וואטסאפ", icon: MessageCircle },
      { value: "navigation", label: "ניווט – ווייז ומפות", icon: Navigation },
      { value: "work", label: "אפליקציות עבודה ובנק", icon: Laptop },
      { value: "music", label: "מוזיקה ותוכן שמע", icon: Music },
    ],
  },
  {
    key: "removability",
    question: "חשוב שלא יהיה אפשר להסיר את הסינון?",
    options: [
      { value: "locked", label: "כן, זה הכרחי", hint: "גם איפוס יצרן לא יוריד", icon: Lock },
      { value: "prefer-locked", label: "עדיף, אבל לא קריטי", icon: ShieldCheck },
      { value: "flexible", label: "לא משנה לי", hint: "רוצה גמישות לשנות", icon: Unlock },
    ],
  },
  {
    key: "dataState",
    question: "מה עם התוכן שנמצא היום במכשיר?",
    helper: "חלק מהפתרונות נצרבים על מכשיר מאופס.",
    columns: 2,
    options: [
      { value: "keep", label: "חשוב לשמור הכול", hint: "תמונות, אנשי קשר, הודעות", icon: Smartphone },
      { value: "can-wipe", label: "אפשר לאפס", hint: "מכשיר חדש או מגובה", icon: RotateCcw },
    ],
  },
  {
    key: "budget",
    question: "מה התקציב שלכם?",
    columns: 3,
    options: [
      { value: "tight", label: "עד 100₪", icon: Wallet },
      { value: "balanced", label: "עד 200₪", icon: Wallet },
      { value: "open", label: "העיקר הפתרון הנכון", icon: Sparkles },
    ],
  },
];

const isComplete = (d: Draft): d is AdvisorAnswers =>
  Boolean(d.whoFor && d.device && d.strictness && d.removability && d.dataState && d.budget);

/* ------------------------------------------------------------------ */

const OptionButton = ({
  option, selected, multi, onClick,
}: { option: Option<string>; selected: boolean; multi?: boolean; onClick: () => void }) => {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex w-full items-center gap-3 rounded-md border p-4 text-right transition-all duration-200 ${
        selected
          ? "border-primary bg-primary-tint shadow-soft"
          : "border-border bg-surface hover:border-primary/45 hover:bg-surface-sunken"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors ${
          selected ? "bg-primary text-white" : "bg-surface-sunken text-primary"
        }`}
      >
        <Icon className="h-[1.15rem] w-[1.15rem]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.9375rem] font-semibold leading-snug text-ink">{option.label}</span>
        {option.hint && <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted-foreground">{option.hint}</span>}
      </span>
      {multi && (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
            selected ? "border-primary bg-primary text-white" : "border-border-strong"
          }`}
          aria-hidden="true"
        >
          {selected && <Check className="h-3.5 w-3.5" />}
        </span>
      )}
    </button>
  );
};

/* ------------------------------------------------------------------ */

const ResultCard = ({ rec, rank }: { rec: Recommendation; rank: number }) => {
  const primary = rank === 0;
  return (
    <div
      className={`rounded-lg border p-5 md:p-6 ${
        primary ? "border-primary/35 bg-surface shadow-card" : "border-border bg-surface"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {primary && (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-sm bg-primary px-2.5 py-1 text-[0.6875rem] font-bold text-white">
              <Sparkles className="h-3 w-3" />
              ההמלצה שלנו עבורכם
            </span>
          )}
          <h4 className={`${primary ? "text-xl md:text-2xl" : "text-lg"} font-display font-bold text-ink`}>
            {rec.profile.name}
          </h4>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{rec.profile.summary}</p>
        </div>
        <div className="text-left">
          <span className="num block text-2xl font-extrabold text-primary">{rec.profile.priceLabel}</span>
          <span className="block text-[0.75rem] text-muted-foreground">התקנה {rec.profile.installTime}</span>
        </div>
      </div>

      {/* Match meter */}
      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
          <motion.div
            className={`h-full rounded-full ${primary ? "bg-primary" : "bg-border-strong"}`}
            initial={{ width: 0 }}
            animate={{ width: `${rec.match}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <span className="num shrink-0 text-xs font-bold text-ink-soft">{rec.match}% התאמה</span>
      </div>

      {rec.reasons.length > 0 && (
        <ul className="mt-4 space-y-2">
          {rec.reasons.map((r) => (
            <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              {r}
            </li>
          ))}
        </ul>
      )}

      {rec.cautions.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-border pt-3">
          {rec.cautions.map((c) => (
            <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {c}
            </li>
          ))}
        </ul>
      )}

      <Link
        to={`/services/${rec.profile.slug}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary link-underline"
      >
        כל הפרטים על {rec.profile.shortName}
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const LeadForm = ({ answers, top }: { answers: AdvisorAnswers; top: Recommendation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const note = `פנייה מיועץ הסינון באתר.\nהמלצה: ${top.profile.name} (${top.profile.priceLabel})\n\n${summariseAnswers(answers)}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("נא למלא שם מלא");
    if (phone.replace(/\D/g, "").length < 9) return toast.error("מספר טלפון לא תקין");

    setSending(true);
    const { error } = await supabase
      .from("contact_submissions")
      .insert({ name: name.trim(), phone: phone.trim(), message: note });
    setSending(false);

    if (error) return toast.error("השליחה נכשלה, נסו שוב או התקשרו אלינו");
    setDone(true);
    toast.success("הפרטים התקבלו – נחזור אליכם בהקדם");
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-success/30 bg-success/5 p-5">
        <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />
        <p className="text-sm font-medium text-ink">
          קיבלנו את הפרטים יחד עם סיכום התשובות שלכם. נחזור אליכם עם המלצה מדויקת.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-md border border-border bg-surface-sunken p-5">
      <h4 className="font-display text-lg font-bold text-ink">רוצים שנוודא איתכם שזו באמת ההתאמה הנכונה?</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        השאירו שם וטלפון – נחזור אליכם עם סיכום התשובות שלכם כבר מולנו, בלי להתחיל מהתחלה.
      </p>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-[1fr_1fr_auto]">
        <Input placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="h-11 bg-surface" />
        <Input placeholder="טלפון" type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className="h-11 bg-surface" />
        <Button type="submit" disabled={sending} className="h-11 gap-2">
          <Send className="h-4 w-4" />
          {sending ? "שולח…" : "שלחו לי"}
        </Button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */

const FilterAdvisor = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>({ mustKeep: [] });
  const [finished, setFinished] = useState(false);

  const step = STEPS[stepIndex];
  const progress = finished ? 100 : Math.round((stepIndex / STEPS.length) * 100);

  const results = useMemo(
    () => (finished && isComplete(draft) ? recommend(draft) : []),
    [finished, draft],
  );

  const goNext = (next: Draft) => {
    if (stepIndex < STEPS.length - 1) {
      setDraft(next);
      setStepIndex((i) => i + 1);
    } else {
      setDraft(next);
      setFinished(true);
    }
  };

  const choose = (value: string) => {
    if (step.multi) {
      const current = (draft.mustKeep ?? []) as MustKeep[];
      const v = value as MustKeep;
      setDraft({
        ...draft,
        mustKeep: current.includes(v) ? current.filter((x) => x !== v) : [...current, v],
      });
      return;
    }

    const next: Draft = { ...draft };
    switch (step.key) {
      case "whoFor": next.whoFor = value as WhoFor; break;
      case "device": next.device = value as DeviceKind; break;
      case "strictness": next.strictness = value as Strictness; break;
      case "removability": next.removability = value as Removability; break;
      case "dataState": next.dataState = value as DataState; break;
      case "budget": next.budget = value as Budget; break;
      default: break;
    }
    goNext(next);
  };

  const reset = () => {
    setDraft({ mustKeep: [] });
    setStepIndex(0);
    setFinished(false);
  };

  const selectedValues: string[] = step?.multi
    ? ((draft.mustKeep ?? []) as string[])
    : [(draft[step?.key as keyof Draft] as string) ?? ""];

  const top = results[0];
  const rest = results.slice(1, 3);

  return (
    <section id="advisor" className="section-padding bg-surface-sunken" aria-label="יועץ הסינון של FilterPhone">
      <div className="container-custom max-w-4xl">
        <div className="mb-10 text-center">
          <span className="eyebrow before:hidden">יועץ הסינון</span>
          <h2 className="mt-3 text-display-md">לא בטוחים איזה סינון מתאים לכם?</h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
            שבע שאלות קצרות, והיועץ ידרג עבורכם את כל הפתרונות שלנו – עם הסבר למה כל אחד מהם
            מתאים או לא מתאים למקרה שלכם.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
          {/* Header + progress */}
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 md:px-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.9375rem] font-bold leading-tight text-ink">יועץ הסינון</p>
                <p className="text-xs text-muted-foreground">
                  {finished ? "סיימנו – הנה מה שמצאנו" : `שאלה ${stepIndex + 1} מתוך ${STEPS.length}`}
                </p>
              </div>
            </div>
            {(stepIndex > 0 || finished) && (
              <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                התחלה מחדש
              </Button>
            )}
          </div>

          <div className="h-1 bg-surface-sunken">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="p-5 md:p-7">
            <AnimatePresence mode="wait">
              {!finished ? (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="text-xl font-display font-bold text-ink md:text-2xl">{step.question}</h3>
                  {step.helper && <p className="mt-2 text-sm text-muted-foreground">{step.helper}</p>}

                  <div
                    className={`mt-5 grid gap-2.5 ${
                      step.columns === 3 ? "sm:grid-cols-3" : step.columns === 2 ? "sm:grid-cols-2" : ""
                    }`}
                  >
                    {step.options.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        option={opt}
                        multi={step.multi}
                        selected={selectedValues.includes(opt.value)}
                        onClick={() => choose(opt.value)}
                      />
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                      disabled={stepIndex === 0}
                      className="gap-1.5"
                    >
                      <ArrowRight className="h-4 w-4" />
                      חזרה
                    </Button>
                    {step.multi && (
                      <Button onClick={() => goNext(draft)} className="gap-1.5">
                        {(draft.mustKeep ?? []).length > 0 ? "המשך" : "אין דרישה מיוחדת"}
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  {top && <ResultCard rec={top} rank={0} />}

                  {rest.length > 0 && (
                    <>
                      <p className="rule-label pt-2">אפשרויות נוספות שבדקנו</p>
                      <div className="grid gap-3 md:grid-cols-2">
                        {rest.map((rec, i) => (
                          <ResultCard key={rec.slug} rec={rec} rank={i + 1} />
                        ))}
                      </div>
                    </>
                  )}

                  {top && isComplete(draft) && (
                    <>
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        <a
                          href={waLink(
                            `שלום פילטר פון, מילאתי את יועץ הסינון באתר.\nההמלצה שהתקבלה: ${top.profile.name} (${top.profile.priceLabel}).\n\n${summariseAnswers(draft)}`,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none"
                        >
                          <Button variant="whatsapp" className="w-full gap-2">
                            <MessageCircle className="h-4 w-4" />
                            שליחת התוצאה בוואטסאפ
                          </Button>
                        </a>
                        <a href={`tel:${SITE.phoneRaw}`} className="flex-1 sm:flex-none">
                          <Button variant="outline" className="w-full">
                            <span className="num">{SITE.phone}</span>
                          </Button>
                        </a>
                      </div>

                      <LeadForm answers={draft} top={top} />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          היועץ נותן כיוון ראשוני בלבד. את ההתאמה הסופית נעשה יחד איתכם, לפי המכשיר המדויק שברשותכם.
        </p>
      </div>
    </section>
  );
};

export default FilterAdvisor;
