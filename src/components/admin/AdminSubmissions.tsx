import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminSubmissions = () => {
  const qc = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-submissions"] });
    qc.invalidateQueries({ queryKey: ["admin-unread-count"] });
    toast.success("סומן כנקרא");
  };

  const remove = async (id: string) => {
    if (!confirm("למחוק?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-submissions"] });
    toast.success("נמחק");
  };

  if (isLoading) return <p className="text-muted-foreground">טוען...</p>;

  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-foreground mb-6">הודעות שנשלחו</h2>
      {!submissions?.length ? (
        <p className="text-muted-foreground">אין הודעות</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div key={s.id} className={`bg-card rounded-xl p-4 card-shadow ${!s.is_read ? "border-r-4 border-primary" : ""}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="text-sm text-muted-foreground">{s.phone} · {s.email}</p>
                </div>
                <div className="flex gap-1">
                  {!s.is_read && (
                    <Button variant="ghost" size="icon" onClick={() => markRead(s.id)} title="סמן כנקרא">
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => remove(s.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(s.created_at).toLocaleString("he-IL")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
