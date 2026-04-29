import { useEffect, useState, FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  LogOut,
  RefreshCw,
  Download,
  QrCode,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ImageOff,
  ImageIcon,
  Smartphone,
  Calendar,
} from "lucide-react";
import { authApi, usersApi, requestsApi, vpnApi, crmAuth } from "@/services/crmApi";

const LEVEL_NAMES: Record<number, string> = {
  1: "חסימה מלאה",
  2: "טשטוש חלקי",
  3: "צניעות בלבד",
};

const TYPE_NAMES: Record<string, string> = {
  level_change: "שינוי רמת סינון",
  pause: "השהיית סינון",
  resume: "חידוש סינון",
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

const LevelPill = ({ level }: { level: number }) => {
  const colors: Record<number, string> = {
    1: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    2: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    3: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[level] || ""}`}>
      רמה {level} · {LEVEL_NAMES[level] || "—"}
    </span>
  );
};

// ============== Login form ==============
function LoginCard({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "חסרים פרטים", description: "נא למלא אימייל וסיסמה", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      crmAuth.setSession(data.token, data.user);
      onLogin(data.user);
      toast({ title: "ברוך הבא!", description: `שלום ${data.user.name}` });
    } catch (err: any) {
      toast({
        title: "שגיאת התחברות",
        description: err.message || "פרטי התחברות שגויים",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/60 shadow-xl backdrop-blur-sm">
          <CardHeader className="text-center space-y-3 pb-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">איזור אישי</CardTitle>
            <p className="text-sm text-muted-foreground">היכנס לחשבון הסינון שלך ב-FilterPhone</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">כתובת אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  dir="ltr"
                  className="text-right"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">סיסמה</Label>
                <Input
                  id="password"
                  type="password"
                  dir="ltr"
                  className="text-right"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    מתחבר...
                  </>
                ) : (
                  "כניסה"
                )}
              </Button>
            </form>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              עדיין אין לך חשבון? צור קשר ב-WhatsApp:{" "}
              <a
                href="https://wa.me/972527186881"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                052-718-6881
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ============== Client portal main ==============
function ClientDashboard({ initialUser, onLogout }: { initialUser: any; onLogout: () => void }) {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(initialUser);
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingReq, setLoadingReq] = useState(true);

  // request modal
  const [reqOpen, setReqOpen] = useState(false);
  const [reqType, setReqType] = useState<string>("level_change");
  const [reqLevel, setReqLevel] = useState<number>(1);
  const [reqReason, setReqReason] = useState("");
  const [sending, setSending] = useState(false);

  // VPN
  const [vpnLoading, setVpnLoading] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

  const refreshUser = async () => {
    try {
      const data = await usersApi.getMe();
      setUser(data);
      crmAuth.setSession(crmAuth.getToken()!, data);
    } catch (err: any) {
      toast({ title: "שגיאה ברענון", description: err.message, variant: "destructive" });
    }
  };

  const loadRequests = async () => {
    try {
      setLoadingReq(true);
      const data = await requestsApi.getAll();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      // שקט
    } finally {
      setLoadingReq(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const sendRequest = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await requestsApi.create({
        type: reqType,
        requested_level: reqType === "level_change" ? reqLevel : undefined,
        reason: reqReason || undefined,
      });
      setReqOpen(false);
      setReqReason("");
      toast({
        title: "הבקשה נשלחה!",
        description: "המנהל יטפל בבקשה בקרוב",
      });
      await loadRequests();
    } catch (err: any) {
      toast({
        title: "שגיאה בשליחה",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const downloadVpn = async () => {
    setVpnLoading(true);
    try {
      const conf = await vpnApi.getMyConfig();
      const blob = new Blob([conf as string], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "filterphone-vpn.conf";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "הקובץ הורד", description: "filterphone-vpn.conf" });
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    } finally {
      setVpnLoading(false);
    }
  };

  const showQr = async () => {
    setVpnLoading(true);
    try {
      const data = await vpnApi.getMyQr();
      setQrData(data.qr);
      setQrOpen(true);
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message, variant: "destructive" });
    } finally {
      setVpnLoading(false);
    }
  };

  const subDate = user.subscription_expires_at
    ? user.subscription_expires_at.split("T")[0]
    : null;
  const isExpiring =
    subDate && new Date(subDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            איזור אישי
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            שלום {user.name} · {user.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshUser}>
            <RefreshCw className="w-4 h-4 ml-1.5" />
            רענן
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 ml-1.5" />
            יציאה
          </Button>
        </div>
      </div>

      {/* Status overview */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">סטטוס הסינון שלי</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">סטטוס חשבון</span>
              <StatusPill status={user.status || "active"} />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">רמת סינון</span>
              <LevelPill level={user.filter_level || 1} />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                פלטפורמה / מכשיר
              </span>
              <span className="text-sm font-medium">
                {user.platform || "—"} {user.device ? `· ${user.device}` : ""}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                תפוגת מנוי
              </span>
              <span className={`text-sm font-medium ${isExpiring ? "text-amber-400" : ""}`}>
                {subDate || "ללא הגבלה"}
                {isExpiring && " · פג בקרוב ⚠"}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Card>
          <CardContent className="pt-6 text-center">
            <ImageOff className="w-7 h-7 text-rose-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-rose-400">
              {(user.images_blocked || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">תמונות חסומות</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <ImageIcon className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-emerald-400">
              {(user.images_processed || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">תמונות שעובדו</p>
          </CardContent>
        </Card>
      </div>

      {/* VPN */}
      <Card className="mb-5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">ה-VPN שלי</CardTitle>
          <p className="text-sm text-muted-foreground">
            חבר את המכשיר ל-VPN כדי שכל הגלישה תעבור דרך הסינון המלא
          </p>
        </CardHeader>
        <CardContent>
          {user.vpn_ip ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">
                  VPN מוגדר · <code className="text-xs text-muted-foreground">{user.vpn_ip}</code>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={downloadVpn} disabled={vpnLoading} size="sm">
                  <Download className="w-4 h-4 ml-1.5" />
                  הורד קובץ קונפיג
                </Button>
                <Button onClick={showQr} disabled={vpnLoading} size="sm" variant="outline">
                  <QrCode className="w-4 h-4 ml-1.5" />
                  הצג QR
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>VPN טרם הוגדר. פנה למנהל לקבלת גישה.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">הבקשות שלי</CardTitle>
          <Button onClick={() => setReqOpen(true)} size="sm">
            <Send className="w-4 h-4 ml-1.5" />
            בקשה חדשה
          </Button>
        </CardHeader>
        <CardContent>
          {loadingReq ? (
            <div className="text-center py-6">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              עדיין לא שלחת בקשות
            </p>
          ) : (
            <div className="space-y-2">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {TYPE_NAMES[r.type] || r.type}
                      {r.requested_level && ` (רמה ${r.requested_level})`}
                    </div>
                    {r.reason && (
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {r.reason}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      {new Date(r.created_at).toLocaleString("he-IL")}
                    </div>
                  </div>
                  <StatusPill status={r.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Dialog */}
      <Dialog open={reqOpen} onOpenChange={setReqOpen}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>שליחת בקשה למנהל</DialogTitle>
          </DialogHeader>
          <form onSubmit={sendRequest} className="space-y-4">
            <div className="space-y-2">
              <Label>סוג בקשה</Label>
              <select
                value={reqType}
                onChange={(e) => setReqType(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="level_change">שינוי רמת סינון</option>
                <option value="pause">השהיית סינון</option>
                <option value="resume">חידוש סינון</option>
              </select>
            </div>

            {reqType === "level_change" && (
              <div className="space-y-2">
                <Label>רמה רצויה</Label>
                <select
                  value={reqLevel}
                  onChange={(e) => setReqLevel(Number(e.target.value))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value={1}>רמה 1 - חסימה מלאה</option>
                  <option value={2}>רמה 2 - טשטוש חלקי</option>
                  <option value={3}>רמה 3 - צניעות בלבד</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label>סיבה (אופציונלי)</Label>
              <Textarea
                value={reqReason}
                onChange={(e) => setReqReason(e.target.value)}
                placeholder="פרט את סיבת הבקשה..."
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={sending} className="flex-1">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : "שלח בקשה"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setReqOpen(false)}>
                ביטול
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* QR Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent dir="rtl" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code - WireGuard VPN</DialogTitle>
          </DialogHeader>
          <div className="text-center py-2">
            {qrData && (
              <img
                src={qrData}
                alt="WireGuard QR"
                className="mx-auto rounded-lg border border-border"
                style={{ width: 260, height: 260 }}
              />
            )}
            <p className="text-xs text-muted-foreground mt-3">
              סרוק עם אפליקציית WireGuard והפעל את החיבור
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============== Main page ==============
export default function MyAccount() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (crmAuth.isExpired()) {
      crmAuth.clear();
      setUser(null);
    } else {
      setUser(crmAuth.getUser());
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    crmAuth.clear();
    setUser(null);
  };

  return (
    <>
      <Helmet>
        <title>איזור אישי | FilterPhone באשדוד</title>
        <meta
          name="description"
          content="איזור אישי לניהול הסינון שלך ב-FilterPhone באשדוד - צפה בסטטוס, שלח בקשות לשינוי רמה והורד את ה-VPN."
        />
        <link rel="canonical" href="https://www.filterphone.com/my-account" />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !user ? (
        <LoginCard onLogin={setUser} />
      ) : user.role === "admin" ? (
        // אדמין שמתחבר דרך /my-account - נשלח להפנייה לפאנל הניהול
        <div className="container mx-auto px-4 py-12 max-w-md text-center">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Shield className="w-12 h-12 text-primary mx-auto" />
              <h2 className="text-xl font-semibold">התחברת כמנהל</h2>
              <p className="text-sm text-muted-foreground">
                לפעולות ניהוליות עבור לפאנל ה-CRM
              </p>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a href="/admin">פתח פאנל ניהול</a>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  יציאה
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <ClientDashboard initialUser={user} onLogout={handleLogout} />
      )}
    </>
  );
}
