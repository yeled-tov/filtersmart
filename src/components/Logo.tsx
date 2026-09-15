import { Link } from "react-router-dom";

interface LogoProps {
  /** Renders the wordmark in white, for use on the ink-coloured bands. */
  inverse?: boolean;
  className?: string;
}

const Logo = ({ inverse = false, className = "" }: LogoProps) => (
  <Link
    to="/"
    className={`group flex items-center gap-3 ${className}`}
    aria-label="FilterPhone – לדף הבית"
  >
    <img
      src="/logo.png"
      alt=""
      width={40}
      height={40}
      loading="eager"
      decoding="async"
      className="h-10 w-10 rounded-lg object-contain"
    />
    <span className="flex flex-col leading-none">
      <span
        className={`text-[1.0625rem] font-extrabold tracking-tight ${
          inverse ? "text-white" : "text-ink group-hover:text-primary"
        } transition-colors`}
      >
        FilterPhone
      </span>
      <span
        className={`mt-1 text-[0.6875rem] font-medium ${
          inverse ? "text-white/55" : "text-muted-foreground"
        }`}
      >
        פילטר פון · סינון טלפונים
      </span>
    </span>
  </Link>
);

export default Logo;
