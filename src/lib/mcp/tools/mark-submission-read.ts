import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "mark_submission_read",
  title: "Mark submission as read",
  description: "Mark one contact submission as read or unread. Requires an admin account.",
  inputSchema: {
    id: z.string().trim().min(1).describe("Submission id."),
    is_read: z.boolean().optional().describe("Read state to set (default true)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  handler: async ({ id, is_read }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("contact_submissions")
      .update({ is_read: is_read ?? true })
      .eq("id", id)
      .select("id, name, is_read");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data?.length) {
      return {
        content: [
          { type: "text", text: "Nothing updated — the id was not found or you are not an admin." },
        ],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data[0]) }],
      structuredContent: { submission: data[0] },
    };
  },
});
