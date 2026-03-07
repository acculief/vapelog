import { getProducts } from '@/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Slug = 'pod' | 'mod' | 'disposable' | 'liquid' | 'shisha' | 'cbd' | 'starter'

const CATEGORY_META: Record<Slug, {
  h1: string
  title: string
  desc: string
  dbCategory: string
  faq: { q: string; a: string }[]
}> = {
  pod: {
    h1: 'ポッド型電子タバコ おすすめ人気ランキング',
    title: 'ポッド型電子タバコ おすすめ人気ランキング2025 | VapeGo',
    desc: 'ポッド型電子タバコ（Pod Vape）は、コンパクトなボディに交換式ポッドを採用した次世代型VAPE。リキッドの交換が簡単で持ち運びにも優れ、初心者から上級者まで幅広いユーザーに支持されています。このページでは口コミ評価・スペック・コスパを総合的に比較したおすすめ機種をランキング形式でご紹介します。',
    dbCategory: 'pod',
    faq: [
      {
        q: 'ポッド型VAPEとは何ですか？',
        a: 'ポッド型VAPEとは、カートリッジ（ポッド）を差し替えて使用するコンパクトな電子タバコです。リキッドを自分で補充するタイプと、使い捨てポッドを交換するタイプがあります。充電はUSB-C対応機種が主流で、持ち運びに便利なスティック型・スクエア型が多く揃っています。',
      },
      {
        q: 'ポッド型VAPEは初心者でも使えますか？',
        a: 'はい、ポッド型はVAPE入門に最適です。設定不要でボタン1つ（または吸引だけ）で使えるオートモード対応機種が多く、BOX MODのような複雑な操作も不要。リキッドの漏れも少なく、日常使いしやすい設計になっています。',
      },
      {
        q: 'ポッド型VAPEを選ぶときのポイントは？',
        a: 'バッテリー容量（mAh）・ポッド容量（mL）・対応リキッドの種類（フリーベース／ニコチン塩）の3点を確認しましょう。外出が多い方は大容量バッテリーモデル、フレーバーを楽しみたい方はメッシュコイル搭載モデルがおすすめです。',
      },
    ],
  },
  mod: {
    h1: 'BOX MOD おすすめ人気ランキング',
    title: 'BOX MOD おすすめ人気ランキング2025【上級者向け】 | VapeGo',
    desc: 'BOX MOD（ボックスモッド）はハイパワー出力と豊富なカスタマイズ性が特徴の本格派VAPE。テクニカルMODとメカニカルMODの2種類があり、アトマイザー・コイルを自由に組み合わせて自分だけの一台を作れます。このページでは出力スペック・バッテリー持続時間・使いやすさを比較したおすすめBOX MODをランキングでご紹介します。',
    dbCategory: 'boxmod',
    faq: [
      {
        q: 'BOX MODとは何ですか？',
        a: 'BOX MODとは、四角いボックス型の本体にアトマイザー（霧化器）を取り付けて使うVAPEデバイスです。出力（ワット数）を細かく調整でき、温度管理モードやTC（テンプコン）モードなど高度な機能を備えたモデルも多数あります。ポッド型より大きいですが、出力・蒸気量・カスタム性は圧倒的に優れています。',
      },
      {
        q: 'BOX MODは初心者には難しいですか？',
        a: '基本的な操作は難しくありませんが、アトマイザーの選択・コイルの組み方など学習コストがあります。初心者はまずスターターキットやポッド型で慣れてから、BOX MODにステップアップするのがおすすめです。近年はシンプルな操作のシングルバッテリーMODも増えています。',
      },
      {
        q: 'BOX MODのバッテリーは交換できますか？',
        a: '多くのBOX MODは18650・21700・20700などの外部バッテリーを使用しており、バッテリーを交換するだけで連続使用が可能です。内蔵バッテリー型もありますが、長時間使用するなら交換式バッテリー対応モデルが便利です。',
      },
    ],
  },
  disposable: {
    h1: '使い捨て電子タバコ おすすめ人気ランキング',
    title: '使い捨て電子タバコ おすすめ人気ランキング2025 | VapeGo',
    desc: '使い捨て電子タバコ（ディスポーザブルVAPE）は、充電・リキッド補充不要ですぐに使えるお手軽VAPE。コンビニやドラッグストアでも購入でき、VAPE初体験やサブデバイスとして人気急上昇中です。このページでは吸引回数・フレーバーの豊富さ・コスパを比較したおすすめ使い捨てVAPEをランキングでご紹介します。',
    dbCategory: 'disposable',
    faq: [
      {
        q: '使い捨て電子タバコはどこで買えますか？',
        a: 'コンビニ（セブン-イレブン・ファミリーマート・ローソン）、ドラッグストア、ドン・キホーテなどで購入できます。また、VAPEショップや公式オンラインストアでは種類が豊富です。日本では加熱式・ニコチンなしのものが主流です。',
      },
      {
        q: '使い捨てVAPEは何回吸えますか？',
        a: '製品によって異なりますが、一般的なモデルは300〜600パフ（吸引回数）が目安です。大容量モデルでは2,000〜5,000パフに対応するものもあります。1日に50パフ程度吸うとすると、スタンダードモデルで約1週間使用できます。',
      },
      {
        q: '使い捨て電子タバコの捨て方は？',
        a: '使い捨てVAPEはリチウムバッテリーを内蔵しているため、燃えるゴミや燃えないゴミには捨てられません。お住まいの自治体のルールに従い、家電量販店やVAPEショップのバッテリー回収ボックスに持ち込むか、小型家電として回収に出してください。',
      },
    ],
  },
  liquid: {
    h1: 'VAPEリキッド おすすめ人気ランキング',
    title: 'VAPEリキッド おすすめ人気ランキング2025 | VapeGo',
    desc: 'VAPEリキッドはフレーバーの種類が豊富で、自分好みの味を楽しめるのが魅力。フルーツ・メンソール・タバコ・スイーツ系まで幅広いフレーバーをランキング形式でご紹介します。',
    dbCategory: 'liquid',
    faq: [
      {
        q: 'VAPEリキッドの選び方は？',
        a: 'PG/VGの比率とニコチン濃度を確認しましょう。PG多めは喉への刺激が強くフレーバーが立ち、VG多めは蒸気量が多くなります。初心者はPG:VG=50:50のバランス型がおすすめです。',
      },
      {
        q: '国産と海外リキッドの違いは？',
        a: '国産リキッドは日本人の味覚に合わせたフレーバー開発が強みで品質管理も安心。海外産はコスパが高くバリエーションが豊富です。',
      },
      {
        q: 'リキッドの保存方法は？',
        a: '直射日光・高温・湿気を避けて保存してください。開封後は冷暗所で保管し、なるべく早めに使い切りましょう。',
      },
    ],
  },
  shisha: {
    h1: '電子シーシャ おすすめ人気ランキング',
    title: '電子シーシャ おすすめ人気ランキング2025 | VapeGo',
    desc: '電子シーシャ（ポケットシーシャ）は充填不要ですぐに楽しめる手軽なシーシャデバイス。フルーツ・ミント系など多彩なフレーバーをランキング形式でご紹介します。',
    dbCategory: 'shisha',
    faq: [
      {
        q: '電子シーシャとは何ですか？',
        a: '水タバコ（シーシャ）の風味を電子的に再現したデバイスです。充填・炭・専用機器が不要で気軽に楽しめます。',
      },
      {
        q: '電子シーシャは本格シーシャと同じですか？',
        a: '完全に同じではありませんが、似た風味と大きな蒸気を楽しめます。準備が簡単で後片付けも不要なのが特徴です。',
      },
      {
        q: 'おすすめのフレーバーは？',
        a: '定番はミント・マンゴー・ウォーターメロン。初心者はメンソール系から試すのがおすすめです。',
      },
    ],
  },
  cbd: {
    h1: 'CBD商品 おすすめ人気ランキング',
    title: 'CBD商品 おすすめ人気ランキング2025 | VapeGo',
    desc: 'CBDオイル・CBDリキッド・CBDスターターキットのおすすめをランキング形式でご紹介。日本で購入できる安全・合法なCBD製品を比較します。',
    dbCategory: 'cbd',
    faq: [
      {
        q: 'CBDとは何ですか？合法ですか？',
        a: 'CBD（カンナビジオール）は大麻草に含まれる成分ですが、THCを含まず日本では合法的に販売されています。リラックス効果が期待されます。',
      },
      {
        q: 'CBD VAPEリキッドの選び方は？',
        a: 'CBD濃度（mg表示）を確認しましょう。初心者は低濃度（150〜300mg）から試し、慣れてきたら濃度を上げていくのがおすすめです。',
      },
      {
        q: 'CBDリキッドは通常のVAPEで使えますか？',
        a: '一般的なVAPEデバイスでも使用できるCBDリキッドが多く販売されています。コイルの種類と推奨VG比率を確認してから使用してください。',
      },
    ],
  },
  starter: {
    h1: 'VAPEスターターキット おすすめ人気ランキング',
    title: 'VAPEスターターキット おすすめ人気ランキング2025 | VapeGo',
    desc: 'VAPE初心者に最適なスターターキットをランキングでご紹介。リキッドチャージ式VAPEは繰り返し使えてコスパ抜群。様々なタイプのスターターセットをスペック・使いやすさ・価格で比較します。',
    dbCategory: 'starter',
    faq: [
      {
        q: 'VAPEスターターキットとは何ですか？',
        a: 'VAPEを始めるために必要なデバイス本体・コイル・ポッドなどが一式揃ったセット商品です。初心者が迷わず始められるよう設計されています。',
      },
      {
        q: 'スターターキットはどれを選べばいいですか？',
        a: '吸い方（MTL：タバコに近い吸い方 / DTL：大量蒸気）を先に決めましょう。初心者にはMTL対応の小型・軽量・操作が簡単なPOD型がおすすめです。',
      },
      {
        q: 'コストはどのくらいかかりますか？',
        a: 'デバイス本体は3,000〜10,000円程度。リキッドは60mlで1,000〜2,000円、コイルは5個入り500〜1,500円程度です。',
      },
    ],
  },
}

