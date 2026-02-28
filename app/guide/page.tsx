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
]

export const revalidate = 86400

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
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
