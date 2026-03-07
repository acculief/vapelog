import Link from 'next/link'
import { getProducts } from '@/lib/queries'

export const revalidate = 0

const CDN_BASE = 'https://cuinyjpiifcslzexrunc.supabase.co/storage/v1/object/public/item-images/vapelog-categories'
// ベプログ（vapelog.jp）準拠の8カテゴリ
const CATEGORIES: { slug: string; name: string; desc: string; image: string; emoji: string; href: string }[] = [
  { slug: 'disposable',   name: '使い捨てVAPE',             desc: '充電不要でそのまま使える',       image: `${CDN_BASE}/disposable.jpg`,  emoji: '💨',  href: '/category/disposable' },
  { slug: 'pod',          name: '使い捨てPOD',               desc: 'コンパクトPOD型ディスポ',       image: `${CDN_BASE}/pod.jpg`,          emoji: '🫧',  href: '/category/pod' },
  { slug: 'rechargeable', name: 'リキッドチャージ式VAPE',    desc: 'POD・BOX MOD・スターター',      image: `${CDN_BASE}/boxmod.jpg`,       emoji: '⚡',  href: '/category/starter' },
  { slug: 'liquid',       name: 'VAPEリキッド/フレーバー',   desc: '国産・海外の電子タバコ液',      image: `${CDN_BASE}/liquid.jpg`,       emoji: '🧪',  href: '/category/liquid' },
  { slug: 'heated',       name: '加熱式タバコ',               desc: 'IQOS・glo・PloomTECH',         image: `${CDN_BASE}/heated.jpg`,       emoji: '🔥',  href: '/search?category=heated' },
  { slug: 'shisha',       name: '本格シーシャ・電子シーシャ', desc: 'ポケットシーシャ・水タバコ',   image: `${CDN_BASE}/shisha.jpg`,       emoji: '💨',  href: '/category/shisha' },
  { slug: 'tobacco',      name: '紙タバコ・手巻きタバコ',     desc: '銘柄・フレーバーで口コミ比較', image: `${CDN_BASE}/tobacco.jpg`,      emoji: '🚬',  href: '/search?category=tobacco' },
  { slug: 'cbd',          name: 'CBD商品',                    desc: 'CBDオイル・CBD VAPE',           image: `${CDN_BASE}/cbd.jpg`,          emoji: '🌿',  href: '/category/cbd' },
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
            VAPE・ヴェポライザーの<br className="sm:hidden" />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">口コミ＆比較サイト</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-lg mb-8 max-w-xl">
            VAPE・ヴェポライザーの口コミ・スペック比較サイト。あなたにぴったりの一本を見つけよう。
          </p>
          <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              name="q"
              placeholder="商品名・ブランドで検索..."
              autoComplete="off"
              className="flex-1 bg-white/10 backdrop-blur border border-violet-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-400 transition"
            />
            <button type="submit"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-lg text-sm transition shrink-0"
              style={{ boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              検索する
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">カテゴリから探す</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={cat.href}
                className="group rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/60 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="w-full aspect-[4/3] flex items-center justify-center"
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


        {/* 目的から探す */}
        <section className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">🎯 目的から探す</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                emoji: '🆕',
                label: 'まず試してみたい',
                sub: '充電・設定不要、買ってすぐ使える使い捨てVAPE',
                href: '/category/disposable',
                color: 'from-blue-600/20 to-cyan-600/20',
                border: 'border-blue-500/30',
                badge: '初心者におすすめ',
              },
              {
                emoji: '💸',
                label: '毎日使うならコスパ重視',
                sub: 'スターターキット＋リキッドで使い捨てより断然お得',
                href: '/category/starter',
                color: 'from-violet-600/20 to-purple-600/20',
                border: 'border-violet-500/30',
                badge: 'ランニングコスト◎',
              },
              {
                emoji: '🍓',
                label: 'フレーバーで選びたい',
                sub: 'フルーツ・メンソール・タバコ系など100種以上',
                href: '/category/liquid',
                color: 'from-pink-600/20 to-rose-600/20',
                border: 'border-pink-500/30',
                badge: '185種以上',
              },
              {
                emoji: '💨',
                label: 'シーシャ・大煙量を楽しむ',
                sub: '本格シーシャ体験、大きな蒸気量でリラックス',
                href: '/category/shisha',
                color: 'from-teal-600/20 to-emerald-600/20',
                border: 'border-teal-500/30',
                badge: '電子シーシャ',
              },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className={`group rounded-xl p-4 border ${item.border} hover:border-violet-500/60 transition-all bg-gradient-to-br ${item.color} flex flex-col gap-2`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{item.badge}</span>
                </div>
                <p className="font-bold text-sm text-white group-hover:text-violet-300 transition leading-tight">{item.label}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{item.sub}</p>
                <p className="text-xs text-violet-400 group-hover:text-violet-300 transition mt-auto">詳しく見る →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ガイド最新記事 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-white">📖 VAPEガイド・使い方</h2>
            <Link href="/guide" className="text-sm text-violet-400 hover:text-violet-300 transition">すべて見る →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { slug: 'what-is-vape', title: 'ヴェポライザーとは？', img: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400&h=200&auto=format&fit=crop&q=80' },
              { slug: 'how-to-choose', title: 'VAPEの選び方', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=200&auto=format&fit=crop&q=80' },
              { slug: 'vape-quit-smoking', title: '禁煙・減煙ガイド', img: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=400&h=200&auto=format&fit=crop&q=80' },
              { slug: 'vape-rules-japan', title: 'VAPEの法律・ルール', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&auto=format&fit=crop&q=80' },
            ].map(g => (
              <Link key={g.slug} href={`/guide/${g.slug}`} className="group rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition">
                <div className="relative h-24 overflow-hidden">
                  <img src={g.img} alt={g.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-white group-hover:text-violet-300 transition leading-tight">{g.title}</p>
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
