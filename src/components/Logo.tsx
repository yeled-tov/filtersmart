import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group" aria-label="SmartFilter – דף הבית">
    <div className="relative flex items-center justify-center w-10 h-10 rounded-lg gradient-primary">
      <Shield className="w-6 h-6 text-primary-foreground" />
    </div>
    <span className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
      SmartFilter
    </span>
  </Link>
);

export default Logo;
