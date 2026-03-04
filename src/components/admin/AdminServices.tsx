import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface ServiceForm {
  name: string;
  slug: string;
  short_desc: string;
  description: string;
  price: string;
  category: string;
  logo_url: string;
  features: string;
  visible: boolean;
  sort_order: number;
}

const emptyForm: ServiceForm = {
  name: "", slug: "", short_desc: "", description: "", price: "",
  category: "filtering", logo_url: "", features: "", visible: true, sort_order: 0,
};

const AdminServices = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [isNew, setIsNew] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const startEdit = (s: any) => {
    setEditing(s.id);
    setIsNew(false);
    setForm({
      name: s.name,
      slug: s.slug,
      short_desc: s.short_desc || "",
      description: s.description || "",
      price: s.price,
      category: s.category,
      logo_url: s.logo_url || "",
      features: Array.isArray(s.features) ? (s.features as string[]).join("\n") : "",
      visible: s.visible,
      sort_order: s.sort_order,
    });
  };

  const startNew = () => {
    setEditing("new");
    setIsNew(true);
    setForm({ ...emptyForm, sort_order: (services?.length || 0) + 1 });
  };

  const cancel = () => { setEditing(null); setIsNew(false); };

  const save = async () => {
    const featuresArr = form.features.split("\n").filter(Boolean);
    const payload = {
      name: form.name,
      slug: form.slug,
      short_desc: form.short_desc || null,
      description: form.description || null,
      price: form.price,
      category: form.category,
      logo_url: form.logo_url || null,
      features: featuresArr,
      visible: form.visible,
      sort_order: form.sort_order,
    };

    if (isNew) {
      const { error } = await supabase.from("services").insert(payload);
      if (error) { toast.error("שגיאה: " + error.message); return; }
      toast.success("שירות נוסף בהצלחה");
    } else {
      const { error } = await supabase.from("services").update(payload).eq("id", editing!);
      if (error) { toast.error("שגיאה: " + error.message); return; }
      toast.success("שירות עודכן בהצלחה");
    }
    qc.invalidateQueries({ queryKey: ["admin-services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
    cancel();
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק את השירות?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast.error("שגיאה: " + error.message); return; }
    toast.success("נמחק");
    qc.invalidateQueries({ queryKey: ["admin-services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  if (isLoading) return <p className="text-muted-foreground">טוען...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">שירותים</h2>
        <Button size="sm" onClick={startNew} className="gap-2"><Plus className="w-4 h-4" />הוסף שירות</Button>
      </div>

      {(editing === "new" || editing) && (
        <div className="bg-card rounded-xl p-6 card-shadow mb-6 space-y-4">
          <h3 className="font-heading font-semibold text-foreground">{isNew ? "שירות חדש" : "עריכת שירות"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="שם השירות" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="slug (אנגלית)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} dir="ltr" />
            <Input placeholder="מחיר" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input placeholder="קטגוריה (filtering / flashing)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} dir="ltr" />
            <Input placeholder="URL לוגו" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} dir="ltr" />
            <Input placeholder="סדר" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
          </div>
          <Input placeholder="תיאור קצר" value={form.short_desc} onChange={(e) => setForm({ ...form, short_desc: e.target.value })} />
          <Textarea placeholder="תיאור מלא" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <Textarea placeholder="פיצ'רים (כל שורה = פיצ'ר)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={5} />
          <div className="flex items-center gap-2">
            <Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
            <span className="text-sm text-muted-foreground">מוצג באתר</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="gap-2"><Save className="w-4 h-4" />שמור</Button>
            <Button variant="outline" onClick={cancel} className="gap-2"><X className="w-4 h-4" />ביטול</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {services?.map((s) => (
          <div key={s.id} className="bg-card rounded-xl p-4 card-shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              {s.logo_url && <img src={s.logo_url} alt="" className="w-8 h-8 rounded object-contain bg-muted p-0.5" />}
              <div>
                <p className="font-medium text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.price} · {s.visible ? "מוצג" : "מוסתר"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(s)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(s.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;
