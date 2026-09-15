import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.warn("404: route not found:", pathname);
  }, [pathname]);

  return (
    <>
      <Helmet>
        <title>הדף לא נמצא | FilterPhone</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="flex min-h-[70vh] items-center justify-center bg-surface-sunken px-5 py-20">
        <div className="text-center">
          <span className="num text-[0.8125rem] font-bold tracking-widest text-accent">404</span>
          <h1 className="mt-3 text-display-md">הדף הזה לא קיים</h1>
          <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
            ייתכן שהכתובת השתנתה. אפשר לחזור לדף הבית, לעבור על השירותים או פשוט להרים טלפון.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/"><Button>לדף הבית</Button></Link>
            <Link to="/services"><Button variant="outline">לכל השירותים</Button></Link>
            <Link to="/contact"><Button variant="outline">צור קשר</Button></Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
