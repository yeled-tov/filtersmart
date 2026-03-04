import { useState } from "react";
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/SEOHead";
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

    toast.success("ההודעה נשלחה בהצלחה! ניצור איתכם קשר בהקדם.");
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <>
      <SEOHead
        title="צור קשר – FilterSmart פילטר סמארט סינון טלפון אשדוד"
        description="צרו קשר עם FilterSmart (פילטר סמארט) באשדוד לשירותי סינון טלפון מקצועיים. טלפון: 052-718-6881, רחוב חטיבת גבעתי 2."
        path="/contact"
        keywords="סינון טלפון אשדוד, פילטר סמארט"
      />

      <section className="section-padding bg-background">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
              צור <span className="gradient-text">קשר</span>
            </h1>
            <p className="text-lg text-muted-foreground">נשמח לעזור לכם עם כל שאלה או בקשה</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 card-shadow">
                <h2 className="text-lg font-heading font-semibold text-card-foreground mb-4">פרטי התקשרות</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground text-sm">כתובת</p>
                      <p className="text-muted-foreground text-sm">{settings?.address || "רחוב חטיבת גבעתי 2, כניסה ו׳, אשדוד"}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground text-sm">טלפון</p>
                      <a href={`tel:${settings?.phone_raw || "0527186881"}`} className="text-muted-foreground text-sm hover:text-primary transition-colors" dir="ltr">
                        {settings?.phone || "052-718-6881"}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground text-sm">מייל</p>
                      <a href={`mailto:${settings?.email || "ywldyld@gmail.com"}`} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                        {settings?.email || "ywldyld@gmail.com"}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground text-sm">שעות פעילות</p>
                      <p className="text-muted-foreground text-sm">{settings?.opening_hours || "ראשון–חמישי: 09:00–19:00"}</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full gradient-primary text-primary-foreground border-0">WhatsApp</Button>
                </a>
                <a href={bitLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full">שלם ב-BIT</Button>
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 card-shadow space-y-4">
              <h2 className="text-lg font-heading font-semibold text-card-foreground mb-2">שלחו לנו הודעה</h2>
              <div>
                <Input placeholder="שם מלא" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <Input placeholder="טלפון" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={errors.phone ? "border-destructive" : ""} dir="ltr" />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Input placeholder="מייל (אופציונלי)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={errors.email ? "border-destructive" : ""} dir="ltr" />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <Textarea placeholder="הודעה" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={errors.message ? "border-destructive" : ""} />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={sending} className="w-full gradient-primary text-primary-foreground border-0 gap-2">
                <Send className="w-4 h-4" />
                {sending ? "שולח..." : "שלח הודעה"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
