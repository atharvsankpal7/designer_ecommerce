// SEO Configuration for SSCreation
export const seoConfig = {
  siteName: 'SSCreation',
  siteUrl: 'https://sscreation.com',
  defaultTitle: 'SSCreation - #1 Premium Graphic Design Templates | Festival & Business Designs',
  defaultDescription: 'SSCreation offers premium graphic design templates for festivals, celebrations, and business needs. Download high-quality Marathi, Hindi, and English templates instantly. Best graphic design templates in India.',
  
  // Primary keywords for ranking
  primaryKeywords: [
    'sscreation',
    'ss creation', 
    'SSCreation',
    'graphic design templates',
    'premium templates',
    'festival designs',
    'business templates',
    'design templates india'
  ],
  
  // Long-tail keywords
  longTailKeywords: [
    'sscreation graphic design templates',
    'ss creation premium templates',
    'festival design templates india',
    'marathi graphic design templates',
    'hindi festival templates',
    'english business templates',
    'instant download design templates',
    'commercial license templates',
    'celebration graphics templates',
    'social media design templates'
  ],
  
  // Social media handles
  social: {
    facebook: 'https://facebook.com/sscreation',
    instagram: 'https://instagram.com/sscreation', 
    twitter: 'https://twitter.com/sscreation',
    youtube: 'https://youtube.com/@sscreation',
    linkedin: 'https://linkedin.com/company/sscreation'
  },
  
  // Business information
  business: {
    name: 'SSCreation',
    legalName: 'SS Creation Private Limited',
    description: 'Premium graphic design templates and custom design services',
    email: 'info@sscreation.com',
    phone: '+91-9876543210',
    address: {
      street: '123 Design Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    }
  },
  
  // Schema.org structured data
  organizationSchema: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SSCreation',
    alternateName: ['SS Creation', 'sscreation'],
    url: 'https://sscreation.com',
    logo: 'https://sscreation.com/logo.png',
    description: 'SSCreation offers premium graphic design templates, festival designs, business cards, social media templates, and celebration graphics.',
    foundingDate: '2020',
    founders: [
      {
        '@type': 'Person',
        name: 'SS Creation Team'
      }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+91-9876543210',
      email: 'info@sscreation.com',
      url: 'https://sscreation.com/contact',
      availableLanguage: ['English', 'Hindi', 'Marathi']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Design Street',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400001',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://facebook.com/sscreation',
      'https://instagram.com/sscreation',
      'https://twitter.com/sscreation',
      'https://youtube.com/@sscreation',
      'https://linkedin.com/company/sscreation'
    ]
  },
  
  // Website schema
  websiteSchema: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SSCreation',
    alternateName: 'SS Creation',
    url: 'https://sscreation.com',
    description: 'Premium graphic design templates for festivals, celebrations, and business needs',
    publisher: {
      '@type': 'Organization',
      name: 'SSCreation'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://sscreation.com/products?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
}

// Generate meta keywords for specific pages
export const generateKeywords = (pageKeywords: string[]) => {
  return [...seoConfig.primaryKeywords, ...pageKeywords, ...seoConfig.longTailKeywords].join(', ')
}

// Generate structured data for products
export const generateProductSchema = (product: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.title,
  description: product.description,
  image: product.displayImage,
  brand: {
    '@type': 'Brand',
    name: 'SSCreation'
  },
  offers: {
    '@type': 'Offer',
    price: product.discountPrice || product.originalPrice,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'SSCreation'
    }
  },
  category: 'Graphic Design Templates',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150'
  }
})

// Generate FAQ schema
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is SSCreation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SSCreation is a premium graphic design template marketplace offering high-quality festival designs, business templates, and celebration graphics for instant download.'
      }
    },
    {
      '@type': 'Question', 
      name: 'Do I get commercial license with templates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, all SSCreation templates come with commercial license allowing you to use them for business purposes and client projects.'
      }
    },
    {
      '@type': 'Question',
      name: 'What languages are supported in templates?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SSCreation offers templates in multiple languages including English, Hindi, and Marathi to cater to diverse audiences.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I download templates after purchase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After successful payment, you will receive instant download links via email. You can also access your purchases from your account dashboard.'
      }
    }
  ]
}