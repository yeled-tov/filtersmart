import { ArrowDown } from "lucide-react";
import { useAppDownloads } from "@/hooks/useAppDownloads";

const formatCount = (n: number) => new Intl.NumberFormat("he-IL").format(n);

type Props = {
  href: string;
  label?: string;
  className?: string;
  size?: "md" | "lg";
  /** Stretch the button to the full width of its container (editorial hero style) */
  block?: boolean;
};

/**
 * APK download CTA with a live, shared download counter.
 * The counter increments on the server for every click from the site.
 */
const ApkDownloadButton = ({
  href,
  label = "הורדה ישירה APK",
  className = "",
  size = "md",
  block = false,
}: Props) => {
  const { count, registerDownload } = useAppDownloads("filtertube");

  const pad = size === "lg" ? "py-4 px-7 text-lg" : "py-4 px-6 text-base";

  return (
    <div className={`${block ? "w-full" : "inline-flex flex-col items-start"} ${className}`}>
      <a
        href={href}
        download
        onClick={() => { void registerDownload(); }}
        className={`group flex ${block ? "w-full" : ""} items-center justify-between gap-6 rounded-xl bg-[#E31E24] ${pad} font-bold text-white shadow-2xl shadow-red-900/30 transition-all hover:bg-[#ff2a31] active:scale-[0.985]`}
      >
        <span>{label}</span>
        <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
      </a>
      <div className={`mt-3 flex items-center gap-2 ${block ? "justify-center" : ""}`} aria-live="polite">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[11px] font-medium text-white/45">
          {count === null ? "טוען מספר הורדות…" : `${formatCount(count)} הורדות עד כה`}
        </span>
      </div>
    </div>
  );
};

export default ApkDownloadButton;
