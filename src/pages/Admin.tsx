import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Package, FileText, MessageSquare, Settings, LayoutDashboard } from "lucide-react";
import AdminServices from "@/components/admin/AdminServices";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminSubmissions from "@/components/admin/AdminSubmissions";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminDashboard from "@/components/admin/AdminDashboard";

type Tab = "dashboard" | "services" | "blog" | "submissions" | "settings";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "דשבורד", icon: LayoutDashboard },
  { id: "services", label: "שירותים", icon: Package },
  { id: "blog", label: "בלוג", icon: FileText },
  { id: "submissions", label: "הודעות", icon: MessageSquare },
  { id: "settings", label: "הגדרות", icon: Settings },
];

const Admin = () => {
  const { isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top bar */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-heading font-bold text-foreground">ניהול FilterSmart</h1>
        <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 text-muted-foreground">
          <LogOut className="w-4 h-4" />
          יציאה
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 bg-card border-l border-border min-h-[calc(100vh-57px)] p-3 space-y-1 hidden md:block">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto border-b border-border bg-card w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 md:mr-52">
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "services" && <AdminServices />}
        {activeTab === "blog" && <AdminBlog />}
        {activeTab === "submissions" && <AdminSubmissions />}
        {activeTab === "settings" && <AdminSettings />}
      </main>
    </div>
  );
};

export default Admin;
