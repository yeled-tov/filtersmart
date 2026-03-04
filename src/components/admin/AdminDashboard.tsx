import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, FileText, MessageSquare, Eye } from "lucide-react";

const AdminDashboard = () => {
  const { data: servicesCount } = useQuery({
    queryKey: ["admin-services-count"],
    queryFn: async () => {
      const { count } = await supabase.from("services").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: postsCount } = useQuery({
    queryKey: ["admin-posts-count"],
    queryFn: async () => {
      const { count } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["admin-unread-count"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false);
      return count || 0;
    },
  });

  const stats = [
    { label: "שירותים", value: servicesCount ?? "–", icon: Package, color: "text-primary" },
    { label: "מאמרים", value: postsCount ?? "–", icon: FileText, color: "text-secondary" },
    { label: "הודעות חדשות", value: unreadCount ?? "–", icon: MessageSquare, color: "text-destructive" },
  ];

  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-foreground mb-6">דשבורד</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-3xl font-heading font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
