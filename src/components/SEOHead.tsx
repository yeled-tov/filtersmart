import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  type?: string;
  image?: string;
  imageAlt?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
}

const SEOHead = ({
  title,
  description,
  path = "",
  keywords,
  type = "website",
  image,
  imageAlt,
  article,
}: SEOHeadProps) => {
  const baseUrl = "https://filterphone.com";
  const fullUrl = `${baseUrl}${path}`;
  const ogImage = image || "https://filterphone.com/hero.jpg";
  const altText = imageAlt || "FilterPhone – סינון טלפונים מקצועי באשדוד";
  const siteName = "FilterPhone – פילטר פון";

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={fullUrl} />

      {/* ===== Facebook / Instagram / WhatsApp / Telegram / LinkedIn ===== */}
      {/* These platforms all read Open Graph (og:) tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="he_IL" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1377" />
      <meta property="og:image:height" content="768" />
      <meta property="og:image:alt" content={altText} />
      <meta property="og:image:type" content="image/jpeg" />

      {/* Facebook specific */}
      <meta property="fb:app_id" content="" />

      {/* Article tags for blog posts (Facebook/LinkedIn) */}
      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
      {article?.author && <meta property="article:author" content={article.author} />}

      {/* ===== Twitter / X ===== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={altText} />
      <meta name="twitter:site" content="@filterphone" />
      <meta name="twitter:creator" content="@filterphone" />

      {/* ===== Pinterest ===== */}
      {/* Pinterest reads og: tags + these additional ones */}
      <meta name="pinterest-rich-pin" content="true" />

      {/* ===== TikTok ===== */}
      {/* TikTok's in-app browser reads og: tags for link previews */}
      {/* Additional metadata for TikTok SEO discoverability */}
      <meta property="og:video:tag" content="סינון טלפון" />
      <meta property="og:video:tag" content="FilterPhone" />
      <meta property="og:video:tag" content="סינון אשדוד" />

      {/* ===== Telegram ===== */}
      {/* Telegram reads og: tags but also supports these for instant view */}
      <meta name="telegram:channel" content="@filterphone" />

      {/* ===== General Social Sharing Optimization ===== */}
      <meta name="author" content="FilterPhone – פילטר פון" />
      <meta name="application-name" content="FilterPhone" />

      {/* Apple/iOS sharing */}
      <meta name="apple-mobile-web-app-title" content="FilterPhone" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Microsoft/Windows sharing */}
      <meta name="msapplication-TileColor" content="#2563c4" />
      <meta name="msapplication-tooltip" content={description} />

      {/* Schema.org itemprop for Google+ and general search enrichment */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={ogImage} />
    </Helmet>
  );
};

export default SEOHead;
