'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
    } else {
      setUser(session.user)
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">🧠 PodBrain</h1>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="block py-2 px-4 rounded-lg hover:bg-gray-800 transition"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/episodes"
            className="block py-2 px-4 rounded-lg hover:bg-gray-800 transition"
          >
            🎙️ Episodes
          </Link>
          <Link
            href="/admin/guests"
            className="block py-2 px-4 rounded-lg hover:bg-gray-800 transition"
          >
            👥 Guests
          </Link>
          <Link
            href="/admin/sponsors"
            className="block py-2 px-4 rounded-lg hover:bg-gray-800 transition"
          >
            💼 Sponsors
          </Link>
          <Link
            href="/episodes"
            className="block py-2 px-4 rounded-lg hover:bg-gray-800 transition text-gray-400"
          >
            🌐 View Public Site
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="mb-3">
            <p className="text-sm text-gray-400">Signed in as:</p>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}