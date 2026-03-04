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
}

const fetchServices = async (): Promise<ServiceRow[]> => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data || []).map((s) => ({
    ...s,
    features: Array.isArray(s.features) ? (s.features as string[]) : [],
  }));
};

export const useServices = () =>
  useQuery({ queryKey: ["services"], queryFn: fetchServices, staleTime: 60_000 });
