"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function BlogPage() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => {
        if (!res.ok) return []
        return res.json()
      })
      .then(data => setBlogs(Array.isArray(data) ? data : []))
      .catch(() => setBlogs([]))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-10 text-blue-700">BayFi Blog</h1>
        {blogs.length === 0 && (
          <p className="text-center text-gray-500">No blog posts yet.</p>
        )}
        <div className="space-y-6">
          {blogs.map(blog => (
            <div
              key={blog.id}
              className="bg-blue-200 border border-blue-300 rounded-2xl shadow-md px-6 py-4"
            >
              <h2 className="text-xl font-semibold text-blue-900">{blog.title}</h2>
              <p className="mt-2 text-gray-700">{blog.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Link
        className="mt-12 bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold px-8 py-3 rounded-3xl shadow-lg transition"
        href="/"
      >
        Go to Home
      </Link>
    </div>
  )
}
