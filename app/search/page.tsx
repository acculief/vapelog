import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 0

interface SearchParams {
  q?: string
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  ratingMin?: string
  tag?: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const where: Record<string, unknown> = {}

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: 'insensitive' } },
      { brand: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
    ]
  }
  if (params.category) where.category = params.category
  if (params.brand) where.brand = { contains: params.brand, mode: 'insensitive' }
  if (params.minPrice || params.maxPrice) {
    where.price = {}
    if (params.minPrice) (where.price as Record<string, number>).gte = parseFloat(params.minPrice)
    if (params.maxPrice) (where.price as Record<string, number>).lte = parseFloat(params.maxPrice)
  }
  if (params.tag) {
    where.tags = {
      some: {
        tag: { name: { contains: params.tag, mode: 'insensitive' } },
      },
    }
  }

  let products: Array<{
    id: string
    name: string
    brand: string
    category: string
    price: number | null
    rankScore: number
    reviews: Array<{ rating: number; qualityScore: number }>
  }> = []

  try {
    products = await prisma.product.findMany({
      where,
      include: {
        reviews: {
          where: { status: 'visible', qualityScore: { gte: 0.3 } },
          select: { rating: true, qualityScore: true },
        },
      },
      orderBy: { rankScore: 'desc' },
      take: 50,
    })

    if (params.ratingMin) {
      const minRating = parseFloat(params.ratingMin)
      products = products.filter((p) => {
        if (p.reviews.length === 0) return false
        const avg = p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        return avg >= minRating
      })
    }
  } catch (e) {
    console.error(e)
  }

  const categories = ['starter', 'pod', 'boxmod', 'liquid', 'disposable', 'parts']
  const categoryLabels: Record<string, string> = {
    starter: 'スターターキット',
    pod: 'ポッド型',
    boxmod: 'BOX MOD',
    liquid: 'リキッド',
    disposable: '使い捨て',
    parts: 'コイル/パーツ',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">商品検索</h1>

      <form className="bg-gray-800 rounded-xl p-6 mb-8" method="GET">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="商品名・ブランドで検索..."
            className="bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="category"
            defaultValue={params.category}
            className="bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべてのカテゴリ</option>
            {categories.map((c) => (
              <option key={c} value={c}>{categoryLabels[c]}</option>
            ))}
          </select>
          <input
            name="brand"
            defaultValue={params.brand}
            placeholder="ブランド名"
            className="bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input
            name="minPrice"
            type="number"
            defaultValue={params.minPrice}
            placeholder="最低価格"
            className="bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="maxPrice"
            type="number"
            defaultValue={params.maxPrice}
            placeholder="最高価格"
            className="bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="ratingMin"
            defaultValue={params.ratingMin}
            className="bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">最低評価</option>
            <option value="4">4星以上</option>
            <option value="3">3星以上</option>
            <option value="2">2星以上</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            🔍 検索
          </button>
        </div>
      </form>

      <div className="text-gray-400 text-sm mb-4">{products.length}件の商品が見つかりました</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const avgRating =
            product.reviews.length > 0
              ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
              : 0
          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl p-5 transition border border-gray-700 hover:border-blue-500"
            >
              <div className="text-xs text-gray-500 mb-1">{categoryLabels[product.category] || product.category} · {product.brand}</div>
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={avgRating} />
                <span className="text-sm">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-gray-600">({product.reviews.length}件)</span>
              </div>
              {product.price && (
                <div className="text-blue-400 font-bold">¥{product.price.toLocaleString()}</div>
              )}
            </Link>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">🔍</div>
          <p>商品が見つかりませんでした。検索条件を変えてみてください。</p>
        </div>
      )}
    </div>
  )
}
