import Link from 'next/link'
import { getProducts } from '@/lib/queries'

export const revalidate = 3600

const CDN_BASE = 'https://cuinyjpiifcslzexrunc.supabase.co/storage/v1/object/public/item-images/vapelog-categories'
const CATEGORIES = [
  { slug: 'pod', name: 'ポッド型', desc: 'コンパクトで手軽', image: `${CDN_BASE}/pod.jpg` },
  { slug: 'starter', name: 'スターターキット', desc: '初心者におすすめ', image: `${CDN_BASE}/starter.jpg` },
  { slug: 'boxmod', name: 'BOX MOD', desc: 'ハイパワー・カスタム向け', image: `${CDN_BASE}/boxmod.jpg` },
  { slug: 'liquid', name: 'リキッド', desc: 'フレーバー・ニコチン塩', image: `${CDN_BASE}/liquid.jpg` },
  { slug: 'disposable', name: '使い捨て', desc: '手軽に試したい方', image: `${CDN_BASE}/disposable.jpg` },
  { slug: 'parts', name: 'パーツ', desc: 'コイル・ポッド交換', image: `${CDN_BASE}/parts.jpg` },
]

async function getTopProducts() {
  try {
    return await getProducts({ limit: 8, orderBy: 'rankScore' })
  } catch { return [] }
}

function RatingBar({ rating, count }: { rating: number; count: number }) {
  if (count === 0) return <span className="text-xs text-gray-500">レビューなし</span>
  const r = Math.round(rating * 10) / 10
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(r) ? 'text-violet-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-medium text-gray-300">{r.toFixed(1)}</span>
      <span className="text-xs text-gray-500">({count}件)</span>
    </div>
  )
}

export default async function HomePage() {
  const topProducts = await getTopProducts()

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-indigo-900/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
            VAPE・電子タバコの<br className="sm:hidden" />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">口コミ・比較サイト</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-lg mb-8 max-w-xl">
            スパムゼロの信頼できるレビュー。ポッド・BOX MOD・リキッドを徹底比較。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <Link href="/search" className="flex-1 bg-white/10 backdrop-blur border border-violet-500/30 rounded-lg px-4 py-3 text-gray-300 text-sm hover:bg-white/15 transition text-left">
              商品名・ブランドで検索...
            </Link>
            <Link href="/search" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-lg text-sm transition text-center shrink-0" style={{ boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              検索する
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10 p-4 sm:p-6 rounded-xl border border-violet-500/20" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
          {[
            { value: '67', label: '掲載商品数' },
            { value: '117+', label: 'レビュー件数' },
            { value: '0', label: 'スパムレビュー' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">カテゴリから探す</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/search?category=${cat.slug}`}
                className="group rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/60 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                {/* 画像：全体表示 */}
                <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden"
                  style={{ background: 'rgba(10,5,25,0.6)' }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* 紫グラデーションライン */}
                <div className="h-[2px] bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 opacity-40 group-hover:opacity-100 transition-opacity" />
                {/* テキスト */}
                <div className="px-4 py-3">
                  <p className="font-bold text-base text-white group-hover:text-violet-300 transition-colors">{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Rankings */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">人気商品ランキング</h2>
            <Link href="/rankings" className="text-sm text-violet-400 hover:text-violet-300 transition">全て見る</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topProducts.map((product, i) => {
              const reviews = (product.reviews || []) as any[]
              const visibleReviews = reviews.filter((r: any) => r.status === 'visible')
              const avg = visibleReviews.length ? visibleReviews.reduce((s: number, r: any) => s + r.rating, 0) / visibleReviews.length : 0
              const badgeGradients = [
                'from-yellow-500 to-amber-500',
                'from-gray-400 to-gray-500',
                'from-orange-500 to-amber-600',
              ]
              const badgeClass = i < 3 ? badgeGradients[i] : 'from-violet-600 to-indigo-600'
              return (
                <Link key={product.id} href={`/products/${product.id}`}
                  className="border border-white/10 hover:border-violet-500/40 rounded-xl overflow-hidden transition group"
                  style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
                  {product.imageUrl && (
                    <div className="w-full h-36 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2" loading="lazy" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-black text-white bg-gradient-to-r ${badgeClass} w-6 h-6 rounded-full flex items-center justify-center shrink-0`}>
                        {i + 1}
                      </span>
                      <span className="text-xs text-gray-500 truncate">{product.brand}</span>
                    </div>
                    <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2 text-gray-100 group-hover:text-white transition">{product.name}</h3>
                    <RatingBar rating={avg} count={visibleReviews.length} />
                    {product.price && (
                      <p className="text-violet-300 font-bold text-sm mt-2">¥{product.price.toLocaleString()}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'AIによるスパム排除', desc: 'レビュー品質スコアで低品質な投稿を自動非表示。信頼できる口コミだけ表示します。', icon: '🤖' },
            { title: '詳細スペック比較', desc: '最大5製品を横並びで比較。バッテリー容量・出力・対応コイルをひと目で確認。', icon: '⚖️' },
            { title: 'カテゴリ横断検索', desc: 'ブランド・価格・評価・フレーバーで絞り込み。用途に合った商品が見つかります。', icon: '🔍' },
          ].map((f) => (
            <div key={f.title} className="border border-violet-500/20 rounded-xl p-5 sm:p-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
