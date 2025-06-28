import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'blogs.json')

export async function GET() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request) {
  const body = await request.json()
  const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'))
  const newBlog = { ...body, id: Date.now() }
  data.push(newBlog)
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2))
  return NextResponse.json(newBlog)
}

export async function PUT(request) {
  const body = await request.json()
  const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'))
  const idx = data.findIndex(item => item.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  data[idx] = body
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2))
  return NextResponse.json(body)
}

export async function DELETE(request) {
  const { id } = await request.json()
  let data = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'))
  data = data.filter(item => item.id !== id)
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2))
  return NextResponse.json({ success: true })
}
