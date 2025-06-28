import { NextResponse } from 'next/server'

export async function GET(request) {
  const cookie = request.cookies.get('admin-auth')
  const authenticated = cookie?.value === 'true'
  return NextResponse.json({ authenticated })
}
