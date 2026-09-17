import { useEffect, useState } from "react";
import baked from "@/data/filtertube-release.json";
import { parsePayload, RELEASES_URL, type ReleasePayload } from "@/lib/filtertubeRelease";

const CACHE_KEY = "fp_filtertube_release_v2";
/** Downloads tick up slowly; a couple of minutes of staleness is invisible. */
const CACHE_TTL_MS = 2 * 60 * 1000;

function readCache(): ReleasePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, payload } = JSON.parse(raw) as { at: number; payload: unknown };
    if (Date.now() - at > CACHE_TTL_MS) return null;
    return parsePayload(payload);
  } catch {
    return null;
  }
}

function writeCache(payload: ReleasePayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), payload }));
  } catch {
    /* private mode — we simply refetch next time */
  }
}

/**
 * Live release data for FilterTube.
 *
 * Renders immediately from the snapshot baked in at build time (or a fresh
 * cache), then replaces it with the mirror's current numbers — so the download
 * count is on screen at first paint rather than after a spinner.
 *
 * `isLive` says whether what is on screen came from this visit's fetch.
 */
export const useFilterTubeRelease = () => {
  const [payload, setPayload] = useState<ReleasePayload | null>(
    () => readCache() ?? parsePayload(baked),
  );
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(RELEASES_URL, { signal: controller.signal });
        if (!res.ok) return;
        const fresh = parsePayload(await res.json());
        if (!active || !fresh) return;
        writeCache(fresh);
        setPayload(fresh);
        setIsLive(true);
      } catch {
        /* offline, or the mirror is mid-deploy — keep what is already rendered */
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { payload, isLive };
};
