import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const ratingMin = searchParams.get('ratingMin')
  const tag = searchParams.get('tag')
  const id = searchParams.get('id')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    const where: Record<string, unknown> = {}

    if (id) {
      where.id = id
    } else {
      if (q) {
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ]
      }
      if (category) where.category = category
      if (brand) where.brand = { contains: brand, mode: 'insensitive' }
      if (minPrice || maxPrice) {
        where.price = {}
        if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice)
        if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice)
      }
      if (tag) {
        where.tags = {
          some: { tag: { name: { contains: tag, mode: 'insensitive' } } },
        }
      }
    }

    let products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: { rankScore: 'desc' },
      include: {
        reviews: {
          where: { status: 'visible', qualityScore: { gte: 0.3 } },
          select: { rating: true, qualityScore: true },
        },
        tags: { include: { tag: true } },
      },
    })

    if (ratingMin) {
      const minRating = parseFloat(ratingMin)
      products = products.filter((p) => {
        if (p.reviews.length === 0) return false
        const avg = p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        return avg >= minRating
      })
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Search failed', products: [] }, { status: 500 })
  }
}
