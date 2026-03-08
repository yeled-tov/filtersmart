import { useParams, Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const estimateReadTime = (content: string) => {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} דק׳ קריאה`;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts, isLoading } = useBlogPosts();
  const { data: settings } = useSiteSettings();
  const post = posts?.find((p) => p.slug === slug);

  const waLink = settings?.whatsapp_link || "https://wa.me/972527186881";

  if (isLoading) {
    return (
      <div className="section-padding container-custom max-w-3xl">
        <Skeleton className="h-4 w-24 mb-6" />
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="section-padding container-custom text-center">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-4">מאמר לא נמצא</h1>
        <Link to="/blog" className="text-primary hover:underline">חזרה לבלוג</Link>
      </div>
    );
  }

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-heading font-semibold text-foreground mt-6 mb-3">{line.slice(4)}</h3>;
      if (line.startsWith("- **")) {
        const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
        if (match) return <li key={i} className="flex items-start gap-2 mb-2 text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /><span><strong className="text-card-foreground">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}</span></li>;
      }
      if (line.startsWith("- ")) return <li key={i} className="flex items-start gap-2 mb-2 text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" /><span>{line.slice(2)}</span></li>;
      if (line.match(/^\d+\. /)) return <li key={i} className="flex items-start gap-2 mb-2 text-muted-foreground"><span className="text-primary font-semibold">{line.match(/^(\d+)/)?.[1]}.</span><span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s*/, "").replace(/\*\*(.+?)\*\*/g, "<strong class='text-card-foreground'>$1</strong>") }} /></li>;
      if (line.startsWith("|")) return null;
      if (line.trim() === "") return <div key={i} className="h-2" />;
      const html = line.replace(/\*\*(.+?)\*\*/g, "<strong class='text-card-foreground'>$1</strong>");
      return <p key={i} className="text-muted-foreground leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  return (
    <>
      <SEOHead title={`${post.title} | בלוג SmartFilter`} description={post.excerpt || ""} path={`/blog/${post.slug}`} />
      <Breadcrumbs
        items={[
          { label: "בלוג", path: "/blog" },
          { label: post.title },
        ]}
      />
      <article className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {estimateReadTime(post.content)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-8">{post.title}</h1>
          <div className="prose-custom">{renderContent(post.content)}</div>
          <div className="mt-12 bg-card rounded-xl p-6 md:p-8 card-shadow text-center">
            <h2 className="text-xl font-heading font-semibold text-card-foreground mb-3">צריכים עזרה עם סינון?</h2>
            <p className="text-muted-foreground mb-4">צרו קשר עם SmartFilter ונתאים לכם את הפתרון המושלם</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-primary text-primary-foreground font-medium">
              דברו איתנו ב-WhatsApp
            </a>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
