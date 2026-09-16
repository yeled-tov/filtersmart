import { CheckCircle2, Clock3, Download, FlaskConical, HardDrive, Tag } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import type { ReleaseSummary, ReleaseView } from "@/lib/filtertubeRelease";

const nf = new Intl.NumberFormat("he-IL");

const formatSize = (bytes: number | null) =>
  bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : "—";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });

/** "היום" / "לפני 3 ימים" / "לפני חודשיים" — a build nobody has touched in a year should look like one. */
function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "היום";
  if (days === 1) return "אתמול";
  if (days < 30) return `לפני ${days} ימים`;
  const months = Math.round(days / 30);
  if (months === 1) return "לפני חודש";
  if (months < 12) return `לפני ${months} חודשים`;
  const years = Math.round(months / 12);
  return years === 1 ? "לפני שנה" : `לפני ${years} שנים`;
}

/* ------------------------------------------------------------------ */

const Stat = ({
  icon: Icon, label, value, sub, pending, numeric = true,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  pending?: boolean;
  /** LTR isolation suits digits; a Hebrew phrase like "לפני 5 ימים" must stay RTL. */
  numeric?: boolean;
}) => (
  <div className="bg-surface p-5 md:p-6">
    <span className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </span>
    {pending ? (
      <span className="mt-2 block h-8 w-24 animate-pulse rounded bg-surface-sunken" aria-hidden="true" />
    ) : (
      <span className={`mt-2 block text-2xl font-extrabold leading-none text-white md:text-[1.75rem] ${numeric ? "num" : ""}`}>
        {value}
      </span>
    )}
    {sub && <span className="mt-1.5 block text-[0.8125rem] text-muted-foreground">{sub}</span>}
  </div>
);

/**
 * Renders the Hebrew release notes that GitHub Actions writes: `### חדש` /
 * `### תוקן` headings over `- **בולט** הסבר` bullets.
 *
 * Two things the source shape forces on us: a bullet's text wraps onto indented
 * continuation lines, which belong to the bullet above rather than being dropped;
 * and the notes end with an install section whose body is plain prose we skip, so
 * any heading left without content is removed rather than dangling.
 */
const inline = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-surface-sunken px-1 py-0.5 text-[0.85em]">$1</code>');

type Node =
  | { kind: "heading"; text: string }
  | { kind: "bullets"; items: string[] }
  | { kind: "quote"; text: string };

function parseNotes(markdown: string): Node[] {
  const nodes: Node[] = [];
  let bullets: string[] | null = null;

  const closeBullets = () => {
    if (bullets && bullets.length > 0) nodes.push({ kind: "bullets", items: bullets });
    bullets = null;
  };

  for (const raw of markdown.split("\n")) {
    const line = raw.trim();
    const indented = /^\s+\S/.test(raw);

    if (!line || line.startsWith("---")) {
      closeBullets();
      continue;
    }
    if (line.startsWith("### ")) {
      closeBullets();
      nodes.push({ kind: "heading", text: line.slice(4) });
      continue;
    }
    if (line.startsWith("## ") || /^\*\*בנייה/.test(line)) {
      // The release title and build line are already shown around this block.
      closeBullets();
      continue;
    }
    if (line.startsWith(">")) {
      closeBullets();
      nodes.push({ kind: "quote", text: line.replace(/^>\s*/, "") });
      continue;
    }
    if (line.startsWith("- ")) {
      if (!bullets) bullets = [];
      bullets.push(line.slice(2));
      continue;
    }
    if (indented && bullets && bullets.length > 0) {
      // Continuation of the bullet above.
      bullets[bullets.length - 1] += ` ${line}`;
      continue;
    }
    closeBullets();
  }
  closeBullets();

  // Drop a heading that ended up with nothing under it.
  return nodes.filter(
    (node, i) => node.kind !== "heading" || (nodes[i + 1] && nodes[i + 1].kind !== "heading"),
  );
}

