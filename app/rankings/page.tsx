import { getProducts } from '@/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '【2026年最新】VAPE・ヴェポライザー人気ランキング | VapeGo',
  description: 'VAPE・ヴェポライザーの人気ランキング【2026年最新版】。吸いごたえ・使いやすさ・コスパを独自スコアで徹底比較。初心者向けの選び方ガイドも解説。',
}

export const revalidate = 0

const CATEGORY_NAV = [
  { slug: 'pod', label: 'ポッド型' },
  { slug: 'starter', label: 'スターター' },
  { slug: 'boxmod', label: 'BOX MOD' },
  { slug: 'liquid', label: 'リキッド' },
  { slug: 'disposable', label: '使い捨て' },
  { slug: 'parts', label: 'パーツ' },
]

const SELECTION_POINTS = [
  {
    num: 1,
    title: '初心者は「使い捨て」か「ポッド型」から選ぼう',
    body: 'VAPE初心者に最もおすすめなのは使い捨てタイプとポッド型。使い捨ては充電・交換不要でとにかく手軽。ポッド型はカートリッジを交換するだけで使え、ランニングコストも抑えられます。まず試してみたい方は使い捨てから始めるのがベストです。',
    icon: '🎯',
  },
  {
    num: 2,
    title: 'VAPEトリックを楽しむなら「リキッド式」や「BOX MOD」',
    body: '大きな煙（クラウドチェイシング）やトリック演技を楽しみたい方にはリキッド式またはBOX MODがおすすめ。出力をカスタマイズでき、好みのフレーバーのリキッドを組み合わせられます。ただしコイル交換などのメンテナンスが必要です。',
    icon: '💨',
  },
  {
    num: 3,
    title: 'コストを抑えるなら「月額ランニングコスト」で比較',
    body: '本体価格だけでなく、リキッド・カートリッジ・コイルの交換コストを含めた月額ランニングコストで比較しましょう。使い捨ては1本300〜800円が相場。ポッド型はカートリッジ代が月1,000〜3,000円程度。長期的にはポッド型やリキッド式の方がお得なケースも多いです。',
    icon: '💰',
  },
]

const TYPE_TABLE = [
  { type: '使い捨て', ease: '★★★', cost: '★★', customise: '×', maintenance: '不要', best: '初心者・お試し' },
  { type: 'ポッド型', ease: '★★★', cost: '★★★', customise: '△', maintenance: '少ない', best: '日常使い・節約' },
  { type: 'スターターキット', ease: '★★', cost: '★★★', customise: '○', maintenance: '普通', best: '本格入門' },
  { type: 'BOX MOD', ease: '★', cost: '★★★★', customise: '◎', maintenance: '多い', best: '上級者・トリック' },
]

