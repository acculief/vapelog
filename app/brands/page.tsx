import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

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
