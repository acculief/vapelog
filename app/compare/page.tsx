import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '電子タバコ比較ガイド2026：IQOS vs glo vs VUSE どれがおすすめ？ | VapeGo',
  description: 'IQOS・glo・VUSEを価格・フレーバー数・バッテリー・使いやすさ・コスパの5項目で徹底比較。2026年最新版、初心者向け選び方ガイド付き。',
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '電子タバコ比較ガイド2026：IQOS vs glo vs VUSE',
  description: 'IQOS・glo・VUSEの比較表と選び方ガイド',
  numberOfItems: 3,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'IQOS ILUMA',
      description: 'フィリップモリスの加熱式タバコ。誘導加熱方式でスティックを均一加熱。国内シェアNo.1ブランド。',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'glo hyper X2',
      description: 'ブリティッシュ・アメリカン・タバコの加熱式タバコ。低温加熱で喉へのダメージが少なく、コスパ重視ユーザーに人気。',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'VUSE GO',
      description: 'RJレイノルズ（BAT傘下）のポッド型電子タバコ。リキッド式で豊富なフレーバーが魅力。',
    },
  ],
}

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'IQOS・glo・VUSEのどれが初心者におすすめですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '初心者にはglo hyper X2がおすすめです。価格が最もリーズナブルで操作も簡単。フレーバースティック（ネオスティック）も手軽に入手できます。タバコ感を求めるならIQOS、フレーバーを楽しみたいならVUSE GOが向いています。',
      },
    },
    {
      '@type': 'Question',
      name: 'IQOSとgloはどちらが安いですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '本体価格はgloの方が安く、約5,000〜7,000円前後。IQOSは8,000〜12,000円程度です。ランニングコスト（スティック代）はほぼ同等で、1箱500円前後。gloはキャンペーンでさらに安く入手できることも多いです。',
      },
    },
    {
      '@type': 'Question',
      name: 'VUSEは日本で使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'VUSE GOは日本でも販売されており、コンビニや専門店で入手可能です。ただし日本ではニコチン入りリキッドの販売は薬機法の規制があるため、販売形態が限られる場合があります。購入前に最新の販売状況を確認してください。',
      },
    },
  ],
}

const products = [
  {
    name: 'IQOS ILUMA',
    brand: 'フィリップモリス',
    price: '¥8,980〜',
    flavors: '約30種',
    battery: '約20本分',
    easeOfUse: '⭐⭐⭐⭐',
    costPerformance: '⭐⭐⭐',
    description: 'フィリップモリスが誇る国内シェアNo.1の加熱式タバコ。独自の誘導加熱技術「Smartcore Induction System」でスティックを均一加熱するため、焦げ臭さがなく本格的なたばこ感が楽しめます。IQOSシリーズの豊富なフレーバー展開も魅力で、長年のユーザーに支持されています。',
    pros: ['国内最大のユーザーベースで情報が豊富', '清潔な誘導加熱方式（ブレードなし）', '専用アプリで使用管理が可能'],
    cons: ['本体価格がやや高め', 'TEREA専用スティックが必要', 'デバイスが少し大きい'],
  },
  {
    name: 'glo hyper X2',
    brand: 'ブリティッシュ・アメリカン・タバコ',
    price: '¥5,500〜',
    flavors: '約25種',
    battery: '約20本分',
    easeOfUse: '⭐⭐⭐⭐⭐',
    costPerformance: '⭐⭐⭐⭐⭐',
    description: 'BATが展開するコスパ最強の加熱式タバコ。低温加熱方式を採用しており、喉や肺への刺激が少なく吸いやすいのが特徴です。ネオスティックのバリエーションも豊富で、メンソール系フレーバーが特に充実しています。価格帯が手頃で初心者が最初の1台として選びやすいモデルです。',
    pros: ['本体価格が最も手頃', 'コンパクトで持ち運びやすい', '喉への刺激が少ない低温加熱'],
    cons: ['たばこ感はIQOSより薄め', 'アプリ機能は限定的'],
  },
  {
    name: 'VUSE GO',
    brand: 'RJレイノルズ / BAT',
    price: '¥3,000〜',
    flavors: '約15種',
    battery: '約500パフ',
    easeOfUse: '⭐⭐⭐⭐⭐',
    costPerformance: '⭐⭐⭐⭐',
    description: 'リキッド式のポッド型電子タバコ。加熱式タバコとは異なりたばこ葉を使わず、フレーバーリキッドを気化させて吸うタイプです。フルーティーなフレーバーや清涼感のあるメンソール系など個性的なラインナップが揃い、たばこ感よりもフレーバー体験を重視するユーザーに最適です。',
    pros: ['フレーバーの多様性が最大', '本体が非常にコンパクト', '使い捨てタイプで手軽'],
    cons: ['日本でのニコチン含有品は入手制限あり', 'たばこ代替としての満足感は人による'],
  },
]

