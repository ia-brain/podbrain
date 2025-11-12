'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Dashboard
          <span className="ml-3 text-2xl">👋</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Bem-vindo ao <span className="font-semibold text-purple-600">Flow CMS</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Episódios"
          value={stats.episodes}
          icon="🎙️"
          gradient="from-purple-500 to-purple-600"
          link="/admin/episodes"
        />
        <StatCard
          title="Convidados"
          value={stats.guests}
          icon="👥"
          gradient="from-pink-500 to-pink-600"
          link="/admin/guests"
        />
        <StatCard
          title="Patrocinadores"
          value={stats.sponsors}
          icon="💼"
          gradient="from-blue-500 to-blue-600"
          link="/admin/sponsors"
        />
        <StatCard
          title="Premium"
          value={stats.premium}
          icon="⭐"
          gradient="from-yellow-500 to-orange-500"
          link="/admin/episodes"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">⚡</span>
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton
            href="/admin/episodes/new"
            icon="🎙️"
            title="Novo Episódio"
            color="purple"
          />
          <QuickActionButton
            href="/admin/guests/new"
            icon="👤"
            title="Novo Convidado"
            color="pink"
          />
          <QuickActionButton
            href="/admin/sponsors/new"
            icon="💼"
            title="Novo Patrocinador"
            color="blue"
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Sistema Flow CMS
          </h2>
          <div className="space-y-3 text-gray-700">
            <p className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Sistema operacional
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              {stats.episodes} episódios cadastrados
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              {stats.guests} convidados no CRM
            </p>
            <p className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              {stats.sponsors} patrocinadores ativos
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔗</span>
            Links Úteis
          </h2>
          <div className="space-y-3">
            <Link
              href="/episodes"
              className="block p-3 bg-white/60 hover:bg-white rounded-lg transition-all font-medium text-gray-700 hover:text-purple-600"
            >
              🌐 Ver Site Público
            </Link>
            <Link
              href="/admin/episodes"
              className="block p-3 bg-white/60 hover:bg-white rounded-lg transition-all font-medium text-gray-700 hover:text-purple-600"
            >
              📋 Gerenciar Episódios
            </Link>
            <Link
              href="/admin/guests"
              className="block p-3 bg-white/60 hover:bg-white rounded-lg transition-all font-medium text-gray-700 hover:text-purple-600"
            >
              📇 CRM de Convidados
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  gradient,
  link
}: {
  title: string
  value: number
  icon: string
  gradient: string
  link: string
}) {
  return (
    <Link href={link}>
      <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border border-white/20`}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/90 font-medium">{title}</p>
          <span className="text-3xl">{icon}</span>
        </div>
        <p className="text-5xl font-bold text-white">{value}</p>
      </div>
    </Link>
  )
}

function QuickActionButton({
  href,
  icon,
  title,
  color
}: {
  href: string
  icon: string
  title: string
  color: 'purple' | 'pink' | 'blue'
}) {
  const colorClasses = {
    purple: 'border-purple-300 hover:border-purple-500 hover:bg-purple-50',
    pink: 'border-pink-300 hover:border-pink-500 hover:bg-pink-50',
    blue: 'border-blue-300 hover:border-blue-500 hover:bg-blue-50',
  }

  return (
    <Link
      href={href}
      className={`p-6 border-2 border-dashed rounded-xl transition-all text-center group ${colorClasses[color]}`}
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="font-semibold text-gray-900">{title}</div>
    </Link>
  )
}
