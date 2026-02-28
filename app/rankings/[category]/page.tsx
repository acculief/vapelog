import { getProducts } from '@/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const CATEGORY_META: Record<string, { h1: string; title: string; desc: string }> = {
  pod: {
    h1: 'ポッド型VAPEランキング',
    title: 'ポッド型VAPEおすすめランキング2025【コンパクト重視】 | VapeGo',
    desc: 'ポッド型VAPEのランキング。持ち運びやすさ・コスパ・使いやすさで比較したおすすめ機種を紹介。',
  },
  starter: {
    h1: '初心者向けスターターキットランキング',
    title: 'VAPE初心者向けスターターキットランキング【2025年版】 | VapeGo',
    desc: 'VAPE初心者に最適なスターターキットランキング。設定不要・リキッド付きのセットから選べる。',
  },
  boxmod: {
    h1: 'BOX MODランキング',
    title: 'BOX MODおすすめランキング【ハイパワー・上級者向け】 | VapeGo',
    desc: 'ハイパワーBOX MODのランキング。出力・バッテリー・カスタム性で比較したおすすめ機種。',
  },
  liquid: {
    h1: 'VAPEリキッドランキング',
    title: 'VAPEリキッドおすすめランキング2025【フレーバー別】 | VapeGo',
    desc: 'VAPEリキッドのおすすめランキング。フルーツ系・メンソール・タバコ系フレーバー別に比較。',
  },
  disposable: {
    h1: '使い捨てVAPEランキング',
    title: '使い捨てVAPE（ディスポーザブル）おすすめランキング | VapeGo',
    desc: '使い捨てVAPEのおすすめランキング。コスパ・フレーバー・吸引回数で比較した人気機種。',
  },
  parts: {
    h1: 'VAPEコイル・パーツランキング',
    title: 'VAPEコイル・パーツおすすめランキング | VapeGo',
    desc: 'VAPEコイル・交換パーツのランキング。対応機種・抵抗値・寿命で比較したおすすめパーツ。',
  },
}

const CATEGORY_NAV = [
  { slug: 'pod', label: 'ポッド型' },
  { slug: 'starter', label: 'スターター' },
  { slug: 'boxmod', label: 'BOX MOD' },
  { slug: 'liquid', label: 'リキッド' },
  { slug: 'disposable', label: '使い捨て' },
  { slug: 'parts', label: 'パーツ' },
]

export const revalidate = 3600

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((category) => ({ category }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const meta = CATEGORY_META[category]
  if (!meta) return {}
  return { title: meta.title, description: meta.desc }
}

export default async function CategoryRankingPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const meta = CATEGORY_META[category]
  if (!meta) notFound()

  let products: any[] = []
  try {
    const raw = await getProducts({ category, limit: 30, orderBy: 'rankScore' })
    products = raw.map(p => ({
      ...p,
      reviews: (p.reviews || []).filter((r: any) => r.status === 'visible'),
    }))
  } catch (e) {
    console.error(e)
  }

  const heroProducts = products.slice(0, 3)
  const restProducts = products.slice(3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: meta.h1,
    description: meta.desc,
    url: `https://vapego.vercel.app/rankings/${category}`,
    itemListElement: products.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://vapego.vercel.app/products/${p.id}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-violet-400 transition">ホーム</Link>
          <span>/</span>
          <Link href="/rankings" className="hover:text-violet-400 transition">ランキング</Link>
          <span>/</span>
          <span className="text-gray-400">{meta.h1}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{meta.h1}</h1>
          <p className="text-gray-500 text-sm">{meta.desc}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORY_NAV.map((cat) => (
            <Link
              key={cat.slug}
              href={`/rankings/${cat.slug}`}
              className={`px-4 py-2 text-sm font-bold rounded-full border transition ${
                cat.slug === category
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : 'border-violet-500/40 text-violet-300 hover:border-violet-400 hover:bg-violet-500/10'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>このカテゴリの商品はまだありません</p>
            <Link href="/rankings" className="text-violet-400 hover:text-violet-300 mt-4 inline-block text-sm">← 総合ランキングを見る</Link>
          </div>
        ) : (
          <>
            {heroProducts.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {heroProducts.map((product, i) => {
                  const avgRating = product.reviews.length > 0
                    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
                    : 0
                  const badgeStyles = [
                    { bg: 'from-yellow-400 to-amber-500', shadow: '0 0 16px rgba(251,191,36,0.4)', label: '🥇 1位' },
                    { bg: 'from-gray-300 to-gray-400', shadow: '0 0 12px rgba(156,163,175,0.3)', label: '🥈 2位' },
                    { bg: 'from-orange-400 to-amber-600', shadow: '0 0 12px rgba(251,146,60,0.3)', label: '🥉 3位' },
                  ]
                  const style = badgeStyles[i]
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition group"
                      style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}
                    >
                      {product.imageUrl && (
                        <div className="w-full h-40 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform" loading="lazy" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className={`inline-block px-3 py-1 text-xs font-black text-white rounded-full mb-2 bg-gradient-to-r ${style.bg}`} style={{ boxShadow: style.shadow }}>
                          {style.label}
                        </div>
                        <h3 className="font-bold text-sm text-white leading-snug mb-1 group-hover:text-violet-300 transition line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} className={`w-3 h-3 ${s <= Math.round(avgRating) ? 'text-violet-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-400 ml-1">{avgRating.toFixed(1)}</span>
                        </div>
                        {product.price && <p className="text-violet-300 font-bold text-sm mt-2">¥{product.price.toLocaleString()}</p>}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {restProducts.length > 0 && (
              <div className="space-y-2">
                {restProducts.map((product, i) => {
                  const rank = i + 4
                  const avgRating = product.reviews.length > 0
                    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
                    : 0
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center gap-4 rounded-xl p-4 transition border border-white/10 hover:border-violet-500/50 group"
                      style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}
                    >
                      <span className="text-sm font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-violet-950/60 text-violet-300 border border-violet-500/30">
                        {rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-0.5">{product.brand}</div>
                        <div className="font-bold text-sm truncate text-gray-100 group-hover:text-white transition">{product.name}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} className={`w-3 h-3 ${s <= Math.round(avgRating) ? 'text-violet-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs font-bold ml-1 text-gray-300">{avgRating.toFixed(1)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{product.reviews.length}件</div>
                      </div>
                      {product.price && (
                        <div className="text-violet-300 font-bold text-sm w-20 text-right shrink-0">
                          ¥{product.price.toLocaleString()}
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}

        <div className="mt-8 text-center">
          <Link href="/rankings" className="text-sm text-violet-400 hover:text-violet-300 transition">← 総合ランキングに戻る</Link>
        </div>
      </div>
    </>
  )
}
