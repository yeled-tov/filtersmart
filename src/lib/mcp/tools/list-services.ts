import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_services",
  title: "List services",
  description:
    "List FilterPhone phone-filtering services (name, slug, price, category, description).",
  inputSchema: {
    category: z.string().trim().optional().describe("Optional category filter."),
    include_hidden: z
      .boolean()
      .optional()
      .describe("Include services hidden on the site (admins only)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, include_hidden }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("services")
      .select("id, name, slug, price, category, short_desc, description, is_popular, visible, sort_order")
      .order("sort_order", { ascending: true });
    if (!include_hidden) query = query.eq("visible", true);
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { services: data ?? [] },
    };
  },
});
