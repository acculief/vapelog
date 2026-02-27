'use client'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  slug: string
  name: string
  images: string[]
  href: string
}

export default function CategoryCard({ slug, name, images, href }: Props) {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const positions: React.CSSProperties[] = [
    { position: 'absolute', left: '5%', bottom: '8px', zIndex: 1, width: '30%', height: '80%', maxHeight: '110px', transform: 'rotate(-8deg)', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))' },
    { position: 'absolute', left: '30%', bottom: '4px', zIndex: 2, width: '38%', height: '85%', maxHeight: '120px', transform: 'rotate(-2deg) translateY(-4px)', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))' },
    { position: 'absolute', right: '5%', bottom: '6px', zIndex: 1, width: '28%', height: '78%', maxHeight: '110px', transform: 'rotate(6deg)', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))' },
  ]

  return (
    <Link href={href} className="group block">
      <div className="bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all rounded-sm overflow-hidden">
        {/* Image area */}
        <div className="relative h-36 sm:h-44 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
          {images.slice(0, 3).map((src, i) =>
            !imgErrors[i] ? (
              <img
                key={i}
                src={src}
                alt=""
                style={{
                  ...positions[i],
                  objectFit: 'contain',
                }}
                onError={() => setImgErrors(prev => ({ ...prev, [i]: true }))}
                referrerPolicy="no-referrer"
              />
            ) : null
          )}
          {/* Placeholder if no images loaded */}
          {images.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl opacity-20">💨</div>
            </div>
          )}
          {/* Blue triangular search badge bottom-right */}
          <div
            className="absolute bottom-0 right-0 w-10 h-10"
            style={{ background: 'transparent' }}
          >
            <div
              className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
            />
            <svg
              className="absolute w-4 h-4 text-white"
              style={{ bottom: '4px', right: '4px' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {/* Label */}
        <div className="px-3 py-2.5 border-t border-gray-100">
          <p className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{name}</p>
          <p className="text-xs text-gray-500">から探す</p>
        </div>
      </div>
    </Link>
  )
}
