import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const settingsCards = [
  {
    title: "📍 פרטי העסק",
    fields: [
      { key: "business_name", label: "שם העסק" },
      { key: "address", label: "כתובת" },
      { key: "city", label: "עיר" },
      { key: "phone", label: "טלפון" },
      { key: "email", label: "אימייל", dir: "ltr" as const },
    ],
  },
  {
    title: "🔗 קישורים",
    fields: [
      { key: "whatsapp_link", label: "קישור WhatsApp", dir: "ltr" as const },
      { key: "bit_link", label: "קישור Bit", dir: "ltr" as const },
      { key: "maps_link", label: "קישור מפה (Waze/Maps)", dir: "ltr" as const },
    ],
  },
  {
    title: "🕐 שעות פעילות",
    fields: [
      { key: "hours_sun_thu", label: "ראשון–חמישי" },
      { key: "hours_fri", label: "שישי" },
      { key: "hours_sat", label: "שבת (סגור = השאר ריק)" },
    ],
  },
  {
    title: "📧 הגדרות טופס יצירת קשר",
    fields: [
      { key: "contact_email", label: "אימייל לקבלת פניות", dir: "ltr" as const },
      { key: "contact_auto_message", label: "הודעה אוטומטית ללקוח", multiline: true },
    ],
  },
  {
    title: "🔍 SEO בסיסי",
    fields: [
      { key: "seo_title", label: "כותרת האתר (Meta Title)" },
      { key: "seo_description", label: "תיאור האתר (Meta Description)", multiline: true },
    ],
  },
];

const allKeys = settingsCards.flatMap((c) => c.fields.map((f) => f.key));

const AdminSettings = () => {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useSiteSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  // Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); save(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [form]);

  const save = async () => {
    setSaving(true);
    for (const key of allKeys) {
      const value = form[key] || "";
      await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
    }
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    toast.success("ההגדרות נשמרו בהצלחה ✅");
    setSaving(false);
  };

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-lg" />)}</div>;

  return (
    <div className="max-w-3xl space-y-4">
      {settingsCards.map((card) => (
        <div key={card.title} className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h3 className="font-heading font-semibold text-foreground">{card.title}</h3>
          <div className="space-y-3">
            {card.fields.map((f) => (
              <div key={f.key}>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
                {(f as any).multiline ? (
                  <Textarea
                    value={form[f.key] || ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <Input
                    value={form[f.key] || ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    dir={(f as any).dir || "rtl"}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button onClick={save} disabled={saving} className="gap-2 w-full md:w-auto">
        <Save className="w-4 h-4" />{saving ? "שומר..." : "שמור את כל ההגדרות"}
      </Button>
    </div>
  );
};

export default AdminSettings;
