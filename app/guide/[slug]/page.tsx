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
}

export default async function GuideArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const searchQuery = SLUG_SEARCH_QUERIES[slug] || 'VAPE'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: { '@type': 'Organization', name: 'VapeGo' },
    publisher: { '@type': 'Organization', name: 'VapeGo' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
