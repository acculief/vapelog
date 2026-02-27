'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number | null
  specs: Record<string, string> | null
  reviews: Array<{ rating: number }>
  tags: Array<{ tag: { name: string; type: string } }>
}

const CATEGORY_LABELS: Record<string, string> = {
  starter: 'スターターキット',
  pod: 'ポッド型',
  boxmod: 'BOX MOD',
  liquid: 'リキッド',
  disposable: '使い捨て',
  parts: 'コイル/パーツ',
}

export default function ComparePage() {
  const [productIds, setProductIds] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!searchQ) { setSearchResults([]); return }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQ)}&limit=5`)
      const data = await res.json()
      setSearchResults(data.products || [])
    }, 300)
    return () => clearTimeout(t)
  }, [searchQ])

  useEffect(() => {
    if (productIds.length === 0) { setProducts([]); return }
    setLoading(true)
    Promise.all(
      productIds.map((id) => fetch(`/api/search?id=${id}`).then((r) => r.json()))
    ).then((results) => {
      setProducts(results.map((r) => r.products?.[0]).filter(Boolean))
      setLoading(false)
    })
  }, [productIds])

  const addProduct = (id: string) => {
    if (productIds.includes(id) || productIds.length >= 5) return
    setProductIds([...productIds, id])
    setSearchQ('')
    setSearchResults([])
  }

  const removeProduct = (id: string) => {
    setProductIds(productIds.filter((p) => p !== id))
  }

  const getAvgRating = (product: Product) => {
    if (!product.reviews || product.reviews.length === 0) return 0
    return product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white">商品比較</h1>
        <p className="text-gray-500 mt-2 text-sm">最大5製品を横並びで比較できます</p>
      </div>

      {/* Search Box */}
      <div className="rounded-xl p-4 mb-8 relative border border-violet-500/20" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
        <input
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          placeholder="比較する商品を検索..."
          className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 border border-violet-500/30"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-4 right-4 rounded-xl shadow-2xl z-10 mt-1 border border-violet-500/30 overflow-hidden" style={{ background: '#1a0d2e', backdropFilter: 'blur(12px)' }}>
            {searchResults.map((p) => (
              <button
                key={p.id}
                onClick={() => addProduct(p.id)}
                className="w-full text-left px-4 py-3 transition first:rounded-t-xl last:rounded-b-xl border-b border-white/5 last:border-0 hover:bg-violet-500/10"
              >
                <div className="font-medium text-sm text-gray-100">{p.name}</div>
                <div className="text-xs text-gray-500">{p.brand} · {CATEGORY_LABELS[p.category] || p.category}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-16 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <svg className="w-12 h-12 mx-auto mb-4 text-violet-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm text-gray-400">商品を検索して比較リストに追加してください</p>
          <p className="text-xs text-gray-600 mt-1">最大5製品まで比較できます</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-violet-500/20" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b border-r border-white/10 rounded-tl-xl w-36 text-xs font-semibold text-gray-500 uppercase tracking-wide" style={{ background: 'rgba(124,58,237,0.08)' }}>項目</th>
                {products.map((p) => (
                  <th key={p.id} className="p-4 border-b border-r border-white/10 text-center last:border-r-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="font-bold text-sm text-gray-100">{p.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{p.brand}</div>
                    <button onClick={() => removeProduct(p.id)} className="text-red-400 text-xs mt-2 hover:text-red-300 flex items-center gap-1 mx-auto transition">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      削除
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="p-4 border-r border-white/10 text-xs font-semibold text-gray-500" style={{ background: 'rgba(124,58,237,0.06)' }}>価格</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-r border-white/10 last:border-r-0 text-center text-violet-300 font-bold text-sm">
                    {p.price ? `¥${p.price.toLocaleString()}` : '—'}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-4 border-r border-white/10 text-xs font-semibold text-gray-500" style={{ background: 'rgba(124,58,237,0.06)' }}>平均評価</td>
                {products.map((p) => {
                  const avg = getAvgRating(p)
                  return (
                    <td key={p.id} className="p-4 border-r border-white/10 last:border-r-0 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} className={`w-3 h-3 ${s <= Math.round(avg) ? 'text-violet-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs font-bold text-gray-300 ml-1">{avg.toFixed(1)}</span>
                      </div>
                    </td>
                  )
                })}
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-4 border-r border-white/10 text-xs font-semibold text-gray-500" style={{ background: 'rgba(124,58,237,0.06)' }}>レビュー数</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-r border-white/10 last:border-r-0 text-center text-sm text-gray-300">{p.reviews?.length || 0}件</td>
                ))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="p-4 border-r border-white/10 text-xs font-semibold text-gray-500" style={{ background: 'rgba(124,58,237,0.06)' }}>カテゴリ</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-r border-white/10 last:border-r-0 text-center text-sm text-gray-300">{CATEGORY_LABELS[p.category] || p.category}</td>
                ))}
              </tr>
              {(() => {
                const allSpecKeys = new Set<string>()
                products.forEach((p) => { if (p.specs) Object.keys(p.specs).forEach((k) => allSpecKeys.add(k)) })
                return Array.from(allSpecKeys).map((key) => (
                  <tr key={key} className="border-b border-white/5">
                    <td className="p-4 border-r border-white/10 text-xs font-semibold text-gray-500" style={{ background: 'rgba(124,58,237,0.06)' }}>{key}</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4 border-r border-white/10 last:border-r-0 text-center text-sm text-gray-300">{p.specs?.[key] || '—'}</td>
                    ))}
                  </tr>
                ))
              })()}
              <tr>
                <td className="p-4 border-r border-white/10 text-xs font-semibold text-gray-500" style={{ background: 'rgba(124,58,237,0.06)' }}>詳細</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border-r border-white/10 last:border-r-0 text-center">
                    <Link href={`/products/${p.id}`}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition inline-block">
                      詳細を見る
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