const Notes = ({ markdown }: { markdown: string }) => {
  const nodes = parseNotes(markdown);

  if (nodes.length === 0) {
    return <p className="mt-2 text-[0.9375rem] text-ink-soft">שיפורים ותיקונים כלליים.</p>;
  }

  return (
    <div>
      {nodes.map((node, i) => {
        if (node.kind === "heading") {
          return (
            <h4 key={i} className="mt-6 text-[0.8125rem] font-bold text-primary first:mt-0">
              {node.text}
            </h4>
          );
        }
        if (node.kind === "quote") {
          return (
            <p key={i} className="mt-3 border-r-2 border-primary/40 pr-3 text-[0.875rem] text-muted-foreground">
              {node.text}
            </p>
          );
        }
        return (
          <ul key={i} className="mt-2.5 space-y-2">
            {node.items.map((item, j) => (
              <li key={j} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span dangerouslySetInnerHTML={{ __html: inline(item) }} />
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */

const BetaStrip = ({ beta }: { beta: ReleaseView }) => (
  <div className="mt-4 rounded-lg border border-accent/30 bg-accent/[0.07] p-5 md:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-[0.9375rem] font-bold text-accent">
        <FlaskConical className="h-[1.125rem] w-[1.125rem]" />
        ערוץ בדיקות · גרסה <span className="num">{beta.version}</span>
      </span>
      <span className="text-[0.8125rem] text-muted-foreground">
        יצאה {relativeDate(beta.publishedAt)}
      </span>
    </div>
    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
      גרסה מוקדמת שמיועדת לבדיקה בלבד, ומגיעה רק למכשירים שהפעילו ״ערוץ בדיקות״ בהגדרות
      האפליקציה. לשימוש רגיל עדיף להישאר על הגרסה היציבה.
    </p>
  </div>
);

/* ------------------------------------------------------------------ */

const ReleaseStatus = ({ summary, isLive }: { summary: ReleaseSummary | null; isLive: boolean }) => {
  const stable = summary?.stable ?? null;
  const pending = !summary;

  return (
    <section className="section-padding border-t border-border bg-surface-sunken" aria-label="מצב האפליקציה">
      <div className="container-custom">
        <AnimatedSection className="max-w-2xl">
          <span className="eyebrow">נתונים חיים</span>
          <h2 className="mt-4 text-display-md text-white">האפליקציה עכשיו</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
            המספרים כאן נמשכים ישירות מדף השחרורים של האפליקציה ב-GitHub, ומתעדכנים מעצמם עם כל
            גרסה חדשה. מספר ההורדות הוא הספירה האמיתית של הקובץ — לא לחיצות על הכפתור באתר.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.08} className="mt-10">
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon={Download}
              label="הורדות סך הכול"
              value={summary ? nf.format(summary.totalDownloads) : ""}
              sub={summary ? `לאורך ${nf.format(summary.releaseCount)} גרסאות` : undefined}
              pending={pending}
            />
            <Stat
              icon={Tag}
              label="גרסה יציבה"
              value={stable?.version ?? ""}
              sub={stable?.build ? `בנייה ${stable.build}` : undefined}
              pending={pending}
            />
            <Stat
              icon={Clock3}
              label="יצאה"
              numeric={false}
              value={stable ? relativeDate(stable.publishedAt) : ""}
              sub={stable ? formatDate(stable.publishedAt) : undefined}
              pending={pending}
            />
            <Stat
              icon={HardDrive}
              label="גודל ההורדה"
              value={stable ? formatSize(stable.sizeBytes) : ""}
              sub="אנדרואיד 7.0 ומעלה"
              pending={pending}
            />
          </div>
        </AnimatedSection>

        {stable && stable.notes && (
          <AnimatedSection delay={0.12} className="mt-4">
            <div className="rounded-lg border border-border bg-surface p-6 md:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-white">
                  מה חדש בגרסה <span className="num">{stable.version}</span>
                </h3>
                <a
                  href={stable.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.8125rem] font-semibold text-primary link-underline"
                >
                  כל הגרסאות הקודמות ←
                </a>
              </div>
              <Notes markdown={stable.notes} />
            </div>
          </AnimatedSection>
        )}

        {summary?.beta && (
          <AnimatedSection delay={0.16}>
            <BetaStrip beta={summary.beta} />
          </AnimatedSection>
        )}

        <p className="mt-5 flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
          <span className={`relative flex h-1.5 w-1.5 ${isLive ? "" : "opacity-50"}`}>
            {isLive && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          {isLive ? "מסונכרן עכשיו מ-GitHub" : "מוצג מנתוני הבנייה האחרונה, מתעדכן ברקע"}
        </p>
      </div>
    </section>
  );
};

export default ReleaseStatus;
