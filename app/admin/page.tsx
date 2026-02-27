import { prisma } from '@/lib/prisma'

export const revalidate = 0

export default async function AdminPage() {
  let reports: Array<{
    id: string
    reason: string
    status: string
    createdAt: Date
    review: {
      id: string
      body: string
      status: string
      rating: number
      user: { email: string | null; name: string | null }
      product: { name: string }
    }
  }> = []

  let hiddenReviews: Array<{
    id: string
    body: string
    qualityScore: number
    rating: number
    createdAt: Date
    user: { email: string | null }
    product: { name: string }
  }> = []

  try {
    reports = await prisma.report.findMany({
      where: { status: 'pending' },
      include: {
        review: {
          include: {
            user: { select: { email: true, name: true } },
            product: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    hiddenReviews = await prisma.review.findMany({
      where: { OR: [{ status: 'hidden' }, { qualityScore: { lt: 0.3 } }] },
      include: {
        user: { select: { email: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
  } catch (e) {
    console.error(e)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-8">🛡️ 管理パネル</h1>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-3xl font-black text-red-400">{reports.length}</div>
          <div className="text-gray-400">未処理通報</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="text-3xl font-black text-orange-400">{hiddenReviews.length}</div>
          <div className="text-gray-400">スパム検出</div>
        </div>
      </div>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">📋 通報一覧</h2>
        {reports.length === 0 ? (
          <p className="text-gray-500">未処理の通報はありません</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="bg-gray-800 rounded-xl p-5">
                <div className="text-sm text-gray-400 mb-1">
                  商品: {report.review.product.name}
                </div>
                <p className="text-gray-300 text-sm mb-2">{report.review.body.slice(0, 100)}...</p>
                <div className="text-red-400 text-sm">通報理由: {report.reason}</div>
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">🤖 スパム自動検出</h2>
        {hiddenReviews.length === 0 ? (
          <p className="text-gray-500">スパム検出なし</p>
        ) : (
          <div className="space-y-3">
            {hiddenReviews.map((review) => (
              <div key={review.id} className="bg-gray-800 border border-red-900/30 rounded-xl p-5">
                <div className="text-xs text-gray-500 mb-1">
                  {review.product.name} | スコア: {review.qualityScore.toFixed(2)}
                </div>
                <p className="text-gray-400 text-sm">{review.body.slice(0, 150)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
