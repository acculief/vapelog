'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AgeGateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleConfirm = () => {
    document.cookie = 'age_verified=1; max-age=31536000; path=/'
    router.push(redirect)
  }

  const handleDeny = () => {
    window.location.href = 'https://www.google.com'
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔞</div>
        <h1 className="text-2xl font-bold text-white mb-2">年齢確認</h1>
        <p className="text-gray-400 mb-8">
          このサイトはVAPE製品に関するサイトです。
          <br />
          20歳以上の方のみご利用いただけます。
          <br />
          <span className="text-sm mt-2 block">※未成年者の喫煙は法律で禁じられています</span>
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition"
          >
            20歳以上です
          </button>
          <button
            onClick={handleDeny}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl transition"
          >
            20歳未満です
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AgeGatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
      <AgeGateContent />
    </Suspense>
  )
}
