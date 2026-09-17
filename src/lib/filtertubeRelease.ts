/**
 * Shapes GitHub's releases payload into what the FilterTube page shows.
 *
 * The same function runs over the snapshot baked in at build time and over the
 * live response fetched in the browser, so the two can never drift apart.
 */

export const FILTERTUBE_REPO = "yeled-tov/filtertube-android";

/**
 * Release data comes from FilterTube's own site, not from GitHub.
 *
 * The browser used to call api.github.com directly, which only works while the
 * repository is public — the moment it is made private every visitor gets a 404
 * and the download button loses its version and its counter. This file is a
 * mirror published by the app's release workflow on every build, and it keeps
 * GitHub's exact payload shape so nothing downstream had to change.
 *
 * It also removes the 60-requests-per-hour unauthenticated GitHub limit, which
 * every visitor behind the same carrier NAT was sharing.
 */
export const RELEASES_API = "https://filter-tube-52d8e.web.app/releases.json";

/** The fields we keep from GitHub. Anything else is dropped before it reaches the bundle. */
export interface RawAsset {
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
}

export interface RawRelease {
  tag_name: string;
  name: string | null;
  body: string | null;
  published_at: string;
  html_url: string;
  prerelease: boolean;
  draft: boolean;
  assets: RawAsset[];
}

export interface ReleaseView {
  version: string;
  build: string | null;
  tag: string;
  notes: string;
  publishedAt: string;
  url: string;
  downloadUrl: string | null;
  sizeBytes: number | null;
  downloads: number;
}

export interface ReleaseSummary {
  totalDownloads: number;
  releaseCount: number;
  stable: ReleaseView | null;
  beta: ReleaseView | null;
}

const isApk = (name: string | undefined) => Boolean(name?.toLowerCase().endsWith(".apk"));

/** The marketing version lives in the release title: "גרסה 2.0.1 (בנייה 218)". */
function parseVersion(release: RawRelease): string {
  const fromTitle = release.name?.match(/(\d+\.\d+\.\d+(?:-test\.\d+)?)/);
  if (fromTitle) return fromTitle[1];
  const fromBody = release.body?.match(/FilterTube\s+(\d+\.\d+\.\d+)/);
  return fromBody ? fromBody[1] : release.tag_name;
}

function view(release: RawRelease | undefined): ReleaseView | null {
  if (!release) return null;
  const asset = release.assets?.find((a) => isApk(a.name));
  return {
    version: parseVersion(release),
    build: release.tag_name?.replace(/^\D+/, "") || null,
    tag: release.tag_name,
    notes: release.body ?? "",
    publishedAt: release.published_at,
    url: release.html_url,
    downloadUrl: asset?.browser_download_url ?? null,
    sizeBytes: asset?.size ?? null,
    downloads: asset?.download_count ?? 0,
  };
}

export function shapeReleases(releases: RawRelease[]): ReleaseSummary | null {
  const published = releases.filter((r) => !r.draft);
  if (published.length === 0) return null;

  // Sum every APK ever published: that is the real number of installs, as opposed
  // to counting clicks on our own download button.
  const totalDownloads = published.reduce(
    (sum, r) =>
      sum + (r.assets ?? []).reduce((s, a) => s + (isApk(a.name) ? a.download_count ?? 0 : 0), 0),
    0,
  );

  return {
    totalDownloads,
    releaseCount: published.filter((r) => !r.prerelease).length,
    stable: view(published.find((r) => !r.prerelease)),
    beta: view(published.find((r) => r.prerelease)),
  };
}

/** Keeps only the fields `shapeReleases` reads, so the baked snapshot stays small. */
export function trimReleases(releases: RawRelease[]): RawRelease[] {
  return releases.map((r) => ({
    tag_name: r.tag_name,
    name: r.name,
    body: r.body,
    published_at: r.published_at,
    html_url: r.html_url,
    prerelease: r.prerelease,
    draft: r.draft,
    assets: (r.assets ?? []).filter((a) => isApk(a.name)).map((a) => ({
      name: a.name,
      size: a.size,
      download_count: a.download_count,
      browser_download_url: a.browser_download_url,
    })),
  }));
}
