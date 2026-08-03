import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description: "List FilterPhone blog articles with title, slug, category and excerpt.",
  inputSchema: {
    search: z.string().trim().optional().describe("Optional text to match in the title."),
    include_drafts: z.boolean().optional().describe("Include unpublished drafts (admins only)."),
    limit: z.number().int().optional().describe("Maximum number of posts to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, include_drafts, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const max = Math.min(Math.max(limit ?? 20, 1), 50);
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("blog_posts")
      .select("id, title, slug, category, excerpt, published, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(max);
    if (!include_drafts) query = query.eq("published", true);
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});
