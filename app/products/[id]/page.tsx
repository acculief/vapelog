import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return {}
    return {
      title: `${product.name} レビュー・評価 | VapeLog`,
      description: `${product.name}の口コミ・評価・レビューをチェック。VapeLogで信頼できる最新情報を。`,
    }
  } catch {
    return {}
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-xl">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  )
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  let product
  try {
    product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          where: { status: 'visible', qualityScore: { gte: 0.3 } },
          orderBy: { qualityScore: 'desc' },
          include: { user: { select: { name: true, email: true } } },
        },
        tags: { include: { tag: true } },
      },
    })
  } catch {
    notFound()
  }

  if (!product) notFound()

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((r) => r.rating === star).length,
  }))

  const specs = product.specs as Record<string, string> | null
  const affiliates = product.affiliateLinks as Record<string, string> | null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    aggregateRating: product.reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: product.reviews.length,
    } : undefined,
    review: product.reviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      reviewBody: r.body,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
    })),
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white">トップ</Link>
        {' › '}
        <Link href="/search" className="hover:text-white">検索</Link>
        {' › '}
        <span>{product.name}</span>
      </div>

      <div className="bg-gray-800 rounded-2xl p-8 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          {(product as any).imageUrl && (
            <div className="w-full sm:w-48 h-48 bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(product as any).imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-2"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">{product.brand}</div>
            <h1 className="text-3xl font-black mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={avgRating} />
              <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
              <span className="text-gray-400">({product.reviews.length}件のレビュー)</span>
            </div>
            {product.price && (
              <div className="text-3xl font-black text-blue-400">¥{product.price.toLocaleString()}</div>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              href={`/write-review?productId=${product.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition"
            >
              ✏️ レビューを書く
            </Link>
            <Link
              href={`/compare?add=${product.id}`}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-xl transition"
            >
              ⚖️ 比較
            </Link>
          </div>
        </div>

        {product.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-4">
            {product.tags.map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/search?tag=${tag.name}`}
                className="bg-gray-700 hover:bg-gray-600 text-xs px-3 py-1 rounded-full transition"
              >
                # {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {affiliates && Object.keys(affiliates).length > 0 && (
        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-700/30 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-4">🛒 購入する</h2>
          <div className="flex gap-3 flex-wrap">
            {affiliates.amazon && (
              <a href={affiliates.amazon} target="_blank" rel="noopener noreferrer sponsored"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl transition">
                Amazonで買う
              </a>
            )}
            {affiliates.rakuten && (
              <a href={affiliates.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl transition">
                楽天で買う
              </a>
            )}
            {affiliates.yahoo && (
              <a href={affiliates.yahoo} target="_blank" rel="noopener noreferrer sponsored"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition">
                Yahoo!で買う
              </a>
            )}
            {affiliates.official && (
              <a href={affiliates.official} target="_blank" rel="noopener noreferrer"
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-xl transition">
                公式サイト
              </a>
            )}
          </div>
        </div>
      )}

      {specs && Object.keys(specs).length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-xl mb-4">📋 スペック</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="text-gray-400 min-w-0">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {product.reviews.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-xl mb-4">📊 評価分布</h2>
          <div className="space-y-2">
            {ratingDist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-yellow-400 w-6">{star}★</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-yellow-400 rounded-full h-3 transition-all"
                    style={{
                      width: product.reviews.length > 0
                        ? `${(count / product.reviews.length) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
                <span className="text-gray-400 text-sm w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-bold text-2xl mb-6">💬 レビュー ({product.reviews.length}件)</h2>
        {product.reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-800 rounded-2xl">
            <p className="mb-4">まだレビューがありません</p>
            <Link
              href={`/write-review?productId=${product.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition"
            >
              最初のレビューを書く
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium">
                      {review.user.name || review.user.email?.split('@')[0] || '匿名'}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-400">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                </div>
                {review.title && <h4 className="font-bold mb-2">{review.title}</h4>}
                <p className="text-gray-300 leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
