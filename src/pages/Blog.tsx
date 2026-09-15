import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const estimateReadTime = (content: string) =>
  `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} דק׳ קריאה`;

const BlogSkeleton = () => (
  <div className="panel p-6 md:p-7">
    <Skeleton className="mb-3 h-4 w-40" />
    <Skeleton className="mb-3 h-7 w-3/4" />
    <Skeleton className="mb-2 h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

const Blog = () => {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <>
      <SEOHead
        title="מדריכים על סינון טלפון – הבלוג של FilterPhone"
        description="מדריכים וטיפים על סינון טלפון, חסימת אינטרנט, בחירת מערכת סינון, מכשירי Qin וסינון לילדים. הידע שצברנו במעבדה, בכתב."
        path="/blog"
        keywords="סינון טלפון מדריך, חסימת אינטרנט, סינון אנדרואיד, סינון אייפון, הדרן מדריך, כושר פליי מדריך"
      />
      <Breadcrumbs items={[{ label: "מדריכים" }]} />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <SectionHeading
            eyebrow="מדריכים"
            title="מה שלמדנו במעבדה, בכתב"
            lead="מדריכים קצרים וענייניים על סינון, חסימת תוכן ובחירת המערכת הנכונה."
          />

          <div className="mt-12 space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <BlogSkeleton key={i} />)
            ) : posts && posts.length > 0 ? (
              posts.map((post, i) => (
                <AnimatedSection key={post.slug} delay={i * 0.05}>
                  <Link to={`/blog/${post.slug}`} className="group block panel panel-hover p-6 md:p-7">
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
                    <h2 className="mt-3 text-xl font-bold text-ink transition-colors group-hover:text-primary md:text-2xl">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{post.excerpt}</p>
                    <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary">
                      לקריאה
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </span>
                  </Link>
                </AnimatedSection>
              ))
            ) : (
              <p className="rounded-lg border border-border bg-surface p-8 text-center text-ink-soft">
                עוד לא פורסמו מדריכים. בינתיים אפשר לעבור על{" "}
                <Link to="/compare" className="font-semibold text-primary underline underline-offset-4">
                  ההשוואה בין מערכות הסינון
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
