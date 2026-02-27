import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let reviewId: string = ''
    let reason: string = ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      reviewId = body.reviewId
      reason = body.reason
    } else {
      const form = await request.formData()
      reviewId = form.get('reviewId') as string || ''
      reason = form.get('reason') as string || ''
      const action = form.get('action') as string
      const reportId = form.get('reportId') as string

      if (action === 'dismiss' && reportId) {
        await prisma.report.update({ where: { id: reportId }, data: { status: 'dismissed' } })
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      if (action === 'hide' && reviewId && reportId) {
        await prisma.review.update({ where: { id: reviewId }, data: { status: 'hidden' } })
        await prisma.report.update({ where: { id: reportId }, data: { status: 'resolved' } })
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }

    if (!reviewId || !reason) {
      return NextResponse.json({ error: '通報内容が不足しています' }, { status: 400 })
    }

    const review = await prisma.review.findUnique({ where: { id: reviewId } })
    if (!review) {
      return NextResponse.json({ error: 'レビューが見つかりません' }, { status: 404 })
    }

    const report = await prisma.report.create({ data: { reviewId, reason } })
    return NextResponse.json({ success: true, reportId: report.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '通報に失敗しました' }, { status: 500 })
  }
}
