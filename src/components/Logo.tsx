import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group" aria-label="FilterPhone – דף הבית">
    <div className="relative">
      <img
        src="/logo.svg"
        alt="FilterPhone לוגו"
        className="w-9 h-9 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
        width={36}
        height={36}
        loading="eager"
      />
      <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-heading font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
        FilterPhone
      </span>
      <span className="text-[10px] text-muted-foreground leading-tight hidden sm:block">סינון טלפונים מקצועי</span>
    </div>
  </Link>
);

export default Logo;
