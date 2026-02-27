import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
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

    const { data: product } = await db.from('Product').select('id').eq('id', productId).single()
    if (!product) {
      return NextResponse.json({ error: '商品が見つかりません' }, { status: 404 })
    }

    // Find or create user
    let userId: string
    const { data: existingUser, error: userFetchError } = await db
      .from('User')
      .select('id, banned')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      if (existingUser.banned) {
        return NextResponse.json({ error: 'このアカウントは利用停止中です' }, { status: 403 })
      }
      userId = existingUser.id
    } else {
      const { data: newUser, error: createError } = await db
        .from('User')
        .insert({ email, name: name || null })
        .select('id')
        .single()
      if (createError || !newUser) {
        console.error('User create error:', createError)
        return NextResponse.json({ error: 'ユーザー作成に失敗しました' }, { status: 500 })
      }
      userId = newUser.id
    }

    const qualityScore = calculateQualityScore(body)
    const status = qualityScore < 0.3 ? 'hidden' : 'visible'

    const { data: review, error: reviewError } = await db
      .from('Review')
      .insert({
        productId,
        userId,
        rating: parseInt(String(rating)),
        title: title || null,
        body,
        qualityScore,
        status,
      })
      .select('id')
      .single()

    if (reviewError || !review) {
      console.error('Review create error:', reviewError)
      return NextResponse.json({ error: 'レビューの投稿に失敗しました' }, { status: 500 })
    }

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
    const { data: reviews, error } = await db
      .from('Review')
      .select('*, user:User(name, email)')
      .eq('productId', productId)
      .eq('status', 'visible')
      .gte('qualityScore', 0.3)
      .order('qualityScore', { ascending: false })

    if (error) throw error
    return NextResponse.json({ reviews: reviews || [] })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch reviews', reviews: [] }, { status: 500 })
  }
}
