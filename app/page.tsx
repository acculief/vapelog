import Link from 'next/link'
import { getProducts } from '@/lib/queries'

export const revalidate = 3600

const CATEGORIES = [
  { slug: 'pod', name: 'ポッド型', desc: 'コンパクトで手軽' },
  { slug: 'starter', name: 'スターターキット', desc: '初心者におすすめ' },
  { slug: 'boxmod', name: 'BOX MOD', desc: 'ハイパワー・カスタム向け' },
  { slug: 'liquid', name: 'リキッド', desc: 'フレーバー・ニコチン塩' },
  { slug: 'disposable', name: '使い捨て', desc: '手軽に試したい方' },
  { slug: 'parts', name: 'パーツ', desc: 'コイル・ポッド交換' },
]

async function getTopProducts() {
  try {
    return await getProducts({ limit: 8, orderBy: 'rankScore' })
  } catch { return [] }
}

function RatingBar({ rating, count }: { rating: number; count: number }) {
  if (count === 0) return <span className="text-xs text-gray-400">レビューなし</span>
  const r = Math.round(rating * 10) / 10
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(r) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-medium text-gray-700">{r.toFixed(1)}</span>
      <span className="text-xs text-gray-400">({count}件)</span>
    </div>
  )
}

export default async function HomePage() {
  const topProducts = await getTopProducts()

  return (
    <>
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
            VAPE・電子タバコの<br className="sm:hidden" />口コミ・比較サイト
          </h1>
          <p className="text-blue-100 text-sm sm:text-lg mb-8 max-w-xl">
            スパムゼロの信頼できるレビュー。ポッド・BOX MOD・リキッドを徹底比較。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <Link href="/search" className="flex-1 bg-white/10 backdrop-blur border border-white/30 rounded-lg px-4 py-3 text-white text-sm hover:bg-white/20 transition text-left">
              商品名・ブランドで検索...
            </Link>
            <Link href="/search" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg text-sm hover:bg-blue-50 transition text-center shrink-0">
              検索する
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-3 gap-4 mb-10 p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          {[
            { value: '53', label: '掲載商品数' },
            { value: '117+', label: 'レビュー件数' },
            { value: '0', label: 'スパムレビュー' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl sm:text-2xl font-black text-blue-600">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold mb-4">カテゴリから探す</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/search?category=${cat.slug}`}
                className="bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-xl p-3 sm:p-4 transition group">
                <p className="font-bold text-sm group-hover:text-blue-600 transition">{cat.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold">人気商品ランキング</h2>
            <Link href="/rankings" className="text-sm text-blue-600 hover:underline">全て見る</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topProducts.map((product, i) => {
              const reviews = (product.reviews || []) as any[]
              const visibleReviews = reviews.filter((r: any) => r.status === 'visible')
              const avg = visibleReviews.length ? visibleReviews.reduce((s: number, r: any) => s + r.rating, 0) / visibleReviews.length : 0
              return (
                <Link key={product.id} href={`/products/${product.id}`}
                  className="bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-xl overflow-hidden transition">
                  {product.imageUrl && (
                    <div className="w-full h-36 bg-gray-50 overflow-hidden">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2" loading="lazy" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black text-white bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-xs text-gray-500 truncate">{product.brand}</span>
                    </div>
                    <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>
                    <RatingBar rating={avg} count={visibleReviews.length} />
                    {product.price && (
                      <p className="text-blue-600 font-bold text-sm mt-2">¥{product.price.toLocaleString()}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'AIによるスパム排除', desc: 'レビュー品質スコアで低品質な投稿を自動非表示。信頼できる口コミだけ表示します。' },
            { title: '詳細スペック比較', desc: '最大5製品を横並びで比較。バッテリー容量・出力・対応コイルをひと目で確認。' },
            { title: 'カテゴリ横断検索', desc: 'ブランド・価格・評価・フレーバーで絞り込み。用途に合った商品が見つかります。' },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
