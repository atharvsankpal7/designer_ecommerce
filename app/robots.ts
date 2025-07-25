import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '/temp/',
          '/cache/'
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      }
    ],
    sitemap: 'https://sscreation.com/sitemap.xml'
  }
}$',
          '/temp/',
          '/cache/'
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      }
    ],
    sitemap: 'https://sscreation.com/sitemap.xml',
    host: 'https://sscreation.com'
  }
}$',$',
          '/temp/',
          '/cache/'
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      }
    ],
    sitemap: 'https://sscreation.com/sitemap.xml',
    host: 'https://sscreation.com'
  }
}