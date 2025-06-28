import { NextResponse } from 'next/server'

export function middleware(request) {
  const adminAuth = request.cookies.get('admin-auth')
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    adminAuth?.value !== 'true'
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
