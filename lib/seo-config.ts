// SEO Configuration for SSCreation
export const seoConfig = {
  siteName: 'SSCreation',
  siteUrl: 'https://sscreation.com',
  defaultTitle: 'SSCreation - #1 Premium Graphic Design Templates & Festival Designs',
  defaultDescription: 'SSCreation offers premium graphic design templates, festival designs, business cards, social media templates, and celebration graphics. Download instantly with commercial license.',
  keywords: [
    'SSCreation',
    'SS Creation', 
    'sscreation',
    'graphic design templates',
    'premium templates',
    'festival designs',
    'business templates',
    'social media templates',
    'celebration graphics',
    'design templates',
    'graphic design',
    'festival graphics',
    'business cards',
    'poster templates',
    'banner designs'
  ],
  author: 'SSCreation',
  creator: 'SSCreation Team',
  publisher: 'SSCreation',
  social: {
    twitter: '@sscreation',
    facebook: 'https://facebook.com/sscreation',
    instagram: 'https://instagram.com/sscreation',
  },
  verification: {
    google: 'your-google-verification-code',
    bing: 'your-bing-verification-code',
  }
};

// Schema.org structured data
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SSCreation",
  "alternateName": ["SS Creation", "sscreation"],
  "url": "https://sscreation.com",
  "logo": "https://sscreation.com/logo.png",
  "description": "SSCreation offers premium graphic design templates, festival designs, business cards, social media templates, and celebration graphics.",
  "foundingDate": "2020",
  "founders": [
    {
      "@type": "Person",
      "name": "SSCreation Team"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Design Street",
    "addressLocality": "Mumbai",
    "addressRegion": "Maharashtra",
    "postalCode": "400001",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "telephone": "+91-9876543210",
    "email": "info@sscreation.com",
    "url": "https://sscreation.com/contact"
  },
  "sameAs": [
    "https://facebook.com/sscreation",
    "https://instagram.com/sscreation",
    "https://twitter.com/sscreation"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SSCreation",
  "alternateName": "SS Creation",
  "url": "https://sscreation.com",
  "description": "Premium graphic design templates and festival designs",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://sscreation.com/products?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const breadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});