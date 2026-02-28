import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ARTICLES, getArticle } from '../articles'

export const revalidate = 86400

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  return {
    title: `${article.title} | VapeGo`,
    description: article.description,
  }
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-xl font-black text-white mt-8 mb-3 pb-2 border-b border-violet-500/20">
          {line.replace('## ', '')}
        </h2>
      )
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="text-gray-300 text-sm ml-4 mb-1 list-disc">
          {line.replace('- ', '')}
        </li>
      )
    } else if (line.startsWith('[IMG:')) {
      const match = line.match(/\[IMG:([^\|]+)\|([^\]]+)\]/)
      if (match) {
        elements.push(
          <div key={key++} className="my-6 rounded-xl overflow-hidden border border-white/10">
            <img
              src={match[1]}
              alt={match[2]}
              className="w-full h-44 sm:h-56 object-cover opacity-85"
              loading="lazy"
            />
            <p className="text-xs text-gray-500 text-center py-1.5 px-2">{match[2]}</p>
          </div>
        )
      }
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />)
    } else {
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      elements.push(
        <p key={key++} className="text-gray-300 text-sm leading-relaxed mb-2">
          {parts.map((part, i) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={i} className="text-white font-bold">{part.replace(/\*\*/g, '')}</strong>
              : part
          )}
        </p>
      )
    }
  }
  return elements
}

const SLUG_SEARCH_QUERIES: Record<string, string> = {
  'what-is-vape': 'ヴェポライザー',
  'how-to-choose': 'スターターキット',
  'pod-vs-boxmod': 'ポッド型',
  'beginner-setup': 'スターターキット',
  'maintenance': 'コイル',
  'liquid-guide': 'リキッド',
  'vape-for-beginners-2025': '初心者 VAPE',
  'vape-coil-types': 'VAPEコイル',
  'vape-smell': 'VAPEにおい',
  'vape-quit-smoking': 'VAPE禁煙',
  'vape-accessories': 'VAPEアクセサリー',
  'vape-travel': '旅行 VAPE',
  'vape-japanese-brands': '日本 VAPEブランド',
  'vape-rules-japan': 'VAPE 法律',
}

const FAQ_DATA: Record<string, { q: string; a: string }[]> = {
  'what-is-vape': [
    { q: 'ヴェポライザーとは何ですか？', a: 'たばこ葉やリキッドを燃焼させずに加熱し、蒸気を吸引するデバイスです。燃やさないためタールや一酸化炭素の発生を大幅に抑えられます。' },
    { q: '電子タバコ・加熱式タバコ・ヴェポライザーの違いは？', a: '加熱式タバコ（iQOS等）は専用スティックを電気で加熱、ニコチンリキッドVAPEはリキッドを気化、乾式ヴェポライザーはたばこ葉をそのまま加熱します。消耗品・使用感がそれぞれ異なります。' },
    { q: 'ヴェポライザーのメリットは？', a: 'においが少ない・コストが抑えられる・フレーバーを楽しめるの3点が主なメリットです。燃焼させないため煙臭さが格段に少なく、長期的なコストも低く抑えられます。' },
  ],
  'how-to-choose': [
    { q: '初心者はどんなVAPEを選べばいいですか？', a: 'まずはポッド型かスターターキットがおすすめです。操作が簡単で価格も3,000〜8,000円程度と手頃で、コイル交換の手間も最小限です。' },
    { q: 'VAPEを選ぶときのポイントは？', a: '予算・使用シーン・操作のしやすさ・カスタム性の4つが判断基準です。外出先中心ならポッド型、自宅でじっくり使いたいならBOX MODが向いています。' },
    { q: 'VAPEの予算はどのくらい必要ですか？', a: '入門は3,000円以下の使い捨てまたは超入門モデル。コスパと使いやすさのバランスが良いゾーンは3,000〜8,000円のポッド型・スターターキットです。' },
  ],
  'pod-vs-boxmod': [
    { q: 'ポッド型VAPEの特徴は？', a: 'コンパクトで操作が簡単。ポケットに収まるサイズで、吸うだけで動作するオートドロー方式が多く初心者向きです。カスタム性はBOX MODより低めです。' },
    { q: 'BOX MODの特徴は？', a: '出力ワット数・温度・抵抗値など細かい設定が可能でカスタム性が高い。蒸気量が豊富で上級者向けですが、サイズが大きく設定の学習コストがかかります。' },
    { q: 'ポッド型とBOX MODどちらを先に買うべきですか？', a: 'まずポッド型から始め、VAPEの楽しさに慣れてきたらBOX MODへのステップアップがスムーズです。ポッド型は操作が簡単で失敗しにくいためです。' },
  ],
  'beginner-setup': [
    { q: 'VAPEを購入したら最初に何をすればいいですか？', a: 'フル充電（1〜2時間）→リキッド補充→プライミング（5〜10分待機）→少量から試吸い、の順番が正しいスタートです。' },
    { q: 'プライミングとは何ですか？', a: 'コイルのコットンにリキッドを馴染ませる作業です。リキッド補充後5〜10分待つだけで、焦げ臭さや喉への刺激を防げます。スキップすると「焦げ臭い」「喉が痛い」原因になります。' },
    { q: 'VAPEコイルの交換サインは？', a: '焦げたようなにおいがする・フレーバーが薄くなった・蒸気量が著しく減少した、の3つが主なサインです。使用頻度にもよりますが1〜2週間が目安です。' },
  ],
  'maintenance': [
    { q: 'VAPEコイルの寿命はどのくらいですか？', a: '使用頻度にもよりますが、一般的に1〜2週間が目安です。焦げ臭さ・フレーバーの薄れ・蒸気量の低下が交換サインです。' },
    { q: 'VAPEタンクの清掃方法は？', a: 'コイルを外してリキッドをふき取り、温水でタンク内をすすいで完全乾燥させます。週1回程度、またはリキッドを変えるタイミングで清掃しましょう。' },
    { q: 'VAPEのバッテリーを長持ちさせるには？', a: '過充電・過放電を避けることが重要です。充電完了後はすぐにケーブルを外し、完全放電状態を長時間放置しないようにしましょう。' },
  ],
  'liquid-guide': [
    { q: 'PG/VG比率とは何ですか？', a: 'VAPEリキッドのベース液の配合比率です。PGが多いと喉への刺激（スロートヒット）が強くフレーバーが際立ち、VGが多いと蒸気量が増えまろやかな口当たりになります。' },
    { q: '初心者はどのPG/VG比率がおすすめですか？', a: 'PG50/VG50前後のバランス型が汎用性が高くおすすめです。スロートヒット重視ならPG70/VG30、蒸気量重視ならPG30/VG70を選びましょう。' },
    { q: '日本でニコチン入りリキッドは使えますか？', a: '日本ではニコチン入りリキッドの販売は薬機法で規制されています。ニコチンなしのフレーバーリキッドは合法的に使用できます。' },
  ],
  'vape-for-beginners-2025': [
    { q: '2025年のVAPE初心者におすすめの機種は？', a: 'ポッド型のオートドローモデルが最もおすすめです。予算5,000円前後で十分なクオリティのモデルが揃っており、操作がシンプルで失敗しにくいのが特徴です。' },
    { q: 'VAPE初心者の予算はどのくらい必要ですか？', a: '3,000〜8,000円のポッド型・スターターキットが初心者に最適です。まず試したい方は3,000円以下の使い捨てVAPEも選択肢です。' },
    { q: '初心者がVAPEで失敗しないコツは？', a: '最初から高機能すぎるモデルを選ばないことが重要です。まずはシンプルなポッド型で操作に慣れ、自分の好みが分かってきたらステップアップしましょう。' },
  ],
  'vape-coil-types': [
    { q: 'VAPEのコイルはどのくらいで交換すればいいですか？', a: '一般的に1〜2週間が交換目安です。焦げ臭さ・フレーバーの薄れ・蒸気量の低下が交換サインです。' },
    { q: 'コイルの抵抗値はどれを選べばいいですか？', a: 'タバコに近い感覚のMTL吸いには1Ω以上、大量蒸気を楽しみたい上級者向けには1Ω未満（サブオーム）がおすすめです。初心者は1Ω以上から始めましょう。' },
    { q: 'コイル素材による味の違いはありますか？', a: 'カンタルは扱いやすいスタンダード、ステンレス（SS316L）は温度管理対応でクリアなフレーバー、ニクロム（Ni80）は立ち上がりが速くウォームな味が出やすいです。' },
  ],
  'vape-smell': [
    { q: 'VAPEはタバコと比べてにおいはどのくらい違いますか？', a: 'タバコの臭さの主原因は燃焼によるタールですが、VAPEは燃焼させないため衣類・部屋・息へのにおいの残り方が格段に少ないです。ただしゼロではありません。' },
    { q: '室内でVAPEを使う際のにおい対策は？', a: '換気をしながら使うのが基本です。窓を少し開けるだけで蒸気が滞留せずにおいがほとんど気になりません。吸い終わった後にしばらく換気すれば翌日にはほぼ消えます。' },
    { q: 'においが少ないVAPEの選び方は？', a: '蒸気量が少ないポッド型MTLモデルを選ぶのが最重要です。フレーバーはメンソール系が周囲に好印象で、フルーツ系はほんのり甘いにおいがします。' },
  ],
  'vape-quit-smoking': [
    { q: 'VAPEはタバコの代わりになりますか？', a: '吸う行為そのものを代替できますが、VAPEは医薬品ではなく禁煙補助薬ではありません。日本ではニコチン入りリキッドの販売が規制されているため、ニコチン代替にはなりません。' },
    { q: 'タバコからVAPEに切り替えるとコストはどうなりますか？', a: '1日1箱（約600円）喫煙する場合、月約18,000円かかります。VAPEはデバイス初期費用5,000〜10,000円＋リキッド代月2,000〜4,000円で、ランニングコストが大幅に下がります。' },
    { q: 'タバコからVAPEに切り替えるときに最初に選ぶべきデバイスは？', a: 'MTL方式のポッド型 + タバコ系フレーバーの組み合わせが最もスムーズに移行できます。タバコに近い感覚で吸えるため違和感が少ないです。' },
  ],
  'vape-accessories': [
    { q: 'VAPEの保護ケースはどんな素材がおすすめですか？', a: 'シリコン製は衝撃吸収性が高く落下保護に優れ、レザー製は高級感と収納力が魅力です。アウトドアや旅行にはハードケースが最も防護性が高く安心です。' },
    { q: 'VAPEの充電はどのケーブルを使うべきですか？', a: 'USB-C充電対応の純正ケーブル使用を推奨します。互換性のない充電器はバッテリー劣化の原因になることがあります。外出が多い方はモバイルバッテリーとの組み合わせが便利です。' },
    { q: 'ドリップチップの素材による違いは？', a: 'デルリン（POM）製は熱伝導率が低く長時間使用に向いています。ステンレス製は耐久性が高く、樹脂製は価格が安くカラーバリエーションが豊富です。' },
  ],
  'vape-travel': [
    { q: '飛行機にVAPEは持ち込めますか？', a: 'VAPEデバイス本体とバッテリーは機内持ち込みのみ可能です。預け荷物には入れられません。バッテリー容量100Wh以下が目安です（航空会社によって異なります）。' },
    { q: '海外旅行でVAPEを持って行っても大丈夫ですか？', a: 'シンガポール・タイ・インドなど国によってはVAPEが法律で禁止されている場合があります。渡航前に必ず現地の法律・規制を確認してください。' },
    { q: '旅行中にリキッドが漏れないようにするには？', a: 'ボトルのキャップをしっかり締め、リキッドを満タンにせず余裕を持たせることで気圧変化による漏れを防げます。密閉性の高いポッドやカートリッジ式モデルも有効です。' },
  ],
  'vape-japanese-brands': [
    { q: '日本向けVAPEの特徴は何ですか？', a: 'ニコチンなしリキッドに特化した設計、コンパクトで持ち運びやすいサイズ感、タバコに近い吸い心地のMTL特化モデルが多いのが特徴です。日本語サポートが充実している点も利点です。' },
    { q: '日本でVAPEを購入するのはどこが安心ですか？', a: 'Amazon・楽天の国内正規販売店か、実店舗のVAPE専門ショップが安心です。メーカー保証と日本語サポートが受けられる環境を確認して購入しましょう。' },
    { q: '海外通販でVAPEを購入するリスクは？', a: '格安品には偽造品・粗悪品のリスクがあります。バッテリーの安全機能が省かれていたりコイル品質が低い場合があります。信頼できる正規販売店での購入を強くおすすめします。' },
  ],
  'vape-rules-japan': [
    { q: '日本でVAPEは合法ですか？', a: 'ニコチンなしのVAPEは日本で合法です。ただしニコチン含有リキッドの国内販売は薬機法で禁止されています。' },
    { q: '飲食店でVAPEを使ってもいいですか？', a: '2020年施行の改正健康増進法により、客席面積100㎡を超える飲食店は原則屋内禁煙です。喫煙専用室がある場合を除き、店内でのVAPEは禁止されています。' },
    { q: 'VAPEに年齢制限はありますか？', a: 'VAPEデバイスおよびリキッドは20歳以上を対象とした商品です。未成年者への販売・譲渡は禁止されており、オンラインショップでも年齢確認が義務付けられています。' },
  ],
}

export default async function GuideArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const searchQuery = SLUG_SEARCH_QUERIES[slug] || 'VAPE'
  const faqs = FAQ_DATA[slug] || []

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.heroImage,
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'VapeGo', url: 'https://vapego.vercel.app' },
    publisher: { '@type': 'Organization', name: 'VapeGo', url: 'https://vapego.vercel.app' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://vapego.vercel.app/guide/${slug}` },
    wordCount: article.content.length,
  }

  const jsonLdFaq = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://vapego.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'ガイド', item: 'https://vapego.vercel.app/guide' },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://vapego.vercel.app/guide/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {jsonLdFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-violet-400 transition">ホーム</Link>
          <span>/</span>
          <Link href="/guide" className="hover:text-violet-400 transition">ガイド</Link>
          <span>/</span>
          <span className="text-gray-400">{article.title}</span>
        </nav>

        <div className="mb-8">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-violet-300 border border-violet-500/30 mb-3" style={{ background: 'rgba(124,58,237,0.15)' }}>
            VAPEガイド
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
            {article.title}
          </h1>
          <p className="text-gray-400 text-sm">{article.description}</p>
        </div>


        {article.heroImage && (
          <div className="mb-8 rounded-xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(124,58,237,0.2)' }}>
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-48 sm:h-64 object-cover"
              loading="eager"
            />
          </div>
        )}
        <div className="rounded-xl p-6 border border-white/10 mb-8" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {renderContent(article.content)}
        </div>

        {faqs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-black text-white mb-4">よくある質問</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="rounded-xl border border-violet-500/20 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <summary className="px-5 py-4 cursor-pointer text-sm font-bold text-white hover:text-violet-300 transition list-none flex items-center justify-between">
                    <span>Q. {faq.q}</span>
                    <span className="text-violet-400 shrink-0 ml-2">▾</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-300 leading-relaxed border-t border-violet-500/10 pt-3">
                    A. {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 rounded-xl border border-violet-500/20 mb-8" style={{ background: 'rgba(124,58,237,0.08)' }}>
          <h2 className="text-base font-bold text-white mb-2">関連商品を探す</h2>
          <p className="text-gray-400 text-sm mb-4">記事で紹介した商品のスペック・口コミを確認してみましょう。</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/search?q=${encodeURIComponent(searchQuery)}`}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-lg hover:from-violet-500 hover:to-indigo-500 transition"
            >
              {searchQuery}を探す
            </Link>
            <Link
              href="/rankings"
              className="px-4 py-2 border border-violet-500/40 text-violet-300 text-sm font-bold rounded-lg hover:border-violet-400 transition"
            >
              ランキングを見る
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/guide" className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ガイド一覧に戻る
          </Link>
        </div>
      </div>
    </>
  )
}
