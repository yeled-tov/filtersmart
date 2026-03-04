import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const fetchBlogPosts = async (): Promise<BlogPostRow[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const useBlogPosts = () =>
  useQuery({ queryKey: ["blog_posts"], queryFn: fetchBlogPosts, staleTime: 60_000 });
