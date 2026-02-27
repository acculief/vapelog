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
      <h1 className="text-3xl font-black mb-2">⚖️ 商品比較</h1>
      <p className="text-gray-400 mb-8">最大5製品を横並びで比較できます</p>

      <div className="bg-gray-800 rounded-xl p-6 mb-8 relative">
        <input
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          placeholder="比較する商品を検索..."
          className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-6 right-6 bg-gray-700 rounded-xl shadow-xl z-10 mt-1">
            {searchResults.map((p) => (
              <button
                key={p.id}
                onClick={() => addProduct(p.id)}
                className="w-full text-left px-4 py-3 hover:bg-gray-600 transition first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-400">{p.brand}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">⚖️</div>
          <p>商品を検索して比較リストに追加してください</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-4 bg-gray-800 rounded-tl-xl w-40">項目</th>
                {products.map((p) => (
                  <th key={p.id} className="p-4 bg-gray-800 text-center">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.brand}</div>
                    <button onClick={() => removeProduct(p.id)} className="text-red-400 text-xs mt-1 hover:text-red-300">
                      ✕ 削除
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-700">
                <td className="p-4 bg-gray-800/50 text-gray-400 font-medium">価格</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center text-blue-400 font-bold">
                    {p.price ? `¥${p.price.toLocaleString()}` : '—'}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-700">
                <td className="p-4 bg-gray-800/50 text-gray-400 font-medium">平均評価</td>
                {products.map((p) => {
                  const avg = getAvgRating(p)
                  return (
                    <td key={p.id} className="p-4 text-center">
                      <span className="text-yellow-400">{'★'.repeat(Math.round(avg))}</span>
                      <span className="ml-1 font-bold">{avg.toFixed(1)}</span>
                    </td>
                  )
                })}
              </tr>
              <tr className="border-t border-gray-700">
                <td className="p-4 bg-gray-800/50 text-gray-400 font-medium">レビュー数</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center">{p.reviews?.length || 0}件</td>
                ))}
              </tr>
              <tr className="border-t border-gray-700">
                <td className="p-4 bg-gray-800/50 text-gray-400 font-medium">カテゴリ</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center text-sm">{p.category}</td>
                ))}
              </tr>
              {(() => {
                const allSpecKeys = new Set<string>()
                products.forEach((p) => { if (p.specs) Object.keys(p.specs).forEach((k) => allSpecKeys.add(k)) })
                return Array.from(allSpecKeys).map((key) => (
                  <tr key={key} className="border-t border-gray-700">
                    <td className="p-4 bg-gray-800/50 text-gray-400 font-medium text-sm">{key}</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-4 text-center text-sm">{p.specs?.[key] || '—'}</td>
                    ))}
                  </tr>
                ))
              })()}
              <tr className="border-t border-gray-700">
                <td className="p-4 bg-gray-800/50 text-gray-400 font-medium">詳細</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <Link href={`/products/${p.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition">
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
