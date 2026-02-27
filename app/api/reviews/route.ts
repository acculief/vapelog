import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateQualityScore } from '@/lib/spamCheck'

export async function POST(request: Request) {
  try {
    const { productId, rating, title, body, email, name } = await request.json()

    if (!productId || !rating || !body || !email) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }
    if (body.length < 40) {
      return NextResponse.json({ error: 'レビューは40文字以上必要です' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: '評価は1〜5で入力してください' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: '商品が見つかりません' }, { status: 404 })
    }

    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({ data: { email, name: name || null } })
    }

    if (user.banned) {
      return NextResponse.json({ error: 'このアカウントは利用停止中です' }, { status: 403 })
    }

    const qualityScore = calculateQualityScore(body)
    const status = qualityScore < 0.3 ? 'hidden' : 'visible'

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: parseInt(String(rating)),
        title: title || null,
        body,
        qualityScore,
        status,
      },
    })

    return NextResponse.json({ success: true, reviewId: review.id, status, qualityScore })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'レビューの投稿に失敗しました' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')

  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

  try {
    const reviews = await prisma.review.findMany({
      where: { productId, status: 'visible', qualityScore: { gte: 0.3 } },
      orderBy: { qualityScore: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    })
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch reviews', reviews: [] }, { status: 500 })
  }
}
