import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const settingsFields = [
  { key: "business_name", label: "שם העסק" },
  { key: "phone", label: "טלפון" },
  { key: "phone_raw", label: "טלפון (ללא מקף)" },
  { key: "email", label: "מייל" },
  { key: "address", label: "כתובת" },
  { key: "whatsapp_link", label: "קישור WhatsApp", dir: "ltr" as const },
  { key: "bit_link", label: "קישור BIT", dir: "ltr" as const },
  { key: "hero_title", label: "כותרת ראשית" },
  { key: "hero_subtitle", label: "כותרת משנה" },
  { key: "hero_description", label: "תיאור ראשי", multiline: true },
  { key: "opening_hours", label: "שעות פעילות" },
];

const AdminSettings = () => {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useSiteSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const save = async () => {
    setSaving(true);
    for (const field of settingsFields) {
      const value = form[field.key] || "";
      await supabase
        .from("site_settings")
        .upsert({ key: field.key, value }, { onConflict: "key" });
    }
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    toast.success("ההגדרות נשמרו");
    setSaving(false);
  };

  if (isLoading) return <p className="text-muted-foreground">טוען...</p>;

  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-foreground mb-6">הגדרות האתר</h2>
      <div className="bg-card rounded-xl p-6 card-shadow space-y-4 max-w-2xl">
        {settingsFields.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-medium text-foreground mb-1 block">{f.label}</label>
            {f.multiline ? (
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
        <Button onClick={save} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? "שומר..." : "שמור הגדרות"}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
