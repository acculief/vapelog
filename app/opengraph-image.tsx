import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'VapeGo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e0a3c 0%, #4c1d95 60%, #6d28d9 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px',
          }}>
            <span style={{ color: '#6d28d9', fontSize: '22px', fontWeight: '900' }}>VGo</span>
          </div>
          <span style={{ color: 'white', fontSize: '40px', fontWeight: '900', letterSpacing: '-1px' }}>VapeGo</span>
        </div>
        <div style={{ color: 'white', fontSize: '52px', fontWeight: '900', lineHeight: 1.2, marginBottom: '24px' }}>
          VAPE・ヴェポライザー 口コミ＆比較サイト
        </div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '26px' }}>
          VAPEをもっと自由に。｜67商品掲載｜スパムゼロレビュー
        </div>
      </div>
    ),
    { ...size }
  )
}
