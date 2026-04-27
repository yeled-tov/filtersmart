import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceRow {
  id: string;
  name: string;
  slug: string;
  short_desc: string | null;
  description: string | null;
  price: string;
  category: string;
  logo_url: string | null;
  features: string[];
  visible: boolean;
  sort_order: number;
  is_popular: boolean | null;
  emoji_icon: string | null;
}

export const fallbackServices: ServiceRow[] = [
  {
    id: "fb-1", name: "סינון בסיסי לאייפון ואנדרואיד", slug: "basic-filtering",
    short_desc: "פתרון מהיר ויעיל לחסימת תוכן לא רצוי – התקנה תוך 5 דקות בלבד",
    description: null, price: "100₪", category: "filtering", logo_url: null,
    features: ["התקנה מהירה תוך 5 דקות", "תמיכה באייפון ואנדרואיד"],
    visible: true, sort_order: 1, is_popular: false, emoji_icon: "🛡️",
  },
  {
    id: "fb-2", name: "מערכת כושר פליי (Kosher Play)", slug: "kosher-play",
    short_desc: "חנות אפליקציות כשרה עם צריבת MDM למניעת איפוס והסרת הגנה",
    description: null, price: "70₪", category: "filtering", logo_url: "/kosherplay-logo.png",
    features: ["חנות אפליקציות כשרה", "צריבת MDM"],
    visible: true, sort_order: 2, is_popular: false, emoji_icon: "🛡️",
  },
  {
    id: "fb-3", name: "מערכת סינון עסקן (Askan)", slug: "askan",
    short_desc: "צריבה מקצועית על מכשיר מאופס או חדש בלבד – סינון AI חכם",
    description: null, price: "300₪", category: "filtering", logo_url: "/askan-logo.png",
    features: ["מסנן תמונות AI חכם ומהיר", "לאנשי עסקים"],
    visible: true, sort_order: 3, is_popular: false, emoji_icon: "🛡️",
  },
  {
    id: "fb-4", name: "מערכת הדרן (Hadran)", slug: "hadran",
    short_desc: "ההגנה החזקה וההרמטית ביותר בשוק – סינון מוסמך שלא ניתן להסרה",
    description: null, price: "300₪", category: "filtering", logo_url: "/hadran-logo.png",
    features: ["סינון מוסמך", "לא ניתן להסרה"],
    visible: true, sort_order: 4, is_popular: true, emoji_icon: "🛡️",
  },
  {
    id: "fb-5", name: "צריבת גרסה Qin F21 Pro", slug: "qin-f21-pro",
    short_desc: "צריבת גרסה כשרה למכשיר שיאומי Qin F21 Pro",
    description: null, price: "70₪", category: "flashing", logo_url: null,
    features: ["צריבת גרסה", "סינון מובנה"],
    visible: true, sort_order: 5, is_popular: false, emoji_icon: "🛡️",
  },
  {
    id: "fb-6", name: "צריבת גרסה Qin F25", slug: "qin-f25",
    short_desc: "צריבת גרסה כשרה למכשיר שיאומי Qin F25",
    description: null, price: "70₪", category: "flashing", logo_url: null,
    features: ["צריבת גרסה", "סינון מובנה"],
    visible: true, sort_order: 6, is_popular: false, emoji_icon: "🛡️",
  },
];

const fetchServices = async (): Promise<ServiceRow[]> => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order");
    if (error) {
      console.error("[useServices] Supabase error:", error.message, error);
      return fallbackServices;
    }
    if (!data || data.length === 0) {
      console.warn("[useServices] No services returned, using fallback");
      return fallbackServices;
    }
    return data.map((s) => ({
      ...s,
      features: Array.isArray(s.features) ? (s.features as string[]) : [],
    }));
  } catch (err) {
    console.error("[useServices] Unexpected error:", err);
    return fallbackServices;
  }
};

export const useServices = () =>
  useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 60_000,
    retry: 1,
    placeholderData: fallbackServices,
  });
