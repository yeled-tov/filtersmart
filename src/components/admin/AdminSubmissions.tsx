import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Trash2, MessageCircle, Phone, Download, Search, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

type Filter = "all" | "unread" | "read";

const AdminSubmissions = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = useMemo(() => {
    let list = submissions || [];
    if (filter === "unread") list = list.filter((s) => !s.is_read);
    if (filter === "read") list = list.filter((s) => s.is_read);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || (s.phone || "").includes(q) || (s.email || "").toLowerCase().includes(q));
    }
    return list;
  }, [submissions, filter, search]);

  const markRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-submissions"] });
    qc.invalidateQueries({ queryKey: ["admin-unread-count"] });
    toast.success("סומן כנקרא ✅");
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק את ההודעה?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-submissions"] });
    qc.invalidateQueries({ queryKey: ["admin-unread-count"] });
    toast.success("הודעה נמחקה ✅");
  };

  const exportCSV = () => {
    if (!submissions?.length) { toast.error("אין נתונים לייצוא"); return; }
    const headers = ["שם", "טלפון", "אימייל", "הודעה", "תאריך", "סטטוס"];
    const rows = submissions.map((s) => [
      s.name, s.phone || "", s.email || "", s.message.replace(/"/g, '""'),
      new Date(s.created_at).toLocaleString("he-IL"), s.is_read ? "נקרא" : "לא נקרא",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("הקובץ יורד ✅");
  };

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "הכל" },
    { id: "unread", label: "לא נקרא" },
    { id: "read", label: "נקרא" },
  ];

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex bg-muted rounded-lg p-0.5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם או טלפון..."
            className="pr-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
          <Download className="w-4 h-4" />ייצוא CSV
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{filtered.length} הודעות</p>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>
      ) : !filtered.length ? (
        <div className="bg-card rounded-xl p-12 border border-border text-center">
          <p className="text-muted-foreground">{search || filter !== "all" ? "לא נמצאו הודעות" : "אין הודעות עדיין"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((s) => {
            const isExpanded = expandedId === s.id;
            return (
              <div
                key={s.id}
                className={`bg-card rounded-xl border transition-colors ${!s.is_read ? "border-primary/40 bg-primary/[0.02]" : "border-border"}`}
              >
                {/* Header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className="w-full flex items-center gap-3 p-4 text-right"
                >
                  {!s.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-foreground text-sm">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString("he-IL")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{s.message}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-muted-foreground">שם:</span> <span className="text-foreground font-medium">{s.name}</span></div>
                      <div><span className="text-muted-foreground">טלפון:</span> <span className="text-foreground font-medium" dir="ltr">{s.phone || "–"}</span></div>
                      <div><span className="text-muted-foreground">אימייל:</span> <span className="text-foreground font-medium" dir="ltr">{s.email || "–"}</span></div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{s.message}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString("he-IL")}</div>
                    <div className="flex flex-wrap gap-2">
                      {s.phone && (
                        <a href={`https://wa.me/${s.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-1.5 text-secondary border-secondary/30 hover:bg-secondary/10">
                            <MessageCircle className="w-3.5 h-3.5" />פתח בווצאפ
                          </Button>
                        </a>
                      )}
                      {s.phone && (
                        <a href={`tel:${s.phone}`}>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Phone className="w-3.5 h-3.5" />התקשר
                          </Button>
                        </a>
                      )}
                      {!s.is_read && (
                        <Button variant="outline" size="sm" onClick={() => markRead(s.id)} className="gap-1.5">
                          <Check className="w-3.5 h-3.5" />סמן כנקרא
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => remove(s.id)} className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
                        <Trash2 className="w-3.5 h-3.5" />מחק
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
