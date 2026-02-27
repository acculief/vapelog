'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function WriteReviewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get('productId') || ''

  const [form, setForm] = useState({
    productId,
    rating: 5,
    title: '',
    body: '',
    email: '',
    name: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.body || form.body.length < 40) {
      setError('レビュー本文は40文字以上で入力してください')
      return
    }
    if (!form.productId) {
      setError('商品を選択してください')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || '送信エラー')
      }
      setSuccess(true)
      setTimeout(() => {
        if (form.productId) router.push(`/products/${form.productId}`)
        else router.push('/')
      }, 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '送信に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">レビューを投稿しました！</h2>
        <p className="text-gray-400">品質チェック後に公開されます。商品ページに戻ります...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-2">✏️ レビューを書く</h1>
      <p className="text-gray-400 mb-8">あなたの経験を共有してください。40文字以上の詳細なレビューをお願いします。</p>

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">商品ID</label>
          <input
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            placeholder="商品IDを入力"
            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">ニックネーム</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="タロウ"
              className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">メールアドレス（非公開）</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">評価</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className={`text-3xl transition ${star <= form.rating ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-300`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-gray-400 self-center">{form.rating}/5</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">タイトル（任意）</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="一言でまとめると..."
            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            レビュー本文 <span className="text-red-400">*</span>
            <span className="ml-2 text-xs">{form.body.length}文字</span>
          </label>
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="使用感・味・吸いごたえ・コスパなど詳しく教えてください（40文字以上）"
            rows={6}
            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition text-lg"
        >
          {submitting ? '送信中...' : '📝 レビューを投稿する'}
        </button>
        <p className="text-xs text-gray-600 text-center">
          ※ 投稿されたレビューはスパムチェック後に公開されます。
        </p>
      </form>
    </div>
  )
}

export default function WriteReviewPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-8">Loading...</div>}>
      <WriteReviewContent />
    </Suspense>
  )
}
