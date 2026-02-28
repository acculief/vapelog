import { getProduct } from '@/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ ids: string }> }): Promise<Metadata> {
  const { ids } = await params
  const [id1, id2] = ids.split('--')
  if (!id1 || !id2) return {}
  try {
    const [p1, p2] = await Promise.all([getProduct(id1), getProduct(id2)])
    if (!p1 || !p2) return {}
    const reviews1 = ((p1.reviews || []) as any[]).filter((r: any) => r.status === 'visible')
    const reviews2 = ((p2.reviews || []) as any[]).filter((r: any) => r.status === 'visible')
    const avg1 = reviews1.length ? (reviews1.reduce((s: number, r: any) => s + r.rating, 0) / reviews1.length).toFixed(1) : 'N/A'
    const avg2 = reviews2.length ? (reviews2.reduce((s: number, r: any) => s + r.rating, 0) / reviews2.length).toFixed(1) : 'N/A'
    return {
      title: `「${p1.name} vs ${p2.name}」比較・どっちがおすすめ？ | VapeGo`,
      description: `${p1.name}（評価${avg1}）と${p2.name}（評価${avg2}）を徹底比較。スペック・価格・口コミをひと目で確認。`,
    }
  } catch {
    return {}
  }
}

export default async function CompareIdsPage({ params }: { params: Promise<{ ids: string }> }) {
  const { ids } = await params
  const [id1, id2] = ids.split('--')
  if (!id1 || !id2) notFound()

  let p1: any, p2: any
  try {
    ;[p1, p2] = await Promise.all([getProduct(id1), getProduct(id2)])
  } catch {
    notFound()
  }
  if (!p1 || !p2) notFound()

  const reviews1 = ((p1.reviews || []) as any[]).filter((r: any) => r.status === 'visible')
  const reviews2 = ((p2.reviews || []) as any[]).filter((r: any) => r.status === 'visible')
  const avg1 = reviews1.length ? reviews1.reduce((s: number, r: any) => s + r.rating, 0) / reviews1.length : 0
  const avg2 = reviews2.length ? reviews2.reduce((s: number, r: any) => s + r.rating, 0) / reviews2.length : 0

  const allSpecKeys = Array.from(new Set([
    ...Object.keys((p1.specs as Record<string, string>) || {}),
    ...Object.keys((p2.specs as Record<string, string>) || {}),
  ]))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${p1.name} vs ${p2.name} 比較`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, item: { '@type': 'Product', name: p1.name, brand: { '@type': 'Brand', name: p1.brand }, ...(p1.price ? { offers: { '@type': 'Offer', price: p1.price, priceCurrency: 'JPY' } } : {}) } },
      { '@type': 'ListItem', position: 2, item: { '@type': 'Product', name: p2.name, brand: { '@type': 'Brand', name: p2.brand }, ...(p2.price ? { offers: { '@type': 'Offer', price: p2.price, priceCurrency: 'JPY' } } : {}) } },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-violet-400 transition">ホーム</Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-violet-400 transition">比較</Link>
          <span>/</span>
          <span className="text-gray-400">比較結果</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-black text-white mb-2">{p1.name} vs {p2.name}</h1>
          <p className="text-gray-500 text-sm">スペック・価格・口コミを徹底比較</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[{ product: p1, avg: avg1, reviewCount: reviews1.length }, { product: p2, avg: avg2, reviewCount: reviews2.length }].map(({ product, avg, reviewCount }, idx) => (
            <div key={idx} className="rounded-xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {product.imageUrl && (
                <div className="w-full h-32 mb-3 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2" />
                </div>
              )}
              <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
              <h2 className="font-bold text-sm text-white mb-2 leading-snug">{product.name}</h2>
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-3 h-3 ${s <= Math.round(avg) ? 'text-violet-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-300 ml-1">{avg > 0 ? avg.toFixed(1) : 'N/A'}</span>
                <span className="text-xs text-gray-500">({reviewCount}件)</span>
              </div>
              {product.price && <p className="text-violet-300 font-bold text-sm">¥{product.price.toLocaleString()}</p>}
              <Link href={`/products/${product.id}`} className="inline-block mt-3 text-xs text-violet-400 hover:text-violet-300 transition">詳細を見る →</Link>
            </div>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden border border-white/10 mb-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(124,58,237,0.15)' }}>
                <th className="px-4 py-3 text-left text-xs text-gray-400 font-bold">スペック</th>
                <th className="px-4 py-3 text-left text-xs text-violet-300 font-bold">{p1.name}</th>
                <th className="px-4 py-3 text-left text-xs text-violet-300 font-bold">{p2.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/5">
                <td className="px-4 py-3 text-xs text-gray-500">価格</td>
                <td className="px-4 py-3 text-xs text-white">{p1.price ? `¥${p1.price.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3 text-xs text-white">{p2.price ? `¥${p2.price.toLocaleString()}` : '—'}</td>
              </tr>
              <tr className="border-t border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <td className="px-4 py-3 text-xs text-gray-500">カテゴリ</td>
                <td className="px-4 py-3 text-xs text-white">{p1.category}</td>
                <td className="px-4 py-3 text-xs text-white">{p2.category}</td>
              </tr>
              <tr className="border-t border-white/5">
                <td className="px-4 py-3 text-xs text-gray-500">平均評価</td>
                <td className="px-4 py-3 text-xs text-white">{avg1 > 0 ? `★${avg1.toFixed(1)} (${reviews1.length}件)` : 'レビューなし'}</td>
                <td className="px-4 py-3 text-xs text-white">{avg2 > 0 ? `★${avg2.toFixed(1)} (${reviews2.length}件)` : 'レビューなし'}</td>
              </tr>
              {allSpecKeys.map((key, i) => {
                const v1 = (p1.specs as Record<string, string>)?.[key] || '—'
                const v2 = (p2.specs as Record<string, string>)?.[key] || '—'
                return (
                  <tr key={key} className="border-t border-white/5" style={i % 2 === 0 ? { background: 'rgba(255,255,255,0.02)' } : {}}>
                    <td className="px-4 py-3 text-xs text-gray-500">{key}</td>
                    <td className="px-4 py-3 text-xs text-white">{v1}</td>
                    <td className="px-4 py-3 text-xs text-white">{v2}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/compare" className="text-sm text-violet-400 hover:text-violet-300 transition">← 比較ツールに戻る</Link>
        </div>
      </div>
    </>
  )
}
