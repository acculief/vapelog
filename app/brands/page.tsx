import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'


const FEATURED_BRANDS = [
  {
    name: 'IQOS（アイコス）',
    description: 'Philip Morris Internationalが開発した加熱式タバコ。専用スティック「HEETS」を使用。日本市場で高シェア。',
    category: '加熱式タバコ',
    tags: ['加熱式', '国内人気', 'PMI'],
  },
  {
    name: 'glo（グロー）',
    description: 'British American Tobacco（BAT）が販売する加熱式タバコ。全周加熱方式でスティック全体を均一に加熱。',
    category: '加熱式タバコ',
    tags: ['加熱式', '全周加熱', 'BAT'],
  },
  {
    name: 'VUSE（ヴューズ）',
    description: 'British American Tobaccoが展開する電子タバコブランド。ポッド型でシンプルな操作性が特徴。',
    category: '電子タバコ',
    tags: ['ポッド型', 'BAT', '電子タバコ'],
  },
  {
    name: 'KANGERTECH（カンガーテック）',
    description: '中国広東省発のVAPEメーカー。高品質なボックスMOD・タンク・コイルを多数展開。コスパに優れた製品ラインナップ。',
    category: 'VAPEデバイス',
    tags: ['BOX MOD', 'タンク', 'コスパ'],
  },
]

export const metadata: Metadata = {
  title: 'VAPEブランド一覧 | VapeGo',
  description: 'VAPEデバイス・リキッドの主要ブランド一覧。各ブランドの特徴と取扱商品をまとめて確認できます。',
  alternates: { canonical: 'https://vapego.vercel.app/brands' },
}

export const revalidate = 3600

export default async function BrandsPage() {
  const { data: products } = await supabaseAdmin
    .from('Product')
    .select('brand, category')
    .order('brand')

  const brandMap: Record<string, { count: number; categories: Set<string> }> = {}
  for (const p of products || []) {
    if (!brandMap[p.brand]) brandMap[p.brand] = { count: 0, categories: new Set() }
    brandMap[p.brand].count++
    brandMap[p.brand].categories.add(p.category)
  }

  const brands = Object.entries(brandMap)
    .map(([name, info]) => ({ name, count: info.count, categories: Array.from(info.categories) }))
    .sort((a, b) => b.count - a.count)

  const categoryLabels: Record<string, string> = {
    pod: 'ポッド型', starter: 'スターター', boxmod: 'BOX MOD',
    liquid: 'リキッド', disposable: '使い捨て', parts: 'パーツ',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">VAPEブランド一覧</h1>
        <p className="text-gray-400 text-sm">主要ブランドの特徴と取扱商品を確認できます</p>
      </div>

      {/* 注目ブランド（特集） */}
      <div className="mb-10">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-violet-400">★</span> 注目ブランド
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {FEATURED_BRANDS.map(brand => (
            <div
              key={brand.name}
              className="flex items-center justify-between p-4 rounded-xl border border-violet-500/30"
              style={{ background: 'rgba(124,58,237,0.08)' }}
            >
              <div>
                <p className="font-bold text-white">{brand.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{brand.description}</p>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {brand.tags.map((t: string) => (
                    <span key={t} className="text-xs text-violet-400 border border-violet-500/30 rounded px-1.5 py-0.5" style={{ background: 'rgba(124,58,237,0.1)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className="text-xs text-violet-300 border border-violet-500/40 rounded px-2 py-1" style={{ background: 'rgba(124,58,237,0.15)' }}>
                  {brand.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-base font-bold text-white mb-1">掲載ブランド一覧</h2>
        <p className="text-gray-400 text-sm">{brands.length}ブランドを掲載中</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {brands.map(brand => (
          <Link
            key={brand.name}
            href={`/search?brand=${encodeURIComponent(brand.name)}`}
            className="group flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-violet-500/40 transition"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div>
              <p className="font-bold text-white group-hover:text-violet-300 transition">{brand.name}</p>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {brand.categories.map(c => (
                  <span key={c} className="text-xs text-violet-400 border border-violet-500/30 rounded px-1.5 py-0.5" style={{ background: 'rgba(124,58,237,0.1)' }}>
                    {categoryLabels[c] || c}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="text-2xl font-black text-white">{brand.count}</p>
              <p className="text-xs text-gray-500">商品</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/search" className="text-sm text-violet-400 hover:text-violet-300 transition">
          すべての商品を検索する →
        </Link>
      </div>
    </div>
  )
}
