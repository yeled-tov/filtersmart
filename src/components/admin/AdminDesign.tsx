import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const designFields = [
  { section: "🎯 כותרת ראשית (Hero)", fields: [
    { key: "hero_title", label: "כותרת ראשית" },
    { key: "hero_subtitle", label: "כותרת משנה" },
    { key: "hero_description", label: "תיאור", multiline: true },
  ]},
  { section: "📞 כפתורי יצירת קשר", fields: [
    { key: "whatsapp_link", label: "קישור WhatsApp", dir: "ltr" as const },
    { key: "bit_link", label: "קישור Bit", dir: "ltr" as const },
    { key: "phone", label: "טלפון לתצוגה" },
    { key: "phone_raw", label: "טלפון (ללא מקף)", dir: "ltr" as const },
  ]},
  { section: "🕐 שעות פעילות", fields: [
    { key: "opening_hours", label: "שעות פעילות" },
  ]},
];

const AdminDesign = () => {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useSiteSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

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
    const allKeys = designFields.flatMap((s) => s.fields.map((f) => f.key));
    for (const key of allKeys) {
      const value = form[key] || "";
      await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
    }
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    toast.success("העיצוב נשמר בהצלחה ✅");
    setSaving(false);
    setIframeKey((k) => k + 1);
  };

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Controls */}
      <div className="lg:w-[380px] shrink-0 space-y-4">
        {designFields.map((section) => (
          <div key={section.section} className="bg-card rounded-xl border border-border p-4 space-y-3">
            <h3 className="font-heading font-semibold text-foreground text-sm">{section.section}</h3>
            {section.fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{f.label}</label>
                {f.multiline ? (
                  <Textarea
                    value={form[f.key] || ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    rows={3}
                    className="text-sm"
                  />
                ) : (
                  <Input
                    value={form[f.key] || ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    dir={(f as any).dir || "rtl"}
                    className="text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="flex gap-2">
          <Button onClick={save} disabled={saving} className="gap-2 flex-1">
            <Save className="w-4 h-4" />{saving ? "שומר..." : "שמור שינויים"}
          </Button>
          <Button variant="outline" onClick={() => setIframeKey((k) => k + 1)} className="gap-2">
            <RefreshCw className="w-4 h-4" />רענן
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 min-h-[500px] bg-card rounded-xl border border-border overflow-hidden hidden lg:block">
        <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">תצוגה מקדימה של האתר</span>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
            <div className="w-3 h-3 rounded-full bg-secondary/50" />
          </div>
        </div>
        <iframe
          key={iframeKey}
          src={window.location.origin + "/"}
          className="w-full h-[600px] border-0"
          title="תצוגה מקדימה"
        />
      </div>
    </div>
  );
};

export default AdminDesign;
