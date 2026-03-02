import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from "next/script"
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-VCD9S5NWF8'

export const metadata: Metadata = {
  title: { default: 'VapeGo | VAPE・ヴェポライザー 口コミ・比較', template: '%s | VapeGo' },
  description: 'VAPE・ヴェポライザーの口コミ・スペック比較サイト。あなたにぴったりの一本を見つけよう。',
  metadataBase: new URL('https://vapego.vercel.app'),
  verification: { google: '0uJTSoLifNf9F30GBAdAstHG5n6Ci6kGC29csJZbdRM' },
  alternates: {
    canonical: 'https://vapego.vercel.app',
    languages: { 'ja': 'https://vapego.vercel.app' },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://vapego.vercel.app',
    siteName: 'VapeGo',
    title: 'VapeGo | VAPE・ヴェポライザー 口コミ・比較',
    description: 'VAPE・ヴェポライザーの口コミ・スペック比較サイト。あなたにぴったりの一本を見つけよう。',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'VapeGo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VapeGo | VAPE・ヴェポライザー 口コミ・比較',
    description: 'VAPE・ヴェポライザーの口コミ・スペック比較サイト。あなたにぴったりの一本を見つけよう。',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://cuinyjpiifcslzexrunc.supabase.co" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://cuinyjpiifcslzexrunc.supabase.co" />
      </head>
      <body className={`${inter.className} min-h-screen`} style={{ background: '#0d0618', color: 'white' }}>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'VapeGo',
              url: 'https://vapego.vercel.app',
              description: 'VAPE・ヴェポライザーの口コミ・スペック比較サイト',
              inLanguage: 'ja',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://vapego.vercel.app/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'VapeGo',
              url: 'https://vapego.vercel.app',
              logo: 'https://vapego.vercel.app/icon.png',
              sameAs: [],
              description: 'VAPE・ヴェポライザーの口コミ・スペック比較サイト',
            })
          }}
        />
        <header className="sticky top-0 z-50 border-b border-violet-500/20 backdrop-blur-md" style={{ background: 'rgba(13,6,24,0.90)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center h-14 gap-6">
              <Link href="/" className="shrink-0 flex items-center">
                <Image src="/logo.jpg" alt="VapeGo" width={44} height={44} className="rounded-full object-cover" />
              </Link>
              <nav className="hidden sm:flex items-center gap-1 flex-1">
                <Link href="/search" className="px-3 py-2 text-sm text-gray-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-md transition">商品を探す</Link>
                <Link href="/rankings" className="px-3 py-2 text-sm text-gray-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-md transition">ランキング</Link>
                <Link href="/compare" className="px-3 py-2 text-sm text-gray-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-md transition">比較する</Link>
                <Link href="/guide" className="px-3 py-2 text-sm text-gray-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-md transition">ガイド</Link>
                <Link href="/brands" className="px-3 py-2 text-sm text-gray-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-md transition">ブランド</Link>
              </nav>
              <div className="ml-auto flex items-center gap-2">
                <Link href="/search" className="sm:hidden p-2 text-gray-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </Link>
                <Link href="/rankings" className="sm:hidden p-2 text-gray-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </Link>
              </div>
            </div>

          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-violet-500/20 mt-16 py-8" style={{ background: 'rgba(13,6,24,0.95)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">VapeGo</p>
                <p className="text-xs text-gray-500 mt-1">VAPEをもっと自由に。 — 20歳以上の方を対象としています</p>
              </div>
              <nav className="flex flex-wrap gap-4 text-xs text-gray-500">
                <Link href="/search" className="hover:text-violet-400 transition">商品一覧</Link>
                <Link href="/rankings" className="hover:text-violet-400 transition">ランキング</Link>
                <Link href="/compare" className="hover:text-violet-400 transition">比較</Link>
                <Link href="/guide" className="hover:text-violet-400 transition">ガイド</Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
