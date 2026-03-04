import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
}

const emptyForm: PostForm = { title: "", slug: "", excerpt: "", content: "", published: false };

const AdminBlog = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [isNew, setIsNew] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const startEdit = (p: any) => {
    setEditing(p.id);
    setIsNew(false);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt || "", content: p.content, published: p.published });
  };

  const startNew = () => { setEditing("new"); setIsNew(true); setForm(emptyForm); };
  const cancel = () => { setEditing(null); setIsNew(false); };

  const save = async () => {
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || null,
      content: form.content,
      published: form.published,
    };

    if (isNew) {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) { toast.error("שגיאה: " + error.message); return; }
      toast.success("מאמר נוסף");
    } else {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing!);
      if (error) { toast.error("שגיאה: " + error.message); return; }
      toast.success("מאמר עודכן");
    }
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
    qc.invalidateQueries({ queryKey: ["blog_posts"] });
    cancel();
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("נמחק");
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
    qc.invalidateQueries({ queryKey: ["blog_posts"] });
  };

  if (isLoading) return <p className="text-muted-foreground">טוען...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">מאמרים</h2>
        <Button size="sm" onClick={startNew} className="gap-2"><Plus className="w-4 h-4" />מאמר חדש</Button>
      </div>

      {editing && (
        <div className="bg-card rounded-xl p-6 card-shadow mb-6 space-y-4">
          <Input placeholder="כותרת" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="slug (אנגלית)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} dir="ltr" />
          <Input placeholder="תקציר" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <Textarea placeholder="תוכן (Markdown)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} />
          <div className="flex items-center gap-2">
            <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            <span className="text-sm text-muted-foreground">פורסם</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="gap-2"><Save className="w-4 h-4" />שמור</Button>
            <Button variant="outline" onClick={cancel} className="gap-2"><X className="w-4 h-4" />ביטול</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {posts?.map((p) => (
          <div key={p.id} className="bg-card rounded-xl p-4 card-shadow flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{p.title}</p>
              <p className="text-sm text-muted-foreground">
                {p.published ? "פורסם" : "טיוטה"} · {new Date(p.created_at).toLocaleDateString("he-IL")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(p.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlog;
