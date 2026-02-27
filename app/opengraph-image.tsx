import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'VapeLog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563EB 60%, #3b82f6 100%)',
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
            <span style={{ color: '#2563EB', fontSize: '28px', fontWeight: '900' }}>VL</span>
          </div>
          <span style={{ color: 'white', fontSize: '40px', fontWeight: '900', letterSpacing: '-1px' }}>VapeLog</span>
        </div>
        <div style={{ color: 'white', fontSize: '52px', fontWeight: '900', lineHeight: 1.2, marginBottom: '24px' }}>
          VAPE・電子タバコ口コミ・比較サイト
        </div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '26px' }}>
          スパムゼロの信頼レビュー｜50商品以上掲載
        </div>
      </div>
    ),
    { ...size }
  )
}
