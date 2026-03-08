import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  type?: string;
  image?: string;
}

const SEOHead = ({ title, description, path = "", keywords, type = "website", image }: SEOHeadProps) => {
  const baseUrl = "https://smartfilter.co.il";
  const fullUrl = `${baseUrl}${path}`;
  const ogImage = image || "https://storage.googleapis.com/gpt-engineer-file-uploads/zQzpmcciMefmd1jcMZlCnfScdqW2/social-images/social-1772354974246-Gemini_Generated_Image_8ki41m8ki41m8ki4.webp";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="he_IL" />
      <meta property="og:site_name" content="FilterSmart – פילטר סמארט" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEOHead;