import { useEffect, useState, FormEvent, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  LogOut,
  RefreshCw,
  Users,
  Inbox,
  ScrollText,
  Wifi,
  Globe,
  ImageOff,
  BarChart3,
  Loader2,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Search,
  Smartphone,
  Pause,
  Play,
  LogIn,
} from "lucide-react";
import {
  authApi,
  usersApi,
  requestsApi,
  logsApi,
  vpnApi,
  imageFilterApi,
  adguardApi,
  crmAuth,
} from "@/services/crmApi";

const LEVEL_NAMES: Record<number, string> = {
  1: "חסימה מלאה",
  2: "טשטוש חלקי",
  3: "צניעות בלבד",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "פעיל", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  paused: { label: "מושהה", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  disabled: { label: "מושבת", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  pending: { label: "ממתין", color: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  approved: { label: "אושרה", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  rejected: { label: "נדחתה", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
};

const StatusPill = ({ status }: { status: string }) => {
  const s = STATUS_LABELS[status] || { label: status, color: "bg-muted text-muted-foreground" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.color}`}>
      {s.label}
    </span>
  );
};

// ============== Login (admin) ==============
function AdminLoginCard({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      if (data.user?.role !== "admin") {
        crmAuth.clear();
        toast({ title: "אין הרשאה", description: "המשתמש אינו מנהל", variant: "destructive" });
        return;
      }
      crmAuth.setSession(data.token, data.user);
      onLogin(data.user);
    } catch (err: any) {
      toast({ title: "שגיאת התחברות", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="border-border/60 shadow-xl">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <CardTitle>פאנל ניהול CRM</CardTitle>
            <p className="text-sm text-muted-foreground">כניסה למנהלים בלבד</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adm-email">אימייל</Label>
                <Input id="adm-email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adm-pass">סיסמה</Label>
                <Input id="adm-pass" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : null}
                כניסה
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ============== Stats Tab ==============
function StatsTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logsApi.getStats().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto mt-10" />;
  if (!stats) return <p className="text-center text-muted-foreground py-10">אין נתונים</p>;

  const cards = [
    { label: "סך לקוחות", value: stats.total_users ?? 0, icon: Users, color: "text-sky-400" },
    { label: "לקוחות פעילים", value: stats.active_users ?? 0, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "בקשות פתוחות", value: stats.pending_requests ?? 0, icon: Inbox, color: "text-amber-400" },
    { label: "תמונות חסומות (היום)", value: stats.images_blocked_today ?? 0, icon: ImageOff, color: "text-rose-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="pt-6 text-center">
            <c.icon className={`w-7 h-7 mx-auto mb-2 ${c.color}`} />
            <div className="text-3xl font-bold">{Number(c.value).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============== Users Tab ==============
function UsersTab() {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          !search ||
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  const setLevel = async (id: any, level: number) => {
    try {
      await usersApi.setFilterLevel(id, level);
      toast({ title: "עודכן", description: `רמה ${level}` });
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  const setStatus = async (id: any, status: string) => {
    try {
      await usersApi.setStatus(id, status);
      toast({ title: "סטטוס עודכן", description: status });
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  const remove = async (id: any) => {
    if (!confirm("למחוק את הלקוח?")) return;
    try {
      await usersApi.delete(id);
      toast({ title: "נמחק" });
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי שם/אימייל"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin mx-auto mt-10" />
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">אין לקוחות</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => (
            <Card key={u.id}>
              <CardContent className="p-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[180px]">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
                <StatusPill status={u.status || "active"} />
                <Badge variant="outline">רמה {u.filter_level || 1} · {LEVEL_NAMES[u.filter_level || 1]}</Badge>
                <div className="flex gap-1">
                  {[1, 2, 3].map((lvl) => (
                    <Button
                      key={lvl}
                      size="sm"
                      variant={u.filter_level === lvl ? "default" : "outline"}
                      onClick={() => setLevel(u.id, lvl)}
                    >
                      {lvl}
                    </Button>
                  ))}
                </div>
                <select
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  value={u.status || "active"}
                  onChange={(e) => setStatus(u.id, e.target.value)}
                >
                  <option value="active">פעיל</option>
                  <option value="paused">מושהה</option>
                  <option value="disabled">מושבת</option>
                </select>
                <Button size="sm" variant="ghost" onClick={() => remove(u.id)}>
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ============== Requests Tab ==============
function RequestsTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await requestsApi.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id: any) => {
    try {
      await requestsApi.approve(id);
      toast({ title: "אושרה" });
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  const reject = async () => {
    try {
      await requestsApi.reject(rejectId, rejectReason);
      toast({ title: "נדחתה" });
      setRejectId(null);
      setRejectReason("");
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto mt-10" />;

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">אין בקשות</p>
      ) : (
        items.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[180px]">
                <div className="font-medium text-sm">{r.user_name || r.user_email || `משתמש #${r.user_id}`}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {r.type} {r.requested_level ? `→ רמה ${r.requested_level}` : ""}
                </div>
                {r.reason && <div className="text-xs text-muted-foreground mt-1">"{r.reason}"</div>}
                <div className="text-[10px] text-muted-foreground/70 mt-1">
                  {new Date(r.created_at).toLocaleString("he-IL")}
                </div>
              </div>
              <StatusPill status={r.status} />
              {r.status === "pending" && (
                <div className="flex gap-1">
                  <Button size="sm" onClick={() => approve(r.id)}>
                    <CheckCircle2 className="w-4 h-4 ml-1" /> אשר
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRejectId(r.id)}>
                    <XCircle className="w-4 h-4 ml-1" /> דחה
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={!!rejectId} onOpenChange={(o) => !o && setRejectId(null)}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>סיבת דחייה</DialogTitle>
          </DialogHeader>
          <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectId(null)}>ביטול</Button>
            <Button variant="destructive" onClick={reject}>דחה בקשה</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============== Logs Tab ==============
function LogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logsApi.getLogs({ limit: 100 })
      .then((d) => setLogs(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto mt-10" />;
  if (logs.length === 0) return <p className="text-center text-muted-foreground py-10">אין לוגים</p>;

  return (
    <div className="space-y-1.5">
      {logs.map((l, i) => (
        <div key={l.id || i} className="flex items-start gap-3 p-2.5 rounded-md border border-border/40 bg-muted/20 text-sm">
          <span className="text-xs text-muted-foreground/70 shrink-0 w-32">
            {new Date(l.created_at || l.timestamp).toLocaleString("he-IL")}
          </span>
          <span className="font-medium text-xs shrink-0">{l.action || l.type}</span>
          <span className="text-xs text-muted-foreground flex-1 min-w-0 truncate">
            {l.user_email || l.user_id} · {l.details || l.message || ""}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============== VPN Tab ==============
function VpnTab() {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const generate = async (id: any) => {
    try {
      await vpnApi.generate(id);
      toast({ title: "נוצר", description: "קונפיג VPN חדש" });
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  const remove = async (id: any) => {
    if (!confirm("למחוק את ה-VPN של הלקוח?")) return;
    try {
      await vpnApi.delete(id);
      toast({ title: "נמחק" });
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto mt-10" />;

  return (
    <div className="space-y-2">
      {users.map((u) => (
        <Card key={u.id}>
          <CardContent className="p-4 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[180px]">
              <div className="font-medium text-sm">{u.name}</div>
              <div className="text-xs text-muted-foreground">{u.email}</div>
            </div>
            {u.vpn_ip ? (
              <Badge variant="outline" className="font-mono text-xs">{u.vpn_ip}</Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">ללא VPN</Badge>
            )}
            <div className="flex gap-1">
              <Button size="sm" onClick={() => generate(u.id)}>
                {u.vpn_ip ? "צור מחדש" : "צור VPN"}
              </Button>
              {u.vpn_ip && (
                <Button size="sm" variant="ghost" onClick={() => remove(u.id)}>
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============== AdGuard Tab ==============
function AdGuardTab() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [domains, setDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, d] = await Promise.all([
        adguardApi.getStats().catch(() => null),
        adguardApi.getBlockedList().catch(() => ({ domains: [] })),
      ]);
      setStats(s);
      setDomains(d?.domains || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const block = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    try {
      await adguardApi.blockDomain(newDomain.trim());
      toast({ title: "נחסם", description: newDomain });
      setNewDomain("");
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  const unblock = async (d: string) => {
    try {
      await adguardApi.unblockDomain(d);
      toast({ title: "שוחרר", description: d });
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto mt-10" />;

  return (
    <div className="space-y-4">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card><CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold">{Number(stats.queries_total || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">סך שאילתות</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-rose-400">{Number(stats.blocked_total || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">חסומות</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold">{stats.block_percentage || 0}%</div>
            <p className="text-xs text-muted-foreground">% חסימה</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">דומיינים ברשימה</p>
          </CardContent></Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">רשימת חסימות DNS</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={block} className="flex gap-2 mb-3">
            <Input
              placeholder="example.com"
              dir="ltr"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
            />
            <Button type="submit"><Plus className="w-4 h-4 ml-1" /> חסום</Button>
          </form>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {domains.map((d) => (
              <div key={d} className="flex items-center justify-between p-2 rounded-md border border-border/40 bg-muted/20">
                <code className="text-sm" dir="ltr">{d}</code>
                <Button size="sm" variant="ghost" onClick={() => unblock(d)}>
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </Button>
              </div>
            ))}
            {domains.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">אין דומיינים חסומים</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== Image Filter Tab ==============
function ImageFilterTab() {
  const { toast } = useToast();
  const [status, setStatus] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [domains, setDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [st, sa, d] = await Promise.all([
        imageFilterApi.getStatus().catch(() => null),
        imageFilterApi.getStats().catch(() => null),
        imageFilterApi.getDomains().catch(() => ({ domains: [] })),
      ]);
      setStatus(st);
      setStats(sa);
      setDomains(d?.domains || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    try {
      await imageFilterApi.addDomain(newDomain.trim());
      toast({ title: "נוסף" });
      setNewDomain("");
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  const remove = async (d: string) => {
    try {
      await imageFilterApi.removeDomain(d);
      load();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  const restart = async () => {
    try {
      await imageFilterApi.restart();
      toast({ title: "השירות הופעל מחדש" });
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin mx-auto mt-10" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">סטטוס שירות:</span>
          <Badge variant={status?.running ? "default" : "destructive"}>
            {status?.running ? "פעיל" : "מושבת"}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={restart}>
          <RefreshCw className="w-4 h-4 ml-1" /> הפעל מחדש
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <Card><CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-rose-400">{Number(stats.blocked || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">תמונות חסומות</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{Number(stats.processed || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">תמונות שעובדו</p>
          </CardContent></Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">דומיינים בסינון תמונות</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="flex gap-2 mb-3">
            <Input placeholder="example.com" dir="ltr" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} />
            <Button type="submit"><Plus className="w-4 h-4 ml-1" /> הוסף</Button>
          </form>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {domains.map((d) => (
              <div key={d} className="flex items-center justify-between p-2 rounded-md border border-border/40 bg-muted/20">
                <code className="text-sm" dir="ltr">{d}</code>
                <Button size="sm" variant="ghost" onClick={() => remove(d)}>
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </Button>
              </div>
            ))}
            {domains.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">אין דומיינים</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== FilterPhone device controls ==============
const FILTERPHONE_API = "https://api.filterphone.com";
const FILTERPHONE_ADMIN_TOKEN = "fp_filterphone_admin_token";

function FilterPhoneControlTab() {
  const { toast } = useToast();
  const [token, setToken] = useState(() => sessionStorage.getItem(FILTERPHONE_ADMIN_TOKEN) || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);
  const [minutes, setMinutes] = useState("60");
  const [reason, setReason] = useState("השהיה יזומה מהדשבורד");
  const [busyDevice, setBusyDevice] = useState<number | null>(null);

  const request = async (path: string, options: RequestInit = {}, authToken = token) => {
    const response = await fetch(FILTERPHONE_API + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: "Bearer " + authToken } : {}),
        ...((options.headers as Record<string, string>) || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      sessionStorage.removeItem(FILTERPHONE_ADMIN_TOKEN);
      setToken("");
      throw new Error("ההתחברות לניהול מכשירי FilterPhone פגה. התחברו שוב.");
    }
    if (!response.ok) throw new Error(data.error || "שגיאה " + response.status);
    return data;
  };

  const load = async (authToken = token) => {
    if (!authToken) return;
    setLoading(true);
    try {
      const list = await request("/v1/admin/devices", {}, authToken);
      const rows = Array.isArray(list) ? list : [];
      // רשימת המכשירים אינה כוללת את מצב ההשהיה, לכן מושכים לכל מכשיר את פרטי התחזוקה.
      const detailed = await Promise.all(rows.map(async (device: any) => {
        try {
          const detail = await request("/v1/admin/devices/" + device.id, {}, authToken);
          return { ...device, pause: detail.pause, unmanage_requested: detail.unmanage_requested };
        } catch {
          return device;
        }
      }));
      setDevices(detailed);
    } catch (err: any) {
      toast({ title: "שגיאה בטעינת המכשירים", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem(FILTERPHONE_ADMIN_TOKEN);
    if (saved) {
      setToken(saved);
      load(saved);
    }
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setLoginBusy(true);
    try {
      const result = await request("/v1/admin/login", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password }),
      }, "");
      if (!result.token) throw new Error("השרת לא החזיר אסימון מנהל.");
      sessionStorage.setItem(FILTERPHONE_ADMIN_TOKEN, result.token);
      setToken(result.token);
      setPassword("");
      toast({ title: "מחובר לניהול FilterPhone" });
      await load(result.token);
    } catch (err: any) {
      toast({ title: "שגיאת התחברות", description: err.message, variant: "destructive" });
    } finally {
      setLoginBusy(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(FILTERPHONE_ADMIN_TOKEN);
    setToken("");
    setDevices([]);
    setPassword("");
  };

  const act = async (device: any, action: "pause" | "resume" | "unmanage") => {
    if (action === "unmanage" && !window.confirm(
      "להסיר את ניהול FilterPhone מהמכשיר \"" + (device.label || device.name || device.id) +
      "\"? הפעולה משחררת את ההגבלות לאחר שהטלפון מקבל את הפקודה."
    )) return;
    setBusyDevice(Number(device.id));
    try {
      if (action === "pause") {
        const mins = Math.max(1, Math.min(1440, Number(minutes) || 60));
        await request("/v1/admin/devices/" + device.id + "/pause", {
          method: "POST",
          body: JSON.stringify({ minutes: mins, reason: reason.trim() }),
        });
        toast({ title: "החסימה הושהתה", description: (device.label || device.name || ("מכשיר " + device.id)) + " · " + mins + " דקות" });
      } else if (action === "resume") {
        await request("/v1/admin/devices/" + device.id + "/resume", { method: "POST", body: JSON.stringify({}) });
        toast({ title: "החסימה חזרה לפעול" });
      } else {
        await request("/v1/admin/devices/" + device.id + "/unmanage", { method: "POST", body: JSON.stringify({}) });
        toast({ title: "נשלחה בקשה להסרת ניהול", description: "הטלפון ישלים אותה בסנכרון הבא." });
      }
      await load(token);
    } catch (err: any) {
      toast({ title: "הפעולה נכשלה", description: err.message, variant: "destructive" });
    } finally {
      setBusyDevice(null);
    }
  };

  if (!token) {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5" /> ניהול מכשירי FilterPhone</CardTitle>
          <p className="text-sm text-muted-foreground">
            התחברות זו מיועדת לשרת FilterPhone החדש ונפרדת מהתחברות ה-CRM. הסיסמה נשלחת לשרת ונשמר רק אסימון זמני בלשונית הדפדפן.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={login} className="space-y-4">
            <div>
              <Label htmlFor="fp-admin-user">שם משתמש של FilterPhone</Label>
              <Input id="fp-admin-user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
            </div>
            <div>
              <Label htmlFor="fp-admin-password">סיסמת מנהל FilterPhone</Label>
              <Input id="fp-admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </div>
            <Button type="submit" disabled={loginBusy} className="w-full">
              {loginBusy ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <LogIn className="w-4 h-4 ml-2" />}
              כניסה לניהול מכשירים
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5" /> שליטה במכשירי FilterPhone</CardTitle>
          <p className="text-sm text-muted-foreground">
            השהיה זמנית פותחת את סינון הרשת ומרפה זמנית את נעילת ה-VPN בטלפון. כשתוקף ההשהיה פג, ההגנה חוזרת אוטומטית.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
            <div>
              <Label htmlFor="fp-pause-minutes">משך ההשהיה (דקות)</Label>
              <Input id="fp-pause-minutes" type="number" min="1" max="1440" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="fp-pause-reason">סיבת ההשהיה</Label>
              <Input id="fp-pause-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => load(token)} disabled={loading}>
              <RefreshCw className={loading ? "w-4 h-4 ml-2 animate-spin" : "w-4 h-4 ml-2"} /> רענן מכשירים
            </Button>
            <Button variant="ghost" onClick={logout}>יציאה מניהול FilterPhone</Button>
          </div>
        </CardContent>
      </Card>

      {loading && devices.length === 0 ? (
        <Loader2 className="w-7 h-7 animate-spin mx-auto mt-10" />
      ) : devices.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">לא נמצאו מכשירים במערכת FilterPhone.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {devices.map((device) => {
            const paused = device.pause?.active === true;
            const label = device.label || device.name || ("מכשיר " + device.id);
            return (
              <Card key={device.id} className="border-border/70">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold break-words">{label}</div>
                      <div className="text-xs text-muted-foreground break-words">
                        {device.customer?.name || "ללא לקוח משויך"}
                        {device.customer?.phone ? " · " + device.customer.phone : ""}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">מזהה {device.id} · רמה {device.level} · {device.status === "active" ? "פעיל" : device.status}</div>
                    </div>
                    <Badge variant={paused ? "secondary" : device.status === "active" ? "default" : "destructive"}>
                      {paused ? "החסימה מושהית" : device.unmanage_requested ? "ממתין להסרת ניהול" : device.status === "active" ? "פעיל" : "לא פעיל"}
                    </Badge>
                  </div>
                  {paused && (
                    <p className="text-sm text-amber-600">
                      מושהה עד {device.pause?.until ? new Date(device.pause.until * 1000).toLocaleString("he-IL") : "ללא זמן סיום זמין"}
                      {device.pause?.reason ? " · " + device.pause.reason : ""}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {paused ? (
                      <Button size="sm" onClick={() => act(device, "resume")} disabled={busyDevice === device.id}>
                        <Play className="w-4 h-4 ml-1" /> החזר חסימה
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => act(device, "pause")} disabled={busyDevice === device.id || device.status !== "active"}>
                        <Pause className="w-4 h-4 ml-1" /> השהיית חסימה
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => act(device, "unmanage")} disabled={busyDevice === device.id || device.status !== "active" || device.unmanage_requested}>
                      הסרת ניהול
                    </Button>
                    {busyDevice === device.id && <Loader2 className="w-4 h-4 animate-spin self-center" />}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============== Main Page ==============
const CrmDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const cached = crmAuth.getUser();
    if (cached && !crmAuth.isExpired() && cached.role === "admin") {
      authApi
        .me()
        .then((data: any) => {
          if (data.role === "admin") setUser(data);
          else crmAuth.clear();
        })
        .catch(() => crmAuth.clear())
        .finally(() => setChecking(false));
    } else {
      crmAuth.clear();
      setChecking(false);
    }
  }, []);

  const logout = () => {
    crmAuth.clear();
    setUser(null);
    toast({ title: "התנתקת" });
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Helmet>
          <title>פאנל ניהול CRM | FilterPhone</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <AdminLoginCard onLogin={setUser} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Helmet>
        <title>פאנל ניהול CRM | FilterPhone</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="font-bold">CRM · FilterPhone</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 ml-1.5" />
              יציאה
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto justify-start gap-1 bg-muted/40 p-1">
            <TabsTrigger value="stats"><BarChart3 className="w-4 h-4 ml-1.5" /> סקירה</TabsTrigger>
            <TabsTrigger value="users"><Users className="w-4 h-4 ml-1.5" /> לקוחות</TabsTrigger>
            <TabsTrigger value="requests"><Inbox className="w-4 h-4 ml-1.5" /> בקשות</TabsTrigger>
            <TabsTrigger value="logs"><ScrollText className="w-4 h-4 ml-1.5" /> לוגים</TabsTrigger>
            <TabsTrigger value="vpn"><Wifi className="w-4 h-4 ml-1.5" /> VPN</TabsTrigger>
            <TabsTrigger value="adguard"><Globe className="w-4 h-4 ml-1.5" /> AdGuard</TabsTrigger>
            <TabsTrigger value="images"><ImageOff className="w-4 h-4 ml-1.5" /> סינון תמונות</TabsTrigger>
            <TabsTrigger value="filterphone"><Smartphone className="w-4 h-4 ml-1.5" /> השהיית חסימה</TabsTrigger>
          </TabsList>

          <TabsContent value="stats"><StatsTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="requests"><RequestsTab /></TabsContent>
          <TabsContent value="logs"><LogsTab /></TabsContent>
          <TabsContent value="vpn"><VpnTab /></TabsContent>
          <TabsContent value="adguard"><AdGuardTab /></TabsContent>
          <TabsContent value="images"><ImageFilterTab /></TabsContent>
          <TabsContent value="filterphone"><FilterPhoneControlTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CrmDashboard;
