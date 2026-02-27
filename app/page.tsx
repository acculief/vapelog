import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600

async function getTopProducts() {
  try {
    return await prisma.product.findMany({
      take: 6,
      orderBy: { rankScore: 'desc' },
      include: {
        reviews: { where: { status: 'visible' }, select: { rating: true } },
      },
    })
  } catch { return [] }
}

function Stars({ rating }: { rating: number }) {
  const r = Math.round(rating)
  return <span className="text-yellow-400 text-sm">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
}

export default async function HomePage() {
  const topProducts = await getTopProducts()

  const categories = [
    { name: 'スターターキット', emoji: '🚀', slug: 'starter' },
    { name: 'ポッド型', emoji: '💧', slug: 'pod' },
    { name: 'BOX MOD', emoji: '📦', slug: 'boxmod' },
    { name: 'リキッド', emoji: '🧪', slug: 'liquid' },
    { name: '使い捨て', emoji: '🗑️', slug: 'disposable' },
    { name: 'パーツ', emoji: '🔧', slug: 'parts' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Hero */}
      <div className="text-center py-10 sm:py-16 bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-2xl mb-8 px-4 sm:px-8">
        <h1 className="text-2xl sm:text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
          日本最大の<br className="sm:hidden" />VAPEレビューサイト
        </h1>
        <p className="text-gray-400 text-sm sm:text-xl mb-6">
          スパムゼロ・信頼の口コミ・詳細比較
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/search" className="flex-1 sm:flex-none text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm sm:text-lg transition">
            🔍 商品を探す
          </Link>
          <Link href="/rankings" className="flex-1 sm:flex-none text-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl text-sm sm:text-lg transition">
            🏆 ランキング
          </Link>
        </div>
      </div>

      {/* Categories - 3cols on SP */}
      <section className="mb-8">
        <h2 className="text-base sm:text-2xl font-bold mb-4">カテゴリから探す</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/search?category=${cat.slug}`}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 sm:p-4 text-center transition group">
              <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">{cat.emoji}</div>
              <div className="text-xs font-medium group-hover:text-blue-400 transition leading-tight">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base sm:text-2xl font-bold mb-4">🏆 人気商品TOP6</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {topProducts.map((product, i) => {
              const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : 0
              return (
                <Link key={product.id} href={`/products/${product.id}`}
                  className="flex items-start gap-3 bg-gray-800 hover:bg-gray-700 rounded-xl p-4 transition border border-gray-700 hover:border-blue-500">
                  <span className="text-xl sm:text-2xl font-black text-blue-400 w-8 text-center flex-shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5 truncate">{product.brand}</div>
                    <h3 className="font-bold text-sm sm:text-base truncate">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Stars rating={avgRating} />
                      <span className="text-xs text-gray-400">({product.reviews.length}件)</span>
                    </div>
                    {product.price && (
                      <div className="text-blue-400 font-bold text-sm mt-1">¥{product.price.toLocaleString()}</div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Features - 1col on SP */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
        {[
          { icon: '🛡️', title: 'スパム完全排除', desc: 'AI自動スコアリングで低品質レビューを非表示' },
          { icon: '⚖️', title: '詳細比較', desc: '最大5製品を横並び比較。価格・評価を一目で' },
          { icon: '🔍', title: '強力な検索', desc: 'カテゴリ・ブランド・価格帯で絞り込み' },
        ].map((f) => (
          <div key={f.title} className="bg-gray-800 rounded-xl p-4 sm:p-6 flex sm:flex-col items-start sm:items-center gap-3 sm:gap-0 sm:text-center">
            <div className="text-3xl sm:text-4xl sm:mb-3 flex-shrink-0">{f.icon}</div>
            <div>
              <h3 className="font-bold text-sm sm:text-lg sm:mb-2">{f.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