const compareItems = [
  { label: '価格（本体）', key: 'price' },
  { label: 'フレーバー数', key: 'flavors' },
  { label: 'バッテリー持ち', key: 'battery' },
  { label: '使いやすさ', key: 'easeOfUse' },
  { label: 'コスパ', key: 'costPerformance' },
]

const faqs = [
  {
    q: 'IQOS・glo・VUSEのどれが初心者におすすめですか？',
    a: '初心者にはglo hyper X2がおすすめです。価格が最もリーズナブルで操作も簡単。フレーバースティック（ネオスティック）も手軽に入手できます。タバコ感を求めるならIQOS、フレーバーを楽しみたいならVUSE GOが向いています。',
  },
  {
    q: 'IQOSとgloはどちらが安いですか？',
    a: '本体価格はgloの方が安く、約5,000〜7,000円前後。IQOSは8,000〜12,000円程度です。ランニングコスト（スティック代）はほぼ同等で、1箱500円前後。gloはキャンペーンでさらに安く入手できることも多いです。',
  },
  {
    q: 'VUSEは日本で使えますか？',
    a: 'VUSE GOは日本でも販売されており、コンビニや専門店で入手可能です。ただし日本ではニコチン入りリキッドの販売は薬機法の規制があるため、販売形態が限られる場合があります。購入前に最新の販売状況を確認してください。',
  },
]

