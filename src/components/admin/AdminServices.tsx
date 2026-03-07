import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Save, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ServiceRow {
  id: string; name: string; slug: string; short_desc: string | null; description: string | null;
  price: string; category: string; logo_url: string | null; features: any;
  visible: boolean; sort_order: number; emoji_icon: string | null; is_popular: boolean;
}

interface ServiceForm {
  name: string; slug: string; short_desc: string; description: string; price: string;
  category: string; logo_url: string; features: string; visible: boolean;
  sort_order: number; emoji_icon: string; is_popular: boolean;
}

const emptyForm: ServiceForm = {
  name: "", slug: "", short_desc: "", description: "", price: "",
  category: "filtering", logo_url: "", features: "", visible: true,
  sort_order: 0, emoji_icon: "🛡️", is_popular: false,
};

const EMOJIS = ["🛡️", "📱", "🔒", "⚡", "🌐", "🎯", "💎", "🔥", "⭐", "🚀", "🛠️", "📡", "🔑", "🏆", "💡", "🎨"];

function SortableRow({ service, onEdit, onToggle, onDelete }: {
  service: ServiceRow; onEdit: () => void; onToggle: () => void; onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-border last:border-0 hover:bg-muted/30">
      <td className="px-3 py-3" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
      </td>
      <td className="px-3 py-3 text-xl">{(service as any).emoji_icon || "🛡️"}</td>
      <td className="px-3 py-3">
        <div className="font-medium text-foreground">{service.name}</div>
        {(service as any).is_popular && (
          <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium">⭐ הכי פופולרי</span>
        )}
      </td>
      <td className="px-3 py-3 text-sm text-muted-foreground max-w-[200px] truncate hidden md:table-cell">{service.short_desc}</td>
      <td className="px-3 py-3 text-sm font-semibold text-foreground whitespace-nowrap">{service.price}</td>
      <td className="px-3 py-3">
        <Switch checked={service.visible} onCheckedChange={onToggle} />
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8"><Pencil className="w-3.5 h-3.5" /></Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      </td>
    </tr>
  );
}

