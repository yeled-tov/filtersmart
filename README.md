# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Routing and indexing notes

Things in this repo that look wrong until you know why, and that have each
already caused a live outage or an indexing fault once:

- **SPA rewrites in `vercel.json` must target `/`, never `/index.html`.**
  `cleanUrls: true` makes `/index.html` a redirect source — it 308s to `/` — so
  a rewrite pointing at it resolves to nothing and the route 404s at the edge.
  This is what silently killed `/admin`, `/admin/login`, `/reset-password` and
  every blog post URL.
- **`vercel.json` takes no extra top-level keys.** Vercel validates it against a
  strict schema and rejects the whole deployment before the build starts, with
  no build log to explain it. There is no way to leave a comment in that file,
  which is why this note lives here.
- **There is deliberately no catch-all rewrite.** Unknown URLs should return a
  real 404. A catch-all turns every typo into a soft 404 serving a copy of the
  home page, which Google penalises. Routes are listed explicitly instead, so a
  new non-prerendered route needs a line adding.
- **Blog posts are prerendered from Supabase at build time** by
  `scripts/prerender.mjs`, which also writes `sitemap.xml`. Publishing a post
  therefore needs a redeploy before it gets its own static page, canonical and
  `Article` markup — until then `/blog/:slug` falls back to the `/blog` listing
  and renders the post client-side. The fallback points at `/blog` rather than
  `/` on purpose: an unknown slug then carries the listing's canonical instead
  of claiming to be the home page.
- **Only `www.filterphone.com` may be indexable.** `filtersmart.vercel.app`
  serves the same site, so any `*.vercel.app` host is sent
  `X-Robots-Tag: noindex, nofollow`.
