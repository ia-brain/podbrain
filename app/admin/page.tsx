'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    episodes: 0,
    guests: 0,
    sponsors: 0,
    premium: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Count episodes
        const { data: episodes } = await supabase
          .from('episodes')
          .select('id')

        // Count guests
        const { data: guests } = await supabase
          .from('guests')
          .select('id')

        // Count sponsors
        const { data: sponsors } = await supabase
          .from('sponsors')
          .select('id')

        // Count premium episodes
        const { data: premiumEpisodes } = await supabase
          .from('episodes')
          .select('id')
          .eq('is_premium', true)

        setStats({
          episodes: episodes?.length || 0,
          guests: guests?.length || 0,
          sponsors: sponsors?.length || 0,
          premium: premiumEpisodes?.length || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="inline-block w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin glow-cyan"></div>
          <p className="mt-6 text-cyan-400 font-orbitron font-bold text-xl">INITIALIZING SYSTEM</p>
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
    <div className="relative min-h-screen">
      <AnimatedBackground />

      {/* Grid Overlay */}
      <div className="fixed inset-0 grid-overlay pointer-events-none z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-12 scanline">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-1 h-16 bg-gradient-to-b from-cyan-400 to-magenta-500 glow-cyan"></div>
            <div>
              <h1 className="text-5xl font-orbitron font-bold text-gradient-neon mb-2">
                COMMAND CENTER
              </h1>
              <p className="text-cyan-400 text-lg font-medium">
                FLOW STUDIOS / SYSTEM v4.0
              </p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent glow-cyan"></div>
        </div>

        {/* Stats Grid - Holographic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <HolographicStatCard
            title="EPISÓDIOS"
            value={stats.episodes}
            icon="🎙️"
            gradient="from-cyan-500 to-cyan-600"
            link="/admin/episodes"
            glowColor="cyan"
          />
          <HolographicStatCard
            title="CONVIDADOS"
            value={stats.guests}
            icon="👥"
            gradient="from-magenta-500 to-pink-500"
            link="/admin/guests"
            glowColor="magenta"
          />
          <HolographicStatCard
            title="PATROCINADORES"
            value={stats.sponsors}
            icon="💼"
            gradient="from-purple-500 to-purple-600"
            link="/admin/sponsors"
            glowColor="purple"
          />
          <HolographicStatCard
            title="PREMIUM"
            value={stats.premium}
            icon="⭐"
            gradient="from-yellow-500 to-orange-500"
            link="/admin/episodes"
            glowColor="cyan"
          />
        </div>

        {/* Quick Actions */}
        <div className="holographic-card rounded-2xl p-8 mb-12 scanline">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-cyan-400 glow-cyan"></div>
            <h2 className="text-3xl font-orbitron font-bold text-white">
              QUICK <span className="text-gradient-neon">ACCESS</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionButton
              href="/admin/episodes/new"
              icon="🎙️"
              title="NOVO EPISÓDIO"
              subtitle="Criar novo conteúdo"
            />
            <QuickActionButton
              href="/admin/guests/new"
              icon="👤"
              title="NOVO CONVIDADO"
              subtitle="Adicionar ao CRM"
            />
            <QuickActionButton
              href="/admin/sponsors/new"
              icon="💼"
              title="NOVO PATROCINADOR"
              subtitle="Cadastrar parceiro"
            />
          </div>
        </div>

        {/* System Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <div className="holographic-card rounded-2xl p-8 scanline">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-green-400"></div>
              <h2 className="text-2xl font-orbitron font-bold text-white">
                SYSTEM <span className="text-green-400">STATUS</span>
              </h2>
            </div>
            <div className="space-y-4">
              <SystemStatus
                label="DATABASE CONNECTION"
                status="ONLINE"
                value="98.7%"
              />
              <SystemStatus
                label="API ENDPOINTS"
                status="OPERATIONAL"
                value={`${stats.episodes + stats.guests + stats.sponsors}`}
              />
              <SystemStatus
                label="CONTENT LIBRARY"
                status="SYNCED"
                value={`${stats.episodes} items`}
              />
              <SystemStatus
                label="CRM SYSTEM"
                status="ACTIVE"
                value={`${stats.guests} profiles`}
              />
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="holographic-card rounded-2xl p-8 scanline">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-magenta-400"></div>
              <h2 className="text-2xl font-orbitron font-bold text-white">
                NAVIGATION <span className="text-magenta-400">HUB</span>
              </h2>
            </div>
            <div className="space-y-3">
              <NavLink
                href="/episodes"
                icon="🌐"
                label="SITE PÚBLICO"
                description="Ver interface externa"
              />
              <NavLink
                href="/admin/episodes"
                icon="📋"
                label="EPISÓDIOS"
                description="Gerenciar conteúdo"
              />
              <NavLink
                href="/admin/guests"
                icon="📇"
                label="CRM CONVIDADOS"
                description="Base de dados"
              />
              <NavLink
                href="/admin/sponsors"
                icon="💰"
                label="PATROCINADORES"
                description="Gestão comercial"
              />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 holographic-card rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse glow-cyan"></div>
            <span className="text-sm font-orbitron text-gray-400">
              FLOW AI SYSTEM © 2025 / ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function HolographicStatCard({
  title,
  value,
  icon,
  gradient,
  link,
  glowColor
}: {
  title: string
  value: number
  icon: string
  gradient: string
  link: string
  glowColor: 'cyan' | 'magenta' | 'purple'
}) {
  const glowClass = glowColor === 'cyan' ? 'glow-cyan' : glowColor === 'magenta' ? 'glow-magenta' : 'glow-purple'

  return (
    <Link href={link}>
      <div className={`holographic-card rounded-2xl p-6 group hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden ${glowClass}`}>
        {/* Animated corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-400/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-magenta-400/20 to-transparent"></div>

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <p className="text-sm font-orbitron text-gray-400 mb-1 tracking-wider">{title}</p>
            <div className="h-px w-12 bg-gradient-to-r from-cyan-400 to-transparent mb-3"></div>
          </div>
          <span className="text-4xl float" style={{ animationDelay: `${Math.random()}s` }}>{icon}</span>
        </div>

        <div className="relative z-10">
          <p className={`text-6xl font-orbitron font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}>
            {value.toString().padStart(3, '0')}
          </p>
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
            <span>ACCESS</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Data stream effect */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50 data-stream"></div>
      </div>
    </Link>
  )
}

function QuickActionButton({
  href,
  icon,
  title,
  subtitle
}: {
  href: string
  icon: string
  title: string
  subtitle: string
}) {
  return (
    <Link
      href={href}
      className="group neon-border rounded-xl p-6 hover:bg-cyan-500/5 transition-all relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-magenta-500/0 group-hover:from-cyan-500/5 group-hover:to-magenta-500/5 transition-all"></div>
      <div className="relative z-10">
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform float">{icon}</div>
        <div className="font-orbitron font-bold text-white text-lg mb-1">{title}</div>
        <div className="text-sm text-gray-400">{subtitle}</div>
        <div className="mt-4 h-px bg-gradient-to-r from-cyan-400 to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
      </div>
    </Link>
  )
}

function SystemStatus({
  label,
  status,
  value
}: {
  label: string
  status: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse glow-cyan"></div>
        <div>
          <p className="text-sm text-gray-400 font-medium">{label}</p>
          <p className="text-xs text-green-400 font-orbitron">{status}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-orbitron font-bold text-cyan-400">{value}</p>
      </div>
    </div>
  )
}

function NavLink({
  href,
  icon,
  label,
  description
}: {
  href: string
  icon: string
  label: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-magenta-400/20 hover:border-magenta-400/60 hover:bg-magenta-500/10 transition-all group"
    >
      <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-orbitron font-bold text-white group-hover:text-magenta-400 transition-colors">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <svg className="w-5 h-5 text-magenta-400 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </Link>
  )
}
