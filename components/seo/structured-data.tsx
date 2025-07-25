import { seoConfig } from '@/lib/seo-config'

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'product' | 'faq'
  data?: any
}

export function StructuredData({ type = 'organization', data }: StructuredDataProps) {
  let schema

  switch (type) {
    case 'organization':
      schema = seoConfig.organizationSchema
      break
    case 'website':
      schema = seoConfig.websiteSchema
      break
    case 'product':
      schema = data
      break
    case 'faq':
      schema = data
      break
    default:
      schema = seoConfig.organizationSchema
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

// Breadcrumb structured data
export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}