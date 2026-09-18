import { ArrowDown } from "lucide-react";

const nf = new Intl.NumberFormat("he-IL");

type Props = {
  href: string;
  label?: string;
  className?: string;
  size?: "md" | "lg";
  /** Stretch the button to the full width of its container. */
  block?: boolean;
  /**
   * Real download count from GitHub's release assets. `null` while the first
   * fetch is still out, in which case the line is simply omitted rather than
   * showing a placeholder number.
   */
  downloads?: number | null;
  /** Version shown next to the count, e.g. "2.0.1". */
  version?: string | null;
};

const ApkDownloadButton = ({
  href,
  label = "הורדה ישירה APK",
  className = "",
  size = "md",
  block = false,
  downloads = null,
  version = null,
}: Props) => {
  const pad = size === "lg" ? "py-4 px-7 text-lg" : "py-4 px-6 text-base";
  const hasMeta = downloads !== null || Boolean(version);

  return (
    <div className={`${block ? "w-full" : "inline-flex flex-col items-start"} ${className}`}>
      <a
        href={href}
        download
        /* A full pill with a gradient fill, the way the app draws its primary button. */
        className={`group flex ${block ? "w-full" : ""} items-center justify-between gap-6 rounded-full bg-gradient-to-br from-[hsl(353_100%_62%)] to-[hsl(353_92%_54%)] ${pad} font-bold text-white shadow-lg shadow-[hsl(353_100%_59%/0.28)] transition-all hover:brightness-[1.06] active:scale-[0.985]`}
      >
        <span>{label}</span>
        <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
      </a>

      {hasMeta && (
        <div className={`mt-3 flex items-center gap-2 ${block ? "justify-center" : ""}`}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {/* Only the numerals get LTR isolation; isolating the whole line would
              reorder the Hebrew words around them. */}
          <span className="text-[0.6875rem] font-medium text-muted-foreground">
            {downloads !== null && (
              <>
                <span className="num">{nf.format(downloads)}</span> הורדות
              </>
            )}
            {downloads !== null && version && " · "}
            {version && (
              <>
                גרסה <span className="num">{version}</span>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default ApkDownloadButton;