export default function CompareGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex gap-1 items-center">
          <Link href="/" className="hover:text-violet-400 transition">ホーム</Link>
          <span>/</span>
          <span className="text-gray-300">比較ガイド</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <span className="inline-block bg-violet-500/20 text-violet-300 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-violet-500/30">
            2026年最新版
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">
            電子タバコ比較ガイド2026：IQOS vs glo vs VUSE どれがおすすめ？
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            国内で人気の3大ブランド「IQOS」「glo」「VUSE」を価格・フレーバー数・バッテリー・使いやすさ・コスパの5項目で徹底比較。自分に合う1台が見つかるガイドです。
          </p>
        </div>

        {/* Comparison Table */}
        <section className="mb-14">
          <h2 className="text-lg font-black text-white mb-5 pb-2 border-b border-violet-500/20">
            📊 5項目徹底比較表
          </h2>
          <div className="overflow-x-auto rounded-xl border border-violet-500/20" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-r border-white/10 w-32" style={{ background: 'rgba(124,58,237,0.08)' }}>
                    項目
                  </th>
                  {products.map((p) => (
                    <th key={p.name} className="p-4 text-center border-b border-r border-white/10 last:border-r-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="font-black text-white text-sm">{p.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{p.brand}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareItems.map((item, idx) => (
                  <tr key={item.key} className={idx < compareItems.length - 1 ? 'border-b border-white/5' : ''}>
                    <td className="p-4 border-r border-white/10 text-xs font-semibold text-gray-400" style={{ background: 'rgba(124,58,237,0.06)' }}>
                      {item.label}
                    </td>
                    {products.map((p) => (
                      <td key={p.name} className="p-4 border-r border-white/10 last:border-r-0 text-center text-gray-200 font-medium">
                        {p[item.key as keyof typeof p] as string}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-2">※価格・フレーバー数は2026年1月時点の情報です。実際の価格は販売店により異なります。</p>
        </section>

        {/* Product Details */}
        <section className="mb-14">
          <h2 className="text-lg font-black text-white mb-6 pb-2 border-b border-violet-500/20">
            🔍 各製品の詳細
          </h2>
          <div className="space-y-8">
            {products.map((p, idx) => (
              <div key={p.name} className="rounded-2xl border border-violet-500/20 overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-lg" style={{ background: 'rgba(124,58,237,0.5)' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{p.name}</h3>
                      <span className="text-xs text-violet-300">{p.brand}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-5">{p.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <div className="text-xs font-bold text-emerald-400 mb-2">👍 メリット</div>
                      <ul className="space-y-1">
                        {p.pros.map((pro) => (
                          <li key={pro} className="text-xs text-gray-300 flex items-start gap-1.5">
                            <span className="text-emerald-400 mt-0.5">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <div className="text-xs font-bold text-red-400 mb-2">👎 デメリット</div>
                      <ul className="space-y-1">
                        {p.cons.map((con) => (
                          <li key={con} className="text-xs text-gray-300 flex items-start gap-1.5">
                            <span className="text-red-400 mt-0.5">×</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendation */}
        <section className="mb-14 rounded-2xl p-6 border border-violet-500/30" style={{ background: 'rgba(124,58,237,0.1)' }}>
          <h2 className="text-lg font-black text-white mb-4">🏆 結論：どれがおすすめ？</h2>
          <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <p><strong className="text-violet-300">初心者・コスパ重視 → glo hyper X2</strong>：本体が最も安く、操作も簡単。まず試してみたい方に最適です。</p>
            <p><strong className="text-violet-300">本格タバコ感・サポート重視 → IQOS ILUMA</strong>：国内ユーザーが最も多く情報が豊富。タバコから移行したい方に向いています。</p>
            <p><strong className="text-violet-300">フレーバー重視・スタイリッシュ → VUSE GO</strong>：個性的なフレーバーを楽しみたい方、使い捨てで気軽に試したい方におすすめ。</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-lg font-black text-white mb-6 pb-2 border-b border-violet-500/20">
            ❓ よくある質問
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group rounded-xl border border-violet-500/20 overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <summary className="p-5 cursor-pointer font-bold text-sm text-white flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-violet-400 ml-4 flex-shrink-0">▼</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-lg font-black text-white mb-4 pb-2 border-b border-violet-500/20">
            📖 関連ガイド
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/guide/vape-for-beginners-2026" className="rounded-xl p-4 border border-violet-500/20 hover:border-violet-400/40 transition" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-xs text-violet-400 mb-1">ガイド</div>
              <div className="text-sm font-bold text-white">2026年版：電子タバコ初心者が最初に知っておくべき10のこと</div>
            </Link>
            <Link href="/guide/vape-flavor-guide" className="rounded-xl p-4 border border-violet-500/20 hover:border-violet-400/40 transition" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-xs text-violet-400 mb-1">ガイド</div>
              <div className="text-sm font-bold text-white">電子タバコフレーバー完全ガイド：初心者におすすめの味ランキング</div>
            </Link>
            <Link href="/guide/how-to-choose" className="rounded-xl p-4 border border-violet-500/20 hover:border-violet-400/40 transition" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-xs text-violet-400 mb-1">ガイド</div>
              <div className="text-sm font-bold text-white">VAPEの選び方｜初心者がまず知るべき4つのポイント</div>
            </Link>
            <Link href="/guide" className="rounded-xl p-4 border border-violet-500/20 hover:border-violet-400/40 transition" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-xs text-violet-400 mb-1">一覧</div>
              <div className="text-sm font-bold text-white">VAPEガイド一覧を見る</div>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
