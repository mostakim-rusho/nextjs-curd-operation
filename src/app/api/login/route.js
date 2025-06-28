import { NextResponse } from 'next/server'

export async function POST(request) {
  const { email, password } = await request.json()
  // Use environment variables for credentials!
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Set a cookie for authentication
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 hours
    })
    return response
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
