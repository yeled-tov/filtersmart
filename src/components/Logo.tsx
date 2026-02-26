import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group" aria-label="FilterSmart – דף הבית">
    <img src={logoImg} alt="FilterSmart לוגו" className="w-10 h-10 rounded-lg object-cover" />
    <span className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
      FilterSmart
    </span>
  </Link>
);

export default Logo;
