import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error("שגיאה בהתחברות: " + error.message);
    } else {
      navigate("/admin");
    }
  };

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
        <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 card-shadow space-y-4">
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
      </div>
    </div>
  );
};

export default AdminLogin;
