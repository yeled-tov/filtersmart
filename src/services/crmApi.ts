// ===================================
// CRM API Client - מתחבר ל-Edge Function שמשמש כ-Proxy
// ===================================

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const CRM_BASE = "/api/proxy";
const TOKEN_KEY = "fp_crm_token";
const USER_KEY = "fp_crm_user";

export const crmAuth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setSession: (token: string, user: any) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isExpired: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = crmAuth.getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${CRM_BASE}${path}`, { ...options, headers });

  // ייתכן ושורצר טקסט (כמו קונפיג VPN)
  const ct = res.headers.get("Content-Type") || "";
  if (!ct.includes("application/json")) {
    if (!res.ok) throw new Error(`שגיאה: ${res.status}`);
    return (await res.text()) as unknown as T;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "שגיאה בשרת");
  return data;
}

// ===== Auth =====
export const authApi = {
  login: (email: string, password: string) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request("/api/auth/me"),
};

// ===== Users =====
export const usersApi = {
  getAll: () => request<any[]>("/api/users"),
  getMe: () => request("/api/users/me"),
  create: (userData: any) =>
    request("/api/users", { method: "POST", body: JSON.stringify(userData) }),
  update: (id: string | number, userData: any) =>
    request(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(userData) }),
  delete: (id: string | number) =>
    request(`/api/users/${id}`, { method: "DELETE" }),
  setFilterLevel: (id: string | number, filter_level: number) =>
    request(`/api/users/${id}/filter-level`, {
      method: "PUT",
      body: JSON.stringify({ filter_level }),
    }),
  setStatus: (id: string | number, status: string) =>
    request(`/api/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// ===== Requests =====
export const requestsApi = {
  getAll: () => request<any[]>("/api/requests"),
  create: (requestData: any) =>
    request("/api/requests", { method: "POST", body: JSON.stringify(requestData) }),
  approve: (id: string | number) =>
    request(`/api/requests/${id}/approve`, { method: "PUT" }),
  reject: (id: string | number, reason: string) =>
    request(`/api/requests/${id}/reject`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }),
};

// ===== Logs & Stats =====
export const logsApi = {
  getLogs: (params: Record<string, any> = {}) => {
    const q = new URLSearchParams(params as any).toString();
    return request<any[]>(`/api/logs${q ? "?" + q : ""}`);
  },
  getStats: () => request("/api/stats"),
};

// ===== VPN =====
export const vpnApi = {
  generate: (userId: string | number) =>
    request<any>(`/api/vpn/generate/${userId}`, { method: "POST" }),
  getQrForUser: (userId: string | number) =>
    request<{ qr: string }>(`/api/vpn/${userId}/qr`),
  getConfigForUser: (userId: string | number) =>
    request<string>(`/api/vpn/${userId}/config`),
  delete: (userId: string | number) =>
    request(`/api/vpn/${userId}`, { method: "DELETE" }),
  getMyConfig: () => request<string>("/api/vpn/my-config"),
  getMyQr: () => request<{ qr: string }>("/api/vpn/my-qr"),
};

// ===== Image Filter =====
export const imageFilterApi = {
  getStatus: () => request("/api/image-filter/status"),
  getStats: () => request("/api/image-filter/stats"),
  getDomains: () => request<{ domains: string[] }>("/api/image-filter/domains"),
  addDomain: (domain: string) =>
    request("/api/image-filter/domains", {
      method: "POST",
      body: JSON.stringify({ domain }),
    }),
  removeDomain: (domain: string) =>
    request(`/api/image-filter/domains/${encodeURIComponent(domain)}`, {
      method: "DELETE",
    }),
  restart: () => request("/api/image-filter/restart", { method: "POST" }),
};

// ===== AdGuard =====
export const adguardApi = {
  getStats: () => request<any>("/api/adguard/stats"),
  getBlockedList: () => request<{ domains: string[] }>("/api/adguard/blocked-list"),
  blockDomain: (domain: string) =>
    request("/api/adguard/block-domain", {
      method: "POST",
      body: JSON.stringify({ domain }),
    }),
  unblockDomain: (domain: string) =>
    request("/api/adguard/unblock-domain", {
      method: "POST",
      body: JSON.stringify({ domain }),
    }),
};
