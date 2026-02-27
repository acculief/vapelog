import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 3600

export default async function RankingsPage() {
  let products: Array<{
    id: string
    name: string
    brand: string
    category: string
    price: number | null
    rankScore: number
    reviews: Array<{ rating: number }>
  }> = []

  try {
    products = await prisma.product.findMany({
      take: 20,
      orderBy: { rankScore: 'desc' },
      include: {
        reviews: {
          where: { status: 'visible', qualityScore: { gte: 0.3 } },
          select: { rating: true },
        },
      },
    })
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
      <h1 className="text-3xl font-black mb-2">🏆 VAPEランキング</h1>
      <p className="text-gray-400 mb-8">レビュー数・評価・最近性・品質スコアを総合した独自スコアで算出</p>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>まだランキングデータがありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product, i) => {
            const avgRating =
              product.reviews.length > 0
                ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
                : 0
            const rankColors = ['text-yellow-400', 'text-gray-300', 'text-orange-400']
            const rankIcons = ['🥇', '🥈', '🥉']

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 rounded-xl p-5 transition border border-gray-700 hover:border-blue-500"
              >
                <span className={`text-2xl font-black w-10 text-center ${rankColors[i] || 'text-gray-500'}`}>
                  {i < 3 ? rankIcons[i] : `#${i + 1}`}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">
                    {categoryLabels[product.category] || product.category} · {product.brand}
                  </div>
                  <div className="font-bold truncate">{product.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400">
                    {'★'.repeat(Math.round(avgRating))}
                    <span className="text-white ml-1">{avgRating.toFixed(1)}</span>
                  </div>
                  <div className="text-xs text-gray-500">{product.reviews.length}件</div>
                </div>
                {product.price && (
                  <div className="text-blue-400 font-bold w-24 text-right">
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
