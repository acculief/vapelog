import { NextResponse } from 'next/server'
import { updateRankings } from '@/lib/ranking'

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await updateRankings()
    return NextResponse.json({ success: true, updatedAt: new Date().toISOString() })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Ranking update failed' }, { status: 500 })
  }
}
