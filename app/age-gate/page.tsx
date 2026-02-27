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
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-14 h-14 mx-auto mb-5 bg-blue-50 rounded-full flex items-center justify-center">
          <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">年齢確認</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          このサイトはVAPE製品に関する情報サイトです。<br />
          20歳以上の方のみご利用いただけます。
          <span className="block text-xs text-gray-400 mt-2">※未成年者の喫煙は法律で禁じられています</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition text-sm"
          >
            20歳以上です
          </button>
          <button
            onClick={handleDeny}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition text-sm"
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
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA]" />}>
      <AgeGateContent />
    </Suspense>
  )
}
