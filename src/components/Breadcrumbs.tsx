import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft } from "lucide-react";
import { SITE } from "@/lib/site";

const routeLabels: Record<string, string> = {
  about: "אודות",
  services: "שירותים",
  pricing: "מחירון",
  compare: "השוואת מערכות סינון",
  filtertube: "FilterTube",
  blog: "מדריכים",
  contact: "צור קשר",
  privacy: "מדיניות פרטיות",
  "refund-policy": "מדיניות ביטולים",
};

interface BreadcrumbsProps {
  items?: { label: string; path?: string }[];
}

/**
 * Renders the visible trail and is the single emitter of BreadcrumbList
 * structured data — pages must not declare their own.
 */
const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs =
    items ||
    segments.map((seg, i) => ({
      label: routeLabels[seg] || decodeURIComponent(seg),
      path: i < segments.length - 1 ? `/${segments.slice(0, i + 1).join("/")}` : undefined,
    }));

  const allCrumbs = [{ label: "בית", path: "/" }, ...crumbs];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allCrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.path ? { item: `${SITE.url}${c.path === "/" ? "/" : c.path}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="פירורי לחם" className="border-b border-border bg-surface-sunken">
        <ol className="container-custom flex flex-wrap items-center gap-1 py-3 text-[0.8125rem] text-muted-foreground">
          {allCrumbs.map((c, i) => (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronLeft className="h-3.5 w-3.5 text-border-strong" aria-hidden="true" />}
              {c.path ? (
                <Link to={c.path} className="transition-colors hover:text-primary">
                  {c.label}
                </Link>
              ) : (
                <span className="font-semibold text-ink">{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
