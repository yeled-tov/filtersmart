import { useState } from "react";
import { MapPin, Phone, Mail, Send, Clock, CheckCircle, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const contactSchema = z.object({
  name: z.string().trim().min(2, "שם חייב להכיל לפחות 2 תווים").max(100),
  phone: z.string().trim().min(9, "מספר טלפון לא תקין").max(15),
  email: z.string().trim().email("כתובת מייל לא תקינה").optional().or(z.literal("")),
  message: z.string().trim().min(5, "הודעה חייבת להכיל לפחות 5 תווים").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { data: settings } = useSiteSettings();

  const waLink = settings?.whatsapp_link || "https://wa.me/972527186881";
  const bitLink = settings?.bit_link || "https://bitpay.co.il/app/me/0527186881";

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
      toast.error("שגיאה בשליחה, נסו שוב");
      return;
    }

    setSubmitted(true);
    toast.success("ההודעה נשלחה בהצלחה! ניצור איתכם קשר בהקדם.");
    setForm({ name: "", phone: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      <SEOHead
        title="צור קשר – FilterPhone פילטר פון | סינון טלפון אשדוד ☎ 052-718-6881"
        description="צרו קשר עם FilterPhone באשדוד לשירותי סינון טלפון מקצועיים. טלפון: 052-718-6881, WhatsApp זמין, רחוב חטיבת גבעתי 2. שירות מהיר ביום הפנייה."
        path="/contact"
        keywords="סינון טלפון אשדוד, פילטר פון יצירת קשר, FilterPhone טלפון, סינון טלפון מחיר"
      />
      <Breadcrumbs items={[{ label: "צור קשר" }]} />

      <section className="section-padding bg-background bg-mesh">
        <div className="container-custom max-w-5xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4 text-balance">
                צור <span className="gradient-text">קשר</span>
              </h1>
              <p className="text-lg text-muted-foreground">נשמח לעזור לכם עם כל שאלה או בקשה – מענה מהיר ואישי</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <AnimatedSection delay={0.08}>
                <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50">
                  <h2 className="text-lg font-heading font-semibold text-card-foreground mb-5">פרטי התקשרות</h2>
                  <ul className="space-y-4">
                    {[
                      { icon: MapPin, label: "כתובת", value: settings?.address || "חטיבת גבעתי 2, כניסה ו׳, אשדוד", sub: "רובע ג׳" },
                      { icon: Phone, label: "טלפון", value: settings?.phone || "052-718-6881", href: `tel:${settings?.phone_raw || "0527186881"}`, dir: "ltr" as const },
                      { icon: Mail, label: "מייל", value: settings?.email || "ywldyld@gmail.com", href: `mailto:${settings?.email || "ywldyld@gmail.com"}` },
                      { icon: Clock, label: "שעות פעילות", value: settings?.opening_hours || "א׳–ה׳: 09:00–19:00", sub: "ו׳: 09:00–13:00" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground text-sm">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="text-muted-foreground text-sm hover:text-primary transition-colors" dir={item.dir}>
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground text-sm">{item.value}</p>
                          )}
                          {item.sub && <p className="text-muted-foreground/60 text-xs">{item.sub}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.16}>
                <div className="flex gap-3">
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full gradient-primary text-white border-0 h-11 gap-2 shadow-md shadow-primary/20">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href={bitLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full h-11">שלם ב-BIT</Button>
                  </a>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={0.12}>
              <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50 relative overflow-hidden h-full">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      >
                        <CheckCircle className="w-16 h-16 text-secondary mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-heading font-bold text-card-foreground mb-2">ההודעה נשלחה!</h3>
                      <p className="text-muted-foreground">ניצור איתכם קשר בהקדם האפשרי</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <h2 className="text-lg font-heading font-semibold text-card-foreground mb-2">שלחו לנו הודעה</h2>
                      <div>
                        <Input placeholder="שם מלא" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`h-11 ${errors.name ? "border-destructive" : ""}`} />
                        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <Input placeholder="טלפון" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`h-11 ${errors.phone ? "border-destructive" : ""}`} dir="ltr" />
                        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                      </div>
                      <div>
                        <Input placeholder="מייל (אופציונלי)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`h-11 ${errors.email ? "border-destructive" : ""}`} dir="ltr" />
                        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <Textarea placeholder="הודעה" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={errors.message ? "border-destructive" : ""} />
                        {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                      </div>
                      <Button type="submit" disabled={sending} className="w-full gradient-primary text-white border-0 gap-2 h-11 shadow-md shadow-primary/20">
                        <Send className="w-4 h-4" />
                        {sending ? "שולח..." : "שלח הודעה"}
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
