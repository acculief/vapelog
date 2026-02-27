import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 0

interface SearchParams {
  q?: string; category?: string; brand?: string
  minPrice?: string; maxPrice?: string; ratingMin?: string; sort?: string
}

const categories = [
  { slug: 'starter', name: 'スターターキット' },
  { slug: 'pod', name: 'ポッド型' },
  { slug: 'boxmod', name: 'BOX MOD' },
  { slug: 'liquid', name: 'リキッド' },
  { slug: 'disposable', name: '使い捨て' },
  { slug: 'parts', name: 'パーツ' },
]

function Stars({ rating }: { rating: number }) {
  const r = Math.round(rating)
  return <span className="text-yellow-400 text-sm">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const where: Record<string, any> = {}

  if (params.q) where.OR = [
    { name: { contains: params.q, mode: 'insensitive' } },
    { brand: { contains: params.q, mode: 'insensitive' } },
  ]
  if (params.category) where.category = params.category
  if (params.brand) where.brand = { contains: params.brand, mode: 'insensitive' }
  if (params.minPrice) where.price = { ...where.price, gte: parseFloat(params.minPrice) }
  if (params.maxPrice) where.price = { ...where.price, lte: parseFloat(params.maxPrice) }

  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where, take: 30, orderBy: { rankScore: 'desc' },
      include: { reviews: { where: { status: 'visible' }, select: { rating: true } } },
    })
    if (params.ratingMin) {
      const min = parseFloat(params.ratingMin)
      products = products.filter(p => {
        if (!p.reviews.length) return false
        return p.reviews.reduce((s: number, r: any) => s + r.rating, 0) / p.reviews.length >= min
      })
    }
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8">商品検索</h1>

      {/* Search form - SP: stacked */}
      <form className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-6" method="GET">
        <div className="space-y-3">
          <input name="q" defaultValue={params.q} placeholder="商品名・ブランドで検索..."
            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <select name="category" defaultValue={params.category}
              className="bg-gray-700 rounded-lg px-3 py-3 text-sm text-white focus:outline-none">
              <option value="">カテゴリ</option>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <select name="ratingMin" defaultValue={params.ratingMin}
              className="bg-gray-700 rounded-lg px-3 py-3 text-sm text-white focus:outline-none">
              <option value="">最低評価</option>
              <option value="4">4星以上</option>
              <option value="3">3星以上</option>
            </select>
            <input name="minPrice" type="number" defaultValue={params.minPrice} placeholder="最低価格"
              className="bg-gray-700 rounded-lg px-3 py-3 text-sm text-white placeholder-gray-500 focus:outline-none" />
            <input name="maxPrice" type="number" defaultValue={params.maxPrice} placeholder="最高価格"
              className="bg-gray-700 rounded-lg px-3 py-3 text-sm text-white placeholder-gray-500 focus:outline-none" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition text-sm">
            🔍 検索する
          </button>
        </div>
      </form>

      <div className="text-gray-400 text-xs mb-3">{products.length}件</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {products.map(product => {
          const avg = product.reviews.length ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length : 0
          return (
            <Link key={product.id} href={`/products/${product.id}`}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 transition border border-gray-700 hover:border-blue-500">
              <div className="text-xs text-gray-500 mb-1 truncate">{product.brand} · {categories.find(c=>c.slug===product.category)?.name||product.category}</div>
              <h3 className="font-bold text-sm sm:text-lg mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Stars rating={avg} />
                <span className="text-xs text-gray-400">({product.reviews.length})</span>
              </div>
              {product.price && <div className="text-blue-400 font-bold text-sm">¥{product.price.toLocaleString()}</div>}
            </Link>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm">商品が見つかりませんでした</p>
        </div>
      )}
    </div>
  )
}
