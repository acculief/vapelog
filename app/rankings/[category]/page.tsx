import { getProducts } from '@/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const CATEGORY_META: Record<string, {
  h1: string; title: string; desc: string;
  points: { title: string; body: string; icon: string }[]
}> = {
  pod: {
    h1: 'ポッド型VAPEランキング',
    title: '【2026年最新】ポッド型VAPEおすすめランキング | VapeGo',
    desc: 'ポッド型VAPEのおすすめランキング【2026年最新版】。持ち運びやすさ・コスパ・使いやすさで比較した人気機種。',
    points: [
      { icon: '🔋', title: 'バッテリー容量は400mAh以上を選ぼう', body: '1日外出するなら400mAh以上のバッテリーが安心。充電頻度が少なく、ビジネスシーンや外出先でもストレスなく使えます。' },
      { icon: '💧', title: 'オープン型かクローズド型かをチェック', body: 'オープン型は好きなリキッドを入れられコスパ◎。クローズド型（カートリッジ式）はリキッド漏れが少なく手軽。用途で選ぼう。' },
      { icon: '💰', title: '交換コイルの価格も比較ポイント', body: 'コイル1個300〜800円が相場。月2〜4個使うので年間コストも計算しておくと失敗しません。' },
    ],
  },
  starter: {
    h1: '初心者向けスターターキットランキング',
    title: '【2026年版】VAPE初心者スターターキットランキング | VapeGo',
    desc: 'VAPE初心者向けスターターキットランキング【2026年最新版】。操作簡単・リキッド付きのセットを比較して厳選。',
    points: [
      { icon: '🎯', title: 'セット内容が充実しているものを選ぼう', body: 'デバイス本体＋コイル＋リキッドがセットになったものが便利。追加購入の手間なくすぐ始められます。' },
      { icon: '⚙️', title: '操作ボタンが少ないシンプル設計がベスト', body: '初心者はドローアクティベート（吸うだけで起動）または1ボタン操作のデバイスがおすすめ。設定不要ですぐ使えます。' },
      { icon: '📞', title: '日本語サポートがあるブランドを選ぼう', body: '故障や使い方のトラブル時に日本語サポートがあると安心。国内正規代理店経由の製品がおすすめです。' },
    ],
  },
  boxmod: {
    h1: 'BOX MODランキング',
    title: '【2026年版】BOX MODおすすめランキング｜上級者向け | VapeGo',
    desc: 'BOX MODおすすめランキング【2026年最新版】。出力・バッテリー・カスタム性で徹底比較したハイパワー機種。',
    points: [
      { icon: '⚡', title: '出力ワット数は使い方に合わせて選ぼう', body: '一般的な使用なら40〜80W。クラウドチェイシングやサブオームコイルには100W以上が必要。最大出力より実用レンジで判断。' },
      { icon: '🔋', title: 'バッテリーは交換式か内蔵型かで選ぶ', body: '交換式（18650/21700）は長期使用に有利でコスト削減◎。内蔵型はUSB充電で手軽だが劣化したら本体買い替えが必要。' },
      { icon: '🛡️', title: '安全機能の充実度を確認しよう', body: '過充電保護・ショート保護・過熱保護は必須。GeekVape・VoopooなどメジャーブランドのチップはOHM値チェックも備えています。' },
    ],
  },
  liquid: {
    h1: 'VAPEリキッドランキング',
    title: '【2026年版】VAPEリキッドおすすめランキング｜フレーバー別 | VapeGo',
    desc: 'VAPEリキッドおすすめランキング【2026年最新版】。フルーツ・メンソール・タバコ系フレーバー別に人気商品を比較。',
    points: [
      { icon: '🧪', title: 'PG/VG比率で吸い心地が変わる', body: 'PG高め（60:40以上）はのどへのキック感が強く、タバコに近い感覚。VG高め（30:70以上）は煙量が多くまろやか。初心者は50:50が無難。' },
      { icon: '🌸', title: 'フレーバー系統は試してから選ぼう', body: 'フルーツ・メンソール・タバコ・デザート系が主流。10mlの小容量からお試しして、気に入ったら大容量を買うのが無駄がなくおすすめ。' },
      { icon: '🔬', title: '成分表示と製造国を必ず確認', body: '食品グレードの原料使用・製造元が明記されているものを選ぼう。規制成分が含まれていないかの確認も重要です。' },
    ],
  },
  disposable: {
    h1: '使い捨てVAPEランキング',
    title: '【2026年版】使い捨てVAPEおすすめランキング｜コスパ比較 | VapeGo',
    desc: '使い捨てVAPEおすすめランキング【2026年最新版】。パフ数・フレーバー・コスパで比較した人気ディスポーザブル機種。',
    points: [
      { icon: '💨', title: 'パフ数と1パフあたりのコストで比較しよう', body: '1本300円台で500パフなら1パフ約0.6円。高品質な600〜800円帯で800パフ超のモデルはコスパも高め。長持ちするほど割安になる。' },
      { icon: '🍃', title: 'フレーバーは多いほど選択肢が広がる', body: 'メンソール・フルーツ・ミント系が初心者に人気。同ブランドで複数フレーバーがある製品は、シリーズで試せて便利です。' },
      { icon: '♻️', title: '捨て方ルールを事前に確認しよう', body: 'バッテリー内蔵のため一般ゴミでは捨てられない自治体が多い。購入前に各自治体の廃棄ルールを確認しておきましょう。' },
    ],
  },
  parts: {
    h1: 'VAPEコイル・パーツランキング',
    title: '【2026年版】VAPEコイル・パーツおすすめランキング | VapeGo',
    desc: 'VAPEコイル・交換パーツのランキング【2026年最新版】。対応機種・抵抗値・寿命で比較したおすすめパーツ。',
    points: [
      { icon: '🔧', title: '対応機種を必ず確認してから購入', body: 'コイルは機種専用設計がほとんど。型番・シリーズ名を確認してから購入しましょう。互換コイルは安価ですが性能差がある場合もあります。' },
      { icon: '⚡', title: '抵抗値（Ω）は使用ワット数に合わせて選ぶ', body: '0.3Ω以下はサブオームで高ワット・大煙量向け。0.6〜1.0Ωは中〜低ワットで吸いごたえ重視。デバイスの推奨レンジに収める。' },
      { icon: '📦', title: '純正品とOEM品の違いを理解しよう', body: '純正品は品質安定・安全だが単価高め。OEM互換品はコスパ良だが品質にばらつきあり。まずは純正でベンチマークを取るのが基本。' },
    ],
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

export const revalidate = 0

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((category) => ({ category }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const meta = CATEGORY_META[category]
  if (!meta) return {}
  return {
    title: meta.title,
    description: meta.desc,
    alternates: { canonical: `https://www.vape-go.com/rankings/${category}` },
  }
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
    url: `https://www.vape-go.com/rankings/${category}`,
    itemListElement: products.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://www.vape-go.com/products/${p.id}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <nav className="text-xs text-gray-500 mb-5 flex items-center gap-2">
          <Link href="/" className="hover:text-violet-400 transition">ホーム</Link>
          <span>/</span>
          <Link href="/rankings" className="hover:text-violet-400 transition">ランキング</Link>
          <span>/</span>
          <span className="text-gray-400">{meta.h1}</span>
        </nav>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold">2026年3月 最終更新</span>
            <span className="text-xs text-gray-500">{products.length}商品掲載</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{meta.h1}</h1>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">{meta.desc}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORY_NAV.map((cat) => (
            <Link key={cat.slug} href={`/rankings/${cat.slug}`}
              className={`px-3 py-1.5 text-xs font-bold rounded-full border transition ${
                cat.slug === category
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : 'border-violet-500/40 text-violet-300 hover:border-violet-400 hover:bg-violet-500/10'
              }`}>
              {cat.label}
            </Link>
          ))}
        </div>

        {/* 選び方ポイント */}
        <section className="mb-10">
          <h2 className="text-lg font-black text-white mb-4">選び方のポイント</h2>
          <div className="space-y-3">
            {meta.points.map((p, i) => (
              <div key={i} className="flex gap-3 rounded-xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white font-black text-xs shrink-0 mt-0.5">{i + 1}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{p.icon}</span>
                    <h3 className="font-bold text-sm text-white">{p.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>このカテゴリの商品はまだありません</p>
            <Link href="/rankings" className="text-violet-400 hover:text-violet-300 mt-4 inline-block text-sm">← 総合ランキングを見る</Link>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-black text-white mb-4">人気ランキング TOP{products.length}</h2>

            {heroProducts.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-4 mb-5">
                {heroProducts.map((product, i) => {
                  const avgRating = product.reviews.length > 0
                    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length : 0
                  const medals = ['🥇 1位', '🥈 2位', '🥉 3位']
                  const badgeBg = ['from-yellow-400 to-amber-500', 'from-gray-300 to-gray-400', 'from-orange-400 to-amber-600']
                  return (
                    <Link key={product.id} href={`/products/${product.id}`}
                      className="rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition group"
                      style={{ background: 'rgba(255,255,255,0.06)' }}>
                      {/* imageUrl fallback */
                        <div className="w-full h-36 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-violet-900/20"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-violet-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                          )}
                        </div>
                      )}
                      <div className="p-3">
                        <div className={`inline-block px-2 py-0.5 text-xs font-black text-white rounded-full mb-2 bg-gradient-to-r ${badgeBg[i]}`}>{medals[i]}</div>
                        <h3 className="font-bold text-sm text-white leading-snug mb-1 group-hover:text-violet-300 transition line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-black text-violet-300">{avgRating > 0 ? avgRating.toFixed(1) : '-'}<span className="text-xs text-gray-500 font-normal ml-1">点</span></div>
                          {!!product.price && <div className="text-violet-300 font-bold text-xs">¥{product.price.toLocaleString()}</div>}
                        </div>
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
                    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length : 0
                  return (
                    <Link key={product.id} href={`/products/${product.id}`}
                      className="flex items-center gap-3 rounded-xl p-4 border border-white/10 hover:border-violet-500/50 transition group"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <span className="text-sm font-black w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-violet-950/60 text-violet-300 border border-violet-500/30">{rank}</span>
                      {/* imageUrl fallback */
                        <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-0.5" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-violet-900/20"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-violet-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-0.5">{product.brand}</div>
                        <div className="font-bold text-sm truncate text-gray-100 group-hover:text-white">{product.name}</div>
                        {!!product.price && <div className="text-violet-300 text-xs mt-0.5">¥{product.price.toLocaleString()}</div>}
                      </div>
                      <div className="shrink-0 text-right">
                        {avgRating > 0 ? (
                          <>
                            <div className="text-xl font-black text-violet-300 leading-none">{avgRating.toFixed(1)}</div>
                            <div className="text-xs text-gray-600">{product.reviews.length}件</div>
                          </>
                        ) : <div className="text-xs text-gray-600">-</div>}
                      </div>
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
