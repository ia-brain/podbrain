'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter, usePathname } from 'next/navigation'
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30"></div>
        <div className="text-center relative z-10">
          <div className="inline-block w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin glow-cyan"></div>
          <p className="mt-6 text-cyan-400 font-orbitron font-bold text-xl">ACCESSING SYSTEM</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse glow-cyan"></div>
            <div className="w-2 h-2 bg-magenta-400 rounded-full animate-pulse glow-magenta" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Futuristic Sidebar */}
      <aside className="w-80 bg-[#13131a] border-r border-cyan-400/20 flex flex-col relative shadow-[0_0_30px_rgba(0,255,255,0.1)]">
        {/* Scanline effect */}
        <div className="absolute inset-0 scanline opacity-50 pointer-events-none"></div>

        {/* Header */}
        <div className="p-6 border-b border-cyan-400/20 relative">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-neon flex items-center justify-center shadow-lg glow-cyan relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-magenta-400/20"></div>
              <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-gradient-neon">FLOW</h1>
              <p className="text-xs text-cyan-400 font-orbitron tracking-wider">STUDIOS AI</p>
            </div>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 relative">
          <NavLink href="/admin" icon="📊" label="COMMAND CENTER" />
          <NavLink href="/admin/episodes" icon="🎙️" label="EPISÓDIOS" />
          <NavLink href="/admin/guests" icon="👥" label="CONVIDADOS" />
          <NavLink href="/admin/sponsors" icon="💼" label="PATROCINADORES" />

          <div className="pt-4 mt-4">
            <div className="h-px bg-gradient-to-r from-transparent via-magenta-400/30 to-transparent mb-4"></div>
            <NavLink href="/episodes" icon="🌐" label="SITE PÚBLICO" secondary />
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-cyan-400/20 bg-[#0a0a0f]/50 relative">
          <div className="mb-4 p-4 holographic-card rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse glow-cyan"></div>
              <p className="text-xs text-gray-400 font-orbitron tracking-wider">AUTHENTICATED</p>
            </div>
            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full py-3 px-4 neon-border rounded-lg transition-all text-sm font-orbitron font-bold hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 relative overflow-hidden group"
          >
            <span className="relative z-10">DISCONNECT</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-magenta-500/0 group-hover:from-cyan-500/20 group-hover:to-magenta-500/20 transition-all"></div>
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
  label,
  secondary = false
}: {
  href: string
  icon: string
  label: string
  secondary?: boolean
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  if (secondary) {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-magenta-400/30 hover:border-magenta-400/60 hover:bg-magenta-500/10 transition-all group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-sm font-orbitron font-medium text-gray-400 group-hover:text-magenta-400 transition-colors">
          {label}
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative overflow-hidden ${
        isActive
          ? 'neon-border bg-cyan-500/10'
          : 'border border-transparent hover:border-cyan-400/30 hover:bg-cyan-500/5'
      }`}
    >
      {isActive && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-magenta-500 glow-cyan"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"></div>
        </>
      )}
      <span className={`text-xl group-hover:scale-110 transition-transform relative z-10 ${isActive ? 'float' : ''}`}>
        {icon}
      </span>
      <span className={`text-sm font-orbitron font-medium transition-colors relative z-10 ${
        isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'
      }`}>
        {label}
      </span>
      {!isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}
    </Link>
  )
}
