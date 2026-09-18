import { CheckCircle2, Clock3, Download, FlaskConical, HardDrive, Tag } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import type { ChannelRelease, ReleasePayload } from "@/lib/filtertubeRelease";

const nf = new Intl.NumberFormat("he-IL");

/** How many changes to show before folding the rest away. */
const VISIBLE_CHANGES = 8;

const formatSize = (bytes: number | null) =>
  bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : "—";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });

/** "היום" / "לפני 3 ימים" — a build nobody has touched in a year should look like one. */
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
      <span className={`mt-2 block text-2xl font-extrabold leading-none text-ink md:text-[1.75rem] ${numeric ? "num" : ""}`}>
        {value}
      </span>
    )}
    {sub && <span className="mt-1.5 block text-[0.8125rem] text-muted-foreground">{sub}</span>}
  </div>
);

const Change = ({ text }: { text: string }) => (
  <li className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
    <span>{text}</span>
  </li>
);

/**
 * The changes are written for the customer — the app's CI takes them from its
 * CHANGELOG rather than from commit subjects — so they are shown as-is. Nothing
 * developer-facing reaches this component to be filtered out.
 */
const Changes = ({ items }: { items: string[] }) => {
  const shown = items.slice(0, VISIBLE_CHANGES);
  const rest = items.slice(VISIBLE_CHANGES);

  return (
    <>
      <ul className="mt-4 space-y-2.5">
        {shown.map((c) => <Change key={c} text={c} />)}
      </ul>

      {rest.length > 0 && (
        <details className="group mt-3">
          <summary className="cursor-pointer list-none text-[0.875rem] font-semibold text-primary marker:hidden">
            <span className="group-open:hidden">
              ועוד {nf.format(rest.length)} שינויים בגרסה הזו ←
            </span>
            <span className="hidden group-open:inline">הצגה מקוצרת ←</span>
          </summary>
          <ul className="mt-2.5 space-y-2.5">
            {rest.map((c) => <Change key={c} text={c} />)}
          </ul>
        </details>
      )}
    </>
  );
};

const BetaStrip = ({ beta }: { beta: ChannelRelease }) => (
  <div className="mt-4 rounded-lg border border-accent/30 bg-accent/[0.07] p-5 md:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-[0.9375rem] font-bold text-accent">
        <FlaskConical className="h-[1.125rem] w-[1.125rem]" />
        ערוץ בדיקות · גרסה <span className="num">{beta.versionName}</span>
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

const ReleaseStatus = ({ payload, isLive }: { payload: ReleasePayload | null; isLive: boolean }) => {
  const stable = payload?.stable ?? null;
  const pending = !payload;

  return (
    <section className="section-padding border-t border-border bg-surface-sunken" aria-label="מצב האפליקציה">
      <div className="container-custom">
        <AnimatedSection className="max-w-2xl">
          <span className="eyebrow">נתונים חיים</span>
          <h2 className="mt-4 text-display-md text-ink">האפליקציה עכשיו</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
            המספרים כאן מתעדכנים מעצמם עם כל גרסה שיוצאת. מספר ההורדות הוא הספירה האמיתית של
            קובץ ההתקנה — לא לחיצות על הכפתור באתר.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.08} className="mt-10">
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon={Download}
              label="הורדות סך הכול"
              value={payload ? nf.format(payload.totalDownloads) : ""}
              sub={payload?.releaseCount ? `לאורך ${nf.format(payload.releaseCount)} גרסאות` : undefined}
              pending={pending}
            />
            <Stat
              icon={Tag}
              label="גרסה נוכחית"
              value={stable?.versionName ?? ""}
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

        {stable && stable.changes.length > 0 && (
          <AnimatedSection delay={0.12} className="mt-4">
            <div className="rounded-lg border border-border bg-surface p-6 md:p-7">
              <h3 className="text-lg font-bold text-ink">
                מה חדש בגרסה <span className="num">{stable.versionName}</span>
              </h3>
              <Changes items={stable.changes} />
            </div>
          </AnimatedSection>
        )}

        {payload?.test && payload.test.build > (stable?.build ?? 0) && (
          <AnimatedSection delay={0.16}>
            <BetaStrip beta={payload.test} />
          </AnimatedSection>
        )}

        <p className="mt-5 flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
          <span className={`relative flex h-1.5 w-1.5 ${isLive ? "" : "opacity-50"}`}>
            {isLive && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          {isLive ? "מסונכרן עכשיו" : "מוצג מנתוני הבנייה האחרונה, מתעדכן ברקע"}
        </p>
      </div>
    </section>
  );
};

export default ReleaseStatus;
