import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'VapeLog | VAPE・電子タバコ 口コミ・比較', template: '%s | VapeLog' },
  description: '日本最大のVAPE口コミサイト。ポッド・MOD・リキッドの詳細比較とレビュー。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-[#F8F9FA] text-gray-900 min-h-screen`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center h-14 gap-6">
              <Link href="/" className="text-xl font-black text-blue-600 tracking-tight shrink-0">
                VapeLog
              </Link>
              <nav className="hidden sm:flex items-center gap-1 flex-1">
                <Link href="/search" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition">商品を探す</Link>
                <Link href="/rankings" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition">ランキング</Link>
                <Link href="/compare" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition">比較する</Link>
              </nav>
              <div className="ml-auto flex items-center gap-2">
                <Link href="/write-review" className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  レビューを書く
                </Link>
                <Link href="/search" className="sm:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </Link>
                <Link href="/rankings" className="sm:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </Link>
              </div>
            </div>
            <div className="sm:hidden flex border-t border-gray-100">
              {[['/', 'トップ'], ['/search', '検索'], ['/rankings', 'ランキング'], ['/compare', '比較']].map(([href, label]) => (
                <Link key={href} href={href} className="flex-1 text-center py-2.5 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition">{label}</Link>
              ))}
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-gray-900">VapeLog</p>
                <p className="text-xs text-gray-500 mt-1">本サービスは20歳以上の方を対象としています</p>
              </div>
              <nav className="flex flex-wrap gap-4 text-xs text-gray-500">
                <Link href="/search" className="hover:underline">商品一覧</Link>
                <Link href="/rankings" className="hover:underline">ランキング</Link>
                <Link href="/compare" className="hover:underline">比較</Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
