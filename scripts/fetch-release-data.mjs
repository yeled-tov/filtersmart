// Build step: snapshot FilterTube's releases from GitHub into the bundle.
//
// Only GitHub knows the real download numbers — it counts every fetch of a release
// asset, wherever the link was clicked. Baking a snapshot at build time puts those
// numbers on screen at first paint instead of after a round trip; the browser then
// refreshes them live from the same API.
//
// This must never fail the build. If GitHub is unreachable or rate-limited we keep
// whatever snapshot is already committed, and the client's live fetch covers it.

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "src", "data", "filtertube-releases.json");
// FilterTube's own mirror, not api.github.com. The Vercel build has no GitHub
// credentials, so once that repository is private this fetch would fail on every
// build and the site would ship whatever snapshot happened to be committed.
const API = "https://filter-tube-52d8e.web.app/releases.json";

const isApk = (name) => Boolean(name && name.toLowerCase().endsWith(".apk"));

/** Mirrors `trimReleases` in src/lib/filtertubeRelease.ts — the client shapes the rest. */
const trim = (releases) =>
  releases.map((r) => ({
    tag_name: r.tag_name,
    name: r.name ?? null,
    body: r.body ?? null,
    published_at: r.published_at,
    html_url: r.html_url,
    prerelease: Boolean(r.prerelease),
    draft: Boolean(r.draft),
    assets: (r.assets ?? [])
      .filter((a) => isApk(a.name))
      .map((a) => ({
        name: a.name,
        size: a.size,
        download_count: a.download_count,
        browser_download_url: a.browser_download_url,
      })),
  }));

async function main() {
  let trimmed;
  try {
    const res = await fetch(API, {
      headers: { Accept: "application/json", "User-Agent": "filterphone-site-build" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`release mirror responded ${res.status}`);
    const payload = await res.json();
    // The mirror wraps the GitHub-shaped list; a bare array is still accepted.
    const releases = Array.isArray(payload) ? payload : (payload.releases ?? []);
    if (!Array.isArray(releases) || releases.length === 0) throw new Error("no releases returned");
    trimmed = trim(releases);
  } catch (err) {
    console.warn(`[release-data] Could not refresh from GitHub (${err.message}).`);
    try {
      const existing = JSON.parse(await readFile(OUT, "utf8"));
      console.warn(`[release-data] Keeping the committed snapshot (${existing.length} releases).`);
    } catch {
      console.warn("[release-data] No snapshot on disk; the page loads its numbers client-side.");
    }
    return;
  }

  await writeFile(OUT, `${JSON.stringify(trimmed, null, 2)}\n`, "utf8");
  const downloads = trimmed.reduce(
    (sum, r) => sum + r.assets.reduce((s, a) => s + (a.download_count ?? 0), 0),
    0,
  );
  const stable = trimmed.find((r) => !r.prerelease);
  console.log(
    `[release-data] ${trimmed.length} releases · ${downloads.toLocaleString("en-US")} downloads · latest ${stable?.tag_name ?? "?"}`,
  );
}

main();