export const revalidate = 0

export async function generateStaticParams() {
  return (['pod', 'mod', 'disposable', 'liquid', 'shisha', 'cbd', 'starter'] as Slug[]).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const meta = CATEGORY_META[slug as Slug]
  if (!meta) return {}
  return {
    title: meta.title,
    description: meta.desc,
    alternates: { canonical: `https://www.vape-go.com/category/${slug}` },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meta = CATEGORY_META[slug as Slug]
  if (!meta) notFound()

  let products: any[] = []
  try {
    const raw = await getProducts({ category: meta.dbCategory, limit: 24, orderBy: 'rankScore' })
    products = raw.map(p => ({
      ...p,
      reviews: (p.reviews || []).filter((r: any) => r.status === 'visible'),
    }))
  } catch (e) {
    console.error(e)
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: meta.h1,
    description: meta.desc,
    url: `https://www.vape-go.com/category/${slug}`,
    itemListElement: products.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://www.vape-go.com/products/${p.id}`,
    })),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: meta.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-violet-400 transition">ホーム</Link>
          <span>/</span>
          <span className="text-gray-400">{meta.h1}</span>
        </nav>

        {/* ヒーロー */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">{meta.h1}</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">{meta.desc}</p>
        </div>

        {/* 商品一覧 */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white mb-4">おすすめ商品一覧</h2>
          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-sm">このカテゴリの商品はまだ登録されていません</p>
              <Link href="/search" className="text-violet-400 hover:text-violet-300 mt-4 inline-block text-sm">商品を検索する →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, i) => {
                const avgRating = product.reviews.length > 0
                  ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
                  : 0
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition group"
                    style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
                  >
                    <div className="w-full h-44 overflow-hidden flex items-center justify-center" style={{ background: product.imageUrl ? 'rgba(255,255,255,0.03)' : 'rgba(93,69,146,0.12)' }}>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-violet-900/20 w-full h-full"><svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-violet-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs text-gray-500 truncate">{product.brand}</span>
                      </div>
                      <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2 text-gray-100 group-hover:text-white transition">
                        {product.name}
                      </h3>
                      {product.reviews.length > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map(s => (
                            <svg key={s} className={`w-3 h-3 ${s <= Math.round(avgRating) ? 'text-violet-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs font-medium text-gray-300 ml-1">{avgRating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500">({product.reviews.length}件)</span>
                        </div>
                      )}
                      {product.price && (
                        <p className="text-violet-300 font-bold text-sm">¥{product.price.toLocaleString()}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-black text-white mb-6">よくある質問</h2>
          <div className="space-y-4">
            {meta.faq.map(({ q, a }, i) => (
              <div
                key={i}
                className="rounded-xl border border-violet-500/20 p-5"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <dt className="font-bold text-white mb-2 flex items-start gap-2">
                  <span className="text-violet-400 shrink-0 font-black">Q.</span>
                  {q}
                </dt>
                <dd className="text-sm text-gray-400 leading-relaxed pl-6">{a}</dd>
              </div>
            ))}
          </div>
        </section>

        {/* 関連リンク */}
        <section>
          <h2 className="text-base font-bold text-white mb-4">関連ページ</h2>
          <div className="flex flex-wrap gap-3">
            <Link href={`/rankings/${slug === 'mod' ? 'boxmod' : slug}`}
              className="text-sm px-4 py-2 rounded-full border border-violet-500/40 text-violet-300 hover:border-violet-400 hover:bg-violet-500/10 transition">
              {meta.h1} ランキング →
            </Link>
            <Link href="/compare"
              className="text-sm px-4 py-2 rounded-full border border-violet-500/40 text-violet-300 hover:border-violet-400 hover:bg-violet-500/10 transition">
              スペック比較 →
            </Link>
            <Link href="/guide/how-to-choose"
              className="text-sm px-4 py-2 rounded-full border border-violet-500/40 text-violet-300 hover:border-violet-400 hover:bg-violet-500/10 transition">
              VAPEの選び方ガイド →
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
