import generalLand from "@/assets/videos/install_general.mp4.asset.json";
import generalPort from "@/assets/videos/install_general_vertical.mp4.asset.json";
import samsungLand from "@/assets/videos/install_samsung.mp4.asset.json";
import samsungPort from "@/assets/videos/install_samsung_vertical.mp4.asset.json";
import xiaomiLand from "@/assets/videos/install_xiaomi.mp4.asset.json";
import xiaomiPort from "@/assets/videos/install_xiaomi_vertical.mp4.asset.json";

/**
 * The install videos, cut into the part that belongs to each step of the guide.
 *
 * There are three videos (general, Samsung, Xiaomi), each in a landscape and a
 * portrait cut. The cuts do not share an order or even a stage count — the
 * Samsung landscape cut has six stages, its portrait cut five, in a different
 * order — so the guide never plays a video from the top. Each step plays its
 * own [start, end] range, and the page keeps one consistent order of its own.
 *
 * Times are seconds, measured from the files. If a video is re-rendered, the
 * ranges here have to be measured again.
 */

export type Maker = "samsung" | "xiaomi" | "other";
export type Cut = "land" | "port";

/** Asset URLs are relative to Lovable hosting; the Vercel-hosted domain can't serve them. */
const ASSET_ORIGIN = "https://filtersmart.lovable.app";
const cdn = (u: string) => (u.startsWith("/") ? ASSET_ORIGIN + u : u);

interface Source {
  url: string;
  uploaded: string;
  duration: number;
}

const src = (asset: { url: string; created_at: string }, duration: number): Source => ({
  url: cdn(asset.url),
  uploaded: asset.created_at,
  duration,
});

export const VIDEO_FILES: Record<Maker, Record<Cut, Source>> = {
  samsung: { land: src(samsungLand, 108.5), port: src(samsungPort, 76.5) },
  xiaomi: { land: src(xiaomiLand, 85.3), port: src(xiaomiPort, 74.2) },
  other: { land: src(generalLand, 105.1), port: src(generalPort, 77.3) },
};

type Range = [start: number, end: number];
type ClipCuts = Partial<Record<Cut, Range>>;

const CLIPS: Record<Maker, Record<string, ClipCuts>> = {
  samsung: {
    autoblocker: { land: [5.75, 19.0], port: [36.25, 44.5] },
    playprotect: { land: [19.5, 40.75], port: [18.5, 35.75] },
    download: { land: [41.0, 54.5], port: [5.25, 18.25] },
    install: { land: [55.0, 72.75], port: [44.75, 62.0] },
    register: { land: [82.25, 87.0] },
    devoptions: { land: [87.0, 102.2] },
    restore: { land: [73.0, 81.75], port: [62.25, 70.5] },
  },
  xiaomi: {
    playprotect: { land: [5.5, 20.5], port: [4.75, 17.75] },
    download: { land: [21.0, 33.5], port: [18.25, 29.25] },
    install: { land: [33.75, 49.0], port: [29.5, 42.75] },
    devoptions: { land: [55.25, 63.0], port: [48.25, 55.0] },
    xiaomisec: { land: [63.0, 74.0], port: [55.0, 64.25] },
    finish: { land: [74.25, 81.0], port: [64.75, 70.5] },
    restore: { land: [49.25, 55.0], port: [43.0, 47.75] },
  },
  other: {
    download: { land: [7.75, 27.0], port: [7.6, 21.4] },
    playprotect: { land: [27.5, 49.75], port: [21.6, 38.15] },
    install: { land: [50.25, 83.25], port: [38.35, 63.15] },
    register: { land: [91.5, 98.0] },
    restore: { land: [83.75, 91.0], port: [63.35, 69.4] },
  },
};

/** The Xiaomi videos never open the app; the registration screen is the same on every phone. */
const BORROWED: Partial<Record<Maker, Record<string, Maker>>> = {
  xiaomi: { register: "other" },
};

export interface Clip {
  url: string;
  start: number;
  end: number;
  poster: string;
  /** A landscape cut shown on a phone: crop to the handset drawn in the frame. */
  cropToPhone: boolean;
  /** The shape the player takes. */
  shape: Cut;
}

/**
 * The clip for a step, for the screen it will be watched on. Phones get the
 * portrait cut and desktops the landscape one; where only one exists, the other
 * screen borrows it — a landscape cut on a phone is cropped to the handset.
 */
export function clipFor(maker: Maker, step: string, phone: boolean): Clip | null {
  const from = BORROWED[maker]?.[step] ?? maker;
  const cuts = CLIPS[from]?.[step];
  if (!cuts) return null;
  const want: Cut = phone ? "port" : "land";
  const cut: Cut = cuts[want] ? want : want === "port" ? "land" : "port";
  const range = cuts[cut];
  if (!range) return null;
  const cropToPhone = phone && cut === "land";
  const suffix = cut === "port" ? "p" : cropToPhone ? "lp" : "l";
  return {
    url: VIDEO_FILES[from][cut].url,
    start: range[0],
    end: range[1],
    poster: `/install/clips/${from}-${step}-${suffix}.webp`,
    cropToPhone,
    shape: cut === "port" || cropToPhone ? "port" : "land",
  };
}

/** How long a step's clip runs, rounded for a label. */
export const clipSeconds = (c: Clip) => Math.round(c.end - c.start);
