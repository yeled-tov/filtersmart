import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets the scroll position on navigation — unless the target carries a hash
 * (e.g. `/#advisor`), in which case we scroll that element into view instead.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // The target may not be mounted yet on a cross-page jump.
      const id = hash.slice(1);
      const scroll = () => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        return Boolean(el);
      };
      if (!scroll()) {
        const timer = window.setTimeout(scroll, 150);
        return () => window.clearTimeout(timer);
      }
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
