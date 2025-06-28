import { NextResponse } from 'next/server'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const uri = "mongodb+srv://bayfi:ix0tHxYPt1M7eVpR@cluster0.wdeeaxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const dbName = "bayfi" // You can use any db name you like

// Global client reuse (avoid multiple connections)
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

// GET all
export async function GET() {
  const db = await connectMongo()
  const data = await db.collection('announcements').find({}).sort({ createdAt: -1 }).toArray()
  return NextResponse.json(data)
}

// POST create
export async function POST(request) {
  const body = await request.json()
  const db = await connectMongo()
  const newAnnouncement = { ...body, createdAt: new Date() }
  const result = await db.collection('announcements').insertOne(newAnnouncement)
  newAnnouncement._id = result.insertedId
  return NextResponse.json(newAnnouncement)
}

// PUT update
export async function PUT(request) {
  const body = await request.json()
  const db = await connectMongo()
  const { _id, ...rest } = body
  const result = await db.collection('announcements').findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: rest },
    { returnDocument: 'after' }
  )
  if (!result.value) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(result.value)
}

// DELETE
export async function DELETE(request) {
  const { id } = await request.json()
  const db = await connectMongo()
  const result = await db.collection('announcements').deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount === 0)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
