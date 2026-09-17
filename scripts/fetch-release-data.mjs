// Build step: snapshot FilterTube's release data into the bundle.
//
// The app's CI mirrors its releases to Firebase Hosting so the data survives the
// app repository going private. We read the mirror here, at build time, purely so
// the numbers are painted with the rest of the page instead of after a fetch —
// the browser refreshes them from the same mirror on load.
//
// This must never fail the build. If the mirror is unreachable we keep whatever
// snapshot is committed, and the client's fetch covers it.

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "src", "data", "filtertube-release.json");

// Kept in step with MIRROR_RELEASES_URL in src/lib/filtertubeRelease.ts. This
// runs in Node before the TypeScript is compiled, so it cannot import it.
const MIRROR = "https://filter-tube-52d8e.web.app/releases.json";

/** Only the fields the page reads, so the snapshot stays small. */
const channel = (c) =>
  c && {
    build: c.build ?? 0,
    tag: c.tag ?? "",
    versionName: c.versionName ?? "",
    changes: Array.isArray(c.changes) ? c.changes : [],
    publishedAt: c.publishedAt ?? null,
    sizeBytes: c.sizeBytes ?? null,
    downloads: c.downloads ?? 0,
    apkUrl: c.apkUrl ?? null,
  };

async function main() {
  let snapshot;
  try {
    const res = await fetch(MIRROR, {
      headers: { Accept: "application/json", "User-Agent": "filterphone-site-build" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`mirror responded ${res.status}`);
    const data = await res.json();
    if (!data || typeof data.totalDownloads !== "number" || !data.stable) {
      throw new Error("unexpected payload shape");
    }
    snapshot = {
      updatedAt: data.updatedAt ?? new Date().toISOString(),
      stable: channel(data.stable),
      test: channel(data.test) ?? null,
      totalDownloads: data.totalDownloads,
      releaseCount: data.releaseCount ?? 0,
    };
  } catch (err) {
    console.warn(`[release-data] Could not reach the release mirror (${err.message}).`);
    try {
      const existing = JSON.parse(await readFile(OUT, "utf8"));
      console.warn(`[release-data] Keeping the committed snapshot (${existing.updatedAt ?? "empty"}).`);
    } catch {
      console.warn("[release-data] No snapshot on disk; the page loads its numbers client-side.");
    }
    return;
  }

  await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(
    `[release-data] ${snapshot.totalDownloads.toLocaleString("en-US")} downloads · ` +
      `stable ${snapshot.stable.versionName} (${snapshot.stable.tag})` +
      (snapshot.test ? ` · test ${snapshot.test.versionName} (${snapshot.test.tag})` : ""),
  );
}

main();
