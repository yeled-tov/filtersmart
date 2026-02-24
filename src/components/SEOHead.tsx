import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
}

const SEOHead = ({ title, description, path = "", keywords }: SEOHeadProps) => {
  const baseUrl = "https://smartfilter.co.il";
  const fullUrl = `${baseUrl}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="he_IL" />
    </Helmet>
  );
};

export default SEOHead;
