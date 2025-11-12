'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    episodes: 0,
    guests: 0,
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

        // Count premium episodes
        const { data: premiumEpisodes } = await supabase
          .from('episodes')
          .select('id')
          .eq('is_premium', true)

        setStats({
          episodes: episodes?.length || 0,
          guests: guests?.length || 0,
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
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your podcast CMS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Episodes</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{stats.episodes}</p>
            </div>
            <div className="text-4xl">🎙️</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Guests</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{stats.guests}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Premium Content</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{stats.premium}</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/episodes/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="font-medium text-gray-900">Add New Episode</div>
          </Link>
          
          <Link
            href="/admin/guests/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="font-medium text-gray-900">Add New Guest</div>
          </Link>
        </div>
      </div>

      {/* Recent Activity (Optional - you can add this later) */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-sm">
          Recent episodes and updates will appear here
        </p>
      </div>
    </div>
  )
}