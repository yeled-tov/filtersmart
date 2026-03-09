import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group" aria-label="FilterPhone – דף הבית">
    <motion.img
      src={logoImg}
      alt="FilterPhone לוגו"
      className="w-10 h-10 rounded-lg object-cover"
      style={{ filter: "drop-shadow(0 0 8px hsl(212 72% 42% / 0.4))" }}
      whileHover={{ rotateY: 15, rotateX: -5, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
    <span className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
      FilterPhone
    </span>
  </Link>
);

export default Logo;