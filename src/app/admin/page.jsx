'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Announcements state
  const [announcements, setAnnouncements] = useState([])
  const [aForm, setAForm] = useState({ title: '', content: '' })
  const [aEditId, setAEditId] = useState(null)

  // Blog state
  const [blogs, setBlogs] = useState([])
  const [bForm, setBForm] = useState({ title: '', content: '' })
  const [bEditId, setBEditId] = useState(null)

  // --- Client-side Auth check ---
  useEffect(() => {
    fetch('/api/check-auth', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) {
          window.location.href = '/login'
        } else {
          setLoading(false)
        }
      })
  }, [])

  // Fetch announcements
  useEffect(() => {
    if (!loading)
      fetch('/api/announcements')
        .then(res => res.json())
        .then(setAnnouncements)
  }, [loading])

  // Fetch blogs
  useEffect(() => {
    if (!loading)
      fetch('/api/blogs')
        .then(res => res.json())
        .then(setBlogs)
  }, [loading])

  // Announcement handlers
  function handleAChange(e) {
    setAForm({ ...aForm, [e.target.name]: e.target.value })
  }
  async function handleAAdd(e) {
    e.preventDefault()
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aForm)
    })
    const newItem = await res.json()
    setAnnouncements([...announcements, newItem])
    setAForm({ title: '', content: '' })
  }
  function handleAEdit(_id) {
    setAEditId(_id)
    const item = announcements.find(a => a._id === _id)
    setAForm({ title: item.title, content: item.content })
  }
  async function handleAUpdate(e) {
    e.preventDefault()
    const res = await fetch('/api/announcements', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...aForm, _id: aEditId })
    })
    const updated = await res.json()
    setAnnouncements(announcements.map(a => a._id === aEditId ? updated : a))
    setAForm({ title: '', content: '' })
    setAEditId(null)
  }
  async function handleADelete(_id) {
    await fetch('/api/announcements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: _id })
    })
    setAnnouncements(announcements.filter(a => a._id !== _id))
  }

  // Blog handlers
  function handleBChange(e) {
    setBForm({ ...bForm, [e.target.name]: e.target.value })
  }
  async function handleBAdd(e) {
    e.preventDefault()
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bForm)
    })
    const newItem = await res.json()
    setBlogs([...blogs, newItem])
    setBForm({ title: '', content: '' })
  }
  function handleBEdit(_id) {
    setBEditId(_id)
    const item = blogs.find(b => b._id === _id)
    setBForm({ title: item.title, content: item.content })
  }
  async function handleBUpdate(e) {
    e.preventDefault()
    const res = await fetch('/api/blogs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bForm, _id: bEditId })
    })
    const updated = await res.json()
    setBlogs(blogs.map(b => b._id === bEditId ? updated : b))
    setBForm({ title: '', content: '' })
    setBEditId(null)
  }
  async function handleBDelete(_id) {
    await fetch('/api/blogs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: _id })
    })
    setBlogs(blogs.filter(b => b._id !== _id))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Announcements Section */}
      <section className="mb-12 p-4 border rounded-xl bg-amber-50">
        <h2 className="text-xl font-semibold mb-3">Home Announcements</h2>
        <form className="mb-4" onSubmit={aEditId ? handleAUpdate : handleAAdd}>
          <input name="title" value={aForm.title} onChange={handleAChange} placeholder="Title" required className="border px-2 py-1 mx-1 rounded"/>
          <input name="content" value={aForm.content} onChange={handleAChange} placeholder="Content" required className="border px-2 py-1 mx-1 rounded"/>
          <button type="submit" className="bg-amber-500 text-white px-4 py-1 rounded mx-1">{aEditId ? 'Update' : 'Add'}</button>
          {aEditId && <button type="button" onClick={() => { setAEditId(null); setAForm({ title: '', content: '' }) }} className="bg-gray-300 px-2 py-1 rounded">Cancel</button>}
        </form>
        <ul>
          {announcements.map(a => (
            <li key={a._id} className="mb-1">
              <b>{a.title}:</b> {a.content}
              <button onClick={() => handleAEdit(a._id)} className="ml-2 bg-yellow-400 px-2 rounded">Edit</button>
              <button onClick={() => handleADelete(a._id)} className="ml-2 bg-red-500 text-white px-2 rounded">Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Blog Section */}
      <section className="mb-12 p-4 border rounded-xl bg-blue-50">
        <h2 className="text-xl font-semibold mb-3">Blog Posts</h2>
        <form className="mb-4" onSubmit={bEditId ? handleBUpdate : handleBAdd}>
          <input name="title" value={bForm.title} onChange={handleBChange} placeholder="Title" required className="border px-2 py-1 mx-1 rounded"/>
          <input name="content" value={bForm.content} onChange={handleBChange} placeholder="Content" required className="border px-2 py-1 mx-1 rounded"/>
          <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded mx-1">{bEditId ? 'Update' : 'Add'}</button>
          {bEditId && <button type="button" onClick={() => { setBEditId(null); setBForm({ title: '', content: '' }) }} className="bg-gray-300 px-2 py-1 rounded">Cancel</button>}
        </form>
        <ul>
          {blogs.map(b => (
            <li key={b._id} className="mb-1">
              <b>{b.title}:</b> {b.content}
              <button onClick={() => handleBEdit(b._id)} className="ml-2 bg-yellow-400 px-2 rounded">Edit</button>
              <button onClick={() => handleBDelete(b._id)} className="ml-2 bg-red-500 text-white px-2 rounded">Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex gap-4">
        <Link className="bg-purple-400 px-5 py-3 rounded-3xl" href="/">
          Go to Home Page
        </Link>
        <Link className="bg-green-400 px-5 py-3 rounded-3xl" href="/blog">
          Go to Blog Page
        </Link>
      </div>
    </div>
  )
}
