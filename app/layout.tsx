import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from '@/components/providers';
import { SSRHeader } from '@/components/layout/ssr-header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sscreation.com'),
  title: 'SSCreation - #1 Premium Graphic Design Templates & Festival Designs | SSCreation Official',
  description: 'SSCreation offers premium graphic design templates, festival designs, business cards, social media templates, and celebration graphics. Download instantly with commercial license. Best graphic design templates by SSCreation.',
  keywords: 'SSCreation, SS Creation, sscreation, graphic design templates, premium templates, festival designs, business templates, social media templates, celebration graphics, design templates, graphic design, festival graphics, business cards, poster templates, banner designs',
  openGraph: {
    title: 'SSCreation - #1 Premium Graphic Design Templates & Festival Designs',
    description: 'SSCreation offers premium graphic design templates, festival designs, business cards, social media templates, and celebration graphics. Download instantly with commercial license.',
    type: 'website',
    locale: 'en_US',
    url: 'https://sscreation.com',
    siteName: 'SSCreation',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SSCreation - Premium Graphic Design Templates by SSCreation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSCreation - Premium Graphic Design Templates',
    description: 'SSCreation offers premium graphic design templates, festival designs, and celebration graphics. Download instantly.',
    images: ['/twitter-image.jpg'],
    creator: '@sscreation',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://sscreation.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://sscreation.com" />
        <meta name="author" content="SSCreation" />
        <meta name="publisher" content="SSCreation" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SSCreation",
              "alternateName": ["SS Creation", "sscreation"],
              "url": "https://sscreation.com",
              "logo": "https://sscreation.com/logo.png",
              "description": "SSCreation offers premium graphic design templates, festival designs, business cards, social media templates, and celebration graphics.",
              "foundingDate": "2020",
              "sameAs": [
                "https://facebook.com/sscreation",
                "https://instagram.com/sscreation",
                "https://twitter.com/sscreation",
                "https://youtube.com/@sscreation",
                "https://linkedin.com/company/sscreation"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "telephone": "+91-9876543210",
                "email": "info@sscreation.com",
                "url": "https://sscreation.com/contact",
                "availableLanguage": ["English", "Hindi", "Marathi"]
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Design Street",
                "addressLocality": "Mumbai",
                "addressRegion": "Maharashtra",
                "postalCode": "400001",
                "addressCountry": "IN"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SSCreation",
              "alternateName": "SS Creation",
              "url": "https://sscreation.com",
              "description": "Premium graphic design templates for festivals, celebrations, and business needs",
              "publisher": {
                "@type": "Organization",
                "name": "SSCreation"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://sscreation.com/products?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <SSRHeader />
          {children}
          <Footer />
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
