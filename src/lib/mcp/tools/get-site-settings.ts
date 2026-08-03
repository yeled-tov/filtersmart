import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_site_settings",
  title: "Get site settings",
  description:
    "Get FilterPhone site settings (contact details, business info, design keys) as key/value pairs.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const settings: Record<string, string> = {};
    (data ?? []).forEach((row) => {
      settings[row.key] = row.value;
    });
    return {
      content: [{ type: "text", text: JSON.stringify(settings) }],
      structuredContent: { settings },
    };
  },
});
