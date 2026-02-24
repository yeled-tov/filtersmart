import { useParams, Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/blog";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="section-padding container-custom text-center">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-4">מאמר לא נמצא</h1>
        <Link to="/blog" className="text-primary hover:underline">חזרה לבלוג</Link>
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return <h2 key={i} className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">{line.slice(3)}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={i} className="text-xl font-heading font-semibold text-foreground mt-6 mb-3">{line.slice(4)}</h3>;
      }
      if (line.startsWith("- **")) {
        const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
        if (match) {
          return (
            <li key={i} className="flex items-start gap-2 mb-2 text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span><strong className="text-card-foreground">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}</span>
            </li>
          );
        }
      }
      if (line.startsWith("- ")) {
        return (
          <li key={i} className="flex items-start gap-2 mb-2 text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <span>{line.slice(2)}</span>
          </li>
        );
      }
      if (line.match(/^\d+\. /)) {
        return (
          <li key={i} className="flex items-start gap-2 mb-2 text-muted-foreground">
            <span className="text-primary font-semibold">{line.match(/^(\d+)/)?.[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s*/, "").replace(/\*\*(.+?)\*\*/g, "<strong class='text-card-foreground'>$1</strong>") }} />
          </li>
        );
      }
      if (line.startsWith("|")) return null; // skip tables for simplicity
      if (line.trim() === "") return <div key={i} className="h-2" />;
      // Bold replacements
      const html = line.replace(/\*\*(.+?)\*\*/g, "<strong class='text-card-foreground'>$1</strong>");
      return <p key={i} className="text-muted-foreground leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  return (
    <>
      <SEOHead
        title={`${post.title} | בלוג SmartFilter`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        keywords={post.keywords}
      />

      <article className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary text-sm mb-6 transition-colors">
            <ArrowRight className="w-4 h-4" />
            חזרה לבלוג
          </Link>

          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-8">{post.title}</h1>

          <div className="prose-custom">
            {renderContent(post.content)}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-card rounded-xl p-6 md:p-8 card-shadow text-center">
            <h2 className="text-xl font-heading font-semibold text-card-foreground mb-3">צריכים עזרה עם סינון?</h2>
            <p className="text-muted-foreground mb-4">צרו קשר עם SmartFilter ונתאים לכם את הפתרון המושלם</p>
            <a href="https://wa.me/972527186881" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-primary text-primary-foreground font-medium"
            >
              דברו איתנו ב-WhatsApp
            </a>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
