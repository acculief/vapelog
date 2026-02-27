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
  } catch {
    return []
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  )
}

export default async function HomePage() {
  const topProducts = await getTopProducts()

  const categories = [
    { name: 'スターターキット', emoji: '🚀', slug: 'starter' },
    { name: 'ポッド型', emoji: '💧', slug: 'pod' },
    { name: 'BOX MOD', emoji: '📦', slug: 'boxmod' },
    { name: 'リキッド', emoji: '🧪', slug: 'liquid' },
    { name: '使い捨て', emoji: '🗑️', slug: 'disposable' },
    { name: 'コイル/パーツ', emoji: '🔧', slug: 'parts' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center py-16 bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-3xl mb-12 px-8">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          日本最大のVAPEレビューサイト
        </h1>
        <p className="text-gray-400 text-xl mb-8">
          スパムゼロ・信頼の口コミ・詳細比較で最高の一本を見つけよう
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/search"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl text-lg transition"
          >
            🔍 商品を探す
          </Link>
          <Link
            href="/rankings"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-10 rounded-xl text-lg transition"
          >
            🏆 ランキング
          </Link>
        </div>
      </div>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">カテゴリから探す</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 text-center transition group"
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="text-sm font-medium group-hover:text-blue-400 transition">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🏆 人気商品TOP6</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProducts.map((product, i) => {
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
                  <div className="flex items-start gap-3">
                    <span className="text-2xl font-black text-blue-400">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                      <h3 className="font-bold truncate">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <StarRating rating={avgRating} />
                        <span className="text-sm text-gray-400">{avgRating.toFixed(1)}</span>
                        <span className="text-xs text-gray-600">({product.reviews.length}件)</span>
                      </div>
                      {product.price && (
                        <div className="text-blue-400 font-bold mt-1">¥{product.price.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: '🛡️', title: 'スパム完全排除', desc: 'AI自動スコアリングで低品質レビューを自動非表示。信頼できる口コミだけを表示' },
          { icon: '⚖️', title: '詳細比較機能', desc: '最大5製品を横並び比較。価格・評価・スペックを一目で確認' },
          { icon: '🔍', title: '強力な検索', desc: 'カテゴリ・ブランド・価格帯・タグで絞り込み。理想の一本をすぐ発見' },
        ].map((f) => (
          <div key={f.title} className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
