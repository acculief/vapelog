import { NextResponse } from 'next/server'
import { searchProducts } from '@/lib/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const ratingMin = searchParams.get('ratingMin')
  const id = searchParams.get('id')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    let allProducts = await searchProducts({
      id: id || undefined,
      q: q || undefined,
      category: category || undefined,
      brand: brand || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      limit,
    })

    // Filter by visible reviews
    allProducts = allProducts.map((p: any) => ({
      ...p,
      reviews: (p.reviews || []).filter((r: any) => r.status === 'visible' && (r.qualityScore ?? 0) >= 0.3),
      tags: (p.tags || []).map((t: any) => ({ tag: t.tag })),
    }))

    const products = ratingMin
      ? allProducts.filter((p: any) => {
          if (p.reviews.length === 0) return false
          const avg = p.reviews.reduce((s: number, r: any) => s + r.rating, 0) / p.reviews.length
          return avg >= parseFloat(ratingMin)
        })
      : allProducts

    return NextResponse.json({ products })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Search failed', products: [] }, { status: 500 })
  }
}
