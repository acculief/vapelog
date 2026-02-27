import { getProducts } from '@/lib/queries'
import Link from 'next/link'

export const revalidate = 3600

export default async function RankingsPage() {
  let products: any[] = []

  try {
    const raw = await getProducts({ limit: 30, orderBy: 'rankScore' })
    products = raw.map(p => ({
      ...p,
      reviews: (p.reviews || []).filter((r: any) => r.status === 'visible'),
    }))
  } catch (e) {
    console.error(e)
  }

  const categoryLabels: Record<string, string> = {
    starter: 'スターターキット',
    pod: 'ポッド型',
    boxmod: 'BOX MOD',
    liquid: 'リキッド',
    disposable: '使い捨て',
    parts: 'コイル/パーツ',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black">VAPEランキング</h1>
        <p className="text-gray-500 mt-2 text-sm">レビュー数・評価・品質スコアを総合した独自スコアで算出</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>まだランキングデータがありません</p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product, i) => {
            const avgRating =
              product.reviews.length > 0
                ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
                : 0
            const rankBadgeColors = [
              'bg-yellow-400 text-white',
              'bg-gray-300 text-gray-700',
              'bg-orange-400 text-white',
            ]
            const badgeClass = i < 3 ? rankBadgeColors[i] : 'bg-gray-100 text-gray-600'

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center gap-4 bg-white hover:bg-gray-50 rounded-xl p-4 transition border border-gray-200 hover:border-blue-400 hover:shadow-sm"
              >
                <span className={`text-sm font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${badgeClass}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400 mb-0.5">
                    {categoryLabels[product.category] || product.category} · {product.brand}
                  </div>
                  <div className="font-bold text-sm truncate">{product.name}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-3 h-3 ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs font-bold ml-1 text-gray-700">{avgRating.toFixed(1)}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{product.reviews.length}件</div>
                </div>
                {product.price && (
                  <div className="text-blue-600 font-bold text-sm w-20 text-right shrink-0">
                    ¥{product.price.toLocaleString()}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
