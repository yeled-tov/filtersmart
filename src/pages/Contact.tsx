import { useState } from "react";
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SITE, waLink } from "@/lib/site";

const contactSchema = z.object({
  name: z.string().trim().min(2, "שם חייב להכיל לפחות 2 תווים").max(100),
  phone: z.string().trim().min(9, "מספר טלפון לא תקין").max(15),
  email: z.string().trim().email("כתובת מייל לא תקינה").optional().or(z.literal("")),
  message: z.string().trim().min(5, "ההודעה חייבת להכיל לפחות 5 תווים").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { data: settings } = useSiteSettings();

  const wa = settings?.whatsapp_link || SITE.whatsapp;
  const bitLink = settings?.bit_link || SITE.bit;
  const phone = settings?.phone || SITE.phone;
  const phoneRaw = settings?.phone_raw || SITE.phoneRaw;
  const email = settings?.email || SITE.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);

    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      message: form.message,
    });

    setSending(false);
    if (error) {
      toast.error("השליחה נכשלה, נסו שוב או התקשרו אלינו");
      return;
    }

    setSubmitted(true);
    toast.success("ההודעה נשלחה – נחזור אליכם בהקדם");
    setForm({ name: "", phone: "", email: "", message: "" });
    window.setTimeout(() => setSubmitted(false), 6000);
  };

  const details = [
    { icon: MapPin, label: "כתובת", value: settings?.address || SITE.street, sub: SITE.neighbourhood, href: SITE.mapsUrl, external: true },
    { icon: Phone, label: "טלפון", value: phone, href: `tel:${phoneRaw}`, ltr: true },
    { icon: Mail, label: "מייל", value: email, href: `mailto:${email}` },
    { icon: Clock, label: "שעות פעילות", value: "א׳–ה׳ 09:00–19:00", sub: "ו׳ 09:00–13:00" },
  ];

  return (
    <>
      <SEOHead
        title={`צור קשר – FilterPhone פילטר פון אשדוד | ${SITE.phone}`}
        description={`יצירת קשר עם FilterPhone באשדוד לשירותי סינון טלפון. טלפון ${SITE.phone}, וואטסאפ זמין, ${SITE.street}, ${SITE.neighbourhood}. שירות בתיאום מראש, בדרך כלל ביום הפנייה.`}
        path="/contact"
        keywords="סינון טלפון אשדוד, פילטר פון יצירת קשר, FilterPhone טלפון"
      />
      <Breadcrumbs items={[{ label: "צור קשר" }]} />

      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="max-w-2xl">
            <span className="eyebrow">יצירת קשר</span>
            <h1 className="mt-4 text-display-lg">נשמח לשמוע מכם</h1>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              הדרך המהירה ביותר היא וואטסאפ או טלפון. אפשר גם להשאיר הודעה כאן ונחזור אליכם.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <AnimatedSection delay={0.06}>
                <div className="panel p-6">
                  <h2 className="text-lg font-bold text-ink">פרטי התקשרות</h2>
                  <ul className="mt-5 space-y-4">
                    {details.map((item) => (
                      <li key={item.label} className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary">
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[0.8125rem] text-muted-foreground">{item.label}</span>
                          {item.href ? (
                            <a
                              href={item.href}
                              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className={`block font-semibold text-ink transition-colors hover:text-primary ${item.ltr ? "num" : ""}`}
                            >
                              {item.value}
                            </a>
                          ) : (
                            <span className="block font-semibold text-ink">{item.value}</span>
                          )}
                          {item.sub && <span className="block text-[0.8125rem] text-muted-foreground">{item.sub}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="grid grid-cols-2 gap-2.5">
                  <a href={waLink("שלום פילטר פון, אשמח לקבל פרטים", wa)} target="_blank" rel="noopener noreferrer">
                    <Button variant="whatsapp" className="w-full gap-2">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href={bitLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">תשלום ב-BIT</Button>
                  </a>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.14}>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 panel panel-hover p-5"
                >
                  <span>
                    <span className="block font-semibold text-ink">איך מגיעים אלינו</span>
                    <span className="mt-0.5 block text-[0.875rem] text-muted-foreground">
                      {SITE.street}, {SITE.neighbourhood}
                    </span>
                  </span>
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                </a>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={0.1} className="lg:col-span-7">
              <div className="relative h-full rounded-xl border border-border bg-surface p-6 shadow-card md:p-8">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex h-full min-h-[22rem] flex-col items-center justify-center text-center"
                    >
                      <CheckCircle2 className="h-14 w-14 text-success" />
                      <h2 className="mt-5 text-display-sm">ההודעה נשלחה</h2>
                      <p className="mt-2 text-ink-soft">נחזור אליכם בהקדם האפשרי.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                      noValidate
                    >
                      <h2 className="text-lg font-bold text-ink">שליחת הודעה</h2>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="c-name" className="mb-1.5 block text-[0.8125rem] font-medium text-ink-soft">שם מלא</label>
                          <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" className={`h-11 ${errors.name ? "border-destructive" : ""}`} />
                          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div>
                          <label htmlFor="c-phone" className="mb-1.5 block text-[0.8125rem] font-medium text-ink-soft">טלפון</label>
                          <Input id="c-phone" type="tel" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" className={`h-11 ${errors.phone ? "border-destructive" : ""}`} />
                          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="c-email" className="mb-1.5 block text-[0.8125rem] font-medium text-ink-soft">מייל <span className="text-muted-foreground">(אופציונלי)</span></label>
                        <Input id="c-email" type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" className={`h-11 ${errors.email ? "border-destructive" : ""}`} />
                        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                      </div>

                      <div>
                        <label htmlFor="c-message" className="mb-1.5 block text-[0.8125rem] font-medium text-ink-soft">במה נוכל לעזור?</label>
                        <Textarea
                          id="c-message"
                          rows={6}
                          placeholder="לדוגמה: יש לי גלקסי A54 לבן 14, מחפש סינון שלא יוכל להסיר"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className={errors.message ? "border-destructive" : ""}
                        />
                        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                      </div>

                      <Button type="submit" disabled={sending} className="w-full gap-2" size="lg">
                        <Send className="h-4 w-4" />
                        {sending ? "שולח…" : "שליחת הודעה"}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
