import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Download, ListChecks, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import { SITE, waLink } from "@/lib/site";
import { faqJsonLd, type FaqItem } from "@/lib/faq";
import { FILTERPHONE, WEB_EXTRAS, WEB_LEVELS } from "@/lib/filterphoneApp";
import landings from "@/data/landings.json";
import guide from "@/data/installGuide.json";

/**
 * One page per thing people search for: internet filtering, filtering a
 * Samsung, filtering a Xiaomi, a kosher smartphone. Each answers that one
 * question in full and links on to the page that does the work — the install
 * guide, the image-filtering page, a lab service.
 *
 * The text lives in src/data/landings.json, which the prerenderer reads as
 * well, so crawlers and AI assistants get the same words the page shows.
 * Every claim in it is one the site already made elsewhere and that was
 * checked against the app; these pages gather, they do not add.
 */

type Maker = "samsung" | "xiaomi" | "other";

interface Section {
  h2: string;
  p?: string[];
  list?: string[];
  block?: "webLevels" | "installSteps";
}

interface Page {
  slug: string;
  crumb: string;
  maker?: Maker;
  title: string;
  description: string;
  keywords: string;
  eyebrow: string;
  h1: string;
  lead: string;
  sections: Section[];
  faqs: FaqItem[];
  related: { href: string; text: string }[];
}

const PAGES = (landings as unknown as { pages: Page[] }).pages;

interface GuideStep { id: string; makers?: Maker[]; title: string }
const GUIDE_STEPS = (guide as unknown as { steps: GuideStep[] }).steps;

/** `**bold**` and `[text](/path)` — the only markup the page text uses. */
const rich = (text: string): ReactNode =>
  text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith("**")) {
      return (
        <strong key={i} className="font-bold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <Link key={i} to={link[2]} className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
          {link[1]}
        </Link>
      );
    }
    return part;
  });

const WebLevelsBlock = () => (
  <>
    <ol className="mt-6 grid gap-3 sm:grid-cols-2">
      {WEB_LEVELS.map((lvl, i) => (
        <li key={lvl.name} className="panel p-5">
          {/* How open: one bar per level, filled up to this one */}
          <div className="flex gap-1" role="img" aria-label={`רמת פתיחות ${i + 1} מתוך ${WEB_LEVELS.length}`}>
            {WEB_LEVELS.map((_, j) => (
              <span key={j} className={`h-1.5 flex-1 rounded-full ${j <= i ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
          <h3 className="mt-4 text-lg font-bold text-ink">{lvl.name}</h3>
          <p className="mt-1 text-[0.875rem] font-semibold text-primary">{lvl.short}</p>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">{lvl.desc}</p>
        </li>
      ))}
    </ol>
    <div className="mt-4 rounded-lg border border-border bg-surface p-5">
      <h3 className="text-[0.9375rem] font-bold text-ink">תוספות לכל לקוח</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {WEB_EXTRAS.map((x) => (
          <li key={x} className="rounded-sm border border-border bg-surface-sunken px-3 py-1 text-[0.8125rem] font-medium text-ink-soft">
            {x}
          </li>
        ))}
      </ul>
    </div>
  </>
);

const InstallStepsBlock = ({ maker }: { maker: Maker }) => {
  const steps = GUIDE_STEPS.filter((s) => !s.makers || s.makers.includes(maker));
  return (
    <>
      <ol className="mt-6 grid gap-2 sm:grid-cols-2">
        {steps.map((s, i) => (
          <li key={s.id}>
            <Link
              to={`/install#${maker}-${s.id}`}
              className="flex h-full items-center gap-3 rounded-lg border border-border bg-surface p-3.5 transition-colors hover:border-primary/50"
            >
              <span className="num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[0.8125rem] font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span className="text-[0.9375rem] font-semibold leading-snug text-ink">{s.title}</span>
            </Link>
          </li>
        ))}
      </ol>
      <Link to={`/install#${maker}`} className="mt-5 inline-block">
        <Button size="lg" className="gap-2">
          <ListChecks className="h-4 w-4" />
          למדריך המלא, עם סרטונים
        </Button>
      </Link>
    </>
  );
};

const Landing = ({ slug }: { slug: string }) => {
  const page = PAGES.find((p) => p.slug === slug)!;
  const path = `/${page.slug}`;
  const installHref = page.maker ? `/install#${page.maker}` : "/install";

  return (
    <>
      <SEOHead
        title={page.title}
        description={page.description}
        path={path}
        keywords={page.keywords}
        image={`${SITE.url}/og-home.jpg`}
        imageAlt={page.h1}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd(page.faqs))}</script>
      </Helmet>

      <Breadcrumbs items={[{ label: page.crumb }]} />

      {/* ------------------------------------------------------------ Hero */}
      <section className="border-b border-border" aria-label={page.h1}>
        <div className="container-custom max-w-4xl py-12 md:py-16">
          <AnimatedSection>
            <span className="eyebrow">{page.eyebrow}</span>
            <h1 className="mt-4 text-display-lg text-ink">{page.h1}</h1>
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">{page.lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={FILTERPHONE.apk} rel="noopener">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  <Download className="h-4 w-4" />
                  הורדת FilterPhone
                </Button>
              </a>
              <Link to={installHref}>
                <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                  <ListChecks className="h-4 w-4" />
                  מדריך התקנה
                </Button>
              </Link>
              <a href={waLink(`שלום, אשמח לפרטים על ${page.crumb}`)} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="whatsapp" className="w-full gap-2 sm:w-auto">
                  <MessageCircle className="h-4 w-4" />
                  שאלה בוואטסאפ
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* -------------------------------------------------------- Sections */}
      <div className="container-custom max-w-4xl space-y-14 py-12 md:space-y-16 md:py-16">
        {page.sections.map((s) => (
          <section key={s.h2} aria-label={s.h2}>
            <AnimatedSection>
              <h2 className="text-display-sm text-ink">{s.h2}</h2>
              {s.p?.map((para) => (
                <p key={para} className="mt-4 text-[1.0625rem] leading-[1.85] text-ink-soft">
                  {rich(para)}
                </p>
              ))}
              {s.list && (
                <ul className="mt-5 space-y-3">
                  {s.list.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[1.0625rem] leading-[1.75] text-ink-soft">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                      <span>{rich(item)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.block === "webLevels" && <WebLevelsBlock />}
              {s.block === "installSteps" && page.maker && <InstallStepsBlock maker={page.maker} />}
            </AnimatedSection>
          </section>
        ))}

        {/* ------------------------------------------------------------ FAQ */}
        <section aria-labelledby="landing-faq">
          <h2 id="landing-faq" className="text-display-sm text-ink">שאלות נפוצות</h2>
          <Accordion type="single" collapsible className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {page.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`landing-faq-${i}`} className="border-0 px-5 md:px-6">
                <AccordionTrigger className="py-[1.125rem] text-right text-[1rem] font-bold text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[0.9375rem] leading-relaxed text-ink-soft">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* -------------------------------------------------------- Related */}
        <nav aria-labelledby="landing-related">
          <h2 id="landing-related" className="text-lg font-bold text-ink">להמשך קריאה</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {page.related.map((r) => (
              <li key={r.href}>
                <Link to={r.href} className="group flex h-full items-center justify-between gap-3 panel panel-hover p-4">
                  <span className="text-[0.9375rem] font-semibold text-ink group-hover:text-primary">{r.text}</span>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:-translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Landing;
