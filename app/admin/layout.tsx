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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar with Flow Branding */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900 text-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-flow">Flow CMS</h1>
              <p className="text-xs text-purple-300 font-medium">Estúdios Flow</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink href="/admin" icon="📊">
            Dashboard
          </NavLink>
          <NavLink href="/admin/episodes" icon="🎙️">
            Episódios
          </NavLink>
          <NavLink href="/admin/guests" icon="👥">
            Convidados
          </NavLink>
          <NavLink href="/admin/sponsors" icon="💼">
            Patrocinadores
          </NavLink>

          <div className="pt-4 mt-4 border-t border-white/10">
            <NavLink href="/episodes" icon="🌐" secondary>
              Ver Site Público
            </NavLink>
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-purple-300 font-medium mb-1">Conectado como</p>
            <p className="text-sm font-medium truncate text-white">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

function NavLink({
  href,
  icon,
  children,
  secondary = false
}: {
  href: string
  icon: string
  children: React.ReactNode
  secondary?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all group ${
        secondary
          ? 'text-gray-400 hover:text-white hover:bg-white/5'
          : 'hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:shadow-lg'
      }`}
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className={`font-medium ${secondary ? 'text-sm' : ''}`}>{children}</span>
    </Link>
  )
}
