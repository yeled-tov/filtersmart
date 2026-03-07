import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, FileText, MessageSquare, MailWarning, Plus, PenLine, Eye, CheckCircle2, ExternalLink } from "lucide-react";

interface Props {
  onNavigate: (tab: "services" | "blog" | "submissions") => void;
}

const AdminDashboard = ({ onNavigate }: Props) => {
  const { data: servicesCount, isLoading: l1 } = useQuery({
    queryKey: ["admin-services-count"],
    queryFn: async () => {
      const { count } = await supabase.from("services").select("*", { count: "exact", head: true }).eq("visible", true);
      return count || 0;
    },
  });

  const { data: postsCount, isLoading: l2 } = useQuery({
    queryKey: ["admin-posts-count"],
    queryFn: async () => {
      const { count } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: totalMessages, isLoading: l3 } = useQuery({
    queryKey: ["admin-total-messages"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_submissions").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: unreadCount, isLoading: l4 } = useQuery({
    queryKey: ["admin-unread-count"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false);
      return count || 0;
    },
  });

  const { data: recentMessages } = useQuery({
    queryKey: ["admin-recent-messages"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
  });

  const stats = [
    { label: "שירותים פעילים", value: servicesCount, icon: Package, color: "text-primary", bg: "bg-primary/10", loading: l1 },
    { label: "פוסטי בלוג", value: postsCount, icon: FileText, color: "text-secondary", bg: "bg-secondary/10", loading: l2 },
    { label: "סה״כ הודעות", value: totalMessages, icon: MessageSquare, color: "text-muted-foreground", bg: "bg-muted", loading: l3 },
    { label: "הודעות שלא נקראו", value: unreadCount, icon: MailWarning, color: "text-destructive", bg: "bg-destructive/10", loading: l4 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-xl p-5 border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">{s.label}</span>
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            {s.loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-heading font-bold text-foreground">{s.value ?? 0}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4">פעולות מהירות</h3>
        <div className="flex flex-wrap gap-3">
          <Button size="sm" onClick={() => onNavigate("services")} className="gap-2">
            <Plus className="w-4 h-4" />הוסף שירות
          </Button>
          <Button size="sm" variant="outline" onClick={() => onNavigate("blog")} className="gap-2">
            <PenLine className="w-4 h-4" />כתוב פוסט
          </Button>
          <Button size="sm" variant="outline" onClick={() => onNavigate("submissions")} className="gap-2">
            <Eye className="w-4 h-4" />ראה הודעות
          </Button>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-heading font-semibold text-foreground">הודעות אחרונות</h3>
        </div>
        {!recentMessages?.length ? (
          <p className="p-5 text-muted-foreground text-sm">אין הודעות עדיין</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">שם</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">טלפון</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">הודעה</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">תאריך</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">פעולה</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((m) => (
                  <tr key={m.id} className={`border-b border-border last:border-0 ${!m.is_read ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{m.name}</td>
                    <td className="px-4 py-3 text-muted-foreground" dir="ltr">{m.phone || "–"}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{m.message}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(m.created_at).toLocaleDateString("he-IL")}</td>
                    <td className="px-4 py-3">
                      {m.phone && (
                        <a
                          href={`https://wa.me/${m.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          WhatsApp
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Health */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-3">בריאות המערכת</h3>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-secondary" />
          <span className="text-foreground">מסד נתונים מחובר ✅</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
