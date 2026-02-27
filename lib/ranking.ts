import { prisma } from './prisma'

export async function updateRankings() {
  const products = await prisma.product.findMany({
    include: {
      reviews: {
        where: { status: 'visible' },
      },
    },
  })

  const now = Date.now()

  for (const product of products) {
    const reviews = product.reviews
    if (reviews.length === 0) {
      await prisma.product.update({
        where: { id: product.id },
        data: { rankScore: 0 },
      })
      continue
    }

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    const reviewCount = reviews.length

    const avgQuality =
      reviews.reduce((sum, r) => sum + r.qualityScore, 0) / reviews.length

    const recentReviews = reviews.filter((r) => {
      const age = now - new Date(r.createdAt).getTime()
      return age < 30 * 24 * 60 * 60 * 1000
    })
    const recencyFactor = 1 + recentReviews.length * 0.1

    const score =
      avgRating *
      Math.log(reviewCount + 1) *
      recencyFactor *
      avgQuality

    await prisma.product.update({
      where: { id: product.id },
      data: { rankScore: score },
    })
  }
}
