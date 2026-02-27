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
        <h1 className="text-2xl sm:text-3xl font-black">商品比較</h1>
        <p className="text-gray-500 mt-2 text-sm">最大5製品を横並びで比較できます</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 relative">
        <input
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          placeholder="比較する商品を検索..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-4 right-4 bg-white border border-gray-200 rounded-xl shadow-lg z-10 mt-1">
            {searchResults.map((p) => (
              <button
                key={p.id}
                onClick={() => addProduct(p.id)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-0"
              >
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-gray-400">{p.brand} · {CATEGORY_LABELS[p.category] || p.category}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-400 bg-white border border-gray-200 rounded-xl">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">商品を検索して比較リストに追加してください</p>
          <p className="text-xs text-gray-300 mt-1">最大5製品まで比較できます</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-white border border-gray-200 rounded-tl-xl w-36 text-xs font-semibold text-gray-500 uppercase tracking-wide">項目</th>
                {products.map((p) => (
                  <th key={p.id} className="p-4 bg-white border border-gray-200 text-center">
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{p.brand}</div>
                    <button onClick={() => removeProduct(p.id)} className="text-red-500 text-xs mt-2 hover:text-red-700 flex items-center gap-1 mx-auto">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      削除
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="p-4 bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500">価格</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border border-gray-200 text-center text-blue-600 font-bold text-sm">
                    {p.price ? `¥${p.price.toLocaleString()}` : '—'}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-4 bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500">平均評価</td>
                {products.map((p) => {
                  const avg = getAvgRating(p)
                  return (
                    <td key={p.id} className="p-4 border border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} className={`w-3 h-3 ${s <= Math.round(avg) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs font-bold text-gray-700 ml-1">{avg.toFixed(1)}</span>
                      </div>
                    </td>
                  )
                })}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-4 bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500">レビュー数</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border border-gray-200 text-center text-sm">{p.reviews?.length || 0}件</td>
                ))}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-4 bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500">カテゴリ</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border border-gray-200 text-center text-sm">{CATEGORY_LABELS[p.category] || p.category}</td>
                ))}
              </tr>
              {(() => {
                const allSpecKeys = new Set<string>()
                products.forEach((p) => { if (p.specs) Object.keys(p.specs).forEach((k) => allSpecKeys.add(k)) })
                return Array.from(allSpecKeys).map((key) => (
                  <tr key={key} className="border-t border-gray-100">
                    <td className="p-4 bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500">{key}</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4 border border-gray-200 text-center text-sm">{p.specs?.[key] || '—'}</td>
                    ))}
                  </tr>
                ))
              })()}
              <tr className="border-t border-gray-100">
                <td className="p-4 bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500">詳細</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 border border-gray-200 text-center">
                    <Link href={`/products/${p.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition inline-block">
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
