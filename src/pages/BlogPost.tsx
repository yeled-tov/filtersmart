import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Calendar, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SITE, waLink } from "@/lib/site";

const estimateReadTime = (content: string) =>
  `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} דק׳ קריאה`;

const inline = (line: string) =>
  line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

/** Minimal Markdown-ish renderer for the post bodies stored in Supabase. */
const renderContent = (content: string) =>
  content.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
    if (line.startsWith("- ")) return <li key={i} dangerouslySetInnerHTML={{ __html: inline(line.slice(2)) }} />;
    if (/^\d+\.\s/.test(line))
      return <li key={i} dangerouslySetInnerHTML={{ __html: inline(line.replace(/^\d+\.\s*/, "")) }} />;
    if (line.startsWith("|") || line.trim() === "---") return null;
    if (line.trim() === "") return null;
    return <p key={i} dangerouslySetInnerHTML={{ __html: inline(line) }} />;
  });

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts, isLoading } = useBlogPosts();
  const { data: settings } = useSiteSettings();
  const post = posts?.find((p) => p.slug === slug);
  const wa = settings?.whatsapp_link || SITE.whatsapp;

  if (isLoading) {
    return (
      <div className="container-custom section-padding max-w-3xl">
        <Skeleton className="mb-4 h-4 w-40" />
        <Skeleton className="mb-8 h-10 w-3/4" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-custom section-padding text-center">
        {/* Served at 200, so it has to say noindex itself or Google files it
            as a soft 404 under the post's URL. */}
        <SEOHead
          title="המאמר לא נמצא | FilterPhone"
          description="המאמר המבוקש אינו קיים. אפשר לעבור לרשימת המדריכים המלאה."
          path={`/blog/${slug ?? ""}`}
          noindex
        />
        <h1 className="text-display-sm">המאמר לא נמצא</h1>
        <p className="mt-4 text-ink-soft">ייתכן שהכתובת השתנתה.</p>
        <Link to="/blog" className="mt-6 inline-block">
          <Button>לכל המדריכים</Button>
        </Link>
      </div>
    );
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    inLanguage: "he-IL",
    author: { "@id": `${SITE.url}/#business` },
    publisher: { "@id": `${SITE.url}/#business` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}` },
    image: `${SITE.url}/hero.jpg`,
  };

  return (
    <>
      <SEOHead
        title={`${post.title} | מדריכי FilterPhone`}
        description={post.excerpt || ""}
        path={`/blog/${post.slug}`}
        type="article"
        article={{
          publishedTime: post.created_at,
          modifiedTime: post.updated_at || post.created_at,
          author: SITE.name,
        }}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      </Helmet>
      <Breadcrumbs items={[{ label: "מדריכים", path: "/blog" }, { label: post.title }]} />

      <article className="section-padding">
        <div className="container-custom max-w-[44rem]">
          <AnimatedSection>
            <div className="flex flex-wrap items-center gap-4 text-[0.8125rem] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.created_at}>
                  {new Date(post.created_at).toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" })}
                </time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {estimateReadTime(post.content)}
              </span>
            </div>
            <h1 className="mt-4 text-display-lg">{post.title}</h1>
            {post.excerpt && (
              <p className="mt-5 border-r-2 border-primary/30 pr-4 text-[1.0625rem] leading-relaxed text-ink-soft">
                {post.excerpt}
              </p>
            )}
          </AnimatedSection>

          <div className="prose-fp mt-10">{renderContent(post.content)}</div>

          <aside className="mt-14 rounded-lg border border-border bg-surface-sunken p-7 text-center">
            <h2 className="text-display-sm">צריכים עזרה עם סינון?</h2>
            <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
              נשמח לעבור איתכם על המכשיר ועל מה שחשוב לכם לחסום, ולהמליץ בכנות.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={waLink("שלום פילטר פון, קראתי מאמר באתר ואשמח לייעוץ", wa)} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  דברו איתנו
                </Button>
              </a>
              <Link to="/#advisor">
                <Button variant="outline">ליועץ הסינון</Button>
              </Link>
            </div>
          </aside>

          <Link to="/blog" className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-primary link-underline">
            לכל המדריכים
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
