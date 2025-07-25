import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogImage?: string
  noindex?: boolean
}

export function SEOHead({
  title = 'SSCreation - #1 Premium Graphic Design Templates',
  description = 'SSCreation offers premium graphic design templates for festivals, celebrations, and business needs. Download instantly with commercial license.',
  keywords = 'sscreation, ss creation, graphic design templates, premium templates, festival designs',
  canonical,
  ogImage = '/og-image.jpg',
  noindex = false
}: SEOHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="SSCreation" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@sscreation" />
      
      {/* Additional SEO tags */}
      <meta name="author" content="SSCreation" />
      <meta name="publisher" content="SSCreation" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Geo tags for local SEO */}
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Mumbai" />
      <meta name="geo.position" content="19.0760;72.8777" />
      <meta name="ICBM" content="19.0760, 72.8777" />
    </Head>
  )
}