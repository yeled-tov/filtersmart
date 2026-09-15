import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { services as staticServices } from "@/data/services";

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

/**
 * Used whenever Supabase is unreachable or returns nothing, so a service page
 * is never thin. Derived from `src/data/services.ts` to keep one source of truth
 * for the copy.
 */
export const fallbackServices: ServiceRow[] = staticServices.map((s, i) => ({
  id: `fallback-${s.slug}`,
  name: s.name,
  slug: s.slug,
  short_desc: s.shortDesc,
  description: s.longDesc,
  price: s.price,
  category: s.category,
  logo_url: s.logo ?? null,
  features: s.features,
  visible: true,
  sort_order: i + 1,
  is_popular: s.slug === "askan",
  emoji_icon: null,
}));

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
