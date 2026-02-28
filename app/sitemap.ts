import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const GUIDE_SLUGS = [
  'what-is-vape',
  'how-to-choose',
  'pod-vs-boxmod',
  'beginner-setup',
  'maintenance',
  'liquid-guide',
]

const RANKING_CATEGORIES = ['pod', 'starter', 'boxmod', 'liquid', 'disposable', 'parts']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vapego.vercel.app'

  let productUrls: MetadataRoute.Sitemap = []
  try {
    const { data: products } = await db
      .from('Product')
      .select('id, createdAt')

    productUrls = (products || []).map((p: any) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: p.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch {
    // DB not connected, return static urls only
  }

  const guideUrls: MetadataRoute.Sitemap = GUIDE_SLUGS.map((slug) => ({
    url: `${baseUrl}/guide/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const rankingCategoryUrls: MetadataRoute.Sitemap = RANKING_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/rankings/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/rankings`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/guide`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/write-review`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    ...guideUrls,
    ...rankingCategoryUrls,
    ...productUrls,
  ]
}
