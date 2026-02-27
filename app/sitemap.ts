import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vapelog.jp'

  let productUrls: MetadataRoute.Sitemap = []
  try {
    const products = await prisma.product.findMany({
      select: { id: true, createdAt: true },
    })
    productUrls = products.map((p) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: p.createdAt,
    }))
  } catch {
    // DB not connected, return static urls only
  }

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/search`, lastModified: new Date() },
    { url: `${baseUrl}/rankings`, lastModified: new Date() },
    { url: `${baseUrl}/compare`, lastModified: new Date() },
    { url: `${baseUrl}/write-review`, lastModified: new Date() },
    ...productUrls,
  ]
}
