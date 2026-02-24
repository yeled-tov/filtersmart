import { Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/blog";

const Blog = () => {
  return (
    <>
      <SEOHead
        title="בלוג SmartFilter – מדריכים וטיפים לסינון טלפון"
        description="מאמרים ומדריכים בנושא סינון טלפון, הגנה דיגיטלית, מכשירי Qin ועוד. כל מה שצריך לדעת על סינון לאייפון ואנדרואיד."
        path="/blog"
        keywords="סינון טלפון, חסימת אינטרנט, סינון אנדרואיד, סינון אייפון"
      />

      <section className="section-padding bg-background">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
              הבלוג <span className="gradient-text">שלנו</span>
            </h1>
            <p className="text-lg text-muted-foreground">מאמרים, מדריכים וטיפים בנושא סינון והגנה דיגיטלית</p>
          </div>

          <div className="space-y-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block bg-card rounded-xl p-6 md:p-8 card-shadow hover:card-shadow-hover transition-all group"
              >
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
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
        </div>
      </section>
    </>
  );
};

export default Blog;
