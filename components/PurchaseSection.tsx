'use client'

import { useEffect, useState } from 'react'

interface Props {
  productName: string
  price: number | null
  affiliates: Record<string, string> | null
  avgRating: number
  reviewCount: number
}

export default function PurchaseSection({ productName, price, affiliates, avgRating, reviewCount }: Props) {
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const amazonUrl = affiliates?.amazon || `https://www.amazon.co.jp/s?k=${encodeURIComponent(productName)}&tag=yajousaki-22`
  const ctaText = amazonUrl.includes('/dp/') ? '今すぐAmazonで購入する' : 'Amazonで最安値をチェック'

  return (
    <>
      {/* Main Purchase Card */}
      <div className="rounded-2xl overflow-hidden mb-8 border border-yellow-500/30" id="purchase-section">
        {/* Header bar */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))' }}>
          <span className="text-yellow-400 font-black text-sm whitespace-nowrap">🏷️ 購入する</span>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-400 text-xs">{'★'.repeat(Math.round(avgRating))}</span>
              <span className="text-white font-bold">{avgRating.toFixed(1)}</span>
              <span className="text-gray-400 text-xs whitespace-nowrap">({reviewCount}件)</span>
            </div>
          )}
        </div>

        <div className="p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
          {/* Price display */}
          {price && (
            <div className="flex items-baseline gap-2 mb-4 flex-wrap">
              <span className="text-xs text-gray-400 border border-gray-600 rounded px-1.5 py-0.5 whitespace-nowrap">参考価格</span>
              <span className="text-3xl font-black text-white">¥{price.toLocaleString()}</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">※価格変動あり</span>
            </div>
          )}

          {/* Amazon Primary CTA */}
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block w-full font-black text-base py-4 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] mb-3"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              boxShadow: '0 6px 30px rgba(245,158,11,0.45)',
              color: '#000',
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xl shrink-0">🛍️</span>
                <div className="min-w-0">
                  <div className="leading-tight font-black">{ctaText}</div>
                  <div className="text-xs font-normal opacity-70 mt-0.5">✓ Prime翌日配送　✓ 返品OK</div>
                </div>
              </div>
              {price && (
                <span className="text-base font-black border-l border-black/20 pl-3 whitespace-nowrap shrink-0">
                  ¥{price.toLocaleString()}
                </span>
              )}
            </div>
          </a>

          {/* Secondary buttons */}
          {(affiliates?.rakuten || affiliates?.yahoo) && (
            <div className="flex gap-2 mb-4">
              {affiliates?.rakuten && (
                <a href={affiliates.rakuten} target="_blank" rel="noopener noreferrer sponsored"
                  className="flex-1 text-center bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-1 whitespace-nowrap">
                  <span>🏬</span> 楽天で購入
                </a>
              )}
              {affiliates?.yahoo && (
                <a href={affiliates.yahoo} target="_blank" rel="noopener noreferrer sponsored"
                  className="flex-1 text-center bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-1 whitespace-nowrap">
                  <span>🛒</span> Yahoo!で購入
                </a>
              )}
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-gray-400 pt-3 border-t border-white/10">
            <span>🔒 SSL暗号化通信</span>
            <span>📦 最短翌日お届け</span>
            <span>↩️ 返品・交換保証</span>
            <span>✅ 正規品保証</span>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 md:hidden ${
          showSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ background: 'rgba(13,6,24,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(124,58,237,0.3)' }}
      >
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-center gap-2 w-full font-black py-3.5 rounded-xl text-black transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 4px 20px rgba(245,158,11,0.4)' }}
        >
          <span>🛍️</span>
          <span>{ctaText}</span>
          {price && <span className="ml-1 opacity-80 font-bold text-sm">¥{price.toLocaleString()}</span>}
        </a>
      </div>
    </>
  )
}
