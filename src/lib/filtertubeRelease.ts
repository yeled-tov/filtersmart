/**
 * FilterTube's release data.
 *
 * The app's repository is going private, which takes GitHub's public API and its
 * release assets down with it. So the app's own CI mirrors everything it used to
 * serve — the APK and the release metadata — onto Firebase Hosting, which stays
 * public either way. That mirror is the source of truth here.
 *
 * We read it through `/api/filtertube-releases.json` on our own domain rather
 * than from the mirror directly. Three reasons, all real:
 *
 * - Firebase Hosting sends no `Access-Control-Allow-Origin`, so a browser fetch
 *   straight to it is blocked. Verified in a browser, not assumed.
 * - Visitors on filtered networks — this site's whole audience — reach
 *   filterphone.com but not necessarily an unfamiliar third-party host.
 * - It replaces the old call to api.github.com, whose 60-requests-per-hour
 *   unauthenticated limit was shared by every visitor behind the same carrier NAT.
 */

/** Where the app's CI publishes the mirror. */
export const MIRROR_ORIGIN = "https://filter-tube-52d8e.web.app";

/** Same-origin proxy, configured as a rewrite in vercel.json. */
export const RELEASES_URL = "/api/filtertube-releases.json";

/** Direct link, used at build time and as the download fallback. */
export const MIRROR_RELEASES_URL = `${MIRROR_ORIGIN}/releases.json`;
export const FALLBACK_APK_URL = `${MIRROR_ORIGIN}/download/FilterTube.apk`;

/** One channel — the stable build, or the test build. */
export interface ChannelRelease {
  build: number;
  tag: string;
  versionName: string;
  /**
   * What changed, written for the customer. The app's CI takes these from its
   * CHANGELOG rather than from commit subjects, so this is release-note prose
   * and not a developer's shorthand.
   */
  changes: string[];
  publishedAt: string;
  sizeBytes: number | null;
  downloads: number;
  /** Path on the mirror, e.g. "/download/FilterTube.apk". */
  apkUrl: string | null;
}

export interface ReleasePayload {
  updatedAt: string;
  stable: ChannelRelease | null;
  test: ChannelRelease | null;
  totalDownloads: number;
  releaseCount: number;
}

/** Absolute download URL for a channel, falling back to the stable path. */
export const apkUrlFor = (release: ChannelRelease | null | undefined): string =>
  release?.apkUrl ? `${MIRROR_ORIGIN}${release.apkUrl}` : FALLBACK_APK_URL;

const isChannel = (value: unknown): value is ChannelRelease => {
  if (!value || typeof value !== "object") return false;
  const c = value as Partial<ChannelRelease>;
  return typeof c.versionName === "string" && typeof c.publishedAt === "string";
};

/**
 * Validates a payload before it reaches the UI. A mirror that is mid-deploy, or
 * an HTML error page served with a JSON content type, must not blank the panel —
 * returning null keeps whatever is already on screen.
 */
export function parsePayload(value: unknown): ReleasePayload | null {
  if (!value || typeof value !== "object") return null;
  const p = value as Partial<ReleasePayload>;
  if (typeof p.totalDownloads !== "number" || !isChannel(p.stable)) return null;
  return {
    updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : new Date().toISOString(),
    stable: p.stable,
    test: isChannel(p.test) ? p.test : null,
    totalDownloads: p.totalDownloads,
    releaseCount: typeof p.releaseCount === "number" ? p.releaseCount : 0,
  };
}
