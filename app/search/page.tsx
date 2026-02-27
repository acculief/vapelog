import { getProducts } from '@/lib/queries'
import Link from 'next/link'

export const revalidate = 0

const CATEGORIES = [
  { slug: '', name: '全て' },
  { slug: 'pod', name: 'ポッド型' },
  { slug: 'starter', name: 'スターターキット' },
  { slug: 'boxmod', name: 'BOX MOD' },
  { slug: 'liquid', name: 'リキッド' },
  { slug: 'disposable', name: '使い捨て' },
  { slug: 'parts', name: 'パーツ' },
]

interface P { q?: string; category?: string; brand?: string; minPrice?: string; maxPrice?: string; ratingMin?: string; sort?: string }

function Stars({ avg, count }: { avg: number; count: number }) {
  if (count === 0) return <span className="text-xs text-gray-400">未レビュー</span>
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-3 h-3 ${i <= Math.round(avg) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-600">{(Math.round(avg * 10) / 10).toFixed(1)}</span>
      <span className="text-xs text-gray-400">({count})</span>
    </div>
  )
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<P> }) {
  const p = await searchParams

  const sortOrderBy = p.sort === 'price_asc' ? 'price' as const
    : p.sort === 'price_desc' ? 'price' as const
    : 'rankScore' as const
  const sortOrder = p.sort === 'price_asc' ? 'asc' as const : 'desc' as const

  let products: any[] = []
  try {
    products = await getProducts({
      category: p.category || undefined,
      brand: p.brand || undefined,
      q: p.q || undefined,
      minPrice: p.minPrice ? parseFloat(p.minPrice) : undefined,
      maxPrice: p.maxPrice ? parseFloat(p.maxPrice) : undefined,
      limit: 48,
      orderBy: sortOrderBy,
      order: sortOrder,
    })

    // Filter by visible reviews and rating
    products = products.map((product: any) => ({
      ...product,
      reviews: (product.reviews || []).filter((r: any) => r.status === 'visible'),
    }))

    if (p.ratingMin) {
      const min = parseFloat(p.ratingMin)
      products = products.filter((pr: any) => {
        if (!pr.reviews.length) return false
        const avg = pr.reviews.reduce((s: number, r: any) => s + r.rating, 0) / pr.reviews.length
        return avg >= min
      })
    }
  } catch {}

  const catName = CATEGORIES.find(c => c.slug === (p.category || ''))?.name || '全て'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">{p.q ? `"${p.q}" の検索結果` : `${catName}の商品一覧`}</h1>
        <p className="text-sm text-gray-500 mt-1">{products.length}件</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <Link key={cat.slug} href={`/search?${new URLSearchParams({ ...p, category: cat.slug }).toString()}`}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition border ${
              (p.category || '') === cat.slug
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}>
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-56 shrink-0">
          <form className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 sticky top-20">
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">キーワード</label>
              <input name="q" defaultValue={p.q} placeholder="商品名・ブランド"
                className="mt-1.5 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">価格帯</label>
              <div className="flex gap-2 mt-1.5">
                <input name="minPrice" type="number" defaultValue={p.minPrice} placeholder="下限"
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="maxPrice" type="number" defaultValue={p.maxPrice} placeholder="上限"
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">最低評価</label>
              <select name="ratingMin" defaultValue={p.ratingMin}
                className="mt-1.5 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
                <option value="">指定なし</option>
                <option value="4">4.0以上</option>
                <option value="3">3.0以上</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">並び順</label>
              <select name="sort" defaultValue={p.sort}
                className="mt-1.5 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
                <option value="">人気順</option>
                <option value="price_asc">価格が安い順</option>
                <option value="price_desc">価格が高い順</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition">
              絞り込む
            </button>
          </form>
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {products.map((product: any) => {
              const avg = product.reviews.length ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length : 0
              const catLabel = CATEGORIES.find(c => c.slug === product.category)?.name || product.category
              return (
                <Link key={product.id} href={`/products/${product.id}`}
                  className="bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-xl overflow-hidden transition">
                  {product.imageUrl && (
                    <div className="w-full h-40 bg-gray-50 overflow-hidden">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2" loading="lazy" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">{product.brand}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{catLabel}</span>
                    </div>
                    <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>
                    <Stars avg={avg} count={product.reviews.length} />
                    {product.price && (
                      <p className="text-blue-600 font-bold text-sm mt-2">¥{product.price.toLocaleString()}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
          {products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">条件に合う商品が見つかりませんでした</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
