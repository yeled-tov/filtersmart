import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, Pause, Play, RotateCcw } from "lucide-react";
import type { Clip } from "@/lib/installVideos";

/**
 * Plays one step's part of an install video — its [start, end] range — and
 * stops there, so a step never runs on into the next one.
 *
 * Nothing is fetched until play is pressed (`preload="none"`), which matters
 * because the guide keeps every step in the page at once.
 *
 * Full screen is taken by the wrapper, not the <video>, so the crop that turns
 * a landscape cut into a handset-shaped one survives it. Where the browser
 * can't put an arbitrary element in full screen (iPhone), the video itself
 * goes, with the system's own controls.
 */
interface Props {
  clip: Clip;
  /** What the clip shows, for screen readers. */
  label: string;
  /** Start playing as soon as the player appears — it was opened by a tap on "play". */
  autoPlay?: boolean;
}

type FsVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

const StepVideo = ({ clip, label, autoPlay = false }: Props) => {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<FsVideo>(null);
  const last = useRef(clip.start);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [touched, setTouched] = useState(false);
  const [progress, setProgress] = useState(0);
  const [full, setFull] = useState(false);

  const play = () => {
    const v = video.current;
    if (!v) return;
    setTouched(true);
    if (ended || v.currentTime < clip.start - 0.5 || v.currentTime >= clip.end - 0.1) {
      v.currentTime = clip.start;
      last.current = clip.start;
    }
    setEnded(false);
    v.play().catch(() => {
      /* blocked or interrupted — the play button stays up */
    });
  };

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) play();
    else v.pause();
  };

  useEffect(() => {
    if (autoPlay) play();
    // Runs once, for a player opened by a tap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const on = () => setFull(document.fullscreenElement === wrap.current);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  const onTime = () => {
    const v = video.current;
    if (!v) return;
    const t = v.currentTime;
    // Stop only when playback crosses the end; someone who seeks past it on purpose is left alone.
    if (last.current < clip.end && t >= clip.end - 0.3) {
      v.pause();
      setEnded(true);
      setProgress(1);
    } else {
      setProgress(Math.min(1, Math.max(0, (t - clip.start) / (clip.end - clip.start))));
    }
    last.current = t;
  };

  const fullscreen = () => {
    const w = wrap.current;
    const v = video.current;
    if (!w || !v) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }
    if (w.requestFullscreen) {
      w.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
      if (v.paused) play();
    } else {
      if (v.paused) play();
      v.webkitEnterFullscreen?.();
    }
  };

  const tall = clip.shape === "port";
  // A cropped landscape cut shows the handset only, which is close to 1:2.
  const ratio = clip.cropToPhone ? "aspect-[1/2]" : tall ? "aspect-[9/16]" : "aspect-video";

  return (
    <div
      ref={wrap}
      className={full ? "flex h-full w-full items-center justify-center bg-black" : tall ? "mx-auto w-full max-w-[16rem]" : "w-full"}
    >
      <div
        className={`relative overflow-hidden bg-[hsl(205_48%_8%)] ${ratio} ${
          full ? "h-full max-h-full w-auto max-w-full" : "w-full rounded-lg border border-border shadow-sm"
        }`}
      >
        <video
          ref={video}
          className={`h-full w-full ${clip.cropToPhone ? "object-cover" : "object-contain"}`}
          style={clip.cropToPhone ? { objectPosition: "21% 50%" } : undefined}
          src={`${clip.url}#t=${clip.start},${clip.end}`}
          poster={clip.poster}
          preload="none"
          playsInline
          aria-label={label}
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={onTime}
        />

        {!playing && (
          <button
            type="button"
            onClick={play}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35 text-white transition-colors hover:bg-black/45"
            aria-label={ended ? `לראות שוב: ${label}` : `הפעלת הסרטון: ${label}`}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-float">
              {ended ? <RotateCcw className="h-7 w-7" /> : <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />}
            </span>
            <span className="rounded-full bg-black/55 px-3 py-1 text-[0.8125rem] font-bold">
              {ended ? "לראות שוב" : touched ? "להמשיך" : "לחצו לצפייה"}
            </span>
          </button>
        )}

        {/* Bottom bar: progress, pause, full screen */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6" dir="ltr">
          {playing && (
            <button
              type="button"
              onClick={toggle}
              className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-ink"
              aria-label="השהיה"
            >
              <Pause className="h-4 w-4" fill="currentColor" />
            </button>
          )}
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/30" aria-hidden="true">
            <div className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
          </div>
          <button
            type="button"
            onClick={fullscreen}
            className="pointer-events-auto flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white/90 px-3 text-[0.75rem] font-bold text-ink"
            dir="rtl"
          >
            {full ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            {full ? "יציאה" : "מסך מלא"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepVideo;
