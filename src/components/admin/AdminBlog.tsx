import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Save, X, Eye, Bold, Italic, Heading, List, Link2, CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";

interface PostRow {
  id: string; title: string; slug: string; content: string; excerpt: string | null;
  published: boolean; created_at: string; updated_at: string;
  category?: string | null; featured_image?: string | null;
  meta_title?: string | null; meta_description?: string | null;
}

interface PostForm {
  title: string; slug: string; excerpt: string; content: string; published: boolean;
  category: string; featured_image: string; meta_title: string; meta_description: string;
  created_at: Date;
}

const emptyForm: PostForm = {
  title: "", slug: "", excerpt: "", content: "", published: false,
  category: "", featured_image: "", meta_title: "", meta_description: "",
  created_at: new Date(),
};

const AdminBlog = () => {
  const qc = useQueryClient();
  const [view, setView] = useState<"list" | "editor" | "preview">("list");
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as PostRow[];
    },
  });

  const readingTime = Math.max(1, Math.ceil(form.content.split(/\s+/).filter(Boolean).length / 200));

  // Auto-save draft every 30s
  useEffect(() => {
    if (view !== "editor") return;
    const timer = setInterval(() => {
      localStorage.setItem("blog_draft_" + (editingId || "new"), JSON.stringify(form));
      setLastAutoSave(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, [view, form, editingId]);

  // Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && view === "editor") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, form]);

  const startNew = () => {
    setIsNew(true);
    setEditingId(null);
    // Check for saved draft
    const draft = localStorage.getItem("blog_draft_new");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setForm({ ...emptyForm, ...parsed, created_at: new Date(parsed.created_at || Date.now()) });
      } catch { setForm(emptyForm); }
    } else {
      setForm(emptyForm);
    }
    setView("editor");
  };

  const startEdit = (p: PostRow) => {
    setIsNew(false);
    setEditingId(p.id);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt || "", content: p.content,
      published: p.published, category: (p as any).category || "",
      featured_image: (p as any).featured_image || "",
      meta_title: (p as any).meta_title || "",
      meta_description: (p as any).meta_description || "",
      created_at: new Date(p.created_at),
    });
    setView("editor");
  };

  const cancel = () => {
    setView("list");
    setEditingId(null);
    setIsNew(false);
    // Clear draft
    localStorage.removeItem("blog_draft_" + (editingId || "new"));
  };

  const save = useCallback(async () => {
    if (!form.title || !form.slug) {
      toast.error("נא למלא כותרת ו-slug");
      return;
    }
    setSaving(true);
    const payload: any = {
      title: form.title, slug: form.slug, excerpt: form.excerpt || null,
      content: form.content, published: form.published,
      category: form.category || null, featured_image: form.featured_image || null,
      meta_title: form.meta_title || null, meta_description: form.meta_description || null,
    };

    const { error } = isNew
      ? await supabase.from("blog_posts").insert(payload)
      : await supabase.from("blog_posts").update(payload).eq("id", editingId!);

    setSaving(false);
    if (error) { toast.error("שגיאה: " + error.message); return; }
    toast.success(isNew ? "מאמר נוסף בהצלחה ✅" : "מאמר עודכן בהצלחה ✅");
    localStorage.removeItem("blog_draft_" + (editingId || "new"));
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
    qc.invalidateQueries({ queryKey: ["blog_posts"] });
    setView("list");
  }, [form, isNew, editingId, qc]);

  const remove = async (id: string) => {
    if (!confirm("למחוק את המאמר?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("מאמר נמחק ✅");
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
    qc.invalidateQueries({ queryKey: ["blog_posts"] });
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = form.content.substring(start, end);
    const newContent = form.content.substring(0, start) + prefix + selected + suffix + form.content.substring(end);
    setForm((f) => ({ ...f, content: newContent }));
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const updateForm = (patch: Partial<PostForm>) => setForm((f) => ({ ...f, ...patch }));

  if (view === "preview") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-semibold text-foreground">תצוגה מקדימה</h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView("editor")} className="gap-2"><Pencil className="w-4 h-4" />חזרה לעריכה</Button>
          </div>
        </div>
        <article className="bg-card rounded-xl border border-border p-8 max-w-3xl">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{form.title || "ללא כותרת"}</h1>
          {form.excerpt && <p className="text-muted-foreground text-lg mb-4">{form.excerpt}</p>}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{readingTime} דק׳ קריאה</span>
            {form.category && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{form.category}</span>}
          </div>
          {form.featured_image && <img src={form.featured_image} alt="" className="w-full rounded-lg mb-6 max-h-64 object-cover" />}
          <div className="prose max-w-none text-foreground whitespace-pre-wrap leading-relaxed">{form.content}</div>
        </article>
      </div>
    );
  }

  if (view === "editor") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-heading font-semibold text-foreground">{isNew ? "פוסט חדש" : "עריכת פוסט"}</h3>
            {lastAutoSave && <span className="text-xs text-muted-foreground">שמירה אוטומטית: {lastAutoSave.toLocaleTimeString("he-IL")}</span>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setView("preview")} className="gap-1"><Eye className="w-3.5 h-3.5" />תצוגה מקדימה</Button>
            <Button variant="outline" size="sm" onClick={cancel} className="gap-1"><X className="w-3.5 h-3.5" />ביטול</Button>
          </div>
        </div>

        <div className="space-y-4 max-w-4xl">
          <Input
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            placeholder="כותרת המאמר"
            className="text-2xl font-heading font-bold h-14 border-0 border-b rounded-none px-0 focus-visible:ring-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input value={form.slug} onChange={(e) => updateForm({ slug: e.target.value })} placeholder="slug (אנגלית)" dir="ltr" />
            <Input value={form.category} onChange={(e) => updateForm({ category: e.target.value })} placeholder="קטגוריה" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{readingTime} דק׳ קריאה</span>
            </div>
          </div>

          <Input value={form.excerpt} onChange={(e) => updateForm({ excerpt: e.target.value })} placeholder="תקציר קצר" />

          {/* Toolbar */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1.5 border border-border">
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown("**", "**")} title="מודגש"><Bold className="w-3.5 h-3.5" /></Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown("*", "*")} title="נטוי"><Italic className="w-3.5 h-3.5" /></Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown("## ")} title="כותרת"><Heading className="w-3.5 h-3.5" /></Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown("- ")} title="רשימה"><List className="w-3.5 h-3.5" /></Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => insertMarkdown("[", "](url)")} title="קישור"><Link2 className="w-3.5 h-3.5" /></Button>
          </div>

          <Textarea
            ref={contentRef}
            value={form.content}
            onChange={(e) => updateForm({ content: e.target.value })}
            placeholder="תוכן המאמר (Markdown)..."
            rows={16}
            className="font-mono text-sm"
          />

          <Input value={form.featured_image} onChange={(e) => updateForm({ featured_image: e.target.value })} placeholder="URL לתמונה ראשית" dir="ltr" />

          {/* SEO */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border space-y-3">
            <h4 className="text-sm font-semibold text-foreground">SEO</h4>
            <Input value={form.meta_title} onChange={(e) => updateForm({ meta_title: e.target.value })} placeholder="Meta Title" />
            <Textarea value={form.meta_description} onChange={(e) => updateForm({ meta_description: e.target.value })} placeholder="Meta Description" rows={2} />
          </div>

          {/* Publish controls */}
          <div className="flex items-center justify-between bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <Switch checked={form.published} onCheckedChange={(v) => updateForm({ published: v })} />
              <span className="text-sm font-medium text-foreground">{form.published ? "פורסם" : "טיוטה"}</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {format(form.created_at, "dd/MM/yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={form.created_at} onSelect={(d) => d && updateForm({ created_at: d })} className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3">
            <Button onClick={save} disabled={saving} className="gap-2 flex-1">
              <Save className="w-4 h-4" />{saving ? "שומר..." : form.published ? "פרסם עכשיו" : "שמור כטיוטה"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{posts?.length || 0} מאמרים</p>
        <Button onClick={startNew} className="gap-2"><Plus className="w-4 h-4" />כתוב פוסט חדש</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
      ) : !posts?.length ? (
        <div className="bg-card rounded-xl p-12 border border-border text-center">
          <p className="text-muted-foreground mb-4">אין מאמרים עדיין</p>
          <Button onClick={startNew} variant="outline" className="gap-2"><Plus className="w-4 h-4" />כתוב פוסט ראשון</Button>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">כותרת</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground hidden md:table-cell">תאריך</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">סטטוס</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground hidden md:table-cell">קריאה</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                const rt = Math.max(1, Math.ceil(p.content.split(/\s+/).filter(Boolean).length / 200));
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{p.title}</p>
                      {(p as any).category && <span className="text-xs text-muted-foreground">{(p as any).category}</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap hidden md:table-cell">{new Date(p.created_at).toLocaleDateString("he-IL")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.published ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>
                        {p.published ? "פורסם" : "טיוטה"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{rt} דק׳</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
