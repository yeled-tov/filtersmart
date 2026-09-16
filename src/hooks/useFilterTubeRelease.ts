import { useEffect, useState } from "react";
import bakedReleases from "@/data/filtertube-releases.json";
import {
  RELEASES_API,
  shapeReleases,
  type RawRelease,
  type ReleaseSummary,
} from "@/lib/filtertubeRelease";

const CACHE_KEY = "fp_filtertube_releases_v1";
/** Downloads tick up slowly; a few minutes of staleness is invisible and saves a request. */
const CACHE_TTL_MS = 5 * 60 * 1000;

interface Cached {
  at: number;
  releases: RawRelease[];
}

function readCache(): RawRelease[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as Cached;
    if (!Array.isArray(cached.releases) || Date.now() - cached.at > CACHE_TTL_MS) return null;
    return cached.releases;
  } catch {
    return null;
  }
}

function writeCache(releases: RawRelease[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), releases } satisfies Cached));
  } catch {
    /* private mode — we simply refetch next time */
  }
}

/**
 * Live release data for FilterTube, straight from GitHub.
 *
 * Renders immediately from the snapshot baked in at build time (or a fresh
 * localStorage cache), then replaces it with live numbers once GitHub answers —
 * so the download count is on screen at first paint rather than after a spinner.
 *
 * `isLive` says whether the numbers on screen came from this visit's fetch.
 */
export const useFilterTubeRelease = () => {
  const [releases, setReleases] = useState<RawRelease[]>(
    () => readCache() ?? (bakedReleases as RawRelease[]),
  );
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(RELEASES_API, {
          headers: { Accept: "application/vnd.github+json" },
          signal: controller.signal,
        });
        // Unauthenticated GitHub allows 60 requests an hour per IP. If this visitor
        // is over it, the baked snapshot stays on screen rather than an error.
        if (!res.ok) return;
        const data = (await res.json()) as RawRelease[];
        if (!active || !Array.isArray(data) || data.length === 0) return;
        writeCache(data);
        setReleases(data);
        setIsLive(true);
      } catch {
        /* offline or blocked — keep whatever is already rendered */
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const summary: ReleaseSummary | null = releases.length > 0 ? shapeReleases(releases) : null;
  return { summary, isLive };
};
