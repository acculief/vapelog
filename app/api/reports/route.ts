import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
        await db.from('Report').update({ status: 'dismissed' }).eq('id', reportId)
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      if (action === 'hide' && reviewId && reportId) {
        await db.from('Review').update({ status: 'hidden' }).eq('id', reviewId)
        await db.from('Report').update({ status: 'resolved' }).eq('id', reportId)
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }

    if (!reviewId || !reason) {
      return NextResponse.json({ error: '通報内容が不足しています' }, { status: 400 })
    }

    const { data: review } = await db.from('Review').select('id').eq('id', reviewId).single()
    if (!review) {
      return NextResponse.json({ error: 'レビューが見つかりません' }, { status: 404 })
    }

    const { data: report, error } = await db
      .from('Report')
      .insert({ reviewId, reason })
      .select('id')
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, reportId: report.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '通報に失敗しました' }, { status: 500 })
  }
}
