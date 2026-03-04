import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

const fetchSettings = async (): Promise<SiteSettings> => {
  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error) throw error;
  const map: SiteSettings = {};
  (data || []).forEach((row) => { map[row.key] = row.value; });
  return map;
};

export const useSiteSettings = () =>
  useQuery({ queryKey: ["site_settings"], queryFn: fetchSettings, staleTime: 60_000 });
