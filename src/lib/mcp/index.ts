import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import listBlogPostsTool from "./tools/list-blog-posts";
import getBlogPostTool from "./tools/get-blog-post";
import getSiteSettingsTool from "./tools/get-site-settings";
import listContactSubmissionsTool from "./tools/list-contact-submissions";
import markSubmissionReadTool from "./tools/mark-submission-read";

// The OAuth issuer must be the direct Supabase host, built from the project ref.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "filterphone",
  title: "filterphone",
  version: "0.1.0",
  instructions:
    "Tools for FilterPhone, a phone-filtering service in Ashdod, Israel. Use `list_services` and `get_site_settings` for offering and contact details, `list_blog_posts`/`get_blog_post` for site content, and `list_contact_submissions`/`mark_submission_read` to review leads (admin accounts only).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listServicesTool,
    listBlogPostsTool,
    getBlogPostTool,
    getSiteSettingsTool,
    listContactSubmissionsTool,
    markSubmissionReadTool,
  ],
});
