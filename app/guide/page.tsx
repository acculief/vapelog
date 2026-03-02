import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VAPEガイド・選び方 | VapeGo',
  description: 'ヴェポライザー・VAPEの選び方、使い方、お手入れ方法を初心者向けに解説。種類別の特徴比較やおすすめも紹介。',
}

const GUIDES = [
  {
    slug: 'what-is-vape',
    title: 'ヴェポライザーとは？電子タバコとの違いを解説',
    desc: '加熱式・電子タバコ・ヴェポライザーの違いを分かりやすく解説。初めて選ぶ方はここから。',
    readTime: '5分',
    tags: ['初心者', 'ヴェポライザー', '基礎知識'],
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'how-to-choose',
    title: 'VAPEの選び方｜初心者がまず知るべき4つのポイント',
    desc: 'ポッド型・BOX MOD・使い捨て、どれを選ぶべきか。予算・ライフスタイル別の選び方を解説。',
    readTime: '7分',
    tags: ['選び方', 'ポッド型', 'BOX MOD'],
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'pod-vs-boxmod',
    title: 'ポッド型 vs BOX MOD｜あなたに合うのはどっち？',
    desc: 'コンパクトなポッド型とハイパワーなBOX MODを徹底比較。使用シーン別のおすすめを紹介。',
    readTime: '6分',
    tags: ['ポッド型', 'BOX MOD', '比較'],
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'beginner-setup',
    title: 'VAPE初心者セットアップガイド｜購入後すぐできること',
    desc: '初めてVAPEを購入した方向け。充電・リキッド入れ方・吸い方まで画像付きで解説。',
    readTime: '8分',
    tags: ['初心者', 'セットアップ', '使い方'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'maintenance',
    title: 'VAPEのお手入れ・メンテナンス完全ガイド',
    desc: 'コイル交換タイミング・清掃方法・保管方法。正しいケアで長持ちさせる方法を解説。',
    readTime: '6分',
    tags: ['メンテナンス', 'コイル交換', 'お手入れ'],
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'liquid-guide',
    title: 'VAPEリキッドの選び方｜ニコチン濃度・PG/VG比率を解説',
    desc: 'フレーバー・ニコチン濃度・PG/VG比率の意味と選び方。初心者向けのおすすめリキッドも紹介。',
    readTime: '7分',
    tags: ['リキッド', 'ニコチン', 'PG/VG'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-for-beginners-2025',
    title: 'VAPE初心者おすすめ2025年版｜失敗しない選び方と人気機種',
    desc: '2025年最新のVAPE初心者向けおすすめ機種。予算別・目的別に失敗しない選び方を解説。',
    readTime: '8分',
    tags: ['2025年版', '初心者', 'おすすめ'],
    image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-coil-types',
    title: 'VAPEコイルの種類と選び方｜抵抗値・素材別に解説',
    desc: 'コイルの抵抗値・素材（カンタル/ステンレス/ニクロム）の違いと選び方。交換手順も解説。',
    readTime: '6分',
    tags: ['コイル', '抵抗値', 'メンテナンス'],
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-smell',
    title: 'VAPEは臭い？においが少ないデバイスと使い方のコツ',
    desc: 'VAPEのにおいが気になる方へ。においが少ない理由・デバイス選び・室内での使い方を解説。',
    readTime: '5分',
    tags: ['におい', '室内使用', 'マナー'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-quit-smoking',
    title: 'VAPEで禁煙・減煙できる？タバコからの切り替えガイド',
    desc: 'タバコからVAPEへの切り替えを検討中の方向け。禁煙・減煙の実態とおすすめデバイスを解説。',
    readTime: '7分',
    tags: ['禁煙', '減煙', 'タバコ代替'],
    image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-accessories',
    title: 'VAPEアクセサリー完全ガイド｜ケース・充電器・コットンの選び方',
    desc: 'VAPEをより快適に使うためのアクセサリー紹介。保護ケース・充電器・コットン・ドリップチップの選び方を解説。',
    readTime: '6分',
    tags: ['アクセサリー', 'ケース', '充電器'],
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-travel',
    title: '旅行・出張でVAPEを持ち運ぶ方法｜機内持ち込みルールと注意点',
    desc: '飛行機・新幹線でのVAPEの持ち運びルール、国際線での注意点、旅行先での使用マナーを詳しく解説。',
    readTime: '7分',
    tags: ['旅行', '機内持ち込み', '海外'],
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-japanese-brands',
    title: '日本のVAPEブランド・国産おすすめデバイスまとめ【2025年版】',
    desc: '日本発のVAPEブランドと日本向けに設計されたデバイスを紹介。国産品質・日本語サポート・国内入手しやすさで選ぶ。',
    readTime: '6分',
    tags: ['日本ブランド', '国産', '2025年版'],
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-rules-japan',
    title: '日本のVAPE法律・規制まとめ｜使用可能な場所とルールを解説',
    desc: '日本でのVAPE使用に関する法律・規制、使用禁止場所、年齢制限、ニコチンリキッド規制について分かりやすく解説。',
    readTime: '7分',
    tags: ['法律', '規制', 'ルール'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-cost-comparison',
    title: '電子タバコとタバコの費用比較：1年間でいくら節約できる？',
    desc: '1日1箱喫煙者がVAPEに切り替えると年間いくら節約できるか。デバイス代・リキッド代込みで徹底計算。',
    readTime: '6分',
    tags: ['費用比較', 'コスト', '節約'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-starter-checklist',
    title: 'VAPEを始めるときに必要なもの完全リスト【初心者向け】',
    desc: 'デバイス・リキッド・充電器・替えコイル。VAPEスタートに絶対必要なものとあると便利なものを完全リスト化。',
    readTime: '5分',
    tags: ['初心者', 'スターター', '必要なもの'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-battery-safety',
    title: '電子タバコのバッテリー安全対策と正しい充電方法',
    desc: 'リチウムイオンバッテリーの安全な使い方・充電方法・保管のコツ・発火リスクの防ぎ方を徹底解説。',
    readTime: '6分',
    tags: ['バッテリー', '安全', '充電'],
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=240&auto=format&fit=crop&q=80',
  },

  {
    slug: 'vape-pod-recommendation',
    title: 'VAPE POD おすすめ【2026年版】｜初心者向け選び方ガイド',
    desc: 'コンパクトで使いやすいVAPE PODのおすすめ機種を2026年最新版で厳選。初心者が失敗しない選び方も解説。',
    readTime: '7分',
    tags: ['POD型', 'おすすめ', '初心者'],
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-liquid-recommendation',
    title: 'VAPEリキッド おすすめ【2026年版】｜フレーバー別人気ランキング',
    desc: 'フルーツ・メンソール・タバコ系など系統別にVAPEリキッドのおすすめを厳選。初心者でも失敗しない選び方。',
    readTime: '6分',
    tags: ['リキッド', 'フレーバー', 'おすすめ'],
    image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-cospa-best',
    title: 'VAPE コスパ最強おすすめ【2026年版】｜安くて長持ちする選び方',
    desc: 'コスパ最強のVAPEを初期費用・ランニングコストで徹底比較。本当にお得なVAPEの選び方と節約のコツを解説。',
    readTime: '6分',
    tags: ['コスパ', '節約', '比較'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-lightweight-small',
    title: '軽い・コンパクトVAPE おすすめ【2026年版】｜持ち運びに最適',
    desc: '外出先でも邪魔にならない軽量・コンパクトVAPEを厳選。重量・サイズ・バッテリーで選ぶおすすめ機種を紹介。',
    readTime: '5分',
    tags: ['コンパクト', '軽量', '携帯性'],
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-pod-comparison',
    title: 'VAPE POD 比較【2026年版】｜人気機種を徹底比較して選ぶ',
    desc: '人気VAPE PODをバッテリー・出力・コイル価格で徹底比較。自分に合った1台を見つけるための完全ガイド。',
    readTime: '8分',
    tags: ['POD型', '比較', '選び方'],
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-liquid-comparison',
    title: 'VAPEリキッド 比較【2026年版】｜人気ブランドを徹底比較',
    desc: '人気VAPEリキッドブランドをフレーバー・品質・コスパで徹底比較。失敗しないリキッド選びのコツも解説。',
    readTime: '7分',
    tags: ['リキッド', '比較', 'ブランド'],
    image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-menthol',
    title: 'メンソールVAPE おすすめ【2026年版】｜清涼感で選ぶ人気機種',
    desc: 'メンソール系VAPEのデバイスとリキッドを清涼感の強さ別に紹介。タバコのメンソールから移行するコツも解説。',
    readTime: '6分',
    tags: ['メンソール', '清涼感', 'おすすめ'],
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-sweet-liquid',
    title: '甘いVAPEリキッド おすすめ【2026年版】｜デザート・スイーツ系',
    desc: '甘いVAPEリキッドのおすすめをデザート・フルーツ・キャンディ系で徹底紹介。甘いリキッドを長く楽しむコツも。',
    readTime: '6分',
    tags: ['甘いリキッド', 'デザート系', 'スイーツ'],
    image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-for-women',
    title: '女性向けVAPE おすすめ【2026年版】｜おしゃれで使いやすい機種',
    desc: 'おしゃれデザイン・軽量・使いやすさで女性向けVAPEを厳選。女性に人気のフレーバーと選び方ポイントも紹介。',
    readTime: '6分',
    tags: ['女性向け', 'おしゃれ', 'コンパクト'],
    image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-beginner-mistake',
    title: 'VAPE初心者が失敗しない選び方【2026年版】｜よくある失敗10選',
    desc: 'VAPE初心者が陥りやすい10の失敗パターンと対策を解説。後悔しない最初の1台の選び方チェックリスト付き。',
    readTime: '7分',
    tags: ['初心者', '失敗回避', '選び方'],
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-room-smell',
    title: 'VAPEは部屋が臭くなる？においの実態と対策',
    desc: 'VAPEを室内で使うと部屋が臭くなるのか徹底解説。タバコとの違いと、室内使用時の換気・消臭対策を紹介。',
    readTime: '5分',
    tags: ['においの対策', '室内使用', 'マナー'],
    image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-health-effects',
    title: 'VAPEは体に悪い？タバコとの比較で解説【2026年版】',
    desc: 'VAPEは体に悪いのか？タバコとの成分・リスク比較と科学的な見解をわかりやすく解説。正しい知識でVAPEを。',
    readTime: '7分',
    tags: ['健康', 'リスク', 'タバコ比較'],
    image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-quit-smoking-effect',
    title: 'VAPEで禁煙は本当に効果ある？成功率と方法【2026年版】',
    desc: 'VAPEで禁煙する効果・成功率を科学的データで解説。ニコチンを段階的に減らす禁煙成功法と注意点を紹介。',
    readTime: '8分',
    tags: ['禁煙', '効果', 'ニコチン'],
    image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-beginner-quit-smoking',
    title: '禁煙したい初心者向けVAPEおすすめ【2026年版】｜選び方と始め方',
    desc: '禁煙目的でVAPEを始めたい方向けのデバイス選びと始め方を解説。スムーズに移行できるリキッド選びも紹介。',
    readTime: '7分',
    tags: ['禁煙', '初心者', 'おすすめ'],
    image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-beginner-menthol',
    title: 'メンソール派初心者向けVAPEおすすめ【2026年版】｜清涼感で選ぶ',
    desc: 'メンソールたばこ派の初心者向けVAPEデバイスとリキッドを厳選紹介。清涼感の強さ別おすすめと移行のコツを解説。',
    readTime: '6分',
    tags: ['メンソール', '初心者', '禁煙'],
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&h=240&auto=format&fit=crop&q=80',
  },
  {
    slug: 'vape-disposable-comparison',
    title: '使い捨てVAPE徹底比較【2026年版】｜コスパ・フレーバー・人気ランキング',
    desc: '使い捨てVAPEをパフ数・フレーバー・価格で徹底比較。初めての使い捨てVAPE選びに役立つ完全ガイド。',
    readTime: '6分',
    tags: ['使い捨て', 'ディスポーザブル', '比較'],
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=240&auto=format&fit=crop&q=80',
  },
]

export const revalidate = 86400

export default function GuidePage() {

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'VAPEとは何ですか？', acceptedAnswer: { '@type': 'Answer', text: 'VAPEとはたばこ葉やリキッドを燃焼させずに加熱し蒸気を吸引するデバイスです。燃やさないためタールや一酸化炭素の発生を大幅に抑えられます。' } },
    { '@type': 'Question', name: '初心者にはどんなVAPEがおすすめですか？', acceptedAnswer: { '@type': 'Answer', text: 'ポッド型かスターターキットがおすすめです。操作がシンプルで価格も手頃、コイル交換の手間も最小限です。' } },
    { '@type': 'Question', name: 'VAPEは日本で合法ですか？', acceptedAnswer: { '@type': 'Answer', text: 'ニコチンなしのVAPEは日本で合法です。ニコチン入りリキッドの国内販売は薬機法で規制されています。' } },
  ],
}

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-violet-300 border border-violet-500/30 mb-3" style={{ background: 'rgba(124,58,237,0.15)' }}>
          初心者ガイド
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">
          VAPEガイド・選び方
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
          VAPEをもっと自由に。ヴェポライザー・VAPEをはじめて選ぶ方から、もっと使いこなしたい方まで。
          基礎知識から選び方・お手入れまで、すべてのガイドがここに。
        </p>
      </div>

      {/* ピックアップ記事 */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-white mb-4">📌 まずはここから読もう</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { slug: 'what-is-vape', title: 'ヴェポライザーとは？電子タバコとの違いを解説', badge: '基礎知識', img: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&h=240&auto=format&fit=crop&q=80' },
            { slug: 'how-to-choose', title: 'VAPEの選び方｜初心者がまず知るべき4つのポイント', badge: '選び方', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=240&auto=format&fit=crop&q=80' },
            { slug: 'vape-quit-smoking', title: 'VAPEで禁煙・減煙できる？タバコからの切り替えガイド', badge: '禁煙', img: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&h=240&auto=format&fit=crop&q=80' },
            { slug: 'vape-health-effects', title: 'VAPEは体に悪い？タバコとの比較で解説', badge: '健康', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=240&auto=format&fit=crop&q=80' },
          ].map(g => (
            <Link key={g.slug} href={`/guide/${g.slug}`}
              className="group flex gap-3 rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition p-3"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                <img src={g.img} alt={g.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 text-xs rounded-full border border-violet-500/30 text-violet-400 mb-1" style={{ background: 'rgba(124,58,237,0.1)' }}>{g.badge}</span>
                <p className="text-sm font-bold text-white group-hover:text-violet-300 transition leading-snug line-clamp-2">{g.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* カテゴリ別 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-white">全記事一覧（{GUIDES.length}本）</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guide/${g.slug}`}
            className="group rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
          >
            {/* サムネイル画像 */}
            <div className="relative overflow-hidden h-40">
              <img
                src={g.image}
                alt={g.title}
                className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 right-3 text-xs text-gray-300 bg-black/50 rounded px-2 py-0.5">
                📖 {g.readTime}
              </div>
            </div>

            {/* テキスト部分 */}
            <div className="p-4">
              <h2 className="text-sm font-bold text-white group-hover:text-violet-300 transition leading-snug mb-1.5">
                {g.title}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{g.desc}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {g.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 text-xs rounded-full border border-violet-500/30 text-violet-400" style={{ background: 'rgba(124,58,237,0.1)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="mt-10 p-6 rounded-xl border border-violet-500/20" style={{ background: 'rgba(124,58,237,0.08)' }}>
        <h2 className="text-lg font-bold text-white mb-2">📊 商品を比較・検索する</h2>
        <p className="text-gray-400 text-sm mb-4">ガイドを読んだら、実際に商品を探してみましょう。スペック比較や口コミも確認できます。</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/search" className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-lg hover:from-violet-500 hover:to-indigo-500 transition">商品を探す</Link>
          <Link href="/rankings" className="px-4 py-2 border border-violet-500/40 text-violet-300 text-sm font-bold rounded-lg hover:border-violet-400 transition">ランキングを見る</Link>
          <Link href="/compare" className="px-4 py-2 border border-violet-500/40 text-violet-300 text-sm font-bold rounded-lg hover:border-violet-400 transition">商品を比較する</Link>
        </div>
      </div>
    </div>
  )
}
