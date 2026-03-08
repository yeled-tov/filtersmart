import { Link } from "react-router-dom";
import { Calendar, ArrowLeft, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const estimateReadTime = (content: string) => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} דק׳ קריאה`;
};

const BlogSkeleton = () => (
  <div className="bg-card rounded-xl p-6 md:p-8 card-shadow">
    <div className="flex items-center gap-2 mb-3">
      <Skeleton className="w-4 h-4 rounded" />
      <Skeleton className="h-4 w-32" />
    </div>
    <Skeleton className="h-7 w-3/4 mb-3" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <Skeleton className="h-4 w-20" />
  </div>
);

const Blog = () => {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <>
      <SEOHead
        title="בלוג SmartFilter – מדריכים וטיפים לסינון טלפון"
        description="מאמרים ומדריכים בנושא סינון טלפון, הגנה דיגיטלית, מכשירי Qin ועוד."
        path="/blog"
        keywords="סינון טלפון, חסימת אינטרנט, סינון אנדרואיד, סינון אייפון"
      />
      <Breadcrumbs items={[{ label: "בלוג" }]} />

      <section className="section-padding bg-background">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
              הבלוג <span className="gradient-text">שלנו</span>
            </h1>
            <p className="text-lg text-muted-foreground">מאמרים, מדריכים וטיפים בנושא סינון והגנה דיגיטלית</p>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => <BlogSkeleton key={i} />)}
            </div>
          ) : (
            <div className="space-y-6">
              {posts?.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block bg-card rounded-xl p-6 md:p-8 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
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
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors mb-3">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <span>קרא עוד</span>
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;
