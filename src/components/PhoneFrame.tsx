/**
 * A device frame for the app's own screenshots.
 *
 * It stands straight and draws no notch: the status bar is already cropped out
 * of every screenshot, and anything painted over the top just hides the app's
 * own header. Screenshots live in /public/filterphone as <name>.jpg, with
 * <name>.webp and <name>-480.webp beside them; the browser picks the smallest
 * one that is sharp at the frame's size.
 */
interface Props {
  /** Basename in /public/filterphone, without extension — e.g. "welcome". */
  shot: string;
  alt: string;
  className?: string;
  /** The hero's first frame should not wait for lazy loading. */
  priority?: boolean;
  /** How wide the frame renders, for the browser to choose a source. */
  sizes?: string;
  /** Folder under /public. App screens live in filterphone/, install-guide screens in install/. */
  dir?: string;
}

const PhoneFrame = ({ shot, alt, className = "", priority = false, sizes = "240px", dir = "filterphone" }: Props) => {
  const base = `/${dir}/${shot}`;
  return (
    <div
      className={`aspect-[640/880] w-full max-w-[15rem] overflow-hidden rounded-[1.75rem] border-[6px] border-[hsl(205_48%_8%)] bg-[hsl(205_48%_8%)] shadow-float ${className}`}
    >
      <picture>
        <source type="image/webp" srcSet={`${base}-480.webp 480w, ${base}.webp 640w`} sizes={sizes} />
        <img
          src={`${base}.jpg`}
          alt={alt}
          width={640}
          height={880}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </picture>
    </div>
  );
};

export default PhoneFrame;
