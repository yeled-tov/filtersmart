import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const { signIn, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already admin
  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error("שגיאה בהתחברות: " + error.message);
    }
    // Navigation will happen automatically via useEffect when isAdmin becomes true
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setGoogleLoading(false);
    if (error) {
      toast.error("שגיאה בהתחברות עם Google: " + (error as Error).message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("נא להזין כתובת מייל");
      return;
    }
    setForgotLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setForgotLoading(false);
    if (error) {
      toast.error("שגיאה: " + error.message);
    } else {
      toast.success("קישור לאיפוס סיסמה נשלח למייל שלך");
      setShowForgot(false);
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">שכחתי סיסמה</h1>
            <p className="text-muted-foreground text-sm mt-1">נשלח לך קישור לאיפוס סיסמה במייל</p>
          </div>
          <form onSubmit={handleForgotPassword} className="bg-card rounded-xl p-6 card-shadow space-y-4">
            <Input
              type="email"
              placeholder="כתובת מייל"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              dir="ltr"
            />
            <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0" disabled={forgotLoading}>
              {forgotLoading ? "שולח..." : "שלח קישור איפוס"}
            </Button>
            <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={() => setShowForgot(false)}>
              חזרה להתחברות
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">פאנל ניהול</h1>
          <p className="text-muted-foreground text-sm mt-1">התחבר כמנהל</p>
        </div>
        <div className="bg-card rounded-xl p-6 card-shadow space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="מייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
            <Input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
            />
            <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0" disabled={loading}>
              {loading ? "מתחבר..." : "התחבר"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">או</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "מתחבר..." : "התחבר עם Google"}
          </Button>

          <button
            type="button"
            className="w-full text-sm text-primary hover:underline mt-2"
            onClick={() => setShowForgot(true)}
          >
            שכחתי סיסמה
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
