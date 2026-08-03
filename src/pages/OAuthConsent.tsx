import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

type OAuthClient = { name?: string };
type AuthorizationDetails = {
  client?: OAuthClient;
  redirect_url?: string;
  redirect_to?: string;
};

type OAuthNamespace = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

const oauth = () =>
  (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("חסר מזהה בקשת הרשאה (authorization_id)");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/admin/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("שרת ההרשאות לא החזיר כתובת חזרה");
      return;
    }
    window.location.href = target;
  };

  const clientName = details?.client?.name ?? "אפליקציה חיצונית";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-7 h-7 text-primary-foreground" />
        </div>
        {error ? (
          <>
            <h1 className="text-xl font-heading font-bold mb-2">לא ניתן לטעון את הבקשה</h1>
            <p className="text-muted-foreground text-sm">{error}</p>
          </>
        ) : !details ? (
          <p className="text-muted-foreground text-sm">טוען…</p>
        ) : (
          <>
            <h1 className="text-xl font-heading font-bold mb-2">
              לחבר את {clientName} לחשבון שלך?
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {clientName} תוכל לגשת לכלים של FilterPhone בשמך, בהתאם להרשאות החשבון שלך.
            </p>
            <div className="flex gap-3">
              <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
                אישור
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                disabled={busy}
                onClick={() => decide(false)}
              >
                דחייה
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default OAuthConsent;
