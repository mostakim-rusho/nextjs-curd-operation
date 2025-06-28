"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-100 to-emerald-100 flex flex-col items-center py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-10 text-amber-700">BayFi Announcements</h1>

        {/* Loader Animation */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* No Announcement Message */}
        {!loading && announcements.length === 0 && (
          <p className="text-center text-gray-500">No announcements yet.</p>
        )}

        {/* Announcements */}
        <div className="space-y-6">
          {announcements.map(a => (
            <div
              className="bg-amber-200 border border-amber-300 rounded-2xl shadow-md px-6 py-4"
              key={a._id}
            >
              <h2 className="text-xl font-semibold text-amber-800">{a.title}</h2>
              <p className="mt-2 text-gray-700">{a.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <Link
        className="mt-12 bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold px-8 py-3 rounded-3xl shadow-lg transition"
        href="/login"
      >
        Go to Login Page
      </Link>
      <Link
        className="mt-6 bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold px-8 py-3 rounded-3xl shadow-lg transition"
        href="/admin"
      >
        Go to Admin Page
      </Link>
      <Link
        className="mt-6 bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold px-8 py-3 rounded-3xl shadow-lg transition"
        href="/blog"
      >
        Go to Blog Page
      </Link>
    </div>
  )
}