const AdminServices = () => {
  const qc = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return (data || []) as unknown as ServiceRow[];
    },
  });

  const openNew = () => {
    setIsNew(true);
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: (services?.length || 0) + 1 });
    setDrawerOpen(true);
  };

  const openEdit = (s: ServiceRow) => {
    setIsNew(false);
    setEditingId(s.id);
    setForm({
      name: s.name, slug: s.slug, short_desc: s.short_desc || "",
      description: s.description || "", price: s.price, category: s.category,
      logo_url: s.logo_url || "",
      features: Array.isArray(s.features) ? (s.features as string[]).join("\n") : "",
      visible: s.visible, sort_order: s.sort_order,
      emoji_icon: (s as any).emoji_icon || "🛡️",
      is_popular: (s as any).is_popular || false,
    });
    setDrawerOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.slug || !form.price) {
      toast.error("נא למלא שם, slug ומחיר");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name, slug: form.slug, short_desc: form.short_desc || null,
      description: form.description || null, price: form.price, category: form.category,
      logo_url: form.logo_url || null, features: form.features.split("\n").filter(Boolean),
      visible: form.visible, sort_order: form.sort_order,
      emoji_icon: form.emoji_icon, is_popular: form.is_popular,
    };

    const { error } = isNew
      ? await supabase.from("services").insert(payload as any)
      : await supabase.from("services").update(payload as any).eq("id", editingId!);

    setSaving(false);
    if (error) { toast.error("שגיאה: " + error.message); return; }
    toast.success(isNew ? "שירות נוסף בהצלחה ✅" : "שירות עודכן בהצלחה ✅");
    qc.invalidateQueries({ queryKey: ["admin-services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
    setDrawerOpen(false);
  };

  const toggleVisibility = async (s: ServiceRow) => {
    await supabase.from("services").update({ visible: !s.visible }).eq("id", s.id);
    toast.success(s.visible ? "שירות הוסתר" : "שירות מוצג");
    qc.invalidateQueries({ queryKey: ["admin-services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  const remove = async (id: string) => {
    if (!confirm("האם למחוק את השירות?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast.error("שגיאה: " + error.message); return; }
    toast.success("שירות נמחק ✅");
    qc.invalidateQueries({ queryKey: ["admin-services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !services) return;
    const oldIdx = services.findIndex((s) => s.id === active.id);
    const newIdx = services.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(services, oldIdx, newIdx);
    // Optimistic update
    qc.setQueryData(["admin-services"], reordered);
    // Persist
    await Promise.all(reordered.map((s, i) => supabase.from("services").update({ sort_order: i } as any).eq("id", s.id)));
    toast.success("סדר השירותים עודכן ✅");
    qc.invalidateQueries({ queryKey: ["services"] });
  }, [services, qc]);

  const updateForm = (patch: Partial<ServiceForm>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{services?.length || 0} שירותים</p>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" />הוסף שירות</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
        </div>
      ) : !services?.length ? (
        <div className="bg-card rounded-xl p-12 border border-border text-center">
          <p className="text-muted-foreground mb-4">אין שירותים עדיין</p>
          <Button onClick={openNew} variant="outline" className="gap-2"><Plus className="w-4 h-4" />הוסף שירות ראשון</Button>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2.5 w-10" />
                    <th className="px-3 py-2.5 text-right font-medium text-muted-foreground w-10">אייקון</th>
                    <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">שם</th>
                    <th className="px-3 py-2.5 text-right font-medium text-muted-foreground hidden md:table-cell">תיאור</th>
                    <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">מחיר</th>
                    <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">פעיל</th>
                    <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">פעולות</th>
                  </tr>
                </thead>
                <SortableContext items={services.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <tbody>
                    {services.map((s) => (
                      <SortableRow
                        key={s.id}
                        service={s}
                        onEdit={() => openEdit(s)}
                        onToggle={() => toggleVisibility(s)}
                        onDelete={() => remove(s.id)}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </table>
            </DndContext>
          </div>
        </div>
      )}

      {/* Edit Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-full sm:w-[420px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isNew ? "שירות חדש" : "עריכת שירות"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6" dir="rtl">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">שם השירות</label>
              <Input value={form.name} onChange={(e) => updateForm({ name: e.target.value })} placeholder="לדוגמה: הדרן" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Slug (אנגלית)</label>
              <Input value={form.slug} onChange={(e) => updateForm({ slug: e.target.value })} dir="ltr" placeholder="hadran" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">תיאור קצר</label>
              <Input value={form.short_desc} onChange={(e) => updateForm({ short_desc: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">תיאור מלא</label>
              <Textarea value={form.description} onChange={(e) => updateForm({ description: e.target.value })} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">מחיר (₪)</label>
                <Input value={form.price} onChange={(e) => updateForm({ price: e.target.value })} placeholder="300₪" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">קטגוריה</label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm({ category: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="filtering">סינון</option>
                  <option value="flashing">צריבת גרסה</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">אייקון</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => updateForm({ emoji_icon: e })}
                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-colors ${
                      form.emoji_icon === e ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">URL לוגו</label>
              <Input value={form.logo_url} onChange={(e) => updateForm({ logo_url: e.target.value })} dir="ltr" placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">פיצ׳רים (כל שורה = פיצ׳ר)</label>
              <Textarea value={form.features} onChange={(e) => updateForm({ features: e.target.value })} rows={4} placeholder="סינון תמונות&#10;חסימת אפליקציות" />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-foreground">תג ״הכי פופולרי״</span>
              <Switch checked={form.is_popular} onCheckedChange={(v) => updateForm({ is_popular: v })} />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-foreground">מוצג באתר</span>
              <Switch checked={form.visible} onCheckedChange={(v) => updateForm({ visible: v })} />
            </div>
            <Button onClick={save} disabled={saving} className="w-full gap-2 mt-4">
              <Save className="w-4 h-4" />{saving ? "שומר..." : "שמור שירות"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminServices;
