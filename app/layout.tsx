import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VapeLog — 日本最大のVAPE口コミ・比較サイト',
  description: '電子タバコ・VAPEの口コミ・ランキング・比較。スパムゼロの信頼できるレビュー。',
  openGraph: {
    title: 'VapeLog',
    description: '日本最大のVAPE口コミ・比較サイト',
    type: 'website',
    locale: 'ja_JP',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link href="/" className="text-xl font-black text-blue-400 tracking-tight">
              💨 VapeLog
            </Link>
            <nav className="flex gap-4 text-sm text-gray-400">
              <Link href="/search" className="hover:text-white transition">検索</Link>
              <Link href="/rankings" className="hover:text-white transition">ランキング</Link>
              <Link href="/compare" className="hover:text-white transition">比較</Link>
              <Link href="/write-review" className="hover:text-white transition">レビューを書く</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-800 mt-16 py-8 text-center text-gray-600 text-sm">
          <p>© 2024 VapeLog — 20歳以上の方のみご利用ください</p>
          <p className="mt-1">未成年者の喫煙は法律で禁じられています</p>
        </footer>
      </body>
    </html>
  )
}
