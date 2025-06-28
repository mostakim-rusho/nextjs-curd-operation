import { NextResponse } from 'next/server'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const uri = "mongodb+srv://bayfi:ix0tHxYPt1M7eVpR@cluster0.wdeeaxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const dbName = "bayfi" // use your preferred DB name

let client
async function connectMongo() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
    })
    await client.connect()
  }
  return client.db(dbName)
}

// GET all blogs
export async function GET() {
  const db = await connectMongo()
  const data = await db.collection('blogs').find({}).sort({ createdAt: -1 }).toArray()
  return NextResponse.json(data)
}

// POST create blog
export async function POST(request) {
  const body = await request.json()
  const db = await connectMongo()
  const newBlog = { ...body, createdAt: new Date() }
  const result = await db.collection('blogs').insertOne(newBlog)
  newBlog._id = result.insertedId
  return NextResponse.json(newBlog)
}

// PUT update blog
export async function PUT(request) {
  const body = await request.json()
  const db = await connectMongo()
  const { _id, ...rest } = body
  const result = await db.collection('blogs').findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: rest },
    { returnDocument: 'after' }
  )
  if (!result.value) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(result.value)
}

// DELETE blog
export async function DELETE(request) {
  const { id } = await request.json()
  const db = await connectMongo()
  const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount === 0)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
