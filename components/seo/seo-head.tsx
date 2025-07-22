import Head from 'next/head';
import { seoConfig, organizationSchema, websiteSchema } from '@/lib/seo-config';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  schema?: object[];
}

export function SEOHead({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  noindex = false,
  schema = []
}: SEOHeadProps) {
  const pageTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle;
  const pageDescription = description || seoConfig.defaultDescription;
  const pageKeywords = [...seoConfig.keywords, ...keywords].join(', ');
  const pageCanonical = canonical || seoConfig.siteUrl;
  const pageOgImage = ogImage || `${seoConfig.siteUrl}/og-image.jpg`;

  const allSchemas = [organizationSchema, websiteSchema, ...schema];

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={seoConfig.author} />
      <meta name="creator" content={seoConfig.creator} />
      <meta name="publisher" content={seoConfig.publisher} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageCanonical} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageCanonical} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:image" content={pageOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seoConfig.social.twitter} />
      <meta name="twitter:creator" content={seoConfig.social.twitter} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageOgImage} />
      
      {/* Verification */}
      <meta name="google-site-verification" content={seoConfig.verification.google} />
      <meta name="msvalidate.01" content={seoConfig.verification.bing} />
      
      {/* Schema.org JSON-LD */}
      {allSchemas.map((schemaItem, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaItem)
          }}
        />
      ))}
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="application-name" content={seoConfig.siteName} />
      <meta name="apple-mobile-web-app-title" content={seoConfig.siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  );
}