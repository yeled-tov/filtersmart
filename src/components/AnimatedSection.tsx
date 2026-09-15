import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Restrained reveal: 12px rise + fade, once. Motion here is meant to be felt,
 * not watched.
 *
 * Content must never depend on the animation to become visible. If the browser
 * has no IntersectionObserver, or the visitor prefers reduced motion, the
 * children render immediately at full opacity.
 */
const AnimatedSection = ({ children, className = "", delay = 0 }: Props) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [canObserve, setCanObserve] = useState(true);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") setCanObserve(false);
  }, []);

  const animate = !reduceMotion && canObserve;
  const visible = !animate || inView;

  return (
    <motion.div
      ref={ref}
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
