import { Download } from "lucide-react";
import { useAppDownloads } from "@/hooks/useAppDownloads";

const formatCount = (n: number) => new Intl.NumberFormat("he-IL").format(n);

type Props = {
  href: string;
  label?: string;
  className?: string;
  size?: "md" | "lg";
};

/**
 * APK download CTA with a live, shared download counter.
 * The counter increments on the server for every click from the site.
 */
const ApkDownloadButton = ({ href, label = "הורד APK · חינם", className = "", size = "md" }: Props) => {
  const { count, registerDownload } = useAppDownloads("filtertube");

  const pad = size === "lg" ? "px-8 py-4" : "px-6 py-3.5";

  return (
    <div className={`inline-flex flex-col items-start gap-2 ${className}`}>
      <a
        href={href}
        download
        onClick={() => { void registerDownload(); }}
        className={`group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 ${pad} text-sm font-bold text-white shadow-[0_10px_40px_-10px_rgba(239,68,68,0.7)] transition hover:brightness-110 hover:shadow-[0_15px_50px_-10px_rgba(239,68,68,0.9)]`}
      >
        <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        {label}
      </a>
      <span className="flex items-center gap-1.5 ps-1 text-[11px] font-medium text-white/55" aria-live="polite">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        {count === null ? "טוען מספר הורדות…" : `${formatCount(count)} הורדות עד כה`}
      </span>
    </div>
  );
};

export default ApkDownloadButton;
