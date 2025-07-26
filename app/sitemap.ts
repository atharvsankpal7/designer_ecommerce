import { MetadataRoute } from 'next'
import connectDB from '@/lib/mongodb'
import { Product, Bundle } from '@/lib/models'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sscreation.com'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bundles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  try {
    await connectDB()

    // Get all products
    const products = await Product.find({ isActive: true })
      .select('_id updatedAt')
      .lean()

    const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${baseUrl}/products/${product._id}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    // Get all bundles
    const bundles = await Bundle.find({ isActive: true })
      .select('_id updatedAt')
      .lean()

    const bundlePages: MetadataRoute.Sitemap = bundles.map((bundle: any) => ({
      url: `${baseUrl}/bundles/${bundle._id}`,
      lastModified: new Date(bundle.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    return [...staticPages, ...productPages, ...bundlePages]
  } catch (error : any) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}