export default async function RankingsPage() {
  let products: any[] = []

  try {
    const raw = await getProducts({ limit: 30, orderBy: 'rankScore' })
    products = raw.map(p => ({
      ...p,
      reviews: (p.reviews || []).filter((r: any) => r.status === 'visible'),
    }))
  } catch (e) {
    console.error(e)
  }

  const categoryLabels: Record<string, string> = {
    starter: 'スターターキット',
    pod: 'ポッド型',
    boxmod: 'BOX MOD',
    liquid: 'リキッド',
    disposable: '使い捨て',
    parts: 'コイル/パーツ',
  }

  const jsonLdItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'VAPE・ヴェポライザー総合ランキング',
    description: 'レビュー数・評価・品質スコアを総合した独自スコアによるランキング',
    url: 'https://www.vape-go.com/rankings',
    itemListElement: products.slice(0, 10).map((p: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://www.vape-go.com/products/${p.id}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ページヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold">
              2026年3月 最終更新
            </span>
            <span className="text-xs text-gray-500">{products.length}商品掲載</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            VAPE・ヴェポライザー<br className="sm:hidden" />人気ランキング
          </h1>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            吸いごたえ・使いやすさ・コストパフォーマンスを独自スコアで総合評価。ユーザー口コミをもとに算出したリアルな人気ランキングです。
          </p>
        </div>

        {/* 目次 */}
        <nav className="rounded-xl p-4 mb-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">目次</p>
          <ol className="space-y-1.5 text-sm">
            <li><a href="#choice" className="text-violet-300 hover:text-violet-200 transition">1. VAPEの選び方【3つのポイント】</a></li>
            <li><a href="#type-table" className="text-violet-300 hover:text-violet-200 transition">2. タイプ別比較表</a></li>
            <li><a href="#ranking" className="text-violet-300 hover:text-violet-200 transition">3. 人気ランキング TOP{products.length}</a></li>
            <li><a href="#how" className="text-violet-300 hover:text-violet-200 transition">4. スコアの算出方法</a></li>
          </ol>
        </nav>

        {/* 選び方ガイド */}
        <section id="choice" className="mb-10">
          <h2 className="text-xl font-black text-white mb-5">
            VAPEの選び方【3つのポイント】
          </h2>
          <div className="space-y-4">
            {SELECTION_POINTS.map((p) => (
              <div key={p.num} className="rounded-xl p-5 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-black text-sm shrink-0 mt-0.5">
                    {p.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{p.icon}</span>
                      <h3 className="font-bold text-white text-sm sm:text-base">{p.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* タイプ別比較表 */}
        <section id="type-table" className="mb-10">
          <h2 className="text-xl font-black text-white mb-4">タイプ別比較表</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(139,92,246,0.15)' }}>
                  <th className="text-left px-4 py-3 text-violet-300 font-bold">タイプ</th>
                  <th className="text-center px-3 py-3 text-violet-300 font-bold">手軽さ</th>
                  <th className="text-center px-3 py-3 text-violet-300 font-bold">コスパ</th>
                  <th className="text-center px-3 py-3 text-violet-300 font-bold">カスタム</th>
                  <th className="text-center px-3 py-3 text-violet-300 font-bold">メンテ</th>
                  <th className="text-left px-3 py-3 text-violet-300 font-bold">こんな人に</th>
                </tr>
              </thead>
              <tbody>
                {TYPE_TABLE.map((row, i) => (
                  <tr key={row.type} className="border-t border-white/5" style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td className="px-4 py-3 font-bold text-white">{row.type}</td>
                    <td className="px-3 py-3 text-center text-yellow-400 text-xs">{row.ease}</td>
                    <td className="px-3 py-3 text-center text-yellow-400 text-xs">{row.cost}</td>
                    <td className="px-3 py-3 text-center text-gray-300">{row.customise}</td>
                    <td className="px-3 py-3 text-center text-xs text-gray-400">{row.maintenance}</td>
                    <td className="px-3 py-3 text-xs text-gray-300">{row.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ランキング */}
        <section id="ranking" className="mb-10">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-xl font-black text-white">人気ランキング TOP{products.length}</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_NAV.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/rankings/${cat.slug}`}
                  className="px-3 py-1.5 text-xs font-bold rounded-full border border-violet-500/40 text-violet-300 hover:border-violet-400 hover:bg-violet-500/10 transition"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p>まだランキングデータがありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product, i) => {
                const avgRating =
                  product.reviews.length > 0
                    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
                    : 0

                const rankBadgeStyles = [
                  { label: '🥇' },
                  { label: '🥈' },
                  { label: '🥉' },
                ]
                const medal = i < 3 ? rankBadgeStyles[i].label : null

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="flex items-center gap-4 rounded-xl p-4 transition border border-white/10 hover:border-violet-500/50 group"
                    style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}
                  >
                    {/* ランクバッジ */}
                    <div className="shrink-0 text-center w-10">
                      {medal ? (
                        <span className="text-2xl">{medal}</span>
                      ) : (
                        <span className="text-sm font-black w-8 h-8 rounded-full flex items-center justify-center bg-violet-950/60 text-violet-300 border border-violet-500/30 mx-auto">
                          {i + 1}
                        </span>
                      )}
                    </div>

                    {/* 商品画像 */}
                    {product.imageUrl && (
                      <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-1" loading="lazy" />
                      </div>
                    )}

                    {/* 商品情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 mb-0.5">
                        {categoryLabels[product.category] || product.category} · {product.brand}
                      </div>
                      <div className="font-bold text-sm text-gray-100 group-hover:text-white transition line-clamp-2 leading-snug">{product.name}</div>
                      {product.price && (
                        <div className="text-violet-300 font-bold text-xs mt-1">¥{product.price.toLocaleString()}</div>
                      )}
                    </div>

                    {/* スコア */}
                    <div className="shrink-0 text-right">
                      {product.reviews.length > 0 ? (
                        <>
                          <div className="text-2xl font-black text-violet-300 leading-none">{avgRating.toFixed(1)}</div>
                          <div className="text-xs text-gray-500">/ 5.0点</div>
                          <div className="text-xs text-gray-600 mt-0.5">{product.reviews.length}件</div>
                        </>
                      ) : (
                        <div className="text-xs text-gray-600">レビューなし</div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* 検証方法 */}
        <section id="how" className="rounded-xl p-6 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <h2 className="text-lg font-black text-white mb-4">📊 スコアの算出方法</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            VapeGoのランキングスコアは、ユーザーが投稿した口コミ評価をもとに独自アルゴリズムで算出しています。
            単純な平均点ではなく、レビューの信頼性（品質スコア）・レビュー件数・投稿日時を加重して計算。
            スパム・低品質レビューは自動フィルタリングにより除外されます。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: '口コミ評価', desc: 'ユーザーが5段階で評価した平均点をベースに算出', icon: '⭐' },
              { label: '品質フィルター', desc: 'AIによるスパム・低品質レビューの自動排除', icon: '🤖' },
              { label: 'レビュー件数', desc: '件数が多いほど信頼性が上がりスコアに反映', icon: '📊' },
            ].map(item => (
              <div key={item.label} className="rounded-lg p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="font-bold text-sm text-white mb-1">{item.label}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
