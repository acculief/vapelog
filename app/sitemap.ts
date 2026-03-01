import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const GUIDE_SLUGS = [
  'what-is-vape',
  'how-to-choose',
  'pod-vs-boxmod',
  'beginner-setup',
  'maintenance',
  'liquid-guide',
  'vape-for-beginners-2025',
  'vape-coil-types',
  'vape-smell',
  'vape-quit-smoking',
  'vape-accessories',
  'vape-travel',
  'vape-japanese-brands',
  'vape-rules-japan',
]

const RANKING_CATEGORIES = ['pod', 'starter', 'boxmod', 'liquid', 'disposable', 'parts']
const CATEGORY_SLUGS = ['pod', 'mod', 'disposable']

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

  const categoryUrls: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/rankings`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/guide`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/write-review`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    ...guideUrls,
    ...rankingCategoryUrls,
    ...categoryUrls,
    ...productUrls,
  ]
}
