// ===================================
// CRM Proxy - מעביר את כל הקריאות ל-CRM שרת ב-HTTP -> HTTPS
// משמש גם כ-API לבוט WhatsApp (עם BOT_API_KEY)
// ===================================
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2.95.0/cors';

const CRM_SERVER = 'http://151.145.88.42:3001';
const BOT_API_KEY = Deno.env.get('BOT_API_KEY') || '';

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // מסיר את הקידומת /functions/v1/crm-proxy
    let path = url.pathname.replace(/^\/functions\/v1\/crm-proxy/, '');
    if (!path) path = '/';
    const targetUrl = `${CRM_SERVER}${path}${url.search}`;

    // אם הקריאה מהבוט (יש header X-Bot-Key) - מאמת ומחליף ל-Authorization של מנהל
    const botKey = req.headers.get('X-Bot-Key');
    let authHeader = req.headers.get('Authorization') || '';

    if (botKey) {
      if (!BOT_API_KEY || botKey !== BOT_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'Invalid bot API key' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // הבוט יכול להעביר User-Id-Override לזיהוי הלקוח (ה-CRM מכיר את הטוקן הזה)
      // הוא משתמש בטוקן מנהל קבוע שמוגדר כסיקרט
      const adminToken = Deno.env.get('CRM_ADMIN_TOKEN') || '';
      if (adminToken) authHeader = `Bearer ${adminToken}`;
    }

    // Forward headers
    const fwdHeaders: Record<string, string> = {
      'Content-Type': req.headers.get('Content-Type') || 'application/json',
    };
    if (authHeader) fwdHeaders['Authorization'] = authHeader;

    // Forward body (אם יש)
    let body: BodyInit | undefined = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await req.text();
    }

    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: fwdHeaders,
      body,
    });

    // העתק את הגוף וה-status בחזרה
    const respBody = await upstreamRes.text();
    const respHeaders: Record<string, string> = { ...corsHeaders };
    const ct = upstreamRes.headers.get('Content-Type');
    if (ct) respHeaders['Content-Type'] = ct;

    return new Response(respBody, {
      status: upstreamRes.status,
      headers: respHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Proxy error: ' + message }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
