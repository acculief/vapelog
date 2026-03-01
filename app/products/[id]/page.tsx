import { getProduct } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import PurchaseSection from '@/components/PurchaseSection'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const product = await getProduct(id)
    if (!product) return {}
    // reviews & avgRating for meta
    const metaReviews = ((product.reviews || []) as any[]).filter((r: any) => r.status === 'visible')
    const metaAvg = metaReviews.length > 0 ? metaReviews.reduce((s: number, r: any) => s + r.rating, 0) / metaReviews.length : 0
    return {
      title: `${product.name} レビュー・評価 | VapeGo`,
      description: `${product.name}（${product.brand}）のレビュー・評価。${metaReviews.length}件の口コミ、平均${metaAvg.toFixed(1)}点。VapeGoで信頼できるVAPEの情報を。`,
      alternates: {
        canonical: `https://vapego.vercel.app/products/${id}`,
      },
      openGraph: {
        title: `${product.name} レビュー・評価 | VapeGo`,
        description: `${product.name}（${product.brand}）のレビュー・評価。${metaReviews.length}件の口コミ。`,
        url: `https://vapego.vercel.app/products/${id}`,
        type: 'website',
      },
    }
  } catch {
    return {}
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-violet-400 text-xl">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  )
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  let product: any
  try {
    product = await getProduct(id)
  } catch {
    notFound()
  }

  if (!product) notFound()

  const reviews = ((product.reviews || []) as any[])
    .filter((r: any) => r.status === 'visible' && (r.qualityScore ?? 0) >= 0.3)
    .sort((a: any, b: any) => (b.qualityScore ?? 0) - (a.qualityScore ?? 0))

  const tags = (product.tags || []) as any[]

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
      : 0

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: any) => r.rating === star).length,
  }))

  const specs = product.specs as Record<string, string> | null
  const affiliates = product.affiliateLinks as Record<string, string> | null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    aggregateRating: reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
    } : undefined,
    review: reviews.slice(0, 5).map((r: any) => ({
      '@type': 'Review',
      reviewBody: r.body,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'トップ', item: 'https://vapego.vercel.app' },
      { '@type': 'ListItem', position: 2, name: '商品一覧', item: 'https://vapego.vercel.app/search' },
      { '@type': 'ListItem', position: 3, name: product.name },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-violet-400 transition">トップ</Link>
        {' › '}
        <Link href="/search" className="hover:text-violet-400 transition">検索</Link>
        {' › '}
        <span className="text-gray-400">{product.name}</span>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl mb-8 border border-violet-500/20 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
        {/* Product Image - same style as list cards */}
        {product.imageUrl && (
          <div className="w-full h-64 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-6" />
          </div>
        )}
        <div className="p-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">{product.brand}</div>
              <h1 className="text-3xl font-black mb-4 text-white">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={avgRating} />
                <span className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</span>
                <span className="text-gray-400">({reviews.length}件のレビュー)</span>
              </div>
              {product.price && (
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs text-gray-400 border border-gray-600 rounded px-1.5 py-0.5">参考価格</span>
                  <span className="text-2xl font-black text-violet-300">¥{product.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">※Amazon実際の価格は変動します</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Link
                href={`/write-review?productId=${product.id}`}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-2 px-6 rounded-xl transition"
                style={{ boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
              >
                ✏️ レビューを書く
              </Link>
              <Link
                href={`/compare?add=${product.id}`}
                className="border border-violet-500/30 hover:border-violet-400 hover:bg-violet-500/10 text-white font-bold py-2 px-4 rounded-xl transition"
              >
                ⚖️ 比較
              </Link>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-4">
              {tags.map(({ tag }: any) => (
                <Link
                  key={tag.id}
                  href={`/search?tag=${tag.name}`}
                  className="text-violet-300 text-xs px-3 py-1 rounded-full transition border border-violet-500/30 hover:border-violet-400 hover:bg-violet-900/40"
                  style={{ background: 'rgba(109,28,217,0.15)' }}
                >
                  # {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Purchase Section - CV Optimized */}
      <PurchaseSection
        productName={product.name}
        price={product.price}
        affiliates={affiliates}
        avgRating={avgRating}
        reviewCount={reviews.length}
      />

      {/* Specs */}
      {specs && Object.keys(specs).length > 0 && (
        <div className="rounded-2xl p-6 mb-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
          <h2 className="font-bold text-xl mb-4 text-white">📋 スペック</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="text-gray-400 min-w-0">{key}:</span>
                <span className="font-medium text-gray-200">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Distribution */}
      {reviews.length > 0 && (
        <div className="rounded-2xl p-6 mb-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
          <h2 className="font-bold text-xl mb-4 text-white">📊 評価分布</h2>
          <div className="space-y-2">
            {ratingDist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-violet-400 w-6">{star}★</span>
                <div className="flex-1 rounded-full h-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div
                    className="bg-violet-500 rounded-full h-3 transition-all"
                    style={{
                      width: reviews.length > 0
                        ? `${(count / reviews.length) * 100}%`
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

      {/* Reviews */}
      <div>
        <h2 className="font-bold text-2xl mb-6 text-white">💬 レビュー ({reviews.length}件)</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <p className="mb-4 text-gray-400">まだレビューがありません</p>
            <Link
              href={`/write-review?productId=${product.id}`}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-2 px-6 rounded-xl transition"
            >
              最初のレビューを書く
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="rounded-xl p-6 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-gray-200">
                      {review.user?.name || review.user?.email?.split('@')[0] || '匿名'}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-violet-400">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                </div>
                {review.title && <h4 className="font-bold mb-2 text-white">{review.title}</h4>}
                <p className="text-gray-300 leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
