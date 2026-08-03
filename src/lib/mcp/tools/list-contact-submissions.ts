import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_contact_submissions",
  title: "List contact submissions",
  description:
    "List leads submitted through the FilterPhone contact forms. Requires an admin account.",
  inputSchema: {
    only_unread: z.boolean().optional().describe("Return only submissions not yet marked as read."),
    limit: z.number().int().optional().describe("Maximum submissions to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ only_unread, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const max = Math.min(Math.max(limit ?? 20, 1), 100);
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("contact_submissions")
      .select("id, name, phone, email, message, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(max);
    if (only_unread) query = query.eq("is_read", false);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data?.length) {
      return {
        content: [
          {
            type: "text",
            text: "No submissions returned. This tool is limited to admin accounts.",
          },
        ],
        structuredContent: { submissions: [] },
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { submissions: data },
    };
  },
});
