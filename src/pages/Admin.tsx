import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import AdminServices from "@/components/admin/AdminServices";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminSubmissions from "@/components/admin/AdminSubmissions";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminDesign from "@/components/admin/AdminDesign";

type Tab = "dashboard" | "services" | "blog" | "submissions" | "design" | "settings";

const navItems: { id: Tab; label: string; emoji: string; hasBadge?: boolean }[] = [
  { id: "dashboard", label: "דשבורד", emoji: "🏠" },
  { id: "services", label: "שירותים", emoji: "🛡️" },
  { id: "blog", label: "בלוג", emoji: "📝" },
  { id: "submissions", label: "הודעות", emoji: "✉️", hasBadge: true },
  { id: "design", label: "עיצוב האתר", emoji: "🎨" },
  { id: "settings", label: "הגדרות כלליות", emoji: "⚙️" },
];

const Admin = () => {
  const { isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: unreadCount } = useQuery({
    queryKey: ["admin-unread-count"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false);
      return count || 0;
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const handleNav = (id: Tab) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const SidebarInner = () => (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">FS</div>
        {!collapsed && <h1 className="font-heading font-bold text-foreground text-sm">ניהול האתר</h1>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={collapsed ? item.label : undefined}
          >
            <span className="text-base shrink-0">{item.emoji}</span>
            {!collapsed && <span>{item.label}</span>}
            {item.hasBadge && (unreadCount ?? 0) > 0 && !collapsed && (
              <span className="mr-auto bg-destructive text-destructive-foreground text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                {unreadCount}
              </span>
            )}
            {item.hasBadge && (unreadCount ?? 0) > 0 && collapsed && (
              <span className="absolute top-1 left-1 w-2 h-2 bg-destructive rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <span className="text-base">🚪</span>
          {!collapsed && <span>יציאה</span>}
        </button>
      </div>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex items-center justify-center py-3 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex" dir="rtl">
      {/* Desktop sidebar */}
      <aside className={`hidden md:block border-l border-border shrink-0 sticky top-0 h-screen transition-all duration-200 ${collapsed ? "w-16" : "w-60"}`}>
        <SidebarInner />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="p-0 w-64">
          <SidebarInner />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <h2 className="font-heading font-semibold text-foreground">
            {navItems.find((n) => n.id === activeTab)?.emoji}{" "}
            {navItems.find((n) => n.id === activeTab)?.label}
          </h2>
        </header>
        <main className="flex-1 p-4 md:p-6 max-w-7xl">
          {activeTab === "dashboard" && <AdminDashboard onNavigate={handleNav} />}
          {activeTab === "services" && <AdminServices />}
          {activeTab === "blog" && <AdminBlog />}
          {activeTab === "submissions" && <AdminSubmissions />}
          {activeTab === "design" && <AdminDesign />}
          {activeTab === "settings" && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
