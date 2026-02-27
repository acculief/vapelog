import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/age-gate') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  const ageVerified = request.cookies.get('age_verified')

  if (!ageVerified) {
    const ageGateUrl = new URL('/age-gate', request.url)
    ageGateUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(ageGateUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
