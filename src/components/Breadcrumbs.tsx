import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const routeLabels: Record<string, string> = {
  "": "בית",
  about: "אודות",
  services: "שירותים",
  blog: "בלוג",
  contact: "צור קשר",
  privacy: "מדיניות פרטיות",
  "refund-policy": "מדיניות החזרים",
};

interface BreadcrumbsProps {
  items?: { label: string; path?: string }[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const crumbs = items || segments.map((seg, i) => ({
    label: routeLabels[seg] || decodeURIComponent(seg),
    path: i < segments.length - 1 ? "/" + segments.slice(0, i + 1).join("/") : undefined,
  }));

  const allCrumbs = [{ label: "בית", path: "/" }, ...crumbs];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allCrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.path ? { item: `https://smartfilter.co.il${c.path}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="breadcrumb" className="container-custom pt-4 pb-2">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {allCrumbs.map((c, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-border">/</span>}
              {c.path ? (
                <Link to={c.path} className="hover:text-primary transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
