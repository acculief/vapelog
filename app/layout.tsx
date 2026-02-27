import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VapeLog — VAPE口コミ・比較',
  description: '電子タバコ・VAPEの口コミ・ランキング・比較。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <Link href="/" className="text-base sm:text-xl font-black text-blue-400 tracking-tight whitespace-nowrap">
              💨 VapeLog
            </Link>
            <nav className="flex items-center gap-1 sm:gap-3 overflow-x-auto">
              <Link href="/search" className="text-gray-400 hover:text-white text-xs sm:text-sm whitespace-nowrap px-2 py-1.5 rounded-lg hover:bg-gray-800 transition">検索</Link>
              <Link href="/rankings" className="text-gray-400 hover:text-white text-xs sm:text-sm whitespace-nowrap px-2 py-1.5 rounded-lg hover:bg-gray-800 transition">ランキング</Link>
              <Link href="/compare" className="text-gray-400 hover:text-white text-xs sm:text-sm whitespace-nowrap px-2 py-1.5 rounded-lg hover:bg-gray-800 transition">比較</Link>
              <Link href="/write-review" className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition">
                <span className="sm:hidden">書く</span>
                <span className="hidden sm:inline">レビューを書く</span>
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-800 mt-12 py-6 text-center text-gray-600 text-xs">
          <p>© 2024 VapeLog | 20歳以上の方のみ</p>
        </footer>
      </body>
    </html>
  )
}
