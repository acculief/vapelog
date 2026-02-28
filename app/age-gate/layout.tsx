import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: '年齢確認 | VapeGo',
}

export default function AgeGateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
